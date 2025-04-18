
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car } from '@/data/cars';
import { markCarAsSold } from '@/utils/activityLogger';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

interface SaleConfirmDialogProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SaleConfirmDialog: React.FC<SaleConfirmDialogProps> = ({ 
  car, 
  isOpen, 
  onClose,
  onConfirm
}) => {
  const [saleType, setSaleType] = useState<'sale' | 'trade'>('sale');
  const [salePrice, setSalePrice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!car) return;
    
    const price = Number(salePrice.replace(/[^\d]/g, '')) / 100;
    
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido para a negociação.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    const success = markCarAsSold(car.id, {
      price,
      type: saleType
    });
    
    if (success) {
      toast({
        title: "Veículo registrado com sucesso",
        description: `${car.name} ${car.version} ${saleType === 'sale' ? 'vendido' : 'trocado'} por ${formatCurrency(price)}.`
      });
      onConfirm();
    } else {
      toast({
        title: "Erro ao registrar",
        description: "Não foi possível registrar a negociação.",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
    onClose();
  };

  const formatPriceInput = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Convert to cents
    const cents = parseInt(digits) || 0;
    
    // Format as currency
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(cents / 100);
    
    return formatted;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPriceInput(e.target.value);
    setSalePrice(formatted);
  };

  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Negociação</DialogTitle>
          <DialogDescription>
            Informe os detalhes da negociação para {car.name} {car.version}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="saleType">Tipo de Negociação</Label>
            <RadioGroup 
              id="saleType" 
              value={saleType} 
              onValueChange={(value) => setSaleType(value as 'sale' | 'trade')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sale" id="sale" />
                <Label htmlFor="sale">Venda</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trade" id="trade" />
                <Label htmlFor="trade">Troca</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salePrice">Valor da Negociação</Label>
            <Input
              id="salePrice"
              value={salePrice}
              onChange={handlePriceChange}
              placeholder="R$ 0,00"
              className="col-span-3"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processando...' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleConfirmDialog;
