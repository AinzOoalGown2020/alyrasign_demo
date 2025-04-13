import React, { useState } from 'react';
import { useNetwork } from '../../../contexts/NetworkContext';

export const NetworkSwitcher: React.FC = () => {
  const { network, setNetwork } = useNetwork();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNetworkChange = () => {
    if (network === 'devnet') {
      if (window.confirm('Êtes-vous sûr de vouloir basculer vers Mainnet ? Cette action est irréversible et implique des frais réels.')) {
        setNetwork('mainnet-beta');
      }
    } else {
      setNetwork('devnet');
    }
  };

  return (
    <div 
      className="flex items-center space-x-2 relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`text-sm ${network === 'devnet' ? 'text-green-500 font-bold' : 'text-gray-600'}`}>
        Devnet
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={network === 'mainnet-beta'}
          onChange={handleNetworkChange}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      <span className={`text-sm ${network === 'mainnet-beta' ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>
        Mainnet
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          <div className="relative">
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-gray-900 border-l-8 border-r-8 border-transparent"></div>
            <p>Devnet : Environnement de test gratuit</p>
            <p>Mainnet : Réseau principal avec frais réels</p>
          </div>
        </div>
      )}
    </div>
  );
}; 