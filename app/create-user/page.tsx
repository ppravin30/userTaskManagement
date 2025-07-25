'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserFormData {
  email: string;
  name: string;
}

const CreateUserPage: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({ email: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to create user');
        setLoading(false);
        return;
      }
      setFormData({ email: '', name: '' });
      router.push('/');
    } catch {
      setError('Server error while creating user');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Create New User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={100}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Enter user email..."
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              maxLength={100}
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              placeholder="Enter name (optional)..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
