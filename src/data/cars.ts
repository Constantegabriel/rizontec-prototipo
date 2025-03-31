
export interface Car {
  id: number;
  name: string;
  price: number;
  year: number;
  version: string;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  features: string[];
  description: string;
  images: string[];
}

export const cars: Car[] = [
  {
    id: 1,
    name: "Toyota Corolla",
    price: 89900,
    year: 2022,
    version: "XEi 2.0",
    mileage: 15000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Prata",
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Central multimídia"],
    description: "Toyota Corolla XEi 2.0 em excelente estado. Único dono, todas as revisões feitas na concessionária. Carro completo, econômico e muito confortável.",
    images: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800",
      "https://images.unsplash.com/photo-1597007030739-6d2e7172ee0e?q=80&w=800",
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800"
    ]
  },
];
