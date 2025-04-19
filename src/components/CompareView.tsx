import React, { useState, useEffect } from 'react';
import { getPackageWithStats } from '../services/api';
import { PackageWithStats } from '../types/package';
import { formatNumber } from './utils/format';
import { Download, Star, Calendar, GitFork, X, Plus } from 'lucide-react';

interface CompareViewProps {
  initialPackages?: string[];
  onClose: () => void;
}

const CompareView: React.FC<CompareViewProps> = ({ initialPackages = [], onClose }) => {
  const [packages, setPackages] = useState<string[]>(initialPackages.slice(0, 3));
  const [packagesData, setPackagesData] = useState<Record<string, PackageWithStats>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPackage, setNewPackage] = useState('');
  
  useEffect(() => {
    // Load initial packages data
    packages.forEach(fetchPackageData);
  }, []);
  
  const fetchPackageData = async (packageName: string) => {
    try {
      setLoading(prev => ({ ...prev, [packageName]: true }));
      
      const data = await getPackageWithStats(packageName);
      
      setPackagesData(prev => ({
        ...prev,
        [packageName]: data
      }));
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[packageName];
        return newErrors;
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [packageName]: `Failed to load ${packageName}`
      }));
    } finally {
      setLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[packageName];
        return newLoading;
      });
    }
  };
  
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackage.trim() || packages.includes(newPackage) || packages.length >= 3) {
      return;
    }
    
    const updatedPackages = [...packages, newPackage];
    setPackages(updatedPackages);
    fetchPackageData(newPackage);
    setNewPackage('');
  };
  
  const handleRemovePackage = (packageName: string) => {
    setPackages(packages.filter(pkg => pkg !== packageName));
    
    // Remove from data and errors
    setPackagesData(prev => {
      const newData = { ...prev };
      delete newData[packageName];
      return newData;
    });
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[packageName];
      return newErrors;
    });
  };
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-[#C9D1D9] font-bold">Compare Packages</h2>
        <button 
          onClick={onClose}
          className="text-[#8B949E] hover:text-[#C9D1D9] transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Add package form */}
      {packages.length < 3 && (
        <form onSubmit={handleAddPackage} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPackage}
              onChange={(e) => setNewPackage(e.target.value)}
              placeholder="Add package to compare"
              className="flex-1 py-2 px-3 bg-[#0D1117] text-[#C9D1D9] rounded-md 
                border border-[#30363D] focus:border-[#58A6FF] focus:ring-1 
                focus:ring-[#58A6FF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newPackage.trim() || packages.length >= 3}
              className="flex items-center bg-[#238636] hover:bg-[#2EA043] text-white px-4 py-2 
                rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          <p className="text-xs text-[#8B949E] mt-1">
            {packages.length === 0 
              ? "Add up to 3 packages to compare" 
              : `${3 - packages.length} more package${3 - packages.length !== 1 ? 's' : ''} can be added`}
          </p>
        </form>
      )}
      
      {/* Comparison table */}
      {packages.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#30363D]">
                <th className="py-3 px-4 text-left text-[#8B949E] font-normal">Metric</th>
                {packages.map(packageName => (
                  <th key={packageName} className="py-3 px-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[#C9D1D9] font-mono font-semibold">{packageName}</span>
                      <button 
                        onClick={() => handleRemovePackage(packageName)}
                        className="text-[#8B949E] hover:text-[#C9D1D9] p-1 rounded-full hover:bg-[#30363D]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Weekly Downloads */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E] flex items-center">
                  <Download size={14} className="mr-2" /> Weekly Downloads
                </td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-16 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName] ? (
                      formatNumber(packagesData[packageName].stats.downloads.weekly)
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* Monthly Downloads */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E] flex items-center">
                  <Download size={14} className="mr-2" /> Monthly Downloads
                </td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-16 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName] ? (
                      formatNumber(packagesData[packageName].stats.downloads.monthly)
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* GitHub Stars */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E] flex items-center">
                  <Star size={14} className="mr-2" /> GitHub Stars
                </td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-16 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName]?.stats.stars ? (
                      formatNumber(packagesData[packageName].stats.stars || 0)
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* Last Updated */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E] flex items-center">
                  <Calendar size={14} className="mr-2" /> Last Updated
                </td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-24 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName] ? (
                      new Date(packagesData[packageName].stats.lastUpdated).toLocaleDateString()
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* Dependencies Count */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E] flex items-center">
                  <GitFork size={14} className="mr-2" /> Dependencies
                </td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-8 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName]?.dependencies ? (
                      Object.keys(packagesData[packageName].dependencies || {}).length
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* Version */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E]">Version</td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9] font-mono">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-12 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName] ? (
                      packagesData[packageName].version
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              
              {/* License */}
              <tr className="border-b border-[#30363D]">
                <td className="py-3 px-4 text-[#8B949E]">License</td>
                {packages.map(packageName => (
                  <td key={packageName} className="py-3 px-4 text-[#C9D1D9]">
                    {loading[packageName] ? (
                      <div className="h-4 bg-[#30363D] rounded w-16 animate-pulse"></div>
                    ) : errors[packageName] ? (
                      <span className="text-red-400">Error</span>
                    ) : packagesData[packageName]?.license ? (
                      packagesData[packageName].license
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 bg-[#161B22] rounded-lg border border-dashed border-[#30363D]">
          <p className="text-[#8B949E]">
            Add packages to start comparing
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareView;