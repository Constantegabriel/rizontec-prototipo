
import React, { useState } from 'react';
import { Car } from '../data/cars';
import CarCard from './CarCard';
import CarModal from './CarModal';

interface CarGridProps {
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      {cars.map((car) => (
        <CarCard 
          key={car.id} 
          car={car} 
          onClick={() => openModal(car)} 
        />
      ))}
      
      {selectedCar && (
        <CarModal 
          car={selectedCar} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default CarGrid;
