/**
 * Format a date string to relative time (e.g., "2 days ago")
 */
export const formatDistanceToNow = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // If invalid date, return 'unknown'
  if (isNaN(date.getTime())) {
    return 'unknown';
  }
  
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

/**
 * Format a date to YYYY-MM-DD
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // If invalid date, return empty string
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toISOString().split('T')[0];
};