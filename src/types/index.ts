
export interface BloodSugarReading {
  date: Date;
  value: number;
  timeOfDay: 'morning' | 'evening';
  category: 'normal' | 'prediabetic' | 'diabetic' | 'hypoglycemic';
}

export interface ProcessedData {
  readings: BloodSugarReading[];
  morningReadings: BloodSugarReading[];
  eveningReadings: BloodSugarReading[];
  stats: {
    average: number;
    morningAverage: number;
    eveningAverage: number;
    max: number;
    min: number;
    morningTrend: 'stable' | 'increasing' | 'decreasing';
    eveningTrend: 'stable' | 'increasing' | 'decreasing';
    normalPercentage: number;
    prediabeticPercentage: number;
    diabeticPercentage: number;
    hypoglycemicPercentage: number;
  };
  insights: string[];
}

export interface ChartData {
  dates: string[];
  morningValues: number[];
  eveningValues: number[];
}
