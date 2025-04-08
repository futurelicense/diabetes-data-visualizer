
import { BloodSugarReading, ProcessedData, ChartData } from '@/types';

// Medical thresholds based on ADA guidelines
const THRESHOLDS = {
  FASTING: {
    NORMAL_MAX: 99,
    PREDIABETIC_MAX: 125,
    HYPOGLYCEMIC: 70
  },
  POSTPRANDIAL: {
    NORMAL_MAX: 139,
    PREDIABETIC_MAX: 199,
    HYPOGLYCEMIC: 70
  }
};

// Determines if a time is morning (before noon) or evening
const isMorningReading = (date: Date): boolean => {
  return date.getHours() < 12;
};

// Categorizes blood sugar based on value and time of day (fasting vs postprandial)
const categorizeBloodSugar = (value: number, isMorning: boolean): 'normal' | 'prediabetic' | 'diabetic' | 'hypoglycemic' => {
  const thresholds = isMorning ? THRESHOLDS.FASTING : THRESHOLDS.POSTPRANDIAL;
  
  if (value < thresholds.HYPOGLYCEMIC) {
    return 'hypoglycemic';
  } else if (value <= thresholds.NORMAL_MAX) {
    return 'normal';
  } else if (value <= thresholds.PREDIABETIC_MAX) {
    return 'prediabetic';
  } else {
    return 'diabetic';
  }
};

// Analyzes the trend in an array of blood sugar readings
const analyzeTrend = (readings: BloodSugarReading[]): 'stable' | 'increasing' | 'decreasing' => {
  if (readings.length < 3) return 'stable';
  
  // Calculate a simple linear regression slope
  const n = readings.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = readings.map(reading => reading.value);
  
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  const slope = denominator === 0 ? 0 : numerator / denominator;
  
  if (Math.abs(slope) < 0.5) return 'stable';
  return slope > 0 ? 'increasing' : 'decreasing';
};

// Generate insights based on the processed data
const generateInsights = (data: ProcessedData): string[] => {
  const insights: string[] = [];
  
  // Morning trends
  if (data.morningReadings.length > 0) {
    if (data.stats.morningTrend === 'increasing') {
      insights.push("Your morning (fasting) blood sugar is trending upward. Consider evaluating your evening meals and bedtime snacks.");
    } else if (data.stats.morningTrend === 'decreasing') {
      insights.push("Your morning blood sugar is trending downward, which is positive if previous levels were elevated.");
    }
    
    if (data.stats.morningAverage > THRESHOLDS.FASTING.NORMAL_MAX) {
      insights.push(`Your average morning blood sugar (${Math.round(data.stats.morningAverage)} mg/dL) is above the normal fasting range. This may indicate the dawn phenomenon or evening dietary factors.`);
    }
  }
  
  // Evening trends
  if (data.eveningReadings.length > 0) {
    if (data.stats.eveningTrend === 'increasing') {
      insights.push("Your evening blood sugar readings are trending upward. Consider reviewing your meal portions and carbohydrate intake.");
    }
    
    if (data.stats.eveningAverage > THRESHOLDS.POSTPRANDIAL.NORMAL_MAX) {
      insights.push(`Your average evening blood sugar (${Math.round(data.stats.eveningAverage)} mg/dL) is above the normal post-meal range. Consider spacing your meals or adjusting your diet.`);
    }
  }
  
  // Hypoglycemic episodes
  const hypoglycemicReadings = data.readings.filter(r => r.category === 'hypoglycemic');
  if (hypoglycemicReadings.length > 0) {
    insights.push(`You have ${hypoglycemicReadings.length} blood sugar reading(s) below 70 mg/dL, which indicates hypoglycemia. Please discuss these episodes with your healthcare provider.`);
  }
  
  // General insights
  if (data.stats.normalPercentage < 50) {
    insights.push(`Only ${Math.round(data.stats.normalPercentage)}% of your readings are in the normal range. Work with your healthcare provider to improve blood sugar control.`);
  } else if (data.stats.normalPercentage > 75) {
    insights.push(`${Math.round(data.stats.normalPercentage)}% of your readings are in the normal range, which shows good blood sugar control.`);
  }
  
  // If no specific insights were generated, provide a general one
  if (insights.length === 0) {
    insights.push("Your blood sugar readings appear to be relatively stable. Continue monitoring and maintain your current management plan.");
  }
  
  return insights;
};

// The main function to process CSV data
export const processCSVData = (csvContent: string): ProcessedData | null => {
  try {
    // Split the CSV by lines and remove header
    const lines = csvContent.split('\n');
    if (lines.length < 2) return null;
    
    // Check header (should be Date,BloodSugar)
    const header = lines[0].toLowerCase().trim();
    if (!header.includes('date') || !header.includes('bloodsugar')) {
      console.error('CSV format incorrect, expected headers with Date and BloodSugar');
      return null;
    }
    
    const readings: BloodSugarReading[] = [];
    
    // Process each data line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = line.split(',');
      if (parts.length < 2) continue;
      
      const dateStr = parts[0].trim();
      const valueStr = parts[1].trim();
      
      // Parse date and value
      const date = new Date(dateStr);
      const value = parseFloat(valueStr);
      
      if (isNaN(date.getTime()) || isNaN(value)) {
        console.warn(`Skipping invalid line: ${line}`);
        continue;
      }
      
      const timeOfDay = isMorningReading(date) ? 'morning' : 'evening';
      const category = categorizeBloodSugar(value, timeOfDay === 'morning');
      
      readings.push({
        date,
        value,
        timeOfDay,
        category
      });
    }
    
    if (readings.length === 0) {
      console.error('No valid readings found in CSV');
      return null;
    }
    
    // Sort readings by date
    readings.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Separate morning and evening readings
    const morningReadings = readings.filter(r => r.timeOfDay === 'morning');
    const eveningReadings = readings.filter(r => r.timeOfDay === 'evening');
    
    // Calculate statistics
    const average = readings.reduce((sum, r) => sum + r.value, 0) / readings.length;
    const morningAverage = morningReadings.length > 0 
      ? morningReadings.reduce((sum, r) => sum + r.value, 0) / morningReadings.length 
      : 0;
    const eveningAverage = eveningReadings.length > 0 
      ? eveningReadings.reduce((sum, r) => sum + r.value, 0) / eveningReadings.length 
      : 0;
    
    const max = Math.max(...readings.map(r => r.value));
    const min = Math.min(...readings.map(r => r.value));
    
    const morningTrend = analyzeTrend(morningReadings);
    const eveningTrend = analyzeTrend(eveningReadings);
    
    // Calculate category percentages
    const normalCount = readings.filter(r => r.category === 'normal').length;
    const prediabeticCount = readings.filter(r => r.category === 'prediabetic').length;
    const diabeticCount = readings.filter(r => r.category === 'diabetic').length;
    const hypoglycemicCount = readings.filter(r => r.category === 'hypoglycemic').length;
    
    const normalPercentage = (normalCount / readings.length) * 100;
    const prediabeticPercentage = (prediabeticCount / readings.length) * 100;
    const diabeticPercentage = (diabeticCount / readings.length) * 100;
    const hypoglycemicPercentage = (hypoglycemicCount / readings.length) * 100;
    
    // Create the processed data object
    const processedData: ProcessedData = {
      readings,
      morningReadings,
      eveningReadings,
      stats: {
        average,
        morningAverage,
        eveningAverage,
        max,
        min,
        morningTrend,
        eveningTrend,
        normalPercentage,
        prediabeticPercentage,
        diabeticPercentage,
        hypoglycemicPercentage
      },
      insights: []
    };
    
    // Generate insights
    processedData.insights = generateInsights(processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error processing CSV data:', error);
    return null;
  }
};

// Prepare data for chart display
export const prepareChartData = (processedData: ProcessedData): ChartData => {
  const allDates = processedData.readings.map(r => 
    r.date.toISOString().split('T')[0]
  );
  
  // Get unique dates
  const uniqueDates = [...new Set(allDates)].sort();
  
  const morningValues: number[] = [];
  const eveningValues: number[] = [];
  
  // For each unique date, find the corresponding morning and evening values
  uniqueDates.forEach(date => {
    const morningReading = processedData.morningReadings.find(
      r => r.date.toISOString().split('T')[0] === date
    );
    
    const eveningReading = processedData.eveningReadings.find(
      r => r.date.toISOString().split('T')[0] === date
    );
    
    morningValues.push(morningReading ? morningReading.value : NaN);
    eveningValues.push(eveningReading ? eveningReading.value : NaN);
  });
  
  return {
    dates: uniqueDates,
    morningValues,
    eveningValues
  };
};

// Format a trend direction for display
export const formatTrend = (trend: 'stable' | 'increasing' | 'decreasing'): string => {
  switch(trend) {
    case 'increasing': return 'Upward ↑';
    case 'decreasing': return 'Downward ↓';
    default: return 'Stable →';
  }
};

// Generate a CSV report from the processed data
export const generateReportCSV = (data: ProcessedData): string => {
  let csv = 'Date,Time,Blood Sugar (mg/dL),Category\n';
  
  data.readings.forEach(reading => {
    const date = reading.date.toISOString().split('T')[0];
    const time = reading.date.toTimeString().split(' ')[0];
    csv += `${date},${time},${reading.value},${reading.category}\n`;
  });
  
  csv += '\nSummary Statistics\n';
  csv += `Average Blood Sugar,${data.stats.average.toFixed(1)} mg/dL\n`;
  csv += `Morning Average,${data.stats.morningAverage.toFixed(1)} mg/dL\n`;
  csv += `Evening Average,${data.stats.eveningAverage.toFixed(1)} mg/dL\n`;
  csv += `Highest Reading,${data.stats.max} mg/dL\n`;
  csv += `Lowest Reading,${data.stats.min} mg/dL\n`;
  csv += `Morning Trend,${data.stats.morningTrend}\n`;
  csv += `Evening Trend,${data.stats.eveningTrend}\n`;
  csv += `Normal Readings,${data.stats.normalPercentage.toFixed(1)}%\n`;
  csv += `Pre-diabetic Readings,${data.stats.prediabeticPercentage.toFixed(1)}%\n`;
  csv += `Diabetic Readings,${data.stats.diabeticPercentage.toFixed(1)}%\n`;
  csv += `Hypoglycemic Readings,${data.stats.hypoglycemicPercentage.toFixed(1)}%\n`;
  
  csv += '\nInsights\n';
  data.insights.forEach(insight => {
    csv += `${insight}\n`;
  });
  
  return csv;
};
