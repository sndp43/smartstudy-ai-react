<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_chart_progress', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children')->cascadeOnDelete();
            $table->string('chart_slug', 60);
            $table->string('item_key', 80);
            $table->unsignedInteger('practice_count')->default(1);
            $table->timestamp('last_practiced_at')->useCurrent();
            $table->timestamps();

            $table->unique(['child_id', 'chart_slug', 'item_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('child_chart_progress');
    }
};
