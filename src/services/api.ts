// API service for interacting with npm Registry API
import { Package, PackageStats, PackageWithStats, SearchResults, TrendingPackage } from '../types/package';

// Base URLs from environment variables
const NPM_REGISTRY_API = import.meta.env.VITE_NPM_REGISTRY_API;
const NPM_API = import.meta.env.VITE_NPM_API;
const NPM_DOWNLOADS_API = import.meta.env.VITE_NPM_DOWNLOADS_API;
const GITHUB_API = import.meta.env.VITE_GITHUB_API;

// Get package data from npm registry
export const getPackage = async (name: string): Promise<Package> => {
  try {
    const response = await fetch(`${NPM_REGISTRY_API}/${encodeURIComponent(name)}`);
    if (!response.ok) throw new Error(`Package ${name} not found`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};

// Search for packages
export const searchPackages = async (query: string, limit = 10): Promise<SearchResults> => {
  try {
    const response = await fetch(
      `${NPM_REGISTRY_API}/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`
    );
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    
    return {
      total: data.total,
      time: data.time,
      packages: data.objects.map((obj: any) => ({
        name: obj.package.name,
        description: obj.package.description,
        version: obj.package.version,
        keywords: obj.package.keywords,
        author: obj.package.author,
        publisher: obj.package.publisher,
        date: obj.package.date,
        links: obj.package.links,
      })),
    };
  } catch (error) {
    console.error('Error searching packages:', error);
    throw error;
  }
};

// Get download statistics for a package
export const getDownloadStats = async (packageName: string): Promise<PackageStats['downloads']> => {
  try {
    const periods = ['last-day', 'last-week', 'last-month', 'last-year'];
    const stats: any = {};
    
    await Promise.all(
      periods.map(async (period) => {
        const response = await fetch(
          `${NPM_DOWNLOADS_API}/point/${period}/${encodeURIComponent(packageName)}`
        );
        if (!response.ok) throw new Error(`Stats for ${packageName} not found`);
        const data = await response.json();
        
        // Map period to our stats property
        const key = period === 'last-day' ? 'daily' :
                    period === 'last-week' ? 'weekly' :
                    period === 'last-month' ? 'monthly' : 'yearly';
                    
        stats[key] = data.downloads;
      })
    );
    
    return stats;
  } catch (error) {
    console.error('Error fetching download stats:', error);
    // Return zeros instead of throwing to prevent UI breakage
    return { daily: 0, weekly: 0, monthly: 0, yearly: 0 };
  }
};

// GitHub stats extraction - in a real app, you would use GitHub's API with proper auth
export const getGitHubStats = async (repoUrl: string): Promise<{stars?: number, issues?: number}> => {
  // Mock implementation - in a real app, you would parse the repo URL and call GitHub API
  return { stars: Math.floor(Math.random() * 10000), issues: Math.floor(Math.random() * 100) };
};

// Get full package details with stats
export const getPackageWithStats = async (name: string): Promise<PackageWithStats> => {
  try {
    const packageData = await getPackage(name);
    const downloads = await getDownloadStats(name);
    
    // Extract GitHub repo URL if available
    let github;
    if (packageData.repository) {
      const repoUrl = typeof packageData.repository === 'string' 
        ? packageData.repository 
        : packageData.repository.url;
        
      if (repoUrl && repoUrl.includes('github.com')) {
        github = repoUrl
          .replace('git+', '')
          .replace('.git', '')
          .replace('git://', 'https://');
      }
    }
    
    // Get GitHub stats if repo URL is available
    const githubStats = github ? await getGitHubStats(github) : {};
    
    return {
      ...packageData,
      github,
      npm: `https://www.npmjs.com/package/${name}`,
      stats: {
        downloads,
        lastUpdated: packageData.lastPublish || new Date().toISOString(),
        ...githubStats
      }
    };
  } catch (error) {
    console.error('Error fetching package with stats:', error);
    throw error;
  }
};

// Mock function to get trending packages - in a real app, this would be server-side
export const getTrendingPackages = async (): Promise<TrendingPackage[]> => {
  // This is a mock - in a real app, you would have a backend that tracks and calculates trends
  const trendingNames = [
    'react', 'next', 'vue', 'svelte', 'tailwindcss', 
    'typescript', 'zod', 'axios', 'express', 'nestjs'
  ];
  
  try {
    const packages = await Promise.all(
      trendingNames.map(async (name) => {
        const pkg = await getPackageWithStats(name);
        
        // Mock trend data - in a real app this would be calculated from historical data
        return {
          ...pkg,
          trend: {
            daily: Math.floor(Math.random() * 20 - 5),  // -5% to +15%
            weekly: Math.floor(Math.random() * 40 - 10), // -10% to +30%
            monthly: Math.floor(Math.random() * 80 - 20), // -20% to +60%
          },
          category: getPackageCategory(name, pkg.keywords || [])
        };
      })
    );
    
    return packages;
  } catch (error) {
    console.error('Error fetching trending packages:', error);
    return [];
  }
};

// Helper to determine package category
const getPackageCategory = (name: string, keywords: string[]): string => {
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  
  if (keywordSet.has('react') || keywordSet.has('vue') || name === 'svelte' || keywordSet.has('frontend')) {
    return 'frontend';
  }
  
  if (keywordSet.has('server') || keywordSet.has('express') || keywordSet.has('backend') || name === 'nestjs') {
    return 'backend';
  }
  
  if (keywordSet.has('testing') || keywordSet.has('test')) {
    return 'testing';
  }
  
  if (keywordSet.has('utility') || keywordSet.has('utilities')) {
    return 'utilities';
  }
  
  return 'other';
};