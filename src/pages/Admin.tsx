
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Car } from '@/data/cars';
import { Trash2, LogOut, Upload, Edit, Plus, ImageOff } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import CarEditModal from '@/components/CarEditModal';
import AdminStats from '@/components/AdminStats';
import { logCarActivity } from '@/utils/activityLogger';
import { loadCars, addCar, updateCar, deleteCar, uploadCarImages, DEFAULT_CAR_IMAGE } from '@/services/carService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';

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
  features: z.string().optional(),
});

type CarFormValues = z.infer<typeof carSchema>;

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [carFeatures, setCarFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'add' | 'list' | 'stats'>('add');
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: cars = [], isLoading, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: loadCars
  });
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);
  
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: '',
      price: 0,
      year: new Date().getFullYear(),
      version: '',
      color: '',
      mileage: 0,
      transmission: '',
      fuel: '',
      description: '',
      features: '',
    },
  });
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Se tínhamos ativado a imagem padrão, desative ao fazer upload
    if (useDefaultImage) {
      setUseDefaultImage(false);
    }
    
    try {
      // Preview temporário das imagens (antes do upload ao servidor)
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
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      event.target.value = '';
      
      toast({
        title: 'Imagens adicionadas',
        description: `As imagens serão enviadas quando o veículo for salvo.`,
      });
    } catch (error) {
      console.error('Erro ao processar imagens:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar as imagens',
        variant: 'destructive'
      });
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const addFeature = () => {
    if (featureInput.trim() !== '') {
      setCarFeatures(prev => [...prev, featureInput.trim()]);
      setFeatureInput('');
    }
  };
  
  const removeFeature = (index: number) => {
    setCarFeatures(prev => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (values: CarFormValues) => {
    let finalImages: string[] = [];
    
    // Se a opção de imagem padrão está ativada, use a imagem padrão
    if (useDefaultImage) {
      finalImages = [DEFAULT_CAR_IMAGE];
    } else {
      // Caso contrário, tente fazer upload das imagens selecionadas
      if (uploadedImages.length > 0) {
        try {
          // Converter as imagens de base64 para Blob/File para upload
          const filesToUpload: File[] = [];
          for (const dataUrl of uploadedImages) {
            // Ignorar a imagem padrão
            if (dataUrl === DEFAULT_CAR_IMAGE) continue;
            
            // Converter de data URL para blob
            try {
              // Verificar se é uma dataURL ou URL já enviada
              if (dataUrl.startsWith('data:')) {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const ext = dataUrl.split(';')[0].split('/')[1];
                const file = new File([blob], `image-${Date.now()}.${ext}`, { type: blob.type });
                filesToUpload.push(file);
              } else {
                // Se já é uma URL, adicione diretamente
                finalImages.push(dataUrl);
              }
            } catch (e) {
              console.error('Erro ao processar imagem:', e);
              // Se falhar, ignore esta imagem
            }
          }
          
          // Se temos arquivos para upload, faça o upload
          if (filesToUpload.length > 0) {
            const uploadedUrls = await uploadCarImages(filesToUpload);
            finalImages = [...finalImages, ...uploadedUrls];
          }
        } catch (error) {
          console.error('Erro ao enviar imagens:', error);
          toast({
            title: 'Aviso',
            description: 'Não foi possível enviar algumas imagens. Usando imagem padrão.',
            variant: 'destructive'
          });
          finalImages = [DEFAULT_CAR_IMAGE];
        }
      } else {
        // Se não há imagens, use a imagem padrão
        finalImages = [DEFAULT_CAR_IMAGE];
      }
    }
    
    const newCar: Car = {
      id: Date.now(),
      name: values.name,
      price: values.price,
      year: values.year,
      version: values.version,
      color: values.color,
      mileage: values.mileage,
      transmission: values.transmission,
      fuel: values.fuel,
      images: finalImages,
      features: carFeatures,
      description: values.description || `${values.name} ${values.version} ${values.year}`,
    };
    
    try {
      await addCar(newCar);
      
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      
      logCarActivity(newCar, 'added');
      
      form.reset();
      setUploadedImages([]);
      setCarFeatures([]);
      setUseDefaultImage(false);
      
      toast({
        title: 'Carro adicionado',
        description: `${values.name} foi adicionado ao estoque`,
      });
    } catch (error) {
      console.error('Erro ao adicionar carro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o veículo',
        variant: 'destructive'
      });
    }
  };
  
  const handleDeleteCar = async (id: number) => {
    const carToDelete = cars.find(car => car.id === id);
    if (!carToDelete) return;
    
    try {
      await deleteCar(id);
      
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      
      logCarActivity(carToDelete, 'deleted');
      
      toast({
        title: 'Carro removido',
        description: 'O veículo foi removido do estoque',
      });
    } catch (error) {
      console.error('Erro ao remover carro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o veículo',
        variant: 'destructive'
      });
    }
  };
  
  const handleEditCar = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
    
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da área administrativa',
    });
  };
  
  const handleCarUpdated = async (updatedCar: Car) => {
    try {
      await updateCar(updatedCar);
      
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      
      logCarActivity(updatedCar, 'edited');
      
      setIsEditModalOpen(false);
      setSelectedCar(null);
      
      toast({
        title: 'Carro atualizado',
        description: `${updatedCar.name} foi atualizado no estoque`,
      });
    } catch (error) {
      console.error('Erro ao atualizar carro:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o veículo',
        variant: 'destructive'
      });
    }
  };
  
  const handleCarRestored = () => {
    refetch();
    
    toast({
      title: 'Estoque atualizado',
      description: 'Um veículo foi restaurado ao estoque',
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Painel Administrativo</h2>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
        
        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'add' 
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('add')}
            >
              Adicionar Veículo
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'list' 
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('list')}
            >
              Estoque Atual
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'stats' 
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Estatísticas
            </button>
          </div>
        </div>
        
        {activeTab === 'add' && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Adicionar Veículo</h3>
              
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
                    
                    {carFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {carFeatures.map((feature, index) => (
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
                          onChange={() => setUseDefaultImage(prev => !prev)}
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
                          {uploadedImages.map((img, index) => (
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
                  
                  <Button type="submit" className="w-full">Adicionar Veículo</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'list' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Estoque Atual</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {cars.length === 0 ? (
                <p className="text-gray-500">Nenhum veículo cadastrado</p>
              ) : (
                cars.map((car) => (
                  <div key={car.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={car.images[0]} 
                      alt={car.name} 
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_CAR_IMAGE;
                      }}
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{car.name}</h4>
                      <p className="text-sm text-gray-600">
                        {car.year} • {car.version} • {car.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => handleEditCar(car)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <AdminStats cars={cars} onCarRestored={handleCarRestored} />
        )}
      </main>
      
      {selectedCar && (
        <CarEditModal
          car={selectedCar}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleCarUpdated}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Admin;
