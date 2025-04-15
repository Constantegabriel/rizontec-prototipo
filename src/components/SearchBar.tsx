
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
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por modelo, marca ou ano"
          className="search-input w-full pl-12"
        />
        <button 
          type="submit" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
