'use client';

import { useState } from 'react';
import { Pencil, Trash2, AlertTriangle, Calculator } from 'lucide-react';
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

function calcUnitCost(row: DataKlinik): string {
  const kunjungan = (row.kunj_sakit ?? 0) + (row.kunj_sehat ?? 0) + (row.kunjungan_rajal ?? 0);
  if (kunjungan === 0) return '-';
  const result = (row.jml_peserta * 10000) / kunjungan;
  return result.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

function getDaysInMonth(bulan: string): number {
  if (!bulan) return 30;
  const [year, month] = bulan.split('-').map(Number);
  if (!year || !month) return 30;
  return new Date(year, month, 0).getDate();
}

function calcBOR(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const totalHP = (row.hp_bpjs ?? 0) + (row.hp_partus_bpjs ?? 0);
  const a = totalHP / days;
  const bor = (a / 20) * 100;
  return bor.toFixed(2) + '%';
}

function calcBORTotal(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const totalHP =
    (row.hp_bpjs ?? 0) +
    (row.hp_partus_bpjs ?? 0) +
    (row.hp_umum ?? 0) +
    (row.hp_partus_umum ?? 0);
  const a = totalHP / days;
  const bor = (a / 20) * 100;
  return bor.toFixed(2) + '%';
}

function calcBORRanapBPJS(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const a = (row.hp_bpjs ?? 0) / days;
  const bor = (a / 20) * 100;
  return bor.toFixed(2) + '%';
}

function calcBORRanapUmum(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const a = (row.hp_umum ?? 0) / days;
  const bor = (a / 20) * 100;
  return bor.toFixed(2) + '%';
}

function calcAVLOS(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const a = ((row.hp_bpjs ?? 0) + (row.hp_partus_bpjs ?? 0)) / days;
  const pasienKeluar = (row.ranap_bpjs ?? 0) + (row.partus_bpjs ?? 0);
  if (pasienKeluar === 0) return '-';
  const avlos = (a * days) / pasienKeluar;
  return avlos.toFixed(2);
}

function calcAVLOSTotal(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  const borTot =
    ((row.hp_bpjs ?? 0) +
      (row.hp_partus_bpjs ?? 0) +
      (row.hp_umum ?? 0) +
      (row.hp_partus_umum ?? 0)) /
    days;
  const pasienKeluar =
    (row.ranap_bpjs ?? 0) +
    (row.partus_bpjs ?? 0) +
    (row.partus_umum ?? 0) +
    (row.ranap_umum ?? 0);
  if (pasienKeluar === 0) return '-';
  const avlosTotal = (borTot * days) / pasienKeluar;
  return avlosTotal.toFixed(2);
}

function calcAVLOSBPJS(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  // $brbpjs = hp_bpjs / hari
  const brbpjs = (row.hp_bpjs ?? 0) / days;
  const ranap = row.ranap_bpjs ?? 0;
  if (ranap === 0) return '-';
  return ((brbpjs * days) / ranap).toFixed(2);
}

function calcAVLOSUmum(row: DataKlinik): string {
  const days = getDaysInMonth(row.bulan);
  if (days === 0) return '-';
  // $brumum = hp_umum / hari
  const brumum = (row.hp_umum ?? 0) / days;
  const ranap = row.ranap_umum ?? 0;
  if (ranap === 0) return '-';
  return ((brumum * days) / ranap).toFixed(2);
}

export default function DataTable({ data, loading, onEdit, onDelete }: DataTableProps) {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showUnitCost, setShowUnitCost] = useState(false);
  const [showBOR, setShowBOR] = useState(false);
  const [showBORTotal, setShowBORTotal] = useState(false);
  const [showBORRanapBPJS, setShowBORRanapBPJS] = useState(false);
  const [showBORRanapUmum, setShowBORRanapUmum] = useState(false);
  const [showAVLOS, setShowAVLOS] = useState(false);
  const [showAVLOSTotal, setShowAVLOSTotal] = useState(false);
  const [showAVLOSBPJS, setShowAVLOSBPJS] = useState(false);
  const [showAVLOSUmum, setShowAVLOSUmum] = useState(false);

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
 
      {/* Calculation Toggles */}
      <div className="px-6 pb-2 flex justify-end gap-2">
        <button
          onClick={() => setShowBOR((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showBOR
              ? 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700'
              : 'bg-white text-violet-700 border-violet-400 hover:bg-violet-50'
          }`}
        >
          <Calculator size={15} />
          {showBOR ? 'Sembunyikan BOR' : 'Hitung BOR'}
        </button>
        <button
          onClick={() => setShowBORTotal((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showBORTotal
              ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700'
              : 'bg-white text-orange-700 border-orange-400 hover:bg-orange-50'
          }`}
        >
          <Calculator size={15} />
          {showBORTotal ? 'Sembunyikan BOR Total' : 'Hitung BOR Total'}
        </button>
        <button
          onClick={() => setShowBORRanapBPJS((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showBORRanapBPJS
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-white text-blue-700 border-blue-400 hover:bg-blue-50'
          }`}
        >
          <Calculator size={15} />
          {showBORRanapBPJS ? 'Sembunyikan BOR Ranap BPJS' : 'Hitung BOR Ranap BPJS'}
        </button>
        <button
          onClick={() => setShowBORRanapUmum((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showBORRanapUmum
              ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700'
              : 'bg-white text-rose-700 border-rose-400 hover:bg-rose-50'
          }`}
        >
          <Calculator size={15} />
          {showBORRanapUmum ? 'Sembunyikan BOR Ranap Umum' : 'Hitung BOR Ranap Umum'}
        </button>
        <button
          onClick={() => setShowAVLOS((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showAVLOS
              ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700'
              : 'bg-white text-teal-700 border-teal-400 hover:bg-teal-50'
          }`}
        >
          <Calculator size={15} />
          {showAVLOS ? 'Sembunyikan AVLOS' : 'Hitung AVLOS'}
        </button>
        <button
          onClick={() => setShowAVLOSTotal((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showAVLOSTotal
              ? 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700'
              : 'bg-white text-cyan-700 border-cyan-400 hover:bg-cyan-50'
          }`}
        >
          <Calculator size={15} />
          {showAVLOSTotal ? 'Sembunyikan AVLOS Total' : 'Hitung AVLOS Total'}
        </button>
        <button
          onClick={() => setShowAVLOSBPJS((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showAVLOSBPJS
              ? 'bg-sky-600 text-white border-sky-600 hover:bg-sky-700'
              : 'bg-white text-sky-700 border-sky-400 hover:bg-sky-50'
          }`}
        >
          <Calculator size={15} />
          {showAVLOSBPJS ? 'Sembunyikan AVLOS BPJS' : 'Hitung AVLOS BPJS'}
        </button>
        <button
          onClick={() => setShowAVLOSUmum((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showAVLOSUmum
              ? 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700'
              : 'bg-white text-pink-700 border-pink-400 hover:bg-pink-50'
          }`}
        >
          <Calculator size={15} />
          {showAVLOSUmum ? 'Sembunyikan AVLOS Umum' : 'Hitung AVLOS Umum'}
        </button>
        <button
          onClick={() => setShowUnitCost((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition ${
            showUnitCost
              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
              : 'bg-white text-emerald-700 border-emerald-400 hover:bg-emerald-50'
          }`}
        >
          <Calculator size={15} />
          {showUnitCost ? 'Sembunyikan Unit Cost' : 'Hitung Unit Cost'}
        </button>
      </div>

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
              {showBOR && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-violet-600 uppercase tracking-wider">
                  BOR
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    (hp_bpjs+hp_partus_bpjs)÷hari÷20×100%
                  </span>
                </th>
              )}
              {showBORTotal && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-orange-600 uppercase tracking-wider">
                  BOR Total
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    (hp_bpjs+hp_partus_bpjs+hp_umum+hp_partus_umum)÷hari÷20×100%
                  </span>
                </th>
              )}
              {showBORRanapBPJS && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  BOR Ranap BPJS
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    hp_bpjs÷hari÷20×100%
                  </span>
                </th>
              )}
              {showBORRanapUmum && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  BOR Ranap Umum
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    hp_umum÷hari÷20×100%
                  </span>
                </th>
              )}
              {showAVLOS && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-teal-600 uppercase tracking-wider">
                  AVLOS
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    (hp_bpjs+hp_partus_bpjs)÷(ranap_bpjs+partus_bpjs)
                  </span>
                </th>
              )}
              {showAVLOSTotal && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                  AVLOS Total
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    (hp_all)÷(ranap_bpjs+partus_bpjs+partus_umum+ranap_umum)
                  </span>
                </th>
              )}
              {showAVLOSBPJS && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-sky-600 uppercase tracking-wider">
                  AVLOS BPJS
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    hp_bpjs÷ranap_bpjs
                  </span>
                </th>
              )}
              {showAVLOSUmum && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-pink-600 uppercase tracking-wider">
                  AVLOS Umum
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    hp_umum÷ranap_umum
                  </span>
                </th>
              )}
              {showUnitCost && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Unit Cost
                  <span className="block normal-case font-normal text-gray-400 text-[10px]">
                    peserta×10.000÷kunjungan
                  </span>
                </th>
              )}
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
                {showBOR && (
                  <td className="px-4 py-3 text-right font-mono text-violet-700 font-medium">
                    {calcBOR(row)}
                  </td>
                )}
                {showBORTotal && (
                  <td className="px-4 py-3 text-right font-mono text-orange-700 font-medium">
                    {calcBORTotal(row)}
                  </td>
                )}
                {showBORRanapBPJS && (
                  <td className="px-4 py-3 text-right font-mono text-blue-700 font-medium">
                    {calcBORRanapBPJS(row)}
                  </td>
                )}
                {showBORRanapUmum && (
                  <td className="px-4 py-3 text-right font-mono text-rose-700 font-medium">
                    {calcBORRanapUmum(row)}
                  </td>
                )}
                {showAVLOS && (
                  <td className="px-4 py-3 text-right font-mono text-teal-700 font-medium">
                    {calcAVLOS(row)}
                  </td>
                )}
                {showAVLOSTotal && (
                  <td className="px-4 py-3 text-right font-mono text-cyan-700 font-medium">
                    {calcAVLOSTotal(row)}
                  </td>
                )}
                {showAVLOSBPJS && (
                  <td className="px-4 py-3 text-right font-mono text-sky-700 font-medium">
                    {calcAVLOSBPJS(row)}
                  </td>
                )}
                {showAVLOSUmum && (
                  <td className="px-4 py-3 text-right font-mono text-pink-700 font-medium">
                    {calcAVLOSUmum(row)}
                  </td>
                )}
                {showUnitCost && (
                  <td className="px-4 py-3 text-right font-mono text-emerald-700 font-medium">
                    {calcUnitCost(row)}
                  </td>
                )}
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
