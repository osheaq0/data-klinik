'use client';

import { useState } from 'react';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';
import type { DataKlinik } from '@/lib/types';
import { TABLE_COLUMNS } from '@/lib/types';

interface DataTableProps {
  data: DataKlinik[];
  loading: boolean;
  onEdit: (record: DataKlinik) => void;
  onDelete: (id: number) => Promise<boolean>;
}

function formatBulan(value: string): string {
  if (!value) return '-';
  const [year, month] = value.split('-');
  if (!year || !month) return value;
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function formatValue(key: string, value: unknown): string {
  if (key === 'bulan') return formatBulan(value as string);
  if (typeof value === 'number') return value.toLocaleString('id-ID');
  return String(value ?? '-');
}

export default function DataTable({ data, loading, onEdit, onDelete }: DataTableProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteConfirm = async () => {
    if (confirmId === null) return;
    setDeletingId(confirmId);
    await onDelete(confirmId);
    setDeletingId(null);
    setConfirmId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Belum ada data. Klik &ldquo;Tambah Data&rdquo; untuk memulai.
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Hapus Data</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Data yang dihapus tidak bisa dikembalikan. Yakin ingin menghapus?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmId(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
              >
                {deletingId !== null ? 'Menghapus…' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                No
              </th>
              {TABLE_COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, idx) => (
              <tr key={row.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{idx + 1}</td>
                {TABLE_COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {formatValue(col.key, row[col.key as keyof DataKlinik])}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(row)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 transition"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmId(row.id!)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition"
                      title="Hapus"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
