
import React, { useEffect, useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Car as CarIcon } from 'lucide-react';

const offerImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80",
    alt: "Oferta especial - Carros premium com desconto",
    title: "Ofertas Exclusivas"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80",
    alt: "Financiamento facilitado",
    title: "Financiamento"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&q=80",
    alt: "Carros revisados e com garantia",
    title: "Garantia Total"
  }
];

const OffersCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === offerImages.length - 1 ? 0 : current + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-4 mb-2">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-[98%] lg:max-w-[90%] xl:max-w-[88%] mx-auto" // Wider on desktop
        setApi={(api) => {
          if (api) {
            api.on("select", () => {
              setActiveIndex(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent className="h-[250px] sm:h-[350px] md:h-[400px]">
          {offerImages.map((image, index) => (
            <CarouselItem key={image.id} className="overflow-hidden rounded-xl">
              <div className="relative h-full w-full">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.alt}</p>
                  </div>
                </div>
                
                {/* Generic car icon for empty states or as overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                  <CarIcon size={120} strokeWidth={1} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/70 hover:text-white border-none" />
        <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/70 hover:text-white border-none" />
        
        {/* Custom pagination */}
        <div className="flex justify-center mt-4 gap-2">
          {offerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`carousel-pagination-dot ${
                activeIndex === index ? "carousel-pagination-dot-active" : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default OffersCarousel;
