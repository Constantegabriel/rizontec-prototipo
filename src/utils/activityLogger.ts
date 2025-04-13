
import { Car } from '@/data/cars';

// Activity log storage key
const ACTIVITY_LOG_KEY = 'carActivityLog';

export interface CarActivity {
  id: string | number;
  carName: string;
  action: 'added' | 'deleted' | 'edited' | 'restored';
  timestamp: Date;
  carData?: Car;  // Full car data for restore functionality
}

// Log car activity
export const logCarActivity = (car: Car, action: 'added' | 'deleted' | 'edited' | 'restored'): void => {
  try {
    // Get existing log
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    let activityLog: CarActivity[] = [];
    
    if (savedLog) {
      // Parse the saved log, converting string dates back to Date objects
      activityLog = JSON.parse(savedLog, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    }
    
    // Add new activity
    const activity: CarActivity = {
      id: car.id,
      carName: `${car.name} ${car.version}`,
      action,
      timestamp: new Date(),
      carData: action === 'deleted' ? {...car} : undefined
    };
    
    activityLog.push(activity);
    
    // Save back to localStorage
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(activityLog));
    
    console.log(`Activity logged: ${action} - ${car.name}`);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Restore a deleted car
export const restoreDeletedCar = (id: string | number): Car | null => {
  try {
    // Get activity log
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!savedLog) return null;
    
    // Parse the log
    const activityLog: CarActivity[] = JSON.parse(savedLog, (key, value) => {
      if (key === 'timestamp') return new Date(value);
      return value;
    });
    
    // Find deleted car activity
    const deletedActivity = activityLog.find(
      activity => activity.id === id && activity.action === 'deleted' && activity.carData
    );
    
    if (!deletedActivity || !deletedActivity.carData) {
      console.error('No deleted car data found for restoration');
      return null;
    }
    
    // Get current cars
    const savedCars = localStorage.getItem('cars_local_storage');
    let cars: Car[] = savedCars ? JSON.parse(savedCars) : [];
    
    // Add the restored car
    const restoredCar = deletedActivity.carData;
    cars.push(restoredCar);
    
    // Save back to localStorage
    localStorage.setItem('cars_local_storage', JSON.stringify(cars));
    
    // Log restoration activity
    logCarActivity(restoredCar, 'restored');
    
    return restoredCar;
  } catch (error) {
    console.error('Error restoring car:', error);
    return null;
  }
};
