<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeasesTable extends Migration
{
    public function up()
    {
        Schema::create('leases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('building_unit_id')->nullable();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('building_unit_id')->references('id')->on('building_units')->onDelete('set null');
            $table->string('lease_agreement_document')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('monthly_rent');
            $table->string('status');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('leases');
    }
}
