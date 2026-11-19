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
        Schema::create('businesses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('owner_id');
            $table->string('name');
            $table->foreign('owner_id')->references('id')->on('business_owners')->onDelete('cascade');
            $table->string('business_address');
            $table->string('business_phone_number');
            $table->string('business_email');
            $table->string('type_of_business');
            $table->integer('number_of_years_in_business');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
