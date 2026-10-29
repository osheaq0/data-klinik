<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DataKlinikController extends Controller
{
    private function getData(): array
    {
        return session('klinik_data', []);
    }

    private function saveData(array $data): void
    {
        session(['klinik_data' => array_values($data)]);
    }

    private function findById(int $id): ?array
    {
        foreach ($this->getData() as $index => $row) {
            if ((int) $row['id'] === $id) {
                return ['index' => $index, 'row' => $row];
            }
        }
        return null;
    }

    private function validationRules(): array
    {
        return [
            'bulan'           => 'required|string|max:20',
            'jml_peserta'     => 'required|integer|min:0',
            'rujukan'         => 'required|integer|min:0',
            'kunj_sakit'      => 'required|integer|min:0',
            'kunj_sehat'      => 'required|integer|min:0',
            'ranap_umum'      => 'required|integer|min:0',
            'hp_umum'         => 'required|numeric|min:0',
            'ranap_bpjs'      => 'required|integer|min:0',
            'hp_bpjs'         => 'required|numeric|min:0',
            'partus_umum'     => 'required|integer|min:0',
            'hp_partus_umum'  => 'required|numeric|min:0',
            'partus_bpjs'     => 'required|integer|min:0',
            'hp_partus_bpjs'  => 'required|numeric|min:0',
            'kunjungan_rajal' => 'required|integer|min:1',
        ];
    }

    public function index()
    {
        $data = $this->getData();
        return view('klinik.index', compact('data'));
    }

    public function create()
    {
        return view('klinik.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $all = $this->getData();
        $nextId = count($all) > 0 ? max(array_column($all, 'id')) + 1 : 1;

        $validated['id']        = $nextId;
        $validated['unit_cost'] = null;

        $all[] = $validated;
        $this->saveData($all);

        return redirect()->route('klinik.index')->with('success', 'Data berhasil disimpan.');
    }

    public function edit(int $id)
    {
        $found = $this->findById($id);
        abort_if(!$found, 404);

        $klinik = (object) $found['row'];
        return view('klinik.edit', compact('klinik'));
    }

    public function update(Request $request, int $id)
    {
        $found = $this->findById($id);
        abort_if(!$found, 404);

        $validated = $request->validate($this->validationRules());

        $all = $this->getData();
        $all[$found['index']] = array_merge($found['row'], $validated);
        $this->saveData($all);

        return redirect()->route('klinik.index')->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $found = $this->findById($id);
        abort_if(!$found, 404);

        $all = $this->getData();
        unset($all[$found['index']]);
        $this->saveData($all);

        return redirect()->route('klinik.index')->with('success', 'Data berhasil dihapus.');
    }

    public function hitungUnitCost(int $id)
    {
        $found = $this->findById($id);
        abort_if(!$found, 404);

        $row = $found['row'];
        $unitCost = 0;

        if ($row['kunjungan_rajal'] > 0) {
            $unitCost = ($row['jml_peserta'] * 10000) / $row['kunjungan_rajal'];
        }

        // Simpan unit cost ke session (bukan database)
        $all = $this->getData();
        $all[$found['index']]['unit_cost'] = $unitCost;
        $this->saveData($all);

        return redirect()->route('klinik.index')
            ->with('success', 'Unit cost berhasil dihitung: Rp ' . number_format($unitCost, 2, ',', '.'));
    }
}
