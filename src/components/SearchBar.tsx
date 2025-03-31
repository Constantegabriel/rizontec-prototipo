
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-4">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busque por marca, modelo ou ano..."
          className="w-full px-4 py-3 pl-12 rounded-full bg-secondary text-foreground border border-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button 
          type="submit" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
