
import React, { useState } from 'react';
import { Car } from '../data/cars';
import CarCard from './CarCard';
import CarModal from './CarModal';
import { DEFAULT_CAR_IMAGE } from '@/services/carService';

interface CarGridProps {
  cars: Car[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (car: Car) => {
    // Garantir que o carro tenha pelo menos uma imagem antes de abrir o modal
    if (!car.images || car.images.length === 0) {
      car.images = [DEFAULT_CAR_IMAGE];
    }
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      {cars.length === 0 ? (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-500">Nenhum veículo encontrado</p>
          <p className="text-gray-400 mt-2">Tente ajustar seus filtros ou busque novamente</p>
        </div>
      ) : (
        cars.map((car) => (
          <CarCard 
            key={car.id} 
            car={{
              ...car,
              images: car.images && car.images.length > 0 ? car.images : [DEFAULT_CAR_IMAGE]
            }} 
            onClick={() => openModal(car)} 
          />
        ))
      )}
      
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
