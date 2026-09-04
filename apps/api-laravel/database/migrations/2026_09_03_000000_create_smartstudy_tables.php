<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('topics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('subject_id')->constrained('subjects');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('topic_id')->constrained('topics');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('difficulty')->default(1);
            $table->timestamps();
        });

        Schema::create('children', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('grade');
            $table->string('board')->nullable();
            $table->string('medium')->default('English');
            $table->timestamps();
        });

        Schema::create('exercises', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('skill_id')->constrained('skills');
            $table->text('question');
            $table->string('question_type');
            $table->unsignedTinyInteger('difficulty');
            $table->json('options');
            $table->string('correct_answer');
            $table->text('explanation');
            $table->timestamps();
        });

        Schema::create('attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children');
            $table->foreignUuid('exercise_id')->constrained('exercises');
            $table->string('answer');
            $table->boolean('correct');
            $table->unsignedInteger('time_taken_ms')->nullable();
            $table->timestamp('attempted_at')->useCurrent();
        });

        Schema::create('skill_mastery', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children');
            $table->foreignUuid('skill_id')->constrained('skills');
            $table->decimal('mastery_score', 5, 2)->default(0);
            $table->decimal('confidence', 5, 2)->default(0);
            $table->unsignedInteger('attempts')->default(0);
            $table->unsignedInteger('correct_attempts')->default(0);
            $table->unsignedInteger('consecutive_correct')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamp('next_review_at')->nullable();
            $table->unique(['child_id', 'skill_id']);
        });

        Schema::create('mistake_analysis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('attempt_id')->constrained('attempts');
            $table->string('mistake_type');
            $table->text('misconception')->nullable();
            $table->decimal('confidence', 4, 3)->default(0.5);
            $table->json('evidence');
        });

        Schema::create('teaching_interventions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children');
            $table->foreignUuid('skill_id')->constrained('skills');
            $table->text('misconception');
            $table->string('strategy_type');
            $table->json('content');
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });

        Schema::create('learning_materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('child_id')->constrained('children');
            $table->string('type');
            $table->string('title');
            $table->text('extracted_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_materials');
        Schema::dropIfExists('teaching_interventions');
        Schema::dropIfExists('mistake_analysis');
        Schema::dropIfExists('skill_mastery');
        Schema::dropIfExists('attempts');
        Schema::dropIfExists('exercises');
        Schema::dropIfExists('children');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('topics');
        Schema::dropIfExists('subjects');
    }
};
