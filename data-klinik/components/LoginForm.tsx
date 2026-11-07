'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import authUsers from '@/lib/auth-users.json';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const email = authUsers[username.trim().toLowerCase() as keyof typeof authUsers];
    if (!email) {
      setError('Username atau kata sandi salah.');
      return;
    }
    setSubmitting(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (loginError) setError('Username atau kata sandi salah, atau akun belum diaktifkan.');
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Data Klinik</h1>
        <p className="mt-1 text-sm text-gray-500">Masuk untuk melihat data klinik Anda.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Kata sandi</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Masuk…' : 'Masuk'}
          </button>
        </form>
        <p className="mt-5 text-xs text-gray-500">Akun dibuat oleh pengelola klinik.</p>
      </div>
    </main>
  );
}
