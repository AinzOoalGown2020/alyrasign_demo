import React from 'react';

export interface CardProps {
  /** Contenu de la carte */
  children: React.ReactNode;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Fonction appelée lors du clic */
  onClick?: () => void;
  /** Variante visuelle de la carte */
  variant?: 'default' | 'outlined' | 'elevated';
  /** Padding de la carte */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** État de survol */
  hoverable?: boolean;
  /** État de chargement */
  loading?: boolean;
}

/**
 * Composant Card réutilisable avec différentes variantes et options de style
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  loading = false
}) => {
  const baseStyles = 'rounded-lg shadow-md';
  
  const variantStyles = {
    default: 'bg-gray-800',
    outlined: 'bg-transparent border border-gray-700',
    elevated: 'bg-gray-800 shadow-lg'
  };

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverStyles = hoverable
    ? 'transition-transform duration-200 hover:scale-[1.02] cursor-pointer'
    : '';

  const loadingStyles = loading
    ? 'animate-pulse'
    : '';

  return (
    <div 
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${loadingStyles}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 