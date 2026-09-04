<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void { Schema::table('exercises', fn (Blueprint $table) => $table->string('template')->default('standard')->after('question_type')); }
    public function down(): void { Schema::table('exercises', fn (Blueprint $table) => $table->dropColumn('template')); }
};
