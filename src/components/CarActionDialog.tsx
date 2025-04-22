
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Car } from "@/data/cars";
import { Label } from "@/components/ui/label";

interface CarActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (justification?: string) => void;
  onSold: (salePrice: number, justification: string, type: "sale" | "trade") => void;
  car: Car;
}

const CarActionDialog: React.FC<CarActionDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSold,
  car,
}) => {
  const [selectedAction, setSelectedAction] = useState<"delete" | "sale" | "trade">("delete");
  const [salePrice, setSalePrice] = useState<number>(car.price || 0);
  const [justification, setJustification] = useState("");
  const [sending, setSending] = useState(false);

  const handleConfirm = () => {
    if (selectedAction === "delete") {
      setSending(true);
      onDelete();
      setSending(false);
      return;
    }
    // Sale or trade requires value and justification
    if (!salePrice || salePrice <= 0 || justification.trim().length < 3) {
      // botão não habilita, validamos do mesmo jeito
      return;
    }
    setSending(true);
    onSold(salePrice, justification, selectedAction);
    setSending(false);
  };

  React.useEffect(() => {
    setSelectedAction("delete");
    setSalePrice(car.price || 0);
    setJustification("");
  }, [isOpen, car]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Qual ação deseja realizar?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex gap-2">
            <button
              className={`flex-1 px-3 py-2 rounded-full font-medium transition-colors ${
                selectedAction === "delete"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedAction("delete")}
              type="button"
            >
              Excluir
            </button>
            <button
              className={`flex-1 px-3 py-2 rounded-full font-medium transition-colors ${
                selectedAction === "sale"
                  ? "bg-gradient-to-tr from-green-400 to-green-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedAction("sale")}
              type="button"
            >
              Vendido
            </button>
            <button
              className={`flex-1 px-3 py-2 rounded-full font-medium transition-colors ${
                selectedAction === "trade"
                  ? "bg-gradient-to-tr from-blue-400 to-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedAction("trade")}
              type="button"
            >
              Troca
            </button>
          </div>
          {(selectedAction === "sale" || selectedAction === "trade") && (
            <div className="space-y-2">
              <Label htmlFor="salePrice">{selectedAction === "sale" ? "Valor da Venda" : "Valor da Troca"}</Label>
              <Input
                id="salePrice"
                type="number"
                min={0}
                value={salePrice}
                onChange={e => setSalePrice(Number(e.target.value))}
                className="w-full"
                placeholder="R$"
              />
              <Label htmlFor="justification">Justificativa</Label>
              <Input
                id="justification"
                value={justification}
                onChange={e => setJustification(e.target.value)}
                className="w-full"
                placeholder="Descreva a negociação (obrigatório)"
                maxLength={100}
              />
              <p className="text-xs text-gray-500">Explique o valor negociado (mínimo 3 caracteres)</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2 justify-end mt-4">
          <Button variant="outline" disabled={sending} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              sending ||
              (selectedAction !== "delete" && (!salePrice || salePrice <= 0 || justification.trim().length < 3))
            }
            variant={selectedAction === "delete" ? "destructive" : "default"}
          >
            {sending ? "Processando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CarActionDialog;
