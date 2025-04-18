import { Car } from '@/data/cars';

// Activity log storage key
const ACTIVITY_LOG_KEY = 'carActivityLog';
const SALES_STATS_KEY = 'carSalesStats';

export interface CarActivity {
  id: string | number;
  carName: string;
  action: 'added' | 'deleted' | 'edited' | 'restored' | 'sold' | 'traded';
  timestamp: Date;
  carData?: Car;  // Full car data for restore functionality
  salePrice?: number; // Price the car was sold for
  saleType?: 'sale' | 'trade'; // Type of transaction
}

export interface SaleStats {
  daily: Record<string, number>; // Format: 'YYYY-MM-DD': total amount
  weekly: Record<string, number>; // Format: 'YYYY-WW': total amount
  monthly: Record<string, number>; // Format: 'YYYY-MM': total amount
  yearly: Record<string, number>; // Format: 'YYYY': total amount
}

// Log car activity
export const logCarActivity = (
  car: Car, 
  action: 'added' | 'deleted' | 'edited' | 'restored' | 'sold' | 'traded',
  saleDetails?: { price: number, type: 'sale' | 'trade' }
): void => {
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
      carData: (action === 'deleted' || action === 'sold' || action === 'traded') ? {...car} : undefined,
      salePrice: saleDetails?.price,
      saleType: saleDetails?.type
    };
    
    activityLog.push(activity);
    
    // Save back to localStorage
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(activityLog));
    
    // If this is a sale or trade, update the sales statistics
    if ((action === 'sold' || action === 'traded') && saleDetails) {
      updateSalesStats(saleDetails.price, new Date());
    }
    
    console.log(`Activity logged: ${action} - ${car.name}`);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Update sales statistics
const updateSalesStats = (amount: number, date: Date): void => {
  try {
    // Get existing stats
    const savedStats = localStorage.getItem(SALES_STATS_KEY);
    let stats: SaleStats = {
      daily: {},
      weekly: {},
      monthly: {},
      yearly: {}
    };
    
    if (savedStats) {
      stats = JSON.parse(savedStats);
    }
    
    // Format keys for different time periods
    const year = date.getFullYear().toString();
    const month = `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const day = `${month}-${date.getDate().toString().padStart(2, '0')}`;
    
    // Get ISO week number
    const getWeekNumber = (d: Date): number => {
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };
    
    const week = `${year}-${getWeekNumber(date).toString().padStart(2, '0')}`;
    
    // Update stats for each time period
    stats.daily[day] = (stats.daily[day] || 0) + amount;
    stats.weekly[week] = (stats.weekly[week] || 0) + amount;
    stats.monthly[month] = (stats.monthly[month] || 0) + amount;
    stats.yearly[year] = (stats.yearly[year] || 0) + amount;
    
    // Save back to localStorage
    localStorage.setItem(SALES_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating sales stats:', error);
  }
};

// Get sales statistics for a specific time range
export const getSalesStats = (
  period: '7d' | '15d' | '30d' | '6m' | '1y'
): { labels: string[], data: number[] } => {
  try {
    const savedStats = localStorage.getItem(SALES_STATS_KEY);
    if (!savedStats) {
      return { labels: [], data: [] };
    }
    
    const stats: SaleStats = JSON.parse(savedStats);
    const now = new Date();
    const result: { labels: string[], data: number[] } = { labels: [], data: [] };
    
    // Helper to get date X days ago in YYYY-MM-DD format
    const getDaysAgo = (days: number): string => {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // Helper to get date X months ago in YYYY-MM format
    const getMonthsAgo = (months: number): string => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - months);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    };
    
    if (period === '7d' || period === '15d' || period === '30d') {
      // Daily stats for the last 7, 15, or 30 days
      const days = period === '7d' ? 7 : period === '15d' ? 15 : 30;
      
      for (let i = days - 1; i >= 0; i--) {
        const dateStr = getDaysAgo(i);
        result.labels.push(dateStr.split('-').slice(1).join('/'));
        result.data.push(stats.daily[dateStr] || 0);
      }
    } else if (period === '6m') {
      // Monthly stats for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const monthStr = getMonthsAgo(i);
        result.labels.push(monthStr.split('-').slice(1).join('/'));
        result.data.push(stats.monthly[monthStr] || 0);
      }
    } else if (period === '1y') {
      // Yearly stats for the current year
      const year = now.getFullYear().toString();
      for (let month = 0; month < 12; month++) {
        const monthStr = `${year}-${(month + 1).toString().padStart(2, '0')}`;
        result.labels.push(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][month]);
        result.data.push(stats.monthly[monthStr] || 0);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error getting sales stats:', error);
    return { labels: [], data: [] };
  }
};

// Mark a car as sold or traded
export const markCarAsSold = (
  carId: string | number,
  details: { price: number, type: 'sale' | 'trade' }
): boolean => {
  try {
    // Get car from localStorage
    const savedCars = localStorage.getItem('cars_local_storage');
    if (!savedCars) return false;
    
    const cars: Car[] = JSON.parse(savedCars);
    const carIndex = cars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) return false;
    
    const car = cars[carIndex];
    
    // Remove car from inventory
    cars.splice(carIndex, 1);
    localStorage.setItem('cars_local_storage', JSON.stringify(cars));
    
    // Log the activity
    logCarActivity(car, details.type === 'sale' ? 'sold' : 'traded', details);
    
    return true;
  } catch (error) {
    console.error('Error marking car as sold:', error);
    return false;
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
      activity => activity.id === id && 
      (activity.action === 'deleted' || activity.action === 'sold' || activity.action === 'traded') && 
      activity.carData
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

// Get total sales amount
export const getTotalSalesAmount = (): number => {
  try {
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!savedLog) return 0;
    
    const activityLog: CarActivity[] = JSON.parse(savedLog, (key, value) => {
      if (key === 'timestamp') return new Date(value);
      return value;
    });
    
    // Sum up all sale prices
    return activityLog
      .filter(activity => (activity.action === 'sold' || activity.action === 'traded') && activity.salePrice)
      .reduce((total, activity) => total + (activity.salePrice || 0), 0);
  } catch (error) {
    console.error('Error getting total sales:', error);
    return 0;
  }
};

// Get total sales count
export const getTotalSalesCount = (): { sold: number, traded: number } => {
  try {
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!savedLog) return { sold: 0, traded: 0 };
    
    const activityLog: CarActivity[] = JSON.parse(savedLog, (key, value) => {
      if (key === 'timestamp') return new Date(value);
      return value;
    });
    
    // Count sales and trades
    const sold = activityLog.filter(activity => activity.action === 'sold').length;
    const traded = activityLog.filter(activity => activity.action === 'traded').length;
    
    return { sold, traded };
  } catch (error) {
    console.error('Error getting sales count:', error);
    return { sold: 0, traded: 0 };
  }
};

// Get sales data by period
export const getSalesByPeriod = (period: '7d' | '14d' | '21d' | '30d' | '3m' | '6m' | '12m'): {
  labels: string[], 
  salesData: number[], 
  tradesData: number[]
} => {
  try {
    const savedLog = localStorage.getItem(ACTIVITY_LOG_KEY);
    if (!savedLog) return { labels: [], salesData: [], tradesData: [] };
    
    const activityLog: CarActivity[] = JSON.parse(savedLog, (key, value) => {
      if (key === 'timestamp') return new Date(value);
      return value;
    });
    
    const now = new Date();
    let days = 0;
    let interval = 'day';
    
    // Convert period to number of days
    if (period === '7d') days = 7;
    else if (period === '14d') days = 14;
    else if (period === '21d') days = 21;
    else if (period === '30d') days = 30;
    else if (period === '3m') {
      days = 90;
      interval = 'week';
    }
    else if (period === '6m') {
      days = 180;
      interval = 'week';
    }
    else if (period === '12m') {
      days = 365;
      interval = 'month';
    }
    
    // Calculate start date
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    
    // Filter activities by period and type
    const filteredActivities = activityLog.filter(activity => 
      (activity.action === 'sold' || activity.action === 'traded') && 
      activity.timestamp >= startDate
    );
    
    // Function to format date based on interval
    const formatDate = (date: Date): string => {
      if (interval === 'day') {
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else if (interval === 'week') {
        // Get week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `W${weekNumber}`;
      } else {
        // Month
        return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][date.getMonth()];
      }
    };
    
    // Generate date labels based on interval
    const labels: string[] = [];
    const salesData: number[] = [];
    const tradesData: number[] = [];
    
    if (interval === 'day') {
      // For daily intervals
      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - 1) + i);
        labels.push(formatDate(date));
        
        // Count sales and trades for this day
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const daySales = filteredActivities.filter(activity => 
          activity.action === 'sold' &&
          activity.timestamp >= dayStart &&
          activity.timestamp <= dayEnd
        ).length;
        
        const dayTrades = filteredActivities.filter(activity => 
          activity.action === 'traded' &&
          activity.timestamp >= dayStart &&
          activity.timestamp <= dayEnd
        ).length;
        
        salesData.push(daySales);
        tradesData.push(dayTrades);
      }
    } else if (interval === 'week') {
      // For weekly intervals
      const weeks = Math.ceil(days / 7);
      for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (weeks - 1) * 7 + i * 7);
        labels.push(formatDate(weekStart));
        
        // Count sales and trades for this week
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekSales = filteredActivities.filter(activity => 
          activity.action === 'sold' &&
          activity.timestamp >= weekStart &&
          activity.timestamp <= weekEnd
        ).length;
        
        const weekTrades = filteredActivities.filter(activity => 
          activity.action === 'traded' &&
          activity.timestamp >= weekStart &&
          activity.timestamp <= weekEnd
        ).length;
        
        salesData.push(weekSales);
        tradesData.push(weekTrades);
      }
    } else {
      // For monthly intervals
      const months = Math.ceil(days / 30);
      for (let i = 0; i < months; i++) {
        const monthStart = new Date(now);
        monthStart.setMonth(monthStart.getMonth() - (months - 1) + i);
        monthStart.setDate(1);
        labels.push(formatDate(monthStart));
        
        // Count sales and trades for this month
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthStart.getMonth() + 1);
        monthEnd.setDate(0);
        
        const monthSales = filteredActivities.filter(activity => 
          activity.action === 'sold' &&
          activity.timestamp >= monthStart &&
          activity.timestamp <= monthEnd
        ).length;
        
        const monthTrades = filteredActivities.filter(activity => 
          activity.action === 'traded' &&
          activity.timestamp >= monthStart &&
          activity.timestamp <= monthEnd
        ).length;
        
        salesData.push(monthSales);
        tradesData.push(monthTrades);
      }
    }
    
    return { labels, salesData, tradesData };
  } catch (error) {
    console.error('Error getting sales by period:', error);
    return { labels: [], salesData: [], tradesData: [] };
  }
};
