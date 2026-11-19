<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('maintenance_contractors', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('company_name')->unique();
            $table->string('contact_name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_contractors');
    }
};
