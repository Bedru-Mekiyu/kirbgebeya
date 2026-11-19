<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('buildings', function (Blueprint $table) {
            $table->string('name');
            $table->string('address');
            $table->uuid('id')->primary();
            $table->string('created_by');
            $table->string('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->string('image')->nullable();
        });
    }

    public function down()
    {
        Schema::dropIfExists('buildings');
    }
};
