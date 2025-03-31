
import React from 'react';
import { Car } from '../data/cars';

interface CarCardProps {
  car: Car;
  onClick: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  // Formatar o preço em reais
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div 
      className="bg-white bg-border p-1 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={car.images[0]} 
          alt={car.name} 
          className="car-image w-full rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-700">{car.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-base font-bold text-primary">{formatPrice(car.price)}</p>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">{car.year}</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-600">{car.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
