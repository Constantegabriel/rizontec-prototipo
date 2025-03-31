
import React, { useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CarGrid from '../components/CarGrid';
import Footer from '../components/Footer';
import { cars, Car } from '../data/cars';

const Index: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCars(cars);
      return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = cars.filter(car => 
      car.name.toLowerCase().includes(searchTerm) || 
      car.version.toLowerCase().includes(searchTerm) || 
      car.year.toString().includes(searchTerm)
    );
    
    setFilteredCars(results);
  };

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
        
        <SearchBar onSearch={handleSearch} />
        
        <div className="mt-4 mb-2">
          <p className="text-gray-600">
            {filteredCars.length === 0 
              ? "Nenhum veículo encontrado" 
              : `Mostrando ${filteredCars.length} veículo${filteredCars.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        
        <CarGrid cars={filteredCars} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
