import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program } from '@coral-xyz/anchor';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useAccessRequest } from '../hooks/useAccessRequest';
import { Alyrasign } from '../../../types/alyrasign';

interface AccessRequestFormProps {
  program: Program<Alyrasign>;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const AccessRequestForm: React.FC<AccessRequestFormProps> = ({ program }) => {
  const { publicKey } = useWallet();
  const { checkExistingRequest, submitRequest } = useAccessRequest(program);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('Satoshi Nakamoto');
  const [email, setEmail] = useState('satoshi@nakamoto.ai');
  const [role, setRole] = useState<'student' | 'trainer'>('student');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasExistingRequest, setHasExistingRequest] = useState(false);

  // Vérification de l'existence d'une demande au chargement
  useEffect(() => {
    const checkRequest = async () => {
      if (publicKey) {
        const exists = await checkExistingRequest();
        setHasExistingRequest(exists);
      }
    };
    checkRequest();
  }, [publicKey, checkExistingRequest]);

  // Validation en temps réel
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value || value.length < 2) {
          return 'Le nom doit contenir au moins 2 caractères';
        }
        if (value.length > 100) {
          return 'Le nom ne doit pas dépasser 100 caractères';
        }
        return '';
      case 'email':
        if (!value) {
          return 'L\'email est requis';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email invalide';
        }
        if (value.length > 100) {
          return 'L\'email ne doit pas dépasser 100 caractères';
        }
        return '';
      case 'message':
        if (value && value.length > 200) {
          return 'Le message ne doit pas dépasser 200 caractères';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'message':
        setMessage(value);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      addNotification({
        type: 'error',
        message: 'Veuillez connecter votre wallet pour soumettre une demande d\'accès.',
      });
      return;
    }

    if (hasExistingRequest) {
      addNotification({
        type: 'info',
        message: 'Une demande d\'accès est déjà en cours pour ce wallet.',
      });
      return;
    }

    // Validation finale
    const nameError = validateField('name', name);
    const emailError = validateField('email', email);
    const messageError = validateField('message', message);

    if (nameError || emailError || messageError) {
      setErrors({
        name: nameError,
        email: emailError,
        message: messageError,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRequest({
        name,
        email,
        role,
        message,
        publicKey: publicKey.toString(),
      });

      addNotification({
        type: 'success',
        message: 'Votre demande d\'accès a été soumise avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasExistingRequest) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-gray-300">
          Une demande d'accès est déjà en cours pour ce wallet.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-300 mb-2">
          Adresse du wallet
        </label>
        <input
          type="text"
          id="wallet"
          value={publicKey?.toString() || ''}
          disabled
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          required
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.name ? 'border-red-500' : 'border-gray-700'
          } rounded-md text-gray-300`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          required
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.email ? 'border-red-500' : 'border-gray-700'
          } rounded-md text-gray-300`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
          Rôle
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'student' | 'trainer')}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
        >
          <option value="student">Étudiant</option>
          <option value="trainer">Formateur</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => handleFieldChange('message', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.message ? 'border-red-500' : 'border-gray-700'
          } rounded-md text-gray-300`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || Object.keys(errors).length > 0}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
      </button>
    </form>
  );
}; 