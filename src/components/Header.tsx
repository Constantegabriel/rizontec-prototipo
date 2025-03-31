
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="order-2 md:order-1 flex flex-col space-y-2 w-full md:w-auto text-sm">
            <div className="flex items-center">
              <MapPin size={16} className="mr-2" />
              <span>Av. das Concessionárias, 1234, São Paulo - SP</span>
            </div>
            
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span>(11) 99999-9999</span>
            </div>
            
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span>contato@autostore.com.br</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 mb-4 md:mb-0 w-full md:w-auto text-center">
            <h1 className="text-2xl font-bold">AutoStore</h1>
            <p className="text-sm">Seu parceiro confiável em veículos</p>
          </div>
          
          <div className="order-3 w-full md:w-auto flex justify-center md:justify-end mt-4 md:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span className="text-xs">Login</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
