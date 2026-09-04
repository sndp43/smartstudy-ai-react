<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_charts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('subject', 50);
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->string('chart_type', 50);
            $table->json('chart_data');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_charts');
    }
};
