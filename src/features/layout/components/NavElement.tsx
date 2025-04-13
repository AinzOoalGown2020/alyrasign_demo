import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface NavElementProps {
  /** Texte du lien */
  label: string;
  /** URL de destination */
  href: string;
  /** Fonction appelée au début de la navigation */
  navigationStarts?: () => void;
  /** Classes CSS supplémentaires */
  className?: string;
}

/**
 * Composant pour les éléments de navigation
 */
export const NavElement: React.FC<NavElementProps> = ({
  label,
  href,
  navigationStarts,
  className = ''
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`btn btn-ghost btn-sm rounded-btn text-lg ${className} ${
        isActive ? 'text-secondary' : ''
      }`}
      onClick={navigationStarts}
    >
      {label}
    </Link>
  );
}; 