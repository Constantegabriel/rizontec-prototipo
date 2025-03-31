
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
    <div className="car-grid">
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
