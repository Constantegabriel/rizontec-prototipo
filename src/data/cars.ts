
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
  {
    id: 2,
    name: "Honda Civic",
    price: 94500,
    year: 2021,
    version: "Touring 1.5 Turbo",
    mileage: 22000,
    fuel: "Gasolina",
    transmission: "Automático",
    color: "Branco",
    features: ["Teto solar", "Bancos de couro", "Câmera de ré", "Sensor de estacionamento", "GPS", "Apple CarPlay"],
    description: "Honda Civic Touring em perfeito estado. Carro top de linha com todos os opcionais, motor turbo potente e econômico.",
    images: [
      "https://images.unsplash.com/photo-1605816988069-b11383b50717?q=80&w=800",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=800",
      "https://images.unsplash.com/photo-1583267746897-2cf4865e0902?q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Jeep Compass",
    price: 145900,
    year: 2023,
    version: "Limited 2.0 Diesel 4x4",
    mileage: 8000,
    fuel: "Diesel",
    transmission: "Automático",
    color: "Preto",
    features: ["4x4", "Interior premium", "Teto panorâmico", "Assistente de condução", "Som premium", "Climatizador digital"],
    description: "Jeep Compass Limited 4x4 Diesel. SUV completo com tração nas 4 rodas, baixa quilometragem e estado de zero. Ideal para cidade e estrada.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=800",
      "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=800"
    ]
  }
];
