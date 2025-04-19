import React from 'react';
import { formatDistanceToNow } from '../utils/date';
import { formatNumber } from '../utils/format';
import { Package, PackageWithStats, TrendingPackage } from '../../types/package';
import { ArrowUpRight, Download, Star, GitFork, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

interface PackageCardProps {
  package: Package | PackageWithStats | TrendingPackage;
  isDetailed?: boolean;
  onClick?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ 
  package: pkg, 
  isDetailed = false,
  onClick
}) => {
  // Check if package has stats
  const hasStats = 'stats' in pkg;
  // Check if package has trend data
  const hasTrend = 'trend' in pkg && hasStats;
  
  // Determine if trending is positive or negative
  const trendDirection = hasTrend 
    ? (pkg as TrendingPackage).trend.weekly > 0 
      ? 'up' 
      : 'down'
    : null;
  
  return (
    <div 
      className={`bg-[#161B22] rounded-lg border border-[#30363D] overflow-hidden
        transition-all duration-300 hover:shadow-lg hover:border-[#58A6FF]/50
        ${isDetailed ? 'p-6' : 'p-4'} 
        ${onClick ? 'cursor-pointer hover:translate-y-[-2px]' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-mono text-lg font-semibold text-[#C9D1D9] truncate">
          {pkg.name}
        </h3>
        
        {hasTrend && (
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
            ${trendDirection === 'up' 
              ? 'bg-green-900/30 text-green-400'
              : 'bg-red-900/30 text-red-400'}`}
          >
            {trendDirection === 'up' 
              ? <TrendingUp size={14} className="mr-1" />
              : <TrendingDown size={14} className="mr-1" />
            }
            {Math.abs((pkg as TrendingPackage).trend.weekly)}%
          </div>
        )}
      </div>
      
      <p className="text-[#8B949E] text-sm mb-4 line-clamp-2 h-10">
        {pkg.description || 'No description available'}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {/* Install command */}
        <div className="bg-[#0D1117] text-[#8B949E] text-xs py-1 px-2 rounded font-mono whitespace-nowrap">
          npm i {pkg.name}
        </div>
        
        {/* Version */}
        <div className="bg-[#0D1117] text-[#8B949E] text-xs py-1 px-2 rounded font-mono whitespace-nowrap">
          v{pkg.version}
        </div>
        
        {/* License if available */}
        {pkg.license && (
          <div className="bg-[#0D1117] text-[#8B949E] text-xs py-1 px-2 rounded whitespace-nowrap">
            {pkg.license}
          </div>
        )}
      </div>
      
      {hasStats && (
        <div className="mt-4 pt-4 border-t border-[#30363D] grid grid-cols-2 gap-3">
          {/* Weekly Downloads */}
          <div className="flex items-center">
            <Download size={14} className="text-[#58A6FF] mr-2" />
            <span className="text-[#8B949E] text-xs">
              {formatNumber((pkg as PackageWithStats).stats.downloads.weekly)}/week
            </span>
          </div>
          
          {/* Stars if available */}
          {(pkg as PackageWithStats).stats.stars && (
            <div className="flex items-center">
              <Star size={14} className="text-[#F0DB4F] mr-2" />
              <span className="text-[#8B949E] text-xs">
                {formatNumber((pkg as PackageWithStats).stats.stars || 0)}
              </span>
            </div>
          )}
          
          {/* Last Updated */}
          <div className="flex items-center">
            <Calendar size={14} className="text-[#8B949E] mr-2" />
            <span className="text-[#8B949E] text-xs">
              {formatDistanceToNow((pkg as PackageWithStats).stats.lastUpdated)}
            </span>
          </div>
          
          {/* Dependencies count */}
          {pkg.dependencies && (
            <div className="flex items-center">
              <GitFork size={14} className="text-[#8B949E] mr-2" />
              <span className="text-[#8B949E] text-xs">
                {Object.keys(pkg.dependencies).length} deps
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Links to npm and github */}
      {isDetailed && hasStats && ((pkg as PackageWithStats).npm || (pkg as PackageWithStats).github) && (
        <div className="mt-4 flex gap-3">
          {(pkg as PackageWithStats).npm && (
            <a 
              href={(pkg as PackageWithStats).npm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58A6FF] text-sm flex items-center hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              NPM <ArrowUpRight size={14} className="ml-1" />
            </a>
          )}
          
          {(pkg as PackageWithStats).github && (
            <a 
              href={(pkg as PackageWithStats).github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#58A6FF] text-sm flex items-center hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub <ArrowUpRight size={14} className="ml-1" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default PackageCard;