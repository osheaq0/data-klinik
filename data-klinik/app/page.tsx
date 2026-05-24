'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { DataKlinik, DataKlinikFormData } from '@/lib/types';
import DataForm from '@/components/DataForm';
import DataTable from '@/components/DataTable';

type ToastMessage = { type: 'success' | 'error'; text: string };

export default function HomePage() {
  const [data, setData] = useState<DataKlinik[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataKlinik | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: ToastMessage['type'], text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: records, error } = await supabase
      .from('data_klinik')
      .select('*')
      .order('bulan', { ascending: false });

    if (error) {
      showToast('error', 'Gagal memuat data: ' + error.message);
    } else {
      setData(records ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (formData: DataKlinikFormData): Promise<boolean> => {
    const { error } = await supabase.from('data_klinik').insert([formData]);
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
      .eq('id', id);
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
    const { error } = await supabase.from('data_klinik').delete().eq('id', id);
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
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">Data Klinik</h1>
          <p className="text-blue-200 text-sm mt-0.5">Sistem Input Data Klinik Bulanan</p>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
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
