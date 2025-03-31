
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">AutoStore</h1>
            <p className="text-sm">Seu parceiro confiável em veículos</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <MapPin size={18} className="mr-2" />
              <span className="text-sm">Av. das Concessionárias, 1234, São Paulo - SP</span>
            </div>
            
            <div className="flex items-center">
              <Phone size={18} className="mr-2" />
              <span className="text-sm">(11) 99999-9999</span>
            </div>
            
            <div className="flex items-center">
              <Mail size={18} className="mr-2" />
              <span className="text-sm">contato@autostore.com.br</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
