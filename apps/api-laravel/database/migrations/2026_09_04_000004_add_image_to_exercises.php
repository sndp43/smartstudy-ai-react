<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void { Schema::table('exercises', fn (Blueprint $table) => $table->text('image_url')->nullable()->after('question')); }
    public function down(): void { Schema::table('exercises', fn (Blueprint $table) => $table->dropColumn('image_url')); }
};
