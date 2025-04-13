import { FC } from 'react';
import Link from 'next/link';

export const Footer: FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 p-4 text-center z-10">
            <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} AlyraSign. Tous droits réservés.
            </p>
        </footer>
    );
};
