
import React, { useState } from 'react';
import { Car } from '@/data/cars';
import CarModal from './CarModal';
import { DEFAULT_CAR_IMAGE } from '@/services/carService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, DollarSign, MoreVertical, Trash2 } from 'lucide-react';
import SaleCarDialog from './SaleCarDialog';

interface CarCardProps {
  car: Car;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isAdmin = false, onDelete, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleSold = () => {
    if (onUpdate) {
      onUpdate();
    }
    setIsSaleDialogOpen(false);
  };

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg border border-gray-700 group">
        <div className="relative">
          <img
            src={car.images[0] || DEFAULT_CAR_IMAGE}
            alt={car.name}
            className="car-image w-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = DEFAULT_CAR_IMAGE;
            }}
          />
          {/* Badge for special features */}
          {car.mileage < 10000 && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Baixa Km
            </div>
          )}
          
          {/* Admin actions */}
          {isAdmin && (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="bg-background/80 backdrop-blur-sm hover:bg-background">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsSaleDialogOpen(true)}>
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    <span>Vendido</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div 
          className="p-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <h3 className="font-semibold text-lg">{car.name}</h3>
          <p className="text-muted-foreground text-sm mb-2">{car.version} • {car.year}</p>
          
          <div className="flex flex-wrap gap-2 my-2">
            <div className="bg-secondary px-2 py-1 rounded-full text-xs text-foreground">
              {car.mileage.toLocaleString()} km
            </div>
            <div className="bg-secondary px-2 py-1 rounded-full text-xs text-foreground">
              {car.transmission}
            </div>
            <div className="bg-secondary px-2 py-1 rounded-full text-xs text-foreground">
              {car.fuel}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <p className="font-bold text-xl">{formatPrice(car.price)}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening the modal
                  setIsModalOpen(true);
                }}
              >
                Ver detalhes
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <CarModal car={car} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (onDelete) {
                  onDelete(car.id);
                }
                setIsDeleteDialogOpen(false);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Sale dialog */}
      <SaleCarDialog 
        car={car}
        isOpen={isSaleDialogOpen}
        onClose={() => setIsSaleDialogOpen(false)}
        onSold={handleSold}
      />
    </>
  );
};

export default CarCard;
