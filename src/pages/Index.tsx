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
import { ChevronRight, Filter, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    brand: null,
    minYear: 0,
    maxYear: 0,
    minPrice: 0,
    maxPrice: 0,
    transmission: null,
    maxMileage: null
  });

  // Fetch cars using React Query
  const { data: allCars = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['cars'],
    queryFn: loadCars,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
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

  // Apply filters
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
    
    // Apply filters
    if (filters.brand) {
      results = results.filter(car => 
        car.name.toLowerCase().startsWith(filters.brand.toLowerCase())
      );
    }
    
    results = results.filter(car => 
      car.year >= filters.minYear && car.year <= filters.maxYear
    );
    
    results = results.filter(car => 
      car.price >= filters.minPrice && car.price <= filters.maxPrice
    );
    
    if (filters.transmission) {
      results = results.filter(car => 
        car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      );
    }
    
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

  // Apply filters whenever search or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, allCars]);
  
  // Refresh handler
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Lista atualizada",
      description: `${allCars.length} veículos carregados.`
    });
  };
  
  const { minYear, maxYear, minPrice, maxPrice, brands } = getMinMaxValues();
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Add missing handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero carousel */}
        <div className="w-full">
          <OffersCarousel />
        </div>
        
        {/* Main search section - Darker gray background */}
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Encontre seu próximo veículo
              </h1>
              <p className="text-muted-foreground text-lg">
                Veículos seminovos com qualidade e procedência garantida
              </p>
            </div>
            
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <SearchBar onSearch={handleSearch} />
                  </div>
                  
                  <Button 
                    onClick={handleRefresh} 
                    className="btn-primary"
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Ver Estoque
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <FilterMenu 
                    onFilter={handleFilter}
                    minYear={minYear}
                    maxYear={maxYear}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    brands={brands}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Results section */}
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Veículos disponíveis</h2>
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : 
                filteredCars.length === 0 
                  ? "Nenhum veículo encontrado" 
                  : `Mostrando ${filteredCars.length} veículo${filteredCars.length !== 1 ? 's' : ''}`}
            </div>
          </div>
          
          {isError ? (
            <div className="text-center my-8">
              <p className="text-red-500">Erro ao carregar veículos. Tente novamente.</p>
            </div>
          ) : (
            <CarGrid cars={filteredCars} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
