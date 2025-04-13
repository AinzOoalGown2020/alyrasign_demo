import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAccessRequest } from '../hooks/useAccessRequest';

const NewAccessRequestForm: React.FC = () => {
  const { publicKey } = useWallet();
  const { isSubmitting, hasExistingRequest, checkExistingRequest, submitRequest } = useAccessRequest();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'trainer'>('student');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkExistingRequest();
  }, [checkExistingRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicKey) {
      return;
    }

    await submitRequest({
      role,
      name,
      email,
      message
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="wallet" className="block text-sm font-medium text-gray-300 mb-1">
          Adresse du portefeuille
        </label>
        <input
          type="text"
          id="wallet"
          value={publicKey?.toBase58() || ''}
          disabled
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
          Nom complet
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
          Rôle souhaité
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as 'student' | 'trainer')}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3"
        >
          <option value="student">Étudiant</option>
          <option value="trainer">Formateur</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3"
          placeholder="Expliquez brièvement pourquoi vous souhaitez ce rôle..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || hasExistingRequest}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Envoi en cours...' : hasExistingRequest ? 'Demande en cours' : 'Envoyer la demande'}
      </button>
    </form>
  );
};

export default NewAccessRequestForm; 