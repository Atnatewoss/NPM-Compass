// Package types based on npm Registry API
export interface Package {
  name: string;
  description: string;
  version: string;
  author?: {
    name: string;
    email?: string;
    url?: string;
  } | string;
  license?: string;
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  } | string;
  keywords?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  lastPublish?: string;
  maintainers?: Array<{
    name: string;
    email?: string;
  }>;
  npm?: string;
  github?: string;
}

export interface PackageStats {
  downloads: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  lastUpdated: string;
  stars?: number;
  issues?: number;
  size?: {
    minified: number;
    gzipped: number;
  };
}

export interface PackageWithStats extends Package {
  stats: PackageStats;
}

export interface SearchResults {
  total: number;
  time: string;
  packages: Package[];
}

export interface TrendingPackage extends PackageWithStats {
  trend: {
    daily: number; // Percentage growth
    weekly: number;
    monthly: number;
  };
  category?: string;
}

export type PackageCategory = 
  | 'frontend' 
  | 'backend' 
  | 'fullstack' 
  | 'utilities' 
  | 'testing' 
  | 'ai' 
  | 'mobile' 
  | 'other';