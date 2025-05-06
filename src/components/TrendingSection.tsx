import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { getTrendingPackages } from '../services/api';
import { TrendingPackage, PackageCategory } from '../types/package';
import PackageCard from './ui/PackageCard';

interface TrendingSectionProps {
  onPackageSelect: (packageName: string) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ onPackageSelect }) => {
  const [trendingPackages, setTrendingPackages] = useState<TrendingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories: { [key: string]: string } = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'fullstack': 'Full Stack',
    'utilities': 'Utilities',
    'testing': 'Testing',
    'ai': 'AI',
    'mobile': 'Mobile',
    'other': 'Other'
  };
  
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const packages = await getTrendingPackages();
        setTrendingPackages(packages);
        setError(null);
      } catch (err) {
        setError('Failed to load trending packages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrending();
  }, []);
  
  const filteredPackages = selectedCategory
    ? trendingPackages.filter(pkg => pkg.category === selectedCategory)
    : trendingPackages;
  
  return (
    <section className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <TrendingUp className="text-[#58A6FF] mr-2" size={20} />
          <h2 className="text-xl text-[#C9D1D9] font-bold">Trending Packages</h2>
        </div>

        {/* Scrollable category buttons */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full scrollbar-hide">
          <Filter className="text-[#8B949E] flex-shrink-0" size={16} />
          <div className="flex gap-2 flex-nowrap">
            <button 
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                ${selectedCategory === null 
                  ? 'bg-[#58A6FF] text-white' 
                  : 'bg-[#21262D] text-[#8B949E] hover:bg-[#30363D]'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            
            {Object.entries(categories).map(([value, label]) => (
              <button 
                key={value}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                  ${selectedCategory === value 
                    ? 'bg-[#58A6FF] text-white' 
                    : 'bg-[#21262D] text-[#8B949E] hover:bg-[#30363D]'}`}
                onClick={() => setSelectedCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-[#30363D] h-10 w-10"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-[#30363D] rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-[#30363D] rounded"></div>
                <div className="h-4 bg-[#30363D] rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-center py-10">
          <p className="text-red-400">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#21262D] text-[#C9D1D9] rounded-md hover:bg-[#30363D]"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && filteredPackages.length === 0 && (
        <div className="text-center py-10">
          <p className="text-[#8B949E]">No packages found in this category</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map((pkg) => (
          <PackageCard 
            key={pkg.name} 
            package={pkg}
            onClick={() => onPackageSelect(pkg.name)}
          />
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;