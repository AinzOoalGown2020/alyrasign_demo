import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { Text } from '../../ui/components/Text';
import { cn } from '../../../utils';

export interface NavElementProps {
  /** Texte du lien */
  label: string;
  /** URL de destination */
  href: string;
  /** URL alternative pour la correspondance active */
  as?: string;
  /** Défilement automatique vers l'ancre */
  scroll?: boolean;
  /** Label du badge (optionnel) */
  chipLabel?: string;
  /** État désactivé */
  disabled?: boolean;
  /** Callback appelé au début de la navigation */
  navigationStarts?: () => void;
  /** Classes CSS supplémentaires */
  className?: string;
  /** Variante de style */
  variant?: 'default' | 'primary' | 'secondary';
}

/**
 * Composant de navigation avec indicateur visuel d'état actif
 */
export const NavElement: React.FC<NavElementProps> = ({
  label,
  href,
  as,
  scroll,
  disabled = false,
  navigationStarts = () => {},
  className = '',
  variant = 'default',
  chipLabel,
}) => {
  const router = useRouter();
  const isActive = href === router.asPath || (as && as === router.asPath);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (divRef.current) {
      const variantClasses = {
        default: '',
        primary: 'from-blue-500 to-indigo-500',
        secondary: 'from-gray-500 to-gray-600'
      };

      divRef.current.className = cn(
        'h-0.5 w-1/4 transition-all duration-300 ease-out',
        isActive
          ? '!w-full bg-gradient-to-l from-fuchsia-500 to-pink-500'
          : 'group-hover:w-1/2 group-hover:bg-fuchsia-500',
        variantClasses[variant]
      );
    }
  }, [isActive, variant]);

  return (
    <Link
      href={href}
      as={as}
      scroll={scroll}
      passHref
      className={cn(
        'group flex h-full flex-col items-center justify-between',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className
      )}
      onClick={() => navigationStarts()}
    >
      <div className="flex flex-row items-center gap-3">
        <Text 
          variant="nav-heading"
          color={isActive ? 'accent' : 'primary'}
          className="transition-colors duration-200"
        >
          {label}
        </Text>
        {chipLabel && (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {chipLabel}
          </span>
        )}
      </div>
      <div ref={divRef} />
    </Link>
  );
}; 