
import { Car } from '@/data/cars';

export type CarActivity = {
  id: number;
  carName: string;
  action: 'added' | 'deleted' | 'edited';
  timestamp: Date;
};

export const logCarActivity = (car: Car, action: 'added' | 'deleted' | 'edited') => {
  // Get existing log
  const existingLogStr = localStorage.getItem('carActivityLog');
  let activityLog: CarActivity[] = [];
  
  if (existingLogStr) {
    try {
      // Parse existing log, converting string dates back to Date objects
      activityLog = JSON.parse(existingLogStr, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing activity log:', error);
      activityLog = [];
    }
  }
  
  // Add new activity
  const newActivity: CarActivity = {
    id: car.id,
    carName: `${car.name} ${car.version}`,
    action,
    timestamp: new Date()
  };
  
  activityLog.push(newActivity);
  
  // Save back to localStorage
  localStorage.setItem('carActivityLog', JSON.stringify(activityLog));
  
  return newActivity;
};

export const clearActivityLog = () => {
  localStorage.removeItem('carActivityLog');
};
