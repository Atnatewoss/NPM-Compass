import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search npm packages...', 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative w-full max-w-3xl mx-auto transition-all duration-300 
        ${isFocused ? 'scale-[1.01]' : 'scale-100'} ${className}`}
    >
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full py-3 px-12 bg-[#161B22] text-[#C9D1D9] rounded-lg 
            border border-[#30363D] focus:border-[#58A6FF] focus:ring-1 
            focus:ring-[#58A6FF] focus:outline-none transition-all duration-300
            placeholder:text-[#6E7681] font-mono tracking-tight text-base md:text-lg"
        />
        <Search className="absolute left-4 text-[#6E7681]" size={18} />
        
        {query && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute right-12 text-[#6E7681] hover:text-[#C9D1D9] transition-colors"
          >
            <X size={18} />
          </button>
        )}
        
        <button
          type="submit"
          disabled={!query.trim()}
          className={`absolute right-3 bg-[#58A6FF] text-white py-1 px-3 rounded 
            text-sm font-medium transition-opacity ${query.trim() ? 'opacity-100' : 'opacity-50'}`}
        >
          Search
        </button>
      </div>
      
      <p className="text-xs text-[#6E7681] mt-2 font-mono">
        Press Enter to search, or try: react, next, vue, tailwindcss
      </p>
    </form>
  );
};

export default SearchBar;