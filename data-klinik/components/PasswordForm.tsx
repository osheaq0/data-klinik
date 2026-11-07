'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PasswordForm({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage('Konfirmasi kata sandi tidak sama.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setMessage('Gagal mengatur kata sandi: ' + error.message);
      return;
    }
    setPassword('');
    setConfirmation('');
    setMessage('Kata sandi berhasil disimpan.');
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm" aria-label="Atur kata sandi">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-gray-800">Atur kata sandi</h2>
        <button type="button" onClick={onClose} className="text-sm text-blue-600 hover:underline">Tutup</button>
      </div>
      <p className="mt-1 text-sm text-gray-500">Setelah menerima undangan, buat kata sandi untuk login berikutnya.</p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block text-sm text-gray-700">
          Kata sandi baru
          <input type="password" autoComplete="new-password" minLength={6} required value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block text-sm text-gray-700">
          Ulangi kata sandi
          <input type="password" autoComplete="new-password" minLength={6} required value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <button type="submit" disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {submitting ? 'Menyimpan…' : 'Simpan kata sandi'}
        </button>
      </form>
      {message && <p role="status" className="mt-3 text-sm text-gray-700">{message}</p>}
    </section>
  );
}
