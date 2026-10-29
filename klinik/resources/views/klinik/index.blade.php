@extends('klinik.layout')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Daftar Data Klinik</h4>
    <a href="{{ route('klinik.create') }}" class="btn btn-primary">+ Tambah Data</a>
</div>

<div class="card">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-bordered table-hover mb-0" style="font-size:0.83rem;">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Bulan</th>
                        <th>Jml Peserta</th>
                        <th>Rujukan</th>
                        <th>Kunj. Sakit</th>
                        <th>Kunj. Sehat</th>
                        <th>Ranap Umum</th>
                        <th>HP Umum</th>
                        <th>Ranap BPJS</th>
                        <th>HP BPJS</th>
                        <th>Partus Umum</th>
                        <th>HP Partus Umum</th>
                        <th>Partus BPJS</th>
                        <th>HP Partus BPJS</th>
                        <th>Kunj. Rajal</th>
                        <th>Unit Cost</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data as $i => $row)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $row['bulan'] }}</td>
                        <td>{{ number_format($row['jml_peserta']) }}</td>
                        <td>{{ number_format($row['rujukan']) }}</td>
                        <td>{{ number_format($row['kunj_sakit']) }}</td>
                        <td>{{ number_format($row['kunj_sehat']) }}</td>
                        <td>{{ number_format($row['ranap_umum']) }}</td>
                        <td>{{ number_format($row['hp_umum'], 2, ',', '.') }}</td>
                        <td>{{ number_format($row['ranap_bpjs']) }}</td>
                        <td>{{ number_format($row['hp_bpjs'], 2, ',', '.') }}</td>
                        <td>{{ number_format($row['partus_umum']) }}</td>
                        <td>{{ number_format($row['hp_partus_umum'], 2, ',', '.') }}</td>
                        <td>{{ number_format($row['partus_bpjs']) }}</td>
                        <td>{{ number_format($row['hp_partus_bpjs'], 2, ',', '.') }}</td>
                        <td>{{ number_format($row['kunjungan_rajal']) }}</td>
                        <td>
                            @if(!empty($row['unit_cost']))
                                <span class="badge bg-success fs-6">Rp {{ number_format($row['unit_cost'], 2, ',', '.') }}</span>
                            @else
                                <span class="text-muted">-</span>
                            @endif
                        </td>
                        <td class="text-nowrap">
                            <a href="{{ route('klinik.edit', $row['id']) }}" class="btn btn-sm btn-warning">Edit</a>
                            <form method="POST" action="{{ route('klinik.hitungUnitCost', $row['id']) }}" class="d-inline">
                                @csrf
                                <button type="submit" class="btn btn-sm btn-info text-white"
                                    title="Hitung: (Jml Peserta × 10.000) ÷ Kunjungan Rajal">
                                    Hitung UC
                                </button>
                            </form>
                            <form method="POST" action="{{ route('klinik.destroy', $row['id']) }}" class="d-inline"
                                onsubmit="return confirm('Hapus data ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger">Hapus</button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="17" class="text-center text-muted py-4">
                            Belum ada data. <a href="{{ route('klinik.create') }}">Tambah sekarang</a>.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
