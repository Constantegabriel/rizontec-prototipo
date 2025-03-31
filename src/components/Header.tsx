
import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-card shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>
          
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-primary">AutoStore</h1>
            <p className="text-sm text-muted-foreground">Seu parceiro confiável em veículos</p>
          </div>
          
          <div className="flex-1 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary hover:bg-transparent"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4" />
              <span className="sr-only">Login</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
