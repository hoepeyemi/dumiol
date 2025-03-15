// Mock implementation of Chakra UI components
import React from 'react';

// Button component
export const Button = ({ 
  children, 
  colorScheme, 
  isDisabled, 
  onClick, 
  isLoading, 
  loadingText,
  ...props 
}: any) => {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'green': return 'bg-green-500 hover:bg-green-600';
      case 'red': return 'bg-red-500 hover:bg-red-600';
      case 'blue': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md text-white ${getColorClass()} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (loadingText || 'Loading...') : children}
    </button>
  );
};

// Box component
export const Box = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>;
};

// Text component
export const Text = ({ children, ...props }: any) => {
  return <p {...props}>{children}</p>;
};

// Flex component
export const Flex = ({ children, ...props }: any) => {
  return <div className="flex" {...props}>{children}</div>;
};

// VStack component
export const VStack = ({ children, spacing, ...props }: any) => {
  return <div className="flex flex-col space-y-4" {...props}>{children}</div>;
};

// HStack component
export const HStack = ({ children, spacing, ...props }: any) => {
  return <div className="flex space-x-4" {...props}>{children}</div>;
};

// Badge component
export const Badge = ({ children, colorScheme, ml, ...props }: any) => {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const marginClass = ml ? `ml-${ml}` : '';

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getColorClass()} ${marginClass}`} {...props}>
      {children}
    </span>
  );
};

// Container component
export const Container = ({ children, maxW, ...props }: any) => {
  const maxWidthClass = maxW === 'container.md' ? 'max-w-3xl' : 'max-w-full';
  return <div className={`container mx-auto px-4 ${maxWidthClass}`} {...props}>{children}</div>;
};

// Heading component
export const Heading = ({ children, size, ...props }: any) => {
  const sizeClass = size === 'md' ? 'text-lg' : 'text-2xl';
  return <h2 className={`font-bold ${sizeClass}`} {...props}>{children}</h2>;
};

// Avatar component
export const Avatar = ({ name, size, ...props }: any) => {
  const sizeClass = size === 'xl' ? 'w-16 h-16' : 'w-10 h-10';
  const initials = name ? name.substring(2, 4).toUpperCase() : 'NA';
  
  return (
    <div className={`${sizeClass} rounded-full bg-blue-500 flex items-center justify-center text-white font-bold`} {...props}>
      {initials}
    </div>
  );
};

// useColorModeValue hook
export const useColorModeValue = (lightValue: string, darkValue: string) => {
  // Always return the light value for simplicity
  return lightValue;
}; 