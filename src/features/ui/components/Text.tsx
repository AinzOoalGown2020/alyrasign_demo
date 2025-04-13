import Link from 'next/link';
import React from 'react';
import { cn } from '../../../utils';

export type TextVariant = 
  | 'heading'
  | 'sub-heading'
  | 'nav-heading'
  | 'nav'
  | 'paragraph'
  | 'sub-paragraph'
  | 'input'
  | 'label';

export interface TextProps {
  /** Variante de style prédéfinie */
  variant: TextVariant;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Lien optionnel (transforme le texte en lien) */
  href?: string;
  /** Contenu du texte */
  children?: React.ReactNode;
  /** ID de l'élément */
  id?: string;
  /** Couleur du texte */
  color?: 'primary' | 'secondary' | 'accent' | 'error' | 'success' | 'warning' | 'info';
  /** Alignement du texte */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Poids de la police */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

/**
 * Styles prédéfinis selon le système de design
 */
const variants: Record<TextVariant, string> = {
  heading: 'text-3xl font-medium',
  'sub-heading': 'text-2xl font-medium',
  'nav-heading': 'text-lg font-medium sm:text-xl whitespace-nowrap',
  nav: 'font-medium whitespace-nowrap',
  paragraph: 'text-lg',
  'sub-paragraph': 'text-base font-medium text-inherit',
  input: 'text-sm uppercase tracking-wide',
  label: 'text-xs uppercase tracking-wide',
};

/**
 * Couleurs prédéfinies
 */
const colors = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  accent: 'text-blue-600',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  info: 'text-blue-400',
};

/**
 * Composant Text pour afficher du texte avec des styles prédéfinis
 * Peut être utilisé comme texte simple ou comme lien
 */
export const Text: React.FC<TextProps> = ({ 
  variant, 
  className = '', 
  href, 
  children,
  color = 'primary',
  align = 'left',
  weight,
  ...props 
}) => {
  const baseClasses = cn(
    variants[variant],
    colors[color],
    `text-${align}`,
    weight && `font-${weight}`,
    className
  );

  const content = (
    <span className={baseClasses} {...props}>
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {content}
      </Link>
    );
  }

  return content;
}; 