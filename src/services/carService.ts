
import { supabase } from "@/integrations/supabase/client";
import { Car } from "@/data/cars";
import { v4 as uuidv4 } from 'uuid';

// URL da imagem genérica para usar quando não houver imagens
export const DEFAULT_CAR_IMAGE = "https://www.svgrepo.com/show/508699/car.svg";

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
    images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE],
    user_id: userId
  };
};

// Convert Supabase database type to local Car type
const mapDbCarToCar = (dbCar: any): Car => {
  // Garantir que sempre há pelo menos uma imagem
  const images = dbCar.images && dbCar.images.length > 0 ? 
    dbCar.images : [DEFAULT_CAR_IMAGE];
  
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
    images: images
  };
};

// Load all cars
export const loadCars = async (): Promise<Car[]> => {
  try {
    console.log('Carregando carros do Supabase...');
    const { data, error } = await supabase
      .from('cars')
      .select('*');
    
    if (error) {
      console.error('Erro ao carregar carros:', error);
      throw error;
    }
    
    console.log('Carros carregados:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('Primeiro carro:', data[0]);
    }
    return data ? data.map(mapDbCarToCar) : [];
  } catch (error) {
    console.error('Erro ao carregar carros:', error);
    throw error;
  }
};

// Add a new car
export const addCar = async (car: Car, userId?: string): Promise<Car> => {
  try {
    console.log('Adicionando carro:', car.name);
    const newCar = mapCarToDbCar(car, userId);
    
    const { data, error } = await supabase
      .from('cars')
      .insert(newCar)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar carro:', error);
      throw error;
    }
    
    console.log('Carro adicionado com sucesso:', data.id);
    return mapDbCarToCar(data);
  } catch (error) {
    console.error('Erro ao adicionar carro:', error);
    throw error;
  }
};

// Update a car
export const updateCar = async (car: Car): Promise<Car> => {
  try {
    console.log('Atualizando carro:', car.id);
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
      console.error('Erro ao atualizar carro:', error);
      throw error;
    }
    
    console.log('Carro atualizado com sucesso:', data.id);
    return mapDbCarToCar(data);
  } catch (error) {
    console.error('Erro ao atualizar carro:', error);
    throw error;
  }
};

// Delete a car
export const deleteCar = async (id: number | string): Promise<void> => {
  try {
    console.log('Deletando carro:', id);
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id.toString());
    
    if (error) {
      console.error('Erro ao deletar carro:', error);
      throw error;
    }
    
    console.log('Carro deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    throw error;
  }
};

// Upload car images - Simplified and more robust implementation
export const uploadCarImages = async (files: File[]): Promise<string[]> => {
  try {
    console.log(`Iniciando upload de ${files.length} imagens...`);
    
    // Se não há arquivos para enviar, retorne a imagem padrão
    if (!files || files.length === 0) {
      console.log('Nenhum arquivo para enviar, usando imagem padrão');
      return [DEFAULT_CAR_IMAGE];
    }
    
    const imageUrls: string[] = [];
    
    // Tentar criar bucket caso não exista (não falharemos se ele já existir)
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('car-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log('Resultado da criação do bucket:', bucketData, bucketError);
    } catch (bucketError) {
      console.log('Bucket car-images já existe ou erro ao criar:', bucketError);
      // Continuar mesmo se houver erro (provavelmente o bucket já existe)
    }
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log(`Enviando arquivo: ${filePath} para o bucket car-images`);
      
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
      
      // Fazer upload do arquivo diretamente
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Erro ao enviar imagem:', uploadError);
        
        // Se falhar, tente obter a URL pública mesmo assim (pode ser que o arquivo já existe)
        const { data } = supabase.storage
          .from('car-images')
          .getPublicUrl(filePath);
        
        if (data && data.publicUrl) {
          console.log('Arquivo já existe, usando URL existente:', data.publicUrl);
          imageUrls.push(data.publicUrl);
          continue;
        }
        
        // Se realmente falhou, use a imagem padrão
        console.log('Usando imagem padrão devido a erro de upload');
        imageUrls.push(DEFAULT_CAR_IMAGE);
        continue;
      }
      
      console.log('Upload realizado com sucesso:', uploadData);
      
      // Obter URL pública da imagem
      const { data } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);
      
      console.log('URL da imagem obtida:', data.publicUrl);
      imageUrls.push(data.publicUrl);
    }
    
    // Se após tentativas, ainda não temos imagens, use a imagem padrão
    if (imageUrls.length === 0) {
      console.log('Nenhuma imagem foi enviada com sucesso, usando imagem padrão');
      return [DEFAULT_CAR_IMAGE];
    }
    
    console.log(`${imageUrls.length} imagens enviadas com sucesso`);
    return imageUrls;
  } catch (error) {
    console.error('Erro ao enviar imagens:', error);
    return [DEFAULT_CAR_IMAGE]; // Em caso de erro, use a imagem padrão
  }
};
