
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterMenu, { FilterOptions } from '../components/FilterMenu';
import CarGrid from '../components/CarGrid';
import Footer from '../components/Footer';
import { cars as initialCars, Car } from '../data/cars';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const Index: React.FC = () => {
  const [allCars, setAllCars] = useState<Car[]>(initialCars);
  const [filteredCars, setFilteredCars] = useState<Car[]>(initialCars);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterOptions>({
    brand: null,
    minYear: 0,
    maxYear: 0,
    minPrice: 0,
    maxPrice: 0
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

  // Load cars from localStorage
  const loadCars = () => {
    const savedCars = localStorage.getItem('cars');
    if (savedCars) {
      const parsedCars = JSON.parse(savedCars);
      setAllCars(parsedCars);
      setFilteredCars(parsedCars); // Show all cars by default
      
      // Initialize filter values
      const { minYear, maxYear, minPrice, maxPrice } = getMinMaxValues();
      setFilters({
        brand: null,
        minYear,
        maxYear,
        minPrice,
        maxPrice
      });
    }
  };

  // Load cars on initial render
  useEffect(() => {
    loadCars();
  }, []);

  // Apply search and filters together
  const applyFilters = () => {
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
    
    setFilteredCars(results);
  };

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
    loadCars();
  };
  
  const { minYear, maxYear, minPrice, maxPrice, brands } = getMinMaxValues();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4">
        <div className="py-8">
          <h2 className="text-3xl font-bold text-center">Encontre seu próximo veículo</h2>
          <p className="text-gray-600 text-center mt-2">
            Carros seminovos com procedência e garantia
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <SearchBar onSearch={handleSearch} />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRefresh} 
                className="ml-2"
                title="Atualizar veículos"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <FilterMenu 
              onFilter={handleFilter}
              minYear={minYear}
              maxYear={maxYear}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brands={brands}
            />
            
            <div className="mt-4 mb-2">
              <p className="text-gray-600">
                {filteredCars.length === 0 
                  ? "Nenhum veículo encontrado" 
                  : `Mostrando ${filteredCars.length} veículo${filteredCars.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            
            <CarGrid cars={filteredCars} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
