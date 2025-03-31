
import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AutoStore</h3>
            <p className="text-gray-300">
              Oferecemos os melhores veículos seminovos com procedência garantida e condições especiais de financiamento.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>Av. das Concessionárias, 1234, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span>contato@autostore.com.br</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li>Segunda à Sexta: 8h às 18h</li>
              <li>Sábado: 9h às 15h</li>
              <li>Domingo: Fechado</li>
            </ul>
            
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Siga-nos</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AutoStore. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
