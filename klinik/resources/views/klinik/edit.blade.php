@extends('klinik.layout')

@section('content')
<div class="row justify-content-center">
    <div class="col-lg-9">
        <div class="card">
            <div class="card-header bg-warning">
                <h5 class="mb-0">Edit Data Klinik &mdash; {{ $klinik->bulan }}</h5>
            </div>
            <div class="card-body">
                <form method="POST" action="{{ route('klinik.update', $klinik) }}">
                    @csrf
                    @method('PUT')
                    @include('klinik._form')
                    <div class="d-flex gap-2 mt-4">
                        <button type="submit" class="btn btn-warning">Update</button>
                        <a href="{{ route('klinik.index') }}" class="btn btn-secondary">Batal</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function hitungPreview() {
        const peserta = parseInt(document.getElementById('jml_peserta').value) || 0;
        const kunjungan = parseInt(document.getElementById('kunjungan_rajal').value) || 0;
        const preview = document.getElementById('uc_preview');
        if (kunjungan > 0) {
            const uc = (peserta * 10000) / kunjungan;
            preview.textContent = 'Rp ' + uc.toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            preview.className = 'text-success fw-bold';
        } else {
            preview.textContent = 'Isi Jml Peserta dan Kunjungan Rajal terlebih dahulu';
            preview.className = 'text-muted';
        }
    }
    document.getElementById('jml_peserta').addEventListener('input', hitungPreview);
    document.getElementById('kunjungan_rajal').addEventListener('input', hitungPreview);
    // Jalankan saat halaman dimuat
    hitungPreview();
</script>
@endsection
