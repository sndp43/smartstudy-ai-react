<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void { Schema::table('exercises', fn (Blueprint $table) => $table->text('image_question')->nullable()->after('image_url')); }
    public function down(): void { Schema::table('exercises', fn (Blueprint $table) => $table->dropColumn('image_question')); }
};
