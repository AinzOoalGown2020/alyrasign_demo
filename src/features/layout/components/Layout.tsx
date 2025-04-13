import React from 'react';
import { AppBar } from './AppBar';
import { Footer } from './Footer';
import { NotificationList } from '../../ui/components';

export interface LayoutProps {
  /** Contenu principal */
  children: React.ReactNode;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Afficher la barre de navigation */
  showNavbar?: boolean;
  /** Afficher le pied de page */
  showFooter?: boolean;
  /** Afficher les notifications */
  showNotifications?: boolean;
  /** Largeur maximale du contenu */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding horizontal du contenu */
  paddingX?: 'none' | 'sm' | 'md' | 'lg';
  /** Padding vertical du contenu */
  paddingY?: 'none' | 'sm' | 'md' | 'lg';
  /** Fond de la page */
  background?: 'default' | 'dark' | 'light' | 'gradient';
}

/**
 * Composant Layout principal pour la structure de l'application
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showNavbar = true,
  showFooter = true,
  showNotifications = true,
  maxWidth = 'lg',
  paddingX = 'md',
  paddingY = 'md',
  background = 'default'
}) => {
  const baseStyles = 'flex flex-col min-h-screen';
  
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

  const backgroundStyles = {
    default: 'bg-gray-900',
    dark: 'bg-gray-950',
    light: 'bg-gray-100',
    gradient: 'bg-gradient-to-b from-gray-900 to-gray-800'
  };

  return (
    <div className={`${baseStyles} ${backgroundStyles[background]} ${className}`}>
      {showNavbar && <AppBar />}
      
      <main className={`
        flex-grow w-full mx-auto
        ${maxWidthStyles[maxWidth]}
        ${paddingXStyles[paddingX]}
        ${paddingYStyles[paddingY]}
      `}>
        {children}
      </main>

      {showFooter && <Footer />}
      
      {showNotifications && <NotificationList />}
    </div>
  );
}; 