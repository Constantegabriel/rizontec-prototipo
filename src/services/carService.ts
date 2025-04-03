
import { supabase } from "@/integrations/supabase/client";
import { Car } from "@/data/cars";
import { v4 as uuidv4 } from 'uuid';

// Convert local Car type to Supabase database type
const mapCarToDbCar = (car: Car, userId?: string): any => {
  return {
    id: car.id ? car.id.toString() : uuidv4(),
    name: car.name,
    price: car.price,
    year: car.year,
    version: car.version,
    color: car.color,
    mileage: car.mileage,
    transmission: car.transmission,
    fuel: car.fuel,
    description: car.description || '',
    features: car.features || [],
    images: car.images || [],
    user_id: userId
  };
};

// Convert Supabase database type to local Car type
const mapDbCarToCar = (dbCar: any): Car => {
  return {
    id: parseInt(dbCar.id) || Date.now(),
    name: dbCar.name,
    price: dbCar.price,
    year: dbCar.year,
    version: dbCar.version,
    color: dbCar.color,
    mileage: dbCar.mileage,
    transmission: dbCar.transmission,
    fuel: dbCar.fuel,
    description: dbCar.description || '',
    features: dbCar.features || [],
    images: dbCar.images || []
  };
};

// Load all cars
export const loadCars = async (): Promise<Car[]> => {
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*');
    
    if (error) {
      console.error('Error loading cars:', error);
      throw error;
    }
    
    return data ? data.map(mapDbCarToCar) : [];
  } catch (error) {
    console.error('Error loading cars:', error);
    throw error;
  }
};

// Add a new car
export const addCar = async (car: Car, userId?: string): Promise<Car> => {
  try {
    const newCar = mapCarToDbCar(car, userId);
    
    const { data, error } = await supabase
      .from('cars')
      .insert(newCar)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding car:', error);
      throw error;
    }
    
    return mapDbCarToCar(data);
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

// Update a car
export const updateCar = async (car: Car): Promise<Car> => {
  try {
    const updatedCar = mapCarToDbCar(car);
    
    // Remove id from the update payload
    const { id, ...updatePayload } = updatedCar;
    
    const { data, error } = await supabase
      .from('cars')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating car:', error);
      throw error;
    }
    
    return mapDbCarToCar(data);
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
};

// Delete a car
export const deleteCar = async (id: number | string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id.toString());
    
    if (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};

// Upload car images
export const uploadCarImages = async (files: File[]): Promise<string[]> => {
  try {
    const imageUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);
      
      imageUrls.push(data.publicUrl);
    }
    
    return imageUrls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
