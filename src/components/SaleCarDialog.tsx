
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Car } from '@/data/cars';
import { markCarAsSold } from '@/utils/activityLogger';
import { toast } from '@/components/ui/use-toast';
import { DollarSign, Truck } from 'lucide-react';

interface SaleCarDialogProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
  onSold: () => void;
}

const SaleCarDialog: React.FC<SaleCarDialogProps> = ({
  car,
  isOpen,
  onClose,
  onSold
}) => {
  const [saleType, setSaleType] = useState<'sale' | 'trade'>('sale');
  const [salePrice, setSalePrice] = useState<number>(car.price);
  const [isLoading, setIsLoading] = useState(false);

  const handleSale = () => {
    if (!salePrice || salePrice <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido para a transação.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = markCarAsSold(car.id, {
        price: salePrice,
        type: saleType
      });

      if (success) {
        toast({
          title: saleType === 'sale' ? "Veículo vendido" : "Veículo negociado",
          description: `${car.name} ${car.version} foi ${saleType === 'sale' ? 'vendido' : 'negociado'} com sucesso.`
        });
        onSold();
        onClose();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível concluir a operação.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a transação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar Transação</DialogTitle>
          <DialogDescription>
            Informe os detalhes da transação para {car.name} {car.version}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Transação</label>
            <Select 
              value={saleType} 
              onValueChange={(value) => setSaleType(value as 'sale' | 'trade')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span>Venda</span>
                  </div>
                </SelectItem>
                <SelectItem value="trade">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Troca</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Valor da Transação</label>
            <div className="relative form-field rounded-md">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                R$
              </span>
              <Input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="pl-8 bg-transparent border-0"
                min={0}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Valor sugerido: {formatCurrency(car.price)}
            </p>
          </div>

          <div className="bg-secondary/50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Resumo da Transação</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Veículo:</span>
                <span className="text-sm">{car.name} {car.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ano:</span>
                <span className="text-sm">{car.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Preço Anunciado:</span>
                <span className="text-sm">{formatCurrency(car.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor da Transação:</span>
                <span className="text-sm font-bold">{formatCurrency(salePrice)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button onClick={handleSale} disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Confirmar Transação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleCarDialog;
