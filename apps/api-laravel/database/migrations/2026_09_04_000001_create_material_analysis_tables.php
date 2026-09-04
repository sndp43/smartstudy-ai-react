<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('material_id')->constrained('learning_materials');
            $table->text('question_text');
            $table->string('question_type');
            $table->foreignUuid('skill_id')->nullable()->constrained('skills');
            $table->unsignedTinyInteger('difficulty')->default(1);
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('school_patterns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children');
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->foreignUuid('skill_id')->nullable()->constrained('skills');
            $table->string('question_type');
            $table->unsignedInteger('frequency')->default(1);
            $table->json('difficulty_distribution')->nullable();
            $table->json('examples')->nullable();
            $table->timestamps();
            $table->unique(['child_id', 'skill_id', 'question_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('school_patterns');
        Schema::dropIfExists('material_questions');
    }
};
