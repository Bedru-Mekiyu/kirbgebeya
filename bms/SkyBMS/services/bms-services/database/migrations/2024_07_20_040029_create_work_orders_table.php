<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('contractor_id');
            $table
                ->foreign('contractor_id')
                ->references('id')
                ->on('maintenance_contractors')
                ->onDelete('cascade');
            $table->uuid('request_id');
            $table
                ->foreign('request_id')
                ->references('id')
                ->on('maintenance_requests')
                ->onDelete('cascade');
            $table->text('work_description')->nullable();
            $table->date('scheduled_date');
            $table->date('completion_date')->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table
                ->enum('status', ['in_progress', 'completed', 'canceled'])
                ->default('in_progress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_orders');
    }
};
