@if($errors->any())
<div class="alert alert-danger">
    <ul class="mb-0">
        @foreach($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
</div>
@endif

<div class="row g-3">
    {{-- Bulan --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Bulan <span class="text-danger">*</span></label>
        <select name="bulan" class="form-select @error('bulan') is-invalid @enderror" required>
            <option value="">-- Pilih Bulan --</option>
            @foreach(['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'] as $bln)
                <option value="{{ $bln }}" {{ old('bulan', $klinik->bulan ?? '') === $bln ? 'selected' : '' }}>{{ $bln }}</option>
            @endforeach
        </select>
        @error('bulan')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Jml Peserta --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Jml Peserta <span class="text-danger">*</span></label>
        <input type="number" id="jml_peserta" name="jml_peserta" min="0"
            class="form-control @error('jml_peserta') is-invalid @enderror"
            value="{{ old('jml_peserta', $klinik->jml_peserta ?? '') }}" required>
        @error('jml_peserta')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Rujukan --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Rujukan</label>
        <input type="number" name="rujukan" min="0"
            class="form-control @error('rujukan') is-invalid @enderror"
            value="{{ old('rujukan', $klinik->rujukan ?? 0) }}" required>
        @error('rujukan')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Kunjungan Sakit --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Kunjungan Sakit</label>
        <input type="number" name="kunj_sakit" min="0"
            class="form-control @error('kunj_sakit') is-invalid @enderror"
            value="{{ old('kunj_sakit', $klinik->kunj_sakit ?? 0) }}" required>
        @error('kunj_sakit')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Kunjungan Sehat --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Kunjungan Sehat</label>
        <input type="number" name="kunj_sehat" min="0"
            class="form-control @error('kunj_sehat') is-invalid @enderror"
            value="{{ old('kunj_sehat', $klinik->kunj_sehat ?? 0) }}" required>
        @error('kunj_sehat')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Ranap Umum --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Ranap Umum</label>
        <input type="number" name="ranap_umum" min="0"
            class="form-control @error('ranap_umum') is-invalid @enderror"
            value="{{ old('ranap_umum', $klinik->ranap_umum ?? 0) }}" required>
        @error('ranap_umum')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- HP Umum --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">HP Umum (Rp)</label>
        <input type="number" name="hp_umum" min="0" step="0.01"
            class="form-control @error('hp_umum') is-invalid @enderror"
            value="{{ old('hp_umum', $klinik->hp_umum ?? 0) }}" required>
        @error('hp_umum')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Ranap BPJS --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Ranap BPJS</label>
        <input type="number" name="ranap_bpjs" min="0"
            class="form-control @error('ranap_bpjs') is-invalid @enderror"
            value="{{ old('ranap_bpjs', $klinik->ranap_bpjs ?? 0) }}" required>
        @error('ranap_bpjs')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- HP BPJS --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">HP BPJS (Rp)</label>
        <input type="number" name="hp_bpjs" min="0" step="0.01"
            class="form-control @error('hp_bpjs') is-invalid @enderror"
            value="{{ old('hp_bpjs', $klinik->hp_bpjs ?? 0) }}" required>
        @error('hp_bpjs')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Partus Umum --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Partus Umum</label>
        <input type="number" name="partus_umum" min="0"
            class="form-control @error('partus_umum') is-invalid @enderror"
            value="{{ old('partus_umum', $klinik->partus_umum ?? 0) }}" required>
        @error('partus_umum')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- HP Partus Umum --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">HP Partus Umum (Rp)</label>
        <input type="number" name="hp_partus_umum" min="0" step="0.01"
            class="form-control @error('hp_partus_umum') is-invalid @enderror"
            value="{{ old('hp_partus_umum', $klinik->hp_partus_umum ?? 0) }}" required>
        @error('hp_partus_umum')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Partus BPJS --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Partus BPJS</label>
        <input type="number" name="partus_bpjs" min="0"
            class="form-control @error('partus_bpjs') is-invalid @enderror"
            value="{{ old('partus_bpjs', $klinik->partus_bpjs ?? 0) }}" required>
        @error('partus_bpjs')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- HP Partus BPJS --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">HP Partus BPJS (Rp)</label>
        <input type="number" name="hp_partus_bpjs" min="0" step="0.01"
            class="form-control @error('hp_partus_bpjs') is-invalid @enderror"
            value="{{ old('hp_partus_bpjs', $klinik->hp_partus_bpjs ?? 0) }}" required>
        @error('hp_partus_bpjs')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>

    {{-- Kunjungan Rajal --}}
    <div class="col-md-4">
        <label class="form-label fw-semibold">Kunjungan Rajal <span class="text-danger">*</span></label>
        <input type="number" id="kunjungan_rajal" name="kunjungan_rajal" min="1"
            class="form-control @error('kunjungan_rajal') is-invalid @enderror"
            value="{{ old('kunjungan_rajal', $klinik->kunjungan_rajal ?? '') }}" required>
        @error('kunjungan_rajal')<div class="invalid-feedback">{{ $message }}</div>@enderror
    </div>
</div>

{{-- Preview Unit Cost --}}
<div class="mt-4 p-3 bg-light rounded border">
    <div class="d-flex align-items-center gap-3 flex-wrap">
        <div>
            <span class="fw-semibold">Preview Unit Cost</span>
            <small class="text-muted d-block">Rumus: Jml Peserta &times; 10.000 &divide; Kunjungan Rajal</small>
        </div>
        <div id="uc_preview" class="text-muted fs-5">
            Isi Jml Peserta dan Kunjungan Rajal terlebih dahulu
        </div>
    </div>
</div>
