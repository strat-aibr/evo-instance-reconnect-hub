
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusMessageProps {
  message: string;
  type?: 'loading' | 'success' | 'error' | 'info';
  className?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
  className
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'loading':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'success':
        return 'bg-success-light text-success border-success';
      case 'error':
        return 'bg-error-light text-error border-error';
      case 'info':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return (
          <div className="animate-pulse h-5 w-5 bg-blue-500 rounded-full mr-2" />
        );
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={cn(
      'p-4 rounded-md border flex items-center justify-center my-2',
      getTypeStyles(),
      className
    )}>
      <span className="mr-2">{getIcon()}</span>
      <span>{message}</span>
    </div>
  );
};

export default StatusMessage;
