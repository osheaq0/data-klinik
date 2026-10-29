<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_klinik', function (Blueprint $table) {
            $table->id();
            $table->string('bulan');
            $table->integer('jml_peserta')->default(0);
            $table->integer('rujukan')->default(0);
            $table->integer('kunj_sakit')->default(0);
            $table->integer('kunj_sehat')->default(0);
            $table->integer('ranap_umum')->default(0);
            $table->decimal('hp_umum', 15, 2)->default(0);
            $table->integer('ranap_bpjs')->default(0);
            $table->decimal('hp_bpjs', 15, 2)->default(0);
            $table->integer('partus_umum')->default(0);
            $table->decimal('hp_partus_umum', 15, 2)->default(0);
            $table->integer('partus_bpjs')->default(0);
            $table->decimal('hp_partus_bpjs', 15, 2)->default(0);
            $table->integer('kunjungan_rajal')->default(0);
            $table->decimal('unit_cost', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_klinik');
    }
};
