
import { Car } from '@/data/cars';

export type CarActivity = {
  id: number;
  carName: string;
  action: 'added' | 'deleted' | 'edited' | 'restored';
  timestamp: Date;
  carData?: Car; // Armazenar dados do carro para restauração
};

export const logCarActivity = (car: Car, action: 'added' | 'deleted' | 'edited' | 'restored') => {
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

  // Se o carro estiver sendo excluído, armazenar uma cópia para possível restauração
  if (action === 'deleted') {
    newActivity.carData = { ...car };
  }
  
  activityLog.push(newActivity);
  
  // Save back to localStorage
  localStorage.setItem('carActivityLog', JSON.stringify(activityLog));
  
  return newActivity;
};

// Função para restaurar um carro excluído
export const restoreDeletedCar = (activityId: number) => {
  const existingLogStr = localStorage.getItem('carActivityLog');
  if (!existingLogStr) return null;
  
  try {
    // Parse existing log
    const activityLog: CarActivity[] = JSON.parse(existingLogStr, (key, value) => {
      if (key === 'timestamp') return new Date(value);
      return value;
    });
    
    // Encontrar a atividade de exclusão
    const deletedActivity = activityLog.find(
      activity => activity.id === activityId && activity.action === 'deleted' && activity.carData
    );
    
    if (!deletedActivity || !deletedActivity.carData) {
      return null;
    }
    
    // Restaurar o carro no localStorage
    const carsStr = localStorage.getItem('cars');
    let cars: Car[] = [];
    
    if (carsStr) {
      cars = JSON.parse(carsStr);
    }
    
    // Verificar se o carro já existe (para evitar duplicatas)
    const carExists = cars.some(car => car.id === deletedActivity.carData!.id);
    
    if (!carExists) {
      cars.push(deletedActivity.carData);
      localStorage.setItem('cars', JSON.stringify(cars));
      
      // Registrar a restauração
      logCarActivity(deletedActivity.carData, 'restored');
      return deletedActivity.carData;
    }
  } catch (error) {
    console.error('Error restoring car:', error);
  }
  
  return null;
};

export const clearActivityLog = () => {
  localStorage.removeItem('carActivityLog');
};
