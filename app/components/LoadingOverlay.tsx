import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  transparent?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  transparent = false
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        transparent ? 'bg-white/70 dark:bg-gray-900/70' : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="text-center">
        <LoadingSpinner size="lg" color="primary" className="mb-4" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 