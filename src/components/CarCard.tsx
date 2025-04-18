import React, { useState } from 'react';
import { Car } from '@/data/cars';
import CarModal from './CarModal';
import { DEFAULT_CAR_IMAGE } from '@/services/carService';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CircleDollarSign, DollarSign, MoreVertical, Trash2 } from 'lucide-react';
import SaleConfirmDialog from './SaleConfirmDialog';

interface CarCardProps {
  car: Car;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: () => void;
  onCardClick?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, isAdmin = false, onDelete, onUpdate, onCardClick }) => {
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
      <div 
        className="bg-card rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg border border-gray-700 group cursor-pointer"
        onClick={onCardClick}
      >
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
          {car.mileage < 10000 && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
              Baixa Km
            </div>
          )}
          
          {isAdmin && (
            <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="bg-background/80 backdrop-blur-sm hover:bg-background">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsSaleDialogOpen(true)}>
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    <span>Vendido/Trocado</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="p-4">
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
          </div>
        </div>
      </div>
      
      <CarModal car={car} isOpen={false} onClose={() => {}} />
      
      <SaleConfirmDialog 
        car={car} 
        isOpen={isSaleDialogOpen} 
        onClose={() => setIsSaleDialogOpen(false)} 
        onConfirm={handleSold}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-4">
            <Button 
              variant="destructive" 
              onClick={() => {
                if (onDelete) {
                  onDelete(car.id);
                }
                setIsDeleteDialogOpen(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Permanentemente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CarCard;
