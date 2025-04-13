import React from 'react';
import Link from 'next/link';
import { Card } from '../../ui/components/Card';

export interface AdminCardProps {
  /** Titre de la carte */
  title: string;
  /** Description de la fonctionnalité */
  description: string;
  /** Icône représentative (emoji ou composant) */
  icon: string;
  /** Lien de destination */
  link: string;
  /** Classes CSS supplémentaires */
  className?: string;
}

/**
 * Carte administrative pour accéder aux différentes sections du tableau de bord
 */
export const AdminCard: React.FC<AdminCardProps> = ({ 
  title, 
  description, 
  icon, 
  link,
  className = ''
}) => {
  return (
    <Link href={link}>
      <Card className={`p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group ${className}`}>
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-3 group-hover:scale-110 transition-transform duration-200">{icon}</span>
          <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-200">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
        <div className="flex justify-end mt-4">
          <span className="text-blue-600 group-hover:text-blue-800 text-sm font-medium flex items-center">
            Accéder 
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Card>
    </Link>
  );
}; 