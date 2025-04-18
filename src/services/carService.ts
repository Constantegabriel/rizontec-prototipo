
import { Car } from "@/data/cars";
import { toast } from "@/components/ui/use-toast";

// URL da imagem genérica para usar quando não houver imagens
export const DEFAULT_CAR_IMAGE = "https://www.shutterstock.com/image-vector/3d-vector-illustration-car-covered-600nw-2512537225.jpg";

// Local storage keys
const CARS_STORAGE_KEY = "cars_local_storage";

// Helper to load cars from localStorage
const getLocalCars = (): Car[] => {
  try {
    const storedCars = localStorage.getItem(CARS_STORAGE_KEY);
    return storedCars ? JSON.parse(storedCars) : [];
  } catch (error) {
    console.error('Erro ao carregar carros do localStorage:', error);
    return [];
  }
};

// Helper to save cars to localStorage
const saveLocalCars = (cars: Car[]): void => {
  try {
    localStorage.setItem(CARS_STORAGE_KEY, JSON.stringify(cars));
  } catch (error) {
    console.error('Erro ao salvar carros no localStorage:', error);
  }
};

// Load all cars
export const loadCars = async (): Promise<Car[]> => {
  try {
    console.log('Carregando carros do armazenamento local...');
    const localCars = getLocalCars();
    
    console.log('Carros carregados:', localCars.length || 0);
    if (localCars && localCars.length > 0) {
      console.log('Primeiro carro:', localCars[0]);
    }
    return localCars;
  } catch (error) {
    console.error('Erro ao carregar carros:', error);
    throw error;
  }
};

// Add a new car
export const addCar = async (car: Car, userId?: string): Promise<Car> => {
  try {
    console.log('Adicionando carro:', car.name);
    
    // Get current cars
    const currentCars = getLocalCars();
    
    // Create new car with a unique ID
    const newCar: Car = {
      ...car,
      id: Date.now(), // Use timestamp as unique ID
      images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE]
    };
    
    // Add to array and save to localStorage
    currentCars.push(newCar);
    saveLocalCars(currentCars);
    
    console.log('Carro adicionado com sucesso:', newCar.id);
    
    // Display success message
    toast({
      title: 'Veículo adicionado',
      description: `${car.name} foi adicionado ao estoque com sucesso.`,
      variant: 'default'
    });
    
    return newCar;
  } catch (error) {
    console.error('Erro ao adicionar carro:', error);
    
    // Display a user-friendly error message
    toast({
      title: 'Erro ao adicionar veículo',
      description: 'Não foi possível adicionar o veículo ao estoque. Tente novamente.',
      variant: 'destructive'
    });
    
    throw error;
  }
};

// Update a car
export const updateCar = async (car: Car): Promise<Car> => {
  try {
    console.log('Atualizando carro:', car.id);
    
    // Get current cars
    const currentCars = getLocalCars();
    
    // Find index of car to update
    const index = currentCars.findIndex(c => c.id === car.id);
    
    if (index === -1) {
      throw new Error('Carro não encontrado');
    }
    
    // Update car
    currentCars[index] = {
      ...car,
      images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE]
    };
    
    // Save to localStorage
    saveLocalCars(currentCars);
    
    console.log('Carro atualizado com sucesso:', car.id);
    return car;
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    
    // Display a user-friendly error message
    toast({
      title: 'Erro ao atualizar veículo',
      description: 'Não foi possível atualizar o veículo. Tente novamente.',
      variant: 'destructive'
    });
    
    throw error;
  }
};

// Delete a car
export const deleteCar = async (id: number | string): Promise<void> => {
  try {
    console.log('Deletando carro:', id);
    
    // Get current cars
    const currentCars = getLocalCars();
    
    // Filter out car to delete
    const updatedCars = currentCars.filter(c => c.id !== id);
    
    // Save to localStorage
    saveLocalCars(updatedCars);
    
    console.log('Carro deletado com sucesso');
    
    // Display success message
    toast({
      title: 'Veículo removido',
      description: 'O veículo foi removido do estoque com sucesso.',
      variant: 'default'
    });
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    
    // Display a user-friendly error message
    toast({
      title: 'Erro ao remover veículo',
      description: 'Não foi possível remover o veículo do estoque. Tente novamente.',
      variant: 'destructive'
    });
    
    throw error;
  }
};

// Upload car images - Local implementation that returns image URLs
export const uploadCarImages = async (files: File[]): Promise<string[]> => {
  try {
    console.log(`Processando ${files.length} imagens...`);
    
    // Se não há arquivos para processar, retorne a imagem padrão
    if (!files || files.length === 0) {
      console.log('Nenhum arquivo para processar, usando imagem padrão');
      return [DEFAULT_CAR_IMAGE];
    }
    
    const imageUrls: string[] = [];
    
    // Processamento local - converter arquivos para URLs de dados
    for (const file of files) {
      // Verificar se o arquivo é muito grande
      if (file.size > 5242880) { // 5MB em bytes
        console.error('Arquivo muito grande:', file.name, file.size);
        toast({
          title: 'Arquivo muito grande',
          description: `O arquivo ${file.name} excede o limite de 5MB`,
          variant: 'destructive'
        });
        continue; // Pular este arquivo e ir para o próximo
      }
      
      // Criar uma URL para o arquivo
      const fileURL = URL.createObjectURL(file);
      console.log('URL criada para o arquivo:', fileURL);
      imageUrls.push(fileURL);
    }
    
    // Se após os processamentos ainda não temos imagens, use a imagem padrão
    if (imageUrls.length === 0) {
      console.log('Nenhuma imagem foi processada com sucesso, usando imagem padrão');
      return [DEFAULT_CAR_IMAGE];
    }
    
    console.log(`${imageUrls.length} imagens processadas com sucesso`);
    return imageUrls;
  } catch (error) {
    console.error('Erro ao processar imagens:', error);
    toast({
      title: 'Erro no processamento',
      description: 'Não foi possível processar as imagens. Será usada uma imagem genérica.',
      variant: 'destructive'
    });
    return [DEFAULT_CAR_IMAGE]; // Em caso de erro, use a imagem padrão
  }
};
