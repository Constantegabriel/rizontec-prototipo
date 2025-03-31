
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
    version: "EXL",
    mileage: 22000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Branco",
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Teto solar", "Couro"],
    description: "Honda Civic EXL em perfeito estado. Veículo bem conservado, com interior em couro e teto solar. Muito econômico e com excelente desempenho.",
    images: [
      "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=800",
      "https://images.unsplash.com/photo-1605515298946-d066076049bd?q=80&w=800",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Jeep Compass",
    price: 149900,
    year: 2022,
    version: "Limited",
    mileage: 18000,
    fuel: "Diesel",
    transmission: "Automático",
    color: "Preto",
    features: ["Ar condicionado digital", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Controle de tração", "4x4", "Couro", "Central multimídia"],
    description: "Jeep Compass Limited diesel 4x4 com baixa quilometragem. Carro muito bem conservado, com interior em couro e sistema de tração 4x4.",
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800",
      "https://images.unsplash.com/photo-1558993840-9e584d0e97fe?q=80&w=800",
      "https://images.unsplash.com/photo-1594485074548-5dea2e32616b?q=80&w=800"
    ]
  },
  {
    id: 4,
    name: "Volkswagen Golf",
    price: 119900,
    year: 2021,
    version: "GTI",
    mileage: 25000,
    fuel: "Gasolina",
    transmission: "DSG",
    color: "Vermelho",
    features: ["Ar condicionado digital", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Bancos esportivos", "Rodas de liga leve", "Central multimídia"],
    description: "Volkswagen Golf GTI em excelente estado. Carro esportivo com ótimo desempenho e baixo consumo. Interior impecável e sistema de som premium.",
    images: [
      "https://images.unsplash.com/photo-1606664696304-c2817d9b6dd1?q=80&w=800",
      "https://images.unsplash.com/photo-1541443201406-586f811765d7?q=80&w=800",
      "https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?q=80&w=800"
    ]
  },
  {
    id: 5,
    name: "Fiat Toro",
    price: 139900,
    year: 2023,
    version: "Ranch",
    mileage: 10000,
    fuel: "Diesel",
    transmission: "Automático",
    color: "Marrom",
    features: ["Ar condicionado digital", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Tração 4x4", "Couro", "Central multimídia"],
    description: "Fiat Toro Ranch diesel 4x4 praticamente zero. Picape completa com baixíssima quilometragem, todas as revisões feitas na concessionária. Excelente para trabalho e lazer.",
    images: [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?q=80&w=800",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800",
      "https://images.unsplash.com/photo-1625785131772-2e651e3e51f9?q=80&w=800"
    ]
  },
  {
    id: 6,
    name: "Hyundai HB20",
    price: 65900,
    year: 2022,
    version: "Premium",
    mileage: 18000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Azul",
    features: ["Ar condicionado", "Direção elétrica", "Vidros elétricos", "Airbag", "ABS", "Central multimídia"],
    description: "Hyundai HB20 Premium em ótimo estado. Carro completo, econômico e muito confortável para uso urbano. Revisões em dia.",
    images: [
      "https://images.unsplash.com/photo-1617469013673-daa5e303bf5c?q=80&w=800",
      "https://images.unsplash.com/photo-1614857192891-cae764318089?q=80&w=800",
      "https://images.unsplash.com/photo-1517994112540-009c47ea476b?q=80&w=800"
    ]
  }
];
