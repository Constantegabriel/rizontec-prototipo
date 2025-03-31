
import React, { useState } from 'react';
import { Car } from '../data/cars';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

const CarModal: React.FC<CarModalProps> = ({ car, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  // Formatar o preço em reais
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow-md"
        >
          <X size={24} />
        </button>
        
        <div className="relative">
          <div className="relative h-64 sm:h-80 md:h-96">
            <img 
              src={car.images[currentImageIndex]} 
              alt={`${car.name} - Imagem ${currentImageIndex + 1}`} 
              className="modal-image w-full h-full object-cover"
            />
            
            {car.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-1"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    {car.images.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-white bg-opacity-60'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h2 className="text-2xl font-bold">{car.name}</h2>
              <p className="text-lg text-gray-600">{car.version} • {car.year}</p>
            </div>
            <p className="text-2xl font-bold text-primary mt-2 md:mt-0">{formatPrice(car.price)}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Quilometragem</p>
              <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Combustível</p>
              <p className="font-semibold">{car.fuel}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Câmbio</p>
              <p className="font-semibold">{car.transmission}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Cor</p>
              <p className="font-semibold">{car.color}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Descrição</h3>
            <p className="text-gray-700">{car.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Características</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => window.open(`tel:1199999999`, '_blank')}
            >
              Entrar em contato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarModal;
