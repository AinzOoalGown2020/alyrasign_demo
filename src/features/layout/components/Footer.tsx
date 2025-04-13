import { FC } from 'react';
import Link from 'next/link';

export const Footer: FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} AlyraSign. Tous droits réservés.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="/mentions-legales" className="text-gray-500 hover:text-gray-900 text-sm">
                            Mentions légales
                        </Link>
                        <Link href="/politique-confidentialite" className="text-gray-500 hover:text-gray-900 text-sm">
                            Politique de confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}; 