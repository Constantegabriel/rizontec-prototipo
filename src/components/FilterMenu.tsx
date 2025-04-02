
import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FilterMenuProps {
  onFilter: (filters: FilterOptions) => void;
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  brands: string[];
}

export interface FilterOptions {
  brand: string | null;
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
  transmission: string | null;
  maxMileage: number | null;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  onFilter,
  minYear,
  maxYear,
  minPrice,
  maxPrice,
  brands,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([minYear, maxYear]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [transmission, setTransmission] = useState<string | null>(null);
  const [maxMileage, setMaxMileage] = useState<number | null>(null);

  // Update ranges when props change (initial load)
  useEffect(() => {
    setYearRange([minYear, maxYear]);
    setPriceRange([minPrice, maxPrice]);
  }, [minYear, maxYear, minPrice, maxPrice]);

  const handleYearChange = (values: number[]) => {
    setYearRange([values[0], values[1]]);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleFilter = () => {
    onFilter({
      brand: selectedBrand,
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      transmission,
      maxMileage,
    });
  };

  const resetFilters = () => {
    setSelectedBrand(null);
    setYearRange([minYear, maxYear]);
    setPriceRange([minPrice, maxPrice]);
    setTransmission(null);
    setMaxMileage(null);
    
    onFilter({
      brand: null,
      minYear: minYear,
      maxYear: maxYear,
      minPrice: minPrice,
      maxPrice: maxPrice,
      transmission: null,
      maxMileage: null,
    });
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Define opções de quilometragem
  const mileageOptions = [
    { label: 'Qualquer', value: null },
    { label: 'Até 10.000 km', value: 10000 },
    { label: 'Até 30.000 km', value: 30000 },
    { label: 'Até 50.000 km', value: 50000 },
    { label: 'Até 100.000 km', value: 100000 },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg bg-card shadow-sm"
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between p-4 text-foreground">
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span>Filtrar veículos</span>
            </div>
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Marca</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedBrand || "Todas as marcas"}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full max-h-[200px] overflow-y-auto">
                  <DropdownMenuItem onClick={() => setSelectedBrand(null)}>
                    Todas as marcas
                  </DropdownMenuItem>
                  {brands.map((brand) => (
                    <DropdownMenuItem 
                      key={brand} 
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ano: {yearRange[0]} - {yearRange[1]}
              </label>
              <Slider
                min={minYear}
                max={maxYear}
                step={1}
                value={[yearRange[0], yearRange[1]]}
                onValueChange={handleYearChange}
                className="my-6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preço: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </label>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1000}
                value={[priceRange[0], priceRange[1]]}
                onValueChange={handlePriceChange}
                className="my-6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Transmissão</label>
              <RadioGroup 
                value={transmission || ""} 
                onValueChange={(value) => setTransmission(value || null)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="transmission-all" />
                  <Label htmlFor="transmission-all">Todas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Automático" id="transmission-auto" />
                  <Label htmlFor="transmission-auto">Automático</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Manual" id="transmission-manual" />
                  <Label htmlFor="transmission-manual">Manual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CVT" id="transmission-cvt" />
                  <Label htmlFor="transmission-cvt">CVT</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quilometragem</label>
              <RadioGroup 
                value={maxMileage?.toString() || ""} 
                onValueChange={(value) => setMaxMileage(value ? parseInt(value) : null)}
                className="flex flex-col space-y-2"
              >
                {mileageOptions.map((option) => (
                  <div key={option.value?.toString() || 'any'} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option.value?.toString() || ""} 
                      id={`mileage-${option.value || 'any'}`} 
                    />
                    <Label htmlFor={`mileage-${option.value || 'any'}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={resetFilters}>
                Limpar filtros
              </Button>
              <Button onClick={handleFilter}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default FilterMenu;
