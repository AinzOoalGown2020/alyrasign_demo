import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { useConnection } from '@solana/wallet-adapter-react';
import { getExplorerUrl } from '../../../utils/explorer';
import { useNetworkConfiguration } from '../../../contexts/NetworkConfigurationProvider';
import useNotificationStore from '../../../stores/useNotificationStore';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  /** Type de notification */
  type: NotificationType;
  /** Message principal */
  message: string;
  /** Description détaillée (optionnelle) */
  description?: string;
  /** ID de transaction Solana (optionnel) */
  txid?: string;
  /** Fonction appelée lors de la fermeture */
  onHide?: () => void;
  /** Durée d'affichage en millisecondes */
  duration?: number;
  /** Position de la notification */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Composant de notification individuelle
 */
const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  description,
  txid,
  onHide,
  duration = 5000,
  position = 'top-right'
}) => {
  const { networkConfiguration } = useNetworkConfiguration();

  useEffect(() => {
    if (!onHide) return;
    
    const id = setTimeout(() => {
      onHide();
    }, duration);

    return () => {
      clearTimeout(id);
    };
  }, [onHide, duration]);

  const handleClose = () => {
    if (onHide) {
      onHide();
    }
  };

  const icons = {
    success: <CheckCircleIcon className="h-8 w-8 mr-1 text-green-500" />,
    error: <XCircleIcon className="h-8 w-8 mr-1 text-red-500" />,
    info: <InformationCircleIcon className="h-8 w-8 mr-1 text-blue-500" />,
    warning: <ExclamationCircleIcon className="h-8 w-8 mr-1 text-yellow-500" />
  };

  const positionStyles = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0'
  };

  return (
    <div className={`
      max-w-sm w-full bg-gray-800 shadow-lg rounded-md 
      pointer-events-auto ring-1 ring-black ring-opacity-5 p-2 
      ${positionStyles[position]} m-4 overflow-hidden
      transform transition-all duration-300 ease-in-out
      hover:shadow-xl
    `}>
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-2 w-0 flex-1">
            <div className="font-bold text-white">{message}</div>
            {description && (
              <p className="mt-0.5 text-sm text-gray-300">{description}</p>
            )}
            {txid && (
              <div className="flex flex-row mt-2">
                <a
                  href={getExplorerUrl(txid, networkConfiguration)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-row items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg 
                    className="flex-shrink-0 h-4 w-4 mr-1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                  <span className="text-sm">
                    {txid.slice(0, 8)}...{txid.slice(txid.length - 8)}
                  </span>
                </a>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 self-start flex">
            <button
              onClick={handleClose}
              className="bg-gray-700 rounded-md p-1 text-gray-400 hover:text-white 
                       transition-colors focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              <span className="sr-only">Fermer</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NotificationStore {
  notifications: NotificationProps[];
  set: (fn: (state: { notifications: NotificationProps[] }) => { notifications: NotificationProps[] }) => void;
}

/**
 * Liste des notifications
 */
export const NotificationList: React.FC = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore() as NotificationStore;

  const handleHide = (notification: NotificationProps) => {
    if (setNotificationStore) {
      setNotificationStore((state) => ({
        notifications: state.notifications.filter((n) => n !== notification),
      }));
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex items-end justify-end px-4 py-6 pointer-events-none sm:p-6">
      <div className="flex flex-col w-full max-w-sm">
        {[...notifications].reverse().map((notification, index) => (
          <Notification
            key={`${notification.message}-${index}`}
            {...notification}
            onHide={() => handleHide(notification)}
          />
        ))}
      </div>
    </div>
  );
}; 