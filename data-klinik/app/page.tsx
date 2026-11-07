'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { LogOut, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DataKlinik, DataKlinikFormData } from '@/lib/types';
import DataForm from '@/components/DataForm';
import DataTable from '@/components/DataTable';
import LoginForm from '@/components/LoginForm';
import PasswordForm from '@/components/PasswordForm';
import authUsers from '@/lib/auth-users.json';

type ToastMessage = { type: 'success' | 'error'; text: string };

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    let receivedChange = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === 'INITIAL_SESSION') return;
      receivedChange = true;
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });

    supabase.auth.getUser()
      .then(({ data }) => {
        if (active && !receivedChange) {
          setUser(data.user);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (active && !receivedChange) setCheckingAuth(false);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checkingAuth) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Memeriksa sesi…</div>;
  }

  if (!user) return <LoginForm />;

  return <ClinicDashboard key={user.id} user={user} />;
}

function ClinicDashboard({ user }: { user: User }) {
  const displayName = Object.entries(authUsers).find(([, email]) => email === user.email)?.[0] ?? user.email;
  const [data, setData] = useState<DataKlinik[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataKlinik | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const showToast = (type: ToastMessage['type'], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from('data_klinik')
      .select('*')
      .eq('owner_id', user.id);

    if (error) {
      showToast('error', 'Gagal memuat data: ' + error.message);
    } else {
      const sorted = ((records ?? []) as DataKlinik[]).sort((a, b) => {
        const dateA = a.tanggal_catat ?? a.tanggal_mulai ?? `${a.bulan ?? ''}-01`;
        const dateB = b.tanggal_catat ?? b.tanggal_mulai ?? `${b.bulan ?? ''}-01`;
        return dateB.localeCompare(dateA) || (b.id ?? 0) - (a.id ?? 0);
      });
      setData(sorted);
    }
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (formData: DataKlinikFormData): Promise<boolean> => {
    const { error } = await supabase.from('data_klinik').insert([{ ...formData, owner_id: user.id }]);
    if (error) {
      showToast('error', 'Gagal menyimpan: ' + error.message);
      return false;
    }
    showToast('success', 'Data berhasil disimpan');
    await fetchData();
    setShowForm(false);
    return true;
  };

  const handleUpdate = async (id: number, formData: DataKlinikFormData): Promise<boolean> => {
    const { error } = await supabase
      .from('data_klinik')
      .update(formData)
      .eq('id', id)
      .eq('owner_id', user.id);
    if (error) {
      showToast('error', 'Gagal memperbarui: ' + error.message);
      return false;
    }
    showToast('success', 'Data berhasil diperbarui');
    await fetchData();
    setEditingRecord(null);
    return true;
  };

  const handleDelete = async (id: number): Promise<boolean> => {
    const { error } = await supabase.from('data_klinik').delete().eq('id', id).eq('owner_id', user.id);
    if (error) {
      showToast('error', 'Gagal menghapus: ' + error.message);
      return false;
    }
    showToast('success', 'Data berhasil dihapus');
    await fetchData();
    return true;
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Data Klinik</h1>
            <p className="text-blue-200 text-sm mt-0.5">Sistem Input Data Klinik Bulanan</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-blue-100">{displayName}</span>
            <button type="button" onClick={() => setShowPasswordForm((value) => !value)}
              className="text-sm text-blue-100 hover:text-white hover:underline">
              Atur kata sandi
            </button>
            <button
              type="button"
              onClick={async () => {
                const { error } = await supabase.auth.signOut();
                if (error) showToast('error', 'Gagal keluar: ' + error.message);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-3 py-2 text-sm hover:bg-blue-700"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
        {showPasswordForm && <PasswordForm onClose={() => setShowPasswordForm(false)} />}
        {/* Toast Notification */}
        {toast && (
          <div
            className={`flex items-center justify-between p-4 rounded-lg text-sm font-medium transition-all ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ml-4 text-current opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Toolbar */}
        {!showForm && !editingRecord && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition"
            >
              <Plus size={16} />
              Tambah Data
            </button>
          </div>
        )}

        {/* Form Card */}
        {(showForm || editingRecord) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800">
                {editingRecord ? 'Edit Data' : 'Tambah Data Baru'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Tutup form"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <DataForm
                initialData={editingRecord ?? undefined}
                onSubmit={
                  editingRecord
                    ? (fd) => handleUpdate(editingRecord.id!, fd)
                    : handleCreate
                }
                onCancel={closeForm}
              />
            </div>
          </div>
        )}

        {/* Data Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">
              Daftar Data
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({data.length} record)
                </span>
              )}
            </h2>
          </div>
          <DataTable
            data={data}
            loading={loading}
            onEdit={(record) => {
              setEditingRecord(record);
              setShowForm(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
