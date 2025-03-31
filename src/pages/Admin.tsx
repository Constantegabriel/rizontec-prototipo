
import React, { useState, useEffect } from 'react';
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
import { Car, cars as initialCars } from '@/data/cars';
import { Trash2, LogOut } from 'lucide-react';

// Schema for car form validation
const carSchema = z.object({
  name: z.string().min(1, 'Nome do carro é obrigatório'),
  price: z.string().min(1, 'Preço é obrigatório'),
  year: z.coerce.number().min(1900, 'Ano inválido'),
  version: z.string().min(1, 'Versão é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  mileage: z.coerce.number().min(0, 'Quilometragem inválida'),
  transmission: z.string().min(1, 'Transmissão é obrigatória'),
  fuel: z.string().min(1, 'Combustível é obrigatório'),
  image: z.string().min(1, 'URL da imagem é obrigatória'),
});

type CarFormValues = z.infer<typeof carSchema>;

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  
  // Load cars from localStorage or use initial data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    const savedCars = localStorage.getItem('cars');
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    } else {
      setCars(initialCars);
      localStorage.setItem('cars', JSON.stringify(initialCars));
    }
  }, [navigate]);
  
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      name: '',
      price: '',
      year: new Date().getFullYear(),
      version: '',
      color: '',
      mileage: 0,
      transmission: '',
      fuel: '',
      image: '',
    },
  });
  
  const onSubmit = (values: CarFormValues) => {
    const newCar: Car = {
      id: Date.now().toString(),
      name: values.name,
      price: values.price,
      year: values.year,
      version: values.version,
      color: values.color,
      mileage: values.mileage,
      transmission: values.transmission,
      fuel: values.fuel,
      image: values.image,
      images: [values.image],
    };
    
    const updatedCars = [...cars, newCar];
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    
    form.reset();
    
    toast({
      title: 'Carro adicionado',
      description: `${values.name} foi adicionado ao estoque`,
    });
  };
  
  const handleDeleteCar = (id: string) => {
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    
    toast({
      title: 'Carro removido',
      description: 'O veículo foi removido do estoque',
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
    
    toast({
      title: 'Logout realizado',
      description: 'Você saiu da área administrativa',
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            <Input placeholder="Ex: R$ 75.990" {...field} />
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
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="URL da imagem principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Adicionar Veículo</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Estoque Atual</h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {cars.length === 0 ? (
                <p className="text-gray-500">Nenhum veículo cadastrado</p>
              ) : (
                cars.map((car) => (
                  <div key={car.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/80x80?text=Sem+Imagem';
                      }}
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{car.name}</h4>
                      <p className="text-sm text-gray-600">
                        {car.year} • {car.version} • {car.price}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
