export interface DataKlinik {
  id?: number;
  bulan: string; // format: YYYY-MM
  jml_peserta: number;
  rujukan: number;
  kunj_sakit: number;
  kunj_sehat: number;
  ranap_umum: number;
  hp_umum: number;
  ranap_bpjs: number;
  hp_bpjs: number;
  partus_umum: number;
  hp_partus_umum: number;
  partus_bpjs: number;
  hp_partus_bpjs: number;
  kunjungan_rajal: number;
  created_at?: string;
  updated_at?: string;
}

export type DataKlinikFormData = Omit<DataKlinik, 'id' | 'created_at' | 'updated_at'>;

export interface NumericField {
  key: keyof DataKlinikFormData;
  label: string;
  isDecimal?: boolean;
}

export const NUMERIC_FIELDS: NumericField[] = [
  { key: 'jml_peserta',    label: 'Jml. Peserta' },
  { key: 'rujukan',        label: 'Rujukan' },
  { key: 'kunj_sakit',     label: 'Kunjungan Sakit' },
  { key: 'kunj_sehat',     label: 'Kunjungan Sehat' },
  { key: 'ranap_umum',     label: 'Ranap Umum' },
  { key: 'hp_umum',        label: 'HP Umum',         isDecimal: true },
  { key: 'ranap_bpjs',     label: 'Ranap BPJS' },
  { key: 'hp_bpjs',        label: 'HP BPJS',         isDecimal: true },
  { key: 'partus_umum',    label: 'Partus Umum' },
  { key: 'hp_partus_umum', label: 'HP Partus Umum',  isDecimal: true },
  { key: 'partus_bpjs',    label: 'Partus BPJS' },
  { key: 'hp_partus_bpjs', label: 'HP Partus BPJS',  isDecimal: true },
  { key: 'kunjungan_rajal', label: 'Kunjungan Rajal' },
];

export const TABLE_COLUMNS = [
  { key: 'bulan',           label: 'Bulan' },
  { key: 'jml_peserta',    label: 'Jml. Peserta' },
  { key: 'rujukan',        label: 'Rujukan' },
  { key: 'kunj_sakit',     label: 'Kunj. Sakit' },
  { key: 'kunj_sehat',     label: 'Kunj. Sehat' },
  { key: 'ranap_umum',     label: 'Ranap Umum' },
  { key: 'hp_umum',        label: 'HP Umum' },
  { key: 'ranap_bpjs',     label: 'Ranap BPJS' },
  { key: 'hp_bpjs',        label: 'HP BPJS' },
  { key: 'partus_umum',    label: 'Partus Umum' },
  { key: 'hp_partus_umum', label: 'HP Partus Umum' },
  { key: 'partus_bpjs',    label: 'Partus BPJS' },
  { key: 'hp_partus_bpjs', label: 'HP Partus BPJS' },
  { key: 'kunjungan_rajal', label: 'Kunj. Rajal' },
];
