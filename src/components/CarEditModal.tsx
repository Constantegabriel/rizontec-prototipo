
import React, { useState, useRef, useEffect } from 'react';
import { Car } from '@/data/cars';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Trash2, Upload, Plus, ImageOff } from 'lucide-react';
import { DEFAULT_CAR_IMAGE } from '@/services/carService';
import { useToast } from '@/components/ui/use-toast';

// Schema for car form validation
const carSchema = z.object({
  name: z.string().min(1, 'Nome do carro é obrigatório'),
  price: z.coerce.number().min(1, 'Preço é obrigatório'),
  year: z.coerce.number().min(1900, 'Ano inválido'),
  version: z.string().min(1, 'Versão é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  mileage: z.coerce.number().min(0, 'Quilometragem inválida'),
  transmission: z.string().min(1, 'Transmissão é obrigatória'),
  fuel: z.string().min(1, 'Combustível é obrigatório'),
  description: z.string().optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

interface CarEditModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCar: Car) => void;
}

const CarEditModal: React.FC<CarEditModalProps> = ({ 
  car, isOpen, onClose, onUpdate 
}) => {
  const [images, setImages] = useState<string[]>([...car.images]);
  const [features, setFeatures] = useState<string[]>([...car.features]);
  const [featureInput, setFeatureInput] = useState<string>('');
  const [useDefaultImage, setUseDefaultImage] = useState<boolean>(
    car.images.length === 1 && car.images[0] === DEFAULT_CAR_IMAGE
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: car.name,
      price: car.price,
      year: car.year,
      version: car.version,
      color: car.color,
      mileage: car.mileage,
      transmission: car.transmission,
      fuel: car.fuel,
      description: car.description,
    },
  });

  // Reset form when car changes
  useEffect(() => {
    form.reset({
      name: car.name,
      price: car.price,
      year: car.year,
      version: car.version,
      color: car.color,
      mileage: car.mileage,
      transmission: car.transmission,
      fuel: car.fuel,
      description: car.description,
    });
    setImages([...car.images]);
    setFeatures([...car.features]);
    setUseDefaultImage(car.images.length === 1 && car.images[0] === DEFAULT_CAR_IMAGE);
  }, [car, form]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Se estava usando imagem padrão, desabilite a opção
    if (useDefaultImage) {
      setUseDefaultImage(false);
    }
    
    Array.from(files).forEach(file => {
      // Verificar tamanho do arquivo
      if (file.size > 5242880) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: `O arquivo ${file.name} excede o limite de 5MB`,
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Clear input to allow selecting the same file again
    event.target.value = '';
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim() !== '') {
      setFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };
  
  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const toggleDefaultImage = () => {
    if (useDefaultImage) {
      // Se estávamos usando a imagem padrão e agora não estamos mais
      setUseDefaultImage(false);
      // Se não tínhamos imagens personalizadas, deixe a lista vazia
      if (images.length === 1 && images[0] === DEFAULT_CAR_IMAGE) {
        setImages([]);
      }
    } else {
      // Se não estávamos usando a imagem padrão e agora estamos
      setUseDefaultImage(true);
      setImages([DEFAULT_CAR_IMAGE]);
    }
  };

  const onSubmit = (values: CarFormValues) => {
    // Se não tem imagens e não está usando a imagem padrão, use a imagem padrão
    let finalImages = images;
    if ((finalImages.length === 0 || (finalImages.length === 1 && finalImages[0] === DEFAULT_CAR_IMAGE)) && !useDefaultImage) {
      finalImages = [];
    } else if (useDefaultImage) {
      finalImages = [DEFAULT_CAR_IMAGE];
    }
    
    const updatedCar: Car = {
      ...car,
      name: values.name,
      price: values.price,
      year: values.year,
      version: values.version,
      color: values.color,
      mileage: values.mileage,
      transmission: values.transmission,
      fuel: values.fuel,
      description: values.description || `${values.name} ${values.version} ${values.year}`,
      images: finalImages,
      features: features,
    };
    
    onUpdate(updatedCar);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Veículo</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Honda Civic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 75990" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Versão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: EXL 2.0 Turbo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Preto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 45000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmissão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Automático" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Combustível</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Flex" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o veículo, seu estado, características, etc." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Características</label>
              <div className="flex">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Ex: Ar condicionado"
                  className="mr-2"
                />
                <Button 
                  type="button" 
                  onClick={addFeature}
                  variant="outline"
                >
                  <Plus size={16} />
                </Button>
              </div>
              
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center">
                      <span className="mr-2">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">Imagens do Veículo</label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="useDefaultImage" 
                    checked={useDefaultImage} 
                    onChange={toggleDefaultImage}
                    className="mr-2"
                  />
                  <label htmlFor="useDefaultImage" className="text-sm text-gray-600">
                    Usar imagem genérica
                  </label>
                </div>
              </div>
              
              {useDefaultImage ? (
                <div className="flex justify-center items-center p-4 border rounded-md">
                  <div className="flex flex-col items-center">
                    <ImageOff size={64} className="text-gray-400 mb-2" />
                    <p className="text-gray-500">Será usada uma imagem genérica</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img 
                          src={img} 
                          alt={`Preview ${index+1}`} 
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = DEFAULT_CAR_IMAGE;
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md hover:border-primary transition-colors"
                    >
                      <Upload size={20} className="mb-1 text-gray-500" />
                      <span className="text-xs text-gray-500">Adicionar</span>
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CarEditModal;
