<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataKlinik extends Model
{
    use HasFactory;

    protected $table = 'data_klinik';

    protected $fillable = [
        'bulan',
        'jml_peserta',
        'rujukan',
        'kunj_sakit',
        'kunj_sehat',
        'ranap_umum',
        'hp_umum',
        'ranap_bpjs',
        'hp_bpjs',
        'partus_umum',
        'hp_partus_umum',
        'partus_bpjs',
        'hp_partus_bpjs',
        'kunjungan_rajal',
        'unit_cost',
    ];
}
