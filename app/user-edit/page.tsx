'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(c => c.startsWith('user='));
    if (cookie) {
      const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      setUsername(data.name);
    }
  }, []);

  const handleSave = async () => {
    setError('');
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Edit Username</h1>
      <input
        type="text"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <button onClick={handleSave} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Save
      </button>
    </div>
  );
}
