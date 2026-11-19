<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingUnitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('building_units', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('building_id');
            $table->string('floor_no');
            $table->string('unit_number');
            $table->string('image')->nullable();
            $table->string('room_type')->nullable();
            $table->float('width')->nullable();
            $table->float('length')->nullable();
            $table->float('area_in_sqm')->nullable();
            $table->float('price_per_meter_sq')->nullable();
            $table->float('estimate_price')->nullable();
            $table->string('status');
            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('building_id')->references('id')->on('buildings');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('building_units');
    }
}
