import React from 'react';

export interface ButtonProps {
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Fonction appelée lors du clic */
  onClick?: () => void;
  /** Classes CSS supplémentaires */
  className?: string;
  /** État désactivé du bouton */
  disabled?: boolean;
  /** Type de bouton HTML */
  type?: 'button' | 'submit' | 'reset';
  /** Variante visuelle du bouton */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** Taille du bouton */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Composant Button réutilisable avec différentes variantes et tailles
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md'
}) => {
  const baseStyles = 'rounded-md font-medium transition-colors duration-200 ease-in-out';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledStyles = disabled
    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    : variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}; 