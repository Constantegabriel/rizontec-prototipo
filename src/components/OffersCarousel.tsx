
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const OffersCarousel: React.FC = () => {
  // Example banner content - in a real app this would come from a database
  const banners = [
    {
      id: 1,
      title: 'Ofertas Especiais',
      description: 'Aproveite descontos imperdíveis em nossos veículos premium',
      image: 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop',
      color: 'from-red-600/80 to-red-900/80',
    },
    {
      id: 2,
      title: 'Financiamento Facilitado',
      description: 'Taxas exclusivas e aprovação rápida para seu novo veículo',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&q=80&w=1470&auto=format&fit=crop',
      color: 'from-blue-700/80 to-blue-900/80',
    },
    {
      id: 3,
      title: 'Avaliamos Seu Usado',
      description: 'Traga seu veículo para avaliação e ganhe as melhores condições',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&q=80&w=1528&auto=format&fit=crop',
      color: 'from-green-600/80 to-green-900/80',
    },
  ];

  return (
    <div className="offers-swiper">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full rounded-xl overflow-hidden"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-[250px] md:h-[350px] w-full">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-90`}></div>
                <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-lg md:text-xl max-w-xl">{banner.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-black/30 hover:bg-black/50 text-white border-none" />
        <CarouselNext className="right-4 bg-black/30 hover:bg-black/50 text-white border-none" />
      </Carousel>
    </div>
  );
};

export default OffersCarousel;
