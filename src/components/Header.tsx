import React from 'react';
import { Package, BarChart2, Github } from 'lucide-react';

interface HeaderProps {
  onCompareClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCompareClick }) => {
  return (
    <header className="py-4 px-4 border-b border-[#30363D] bg-[#0D1117]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Package className="text-[#58A6FF] mr-2" size={24} />
          <h1 className="text-xl text-[#C9D1D9] font-bold font-mono">
            NPM Compass
          </h1>
        </div>
        
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <button 
                onClick={onCompareClick}
                className="flex items-center text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
              >
                <BarChart2 size={18} className="mr-1" />
                <span className="hidden md:inline">Compare</span>
              </button>
            </li>
            <li>
              <a 
                href="https://github.com/Atnatewoss/NPM-Compass"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
              >
                <Github size={18} className="mr-1" />
                <span className="hidden md:inline">API Docs</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;