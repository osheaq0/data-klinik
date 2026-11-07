'use client';

import { useState } from 'react';
import type { DataKlinik, DataKlinikFormData } from '@/lib/types';
import { NUMERIC_FIELDS } from '@/lib/types';
import { daysInMonth, isDateInMonth } from '@/lib/period';

const EMPTY_FORM: DataKlinikFormData = {
  bulan: '',
  tanggal_catat: '',
  jml_peserta: 0,
  rujukan: 0,
  kunj_sakit: 0,
  kunj_sehat: 0,
  ranap_umum: 0,
  hp_umum: 0,
  ranap_bpjs: 0,
  hp_bpjs: 0,
  partus_umum: 0,
  hp_partus_umum: 0,
  partus_bpjs: 0,
  hp_partus_bpjs: 0,
  kunjungan_rajal: 0,
};

interface DataFormProps {
  initialData?: DataKlinik;
  onSubmit: (data: DataKlinikFormData) => Promise<boolean>;
  onCancel: () => void;
}

export default function DataForm({ initialData, onSubmit, onCancel }: DataFormProps) {
  const [form, setForm] = useState<DataKlinikFormData>(() => {
    if (!initialData) return EMPTY_FORM;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, owner_id, created_at, updated_at, tanggal_mulai, ...rest } = initialData;
    return { ...rest, bulan: rest.bulan ?? '', tanggal_catat: rest.tanggal_catat ?? '' };
  });
  const [submitting, setSubmitting] = useState(false);
  const undatedLegacyRecord = !!initialData && !initialData.tanggal_catat && !form.tanggal_catat && !!form.bulan;
  const validPeriod = isDateInMonth(form.tanggal_catat, form.bulan) || undatedLegacyRecord;

  const set = (key: keyof DataKlinikFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPeriod) return;
    setSubmitting(true);
    const ok = await onSubmit(form);
    setSubmitting(false);
    if (ok && !initialData) setForm(EMPTY_FORM);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bulan <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={form.bulan}
            onChange={(e) => set('bulan', e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-48"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Input <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.tanggal_catat}
            onChange={(e) => set('tanggal_catat', e.target.value)}
            min={form.bulan ? `${form.bulan}-01` : undefined}
            max={form.bulan ? `${form.bulan}-${String(daysInMonth(form.bulan)).padStart(2, '0')}` : undefined}
            required={!undatedLegacyRecord}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline w-48"
          />
          {undatedLegacyRecord && (
            <p className="mt-1 text-xs text-gray-500">Data lama boleh tanpa tanggal; isi jika diketahui.</p>
          )}
          {form.tanggal_catat && !isDateInMonth(form.tanggal_catat, form.bulan) && (
            <p className="mt-1 text-xs text-red-600">Tanggal harus berada dalam bulan yang dipilih.</p>
          )}
        </div>
      </div>

      {/* Numeric fields grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {NUMERIC_FIELDS.map(({ key, label, isDecimal }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="number"
              min="0"
              step={isDecimal ? '0.01' : '1'}
              value={form[key] as number}
              onChange={(e) =>
                set(key, isDecimal ? parseFloat(e.target.value) || 0 : parseInt(e.target.value) || 0)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || !validPeriod}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting ? 'Menyimpan…' : initialData ? 'Perbarui' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
