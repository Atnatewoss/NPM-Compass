import React, { useState } from 'react';
import SearchBar from './components/ui/SearchBar';
import TrendingSection from './components/TrendingSection';
import PackageDetails from './components/PackageDetails';
import CompareView from './components/CompareView';
import Header from './components/Header';
import { Package } from 'lucide-react';

enum View {
  HOME,
  PACKAGE_DETAILS,
  COMPARE
}

function App() {
  const [view, setView] = useState<View>(View.HOME);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [comparePackages, setComparePackages] = useState<string[]>([]);
  
  const handleSearch = (query: string) => {
    setSelectedPackage(query);
    setView(View.PACKAGE_DETAILS);
  };
  
  const handlePackageSelect = (packageName: string) => {
    setSelectedPackage(packageName);
    setView(View.PACKAGE_DETAILS);
  };
  
  const handleBack = () => {
    setView(View.HOME);
  };
  
  const handleCompareClick = () => {
    setView(View.COMPARE);
  };
  
  const renderContent = () => {
    switch (view) {
      case View.PACKAGE_DETAILS:
        return (
          <PackageDetails
            packageName={selectedPackage}
            onBack={handleBack}
          />
        );
        
      case View.COMPARE:
        return (
          <CompareView
            initialPackages={comparePackages}
            onClose={handleBack}
          />
        );
        
      case View.HOME:
      default:
        return (
          <>
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Package className="text-[#58A6FF] mb-4" size={48} />
              <h1 className="text-3xl md:text-4xl font-bold text-[#C9D1D9] mb-4">
                NPM Compass
              </h1>
              <p className="text-[#8B949E] text-lg max-w-2xl mb-8">
                Discover, analyze, and compare npm packages. Find trending libraries and make informed decisions for your projects.
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="container mx-auto px-4">
              <TrendingSection onPackageSelect={handlePackageSelect} />
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      <Header onCompareClick={handleCompareClick} />
      <main className="container mx-auto px-4 py-4">
        {renderContent()}
      </main>
      <footer className="py-6 border-t border-[#30363D] mt-12">
        <div className="container mx-auto px-4 text-center text-[#8B949E]">
          <p className="text-sm">
            Built with NPM Registry API. Data refreshes regularly. Not affiliated with npm, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;