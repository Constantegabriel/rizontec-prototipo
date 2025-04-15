
import React, { useState } from 'react';
import { Car } from '../data/cars';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEFAULT_CAR_IMAGE } from '@/services/carService';

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

  // Verificar se está usando imagem padrão
  const isUsingDefaultImage = car.images.length === 1 && car.images[0] === DEFAULT_CAR_IMAGE;

  // Prepare WhatsApp message with car details
  const openWhatsApp = () => {
    const message = `Olá, estou interessado no veículo ${car.name} ${car.version} ${car.year} anunciado no site. Poderia me dar mais informações?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5548998143419?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 bg-gray-700 rounded-full p-1 shadow-md"
        >
          <X size={24} />
        </button>
        
        <div className="relative">
          <div className="relative h-64 sm:h-80 md:h-96">
            <img 
              src={car.images[currentImageIndex]} 
              alt={`${car.name} - Imagem ${currentImageIndex + 1}`} 
              className="modal-image w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = DEFAULT_CAR_IMAGE;
              }}
            />
            
            {!isUsingDefaultImage && car.images.length > 1 && (
              <>
                <button 
                  onClick={prevImage} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-75 rounded-full p-1"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-75 rounded-full p-1"
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
              <h2 className="text-2xl font-bold text-gray-300">{car.name}</h2>
              <p className="text-lg text-gray-400">{car.version} • {car.year}</p>
            </div>
            <p className="text-2xl font-bold text-primary mt-2 md:mt-0">{formatPrice(car.price)}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-secondary text-gray-300 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Quilometragem</p>
              <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
            </div>
            <div className="bg-secondary text-gray-300 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Combustível</p>
              <p className="font-semibold">{car.fuel}</p>
            </div>
            <div className="bg-secondary text-gray-300 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Câmbio</p>
              <p className="font-semibold">{car.transmission}</p>
            </div>
            <div className="bg-secondary text-gray-300 p-3 rounded-lg">
              <p className="text-sm text-gray-400">Cor</p>
              <p className="font-semibold">{car.color}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Descrição</h3>
            <p className="text-gray-400">{car.description}</p>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Características</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {car.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                  <span className="text-gray-400">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              onClick={openWhatsApp}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#ffffff" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
              </svg>
              Entrar em contato pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarModal;
