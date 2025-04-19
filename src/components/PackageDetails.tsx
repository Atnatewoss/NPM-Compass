import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Package as PackageIcon, ExternalLink } from 'lucide-react';
import { getPackageWithStats } from '../services/api';
import { PackageWithStats } from '../types/package';
import { formatNumber } from './utils/format';

interface PackageDetailsProps {
  packageName: string;
  onBack: () => void;
}

const PackageDetails: React.FC<PackageDetailsProps> = ({ packageName, onBack }) => {
  const [packageData, setPackageData] = useState<PackageWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const data = await getPackageWithStats(packageName);
        setPackageData(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load package details for ${packageName}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackageDetails();
  }, [packageName]);
  
  const handleCopyInstall = () => {
    navigator.clipboard.writeText(`npm install ${packageName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse space-y-6 py-10">
        <div className="h-8 bg-[#30363D] rounded w-1/4"></div>
        <div className="h-4 bg-[#30363D] rounded w-3/4"></div>
        <div className="h-4 bg-[#30363D] rounded w-1/2"></div>
        <div className="h-20 bg-[#30363D] rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-[#30363D] rounded"></div>
          <div className="h-12 bg-[#30363D] rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-[#21262D] text-[#C9D1D9] rounded-md hover:bg-[#30363D]"
          onClick={onBack}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  if (!packageData) {
    return null;
  }
  
  return (
    <div className="space-y-6 py-4">
      <button 
        onClick={onBack}
        className="flex items-center text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to search
      </button>
      
      <div className="flex items-center gap-3">
        <PackageIcon size={24} className="text-[#58A6FF]" />
        <h1 className="text-2xl md:text-3xl font-bold text-[#C9D1D9]">{packageData.name}</h1>
        <span className="text-[#8B949E] text-sm font-mono">v{packageData.version}</span>
      </div>
      
      <p className="text-[#8B949E] text-lg">
        {packageData.description || 'No description available'}
      </p>
      
      {/* Install command */}
      <div className="mt-6 relative">
        <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 font-mono">
          <code className="text-[#C9D1D9]">npm install {packageData.name}</code>
          <button 
            onClick={handleCopyInstall}
            className="absolute right-3 top-3 text-[#8B949E] hover:text-[#C9D1D9] p-1 rounded-md transition-colors"
            aria-label="Copy install command"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <h3 className="text-[#8B949E] text-sm mb-1">Weekly Downloads</h3>
          <p className="text-[#C9D1D9] text-2xl font-bold">
            {formatNumber(packageData.stats.downloads.weekly)}
          </p>
        </div>
        
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <h3 className="text-[#8B949E] text-sm mb-1">Monthly Downloads</h3>
          <p className="text-[#C9D1D9] text-2xl font-bold">
            {formatNumber(packageData.stats.downloads.monthly)}
          </p>
        </div>
        
        {packageData.stats.stars && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-[#8B949E] text-sm mb-1">GitHub Stars</h3>
            <p className="text-[#C9D1D9] text-2xl font-bold">
              {formatNumber(packageData.stats.stars)}
            </p>
          </div>
        )}
        
        {packageData.dependencies && (
          <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
            <h3 className="text-[#8B949E] text-sm mb-1">Dependencies</h3>
            <p className="text-[#C9D1D9] text-2xl font-bold">
              {Object.keys(packageData.dependencies).length}
            </p>
          </div>
        )}
      </div>
      
      {/* Links */}
      <div className="flex flex-wrap gap-4 mt-6">
        {packageData.npm && (
          <a 
            href={packageData.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] px-4 py-2 rounded-md transition-colors"
          >
            NPM Page <ExternalLink size={16} className="ml-2" />
          </a>
        )}
        
        {packageData.github && (
          <a 
            href={packageData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] px-4 py-2 rounded-md transition-colors"
          >
            GitHub Repository <ExternalLink size={16} className="ml-2" />
          </a>
        )}
        
        {packageData.homepage && packageData.homepage !== packageData.github && (
          <a 
            href={packageData.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9] px-4 py-2 rounded-md transition-colors"
          >
            Homepage <ExternalLink size={16} className="ml-2" />
          </a>
        )}
      </div>
      
      {/* Keywords */}
      {packageData.keywords && packageData.keywords.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[#C9D1D9] text-lg font-semibold mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {packageData.keywords.map((keyword) => (
              <div 
                key={keyword} 
                className="bg-[#21262D] text-[#8B949E] text-xs py-1 px-2 rounded"
              >
                {keyword}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Dependencies */}
      {packageData.dependencies && Object.keys(packageData.dependencies).length > 0 && (
        <div className="mt-8">
          <h3 className="text-[#C9D1D9] text-lg font-semibold mb-3">Dependencies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(packageData.dependencies).map(([name, version]) => (
              <div 
                key={name} 
                className="bg-[#21262D] text-[#8B949E] text-sm p-2 rounded font-mono flex justify-between"
              >
                <span>{name}</span>
                <span>{version}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageDetails;