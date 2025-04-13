
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterMenu, { FilterOptions } from '../components/FilterMenu';
import CarGrid from '../components/CarGrid';
import Footer from '../components/Footer';
import OffersCarousel from '../components/OffersCarousel';
import { Car } from '../data/cars';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { loadCars } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';

const Index: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    brand: null,
    minYear: 0,
    maxYear: 0,
    minPrice: 0,
    maxPrice: 0,
    transmission: null,
    maxMileage: null
  });

  // Fetch cars using React Query with refetch interval for automatic updates
  const { data: allCars = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: loadCars,
    refetchInterval: 10000, // Recarregar a cada 10 segundos
    refetchOnWindowFocus: true, // Recarregar quando a janela receber foco
    staleTime: 5000, // Considerar dados atuais por 5 segundos
  });

  // Calculate min and max values for filters
  const getMinMaxValues = () => {
    if (allCars.length === 0) return { minYear: 2000, maxYear: 2023, minPrice: 0, maxPrice: 200000, brands: [] };
    
    const brands = [...new Set(allCars.map(car => car.name.split(' ')[0]))];
    const years = allCars.map(car => car.year);
    const prices = allCars.map(car => car.price);
    
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      brands
    };
  };

  // Apply search and filters together
  const applyFilters = () => {
    console.log('Aplicando filtros em', allCars.length, 'carros');
    let results = allCars;
    
    // Apply search query if exists
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase().trim();
      results = results.filter(car => 
        car.name.toLowerCase().includes(searchTerm) || 
        car.version.toLowerCase().includes(searchTerm) || 
        car.year.toString().includes(searchTerm)
      );
    }
    
    // Apply brand filter if selected
    if (filters.brand) {
      results = results.filter(car => 
        car.name.toLowerCase().startsWith(filters.brand.toLowerCase())
      );
    }
    
    // Apply year range filter
    results = results.filter(car => 
      car.year >= filters.minYear && car.year <= filters.maxYear
    );
    
    // Apply price range filter
    results = results.filter(car => 
      car.price >= filters.minPrice && car.price <= filters.maxPrice
    );
    
    // Apply transmission filter if selected
    if (filters.transmission) {
      results = results.filter(car => 
        car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }
    
    // Apply mileage filter if selected
    if (filters.maxMileage) {
      results = results.filter(car => 
        car.mileage <= filters.maxMileage
      );
    }
    
    console.log('Após filtros:', results.length, 'carros');
    setFilteredCars(results);
  };

  // Initialize filters when cars are loaded
  useEffect(() => {
    if (allCars.length > 0) {
      console.log('Carros carregados na página inicial:', allCars.length);
      const { minYear, maxYear, minPrice, maxPrice } = getMinMaxValues();
      setFilters(prev => ({
        ...prev,
        minYear,
        maxYear,
        minPrice,
        maxPrice
      }));
      
      setFilteredCars(allCars);
    } else {
      console.log('Nenhum carro carregado na página inicial');
    }
  }, [allCars]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filters
  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Apply filters whenever search or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, allCars]);
  
  // Refresh handler to reload cars
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Lista atualizada",
      description: `${allCars.length} veículos carregados.`
    });
  };
  
  const { minYear, maxYear, minPrice, maxPrice, brands } = getMinMaxValues();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4">
        {/* Add the Offers Carousel */}
        <OffersCarousel />
        
        <div className="py-6">
          <h2 className="text-3xl font-bold text-center">Encontre seu próximo veículo</h2>
          <p className="text-gray-600 text-center mt-2">
            Carros seminovos com procedência e garantia
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <FilterMenu 
              onFilter={handleFilter}
              minYear={minYear}
              maxYear={maxYear}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brands={brands}
            />
            
            <div className="flex justify-center my-6">
              <Button 
                onClick={handleRefresh} 
                className="rounded-full px-6 py-2 text-base font-medium bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 shadow-md hover:shadow-lg transition-all duration-300 text-white border-none"
              >
                Ver Estoque
              </Button>
            </div>
            
            <div className="mt-4 mb-2">
              <p className="text-gray-600">
                {isLoading ? "Carregando..." : 
                  filteredCars.length === 0 
                    ? "Nenhum veículo encontrado" 
                    : `Mostrando ${filteredCars.length} veículo${filteredCars.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            {isError ? (
              <div className="text-center my-8">
                <p className="text-red-500">Erro ao carregar veículos. Tente novamente.</p>
              </div>
            ) : (
              <CarGrid cars={filteredCars} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
