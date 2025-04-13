import React from 'react';

export interface ContentContainerProps {
  /** Contenu principal */
  children: React.ReactNode;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Largeur maximale du conteneur */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding horizontal */
  paddingX?: 'none' | 'sm' | 'md' | 'lg';
  /** Padding vertical */
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
  /** Centrer le contenu horizontalement */
  center?: boolean;
  /** Ajouter un fond */
  withBackground?: boolean;
}

/**
 * Composant ContentContainer pour gérer la mise en page du contenu principal
 */
export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  className = '',
  maxWidth = 'lg',
  paddingX = 'md',
  paddingY = 'md',
  center = true,
  withBackground = false
}) => {
  const baseStyles = 'flex-1 flex flex-col min-h-screen';
  
  const maxWidthStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full'
  };

  const paddingXStyles = {
    none: '',
    sm: 'px-4',
    md: 'px-6',
    lg: 'px-8'
  };

  const paddingYStyles = {
    none: '',
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8'
  };

  const centerStyles = center ? 'mx-auto' : '';
  const backgroundStyles = withBackground ? 'bg-gray-900' : '';

  return (
    <div className={`${baseStyles} ${backgroundStyles} ${className}`}>
      <main className={`
        flex-grow w-full
        ${maxWidthStyles[maxWidth]}
        ${paddingXStyles[paddingX]}
        ${paddingYStyles[paddingY]}
        ${centerStyles}
      `}>
        {children}
      </main>
    </div>
  );
}; 