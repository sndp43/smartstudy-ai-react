<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->string('username')->nullable()->after('name');
        });

        foreach (DB::table('children')->whereNull('username')->get() as $child) {
            $base = Str::of($child->name)->lower()->replaceMatches('/[^a-z0-9]+/', '_')->trim('_')->value() ?: 'child';
            $username = $base;
            $counter = 1;
            while (DB::table('children')->where('username', $username)->exists()) {
                $username = $base . '_' . $counter++;
            }
            DB::table('children')->where('id', $child->id)->update(['username' => $username]);
        }

        Schema::table('children', function (Blueprint $table) {
            $table->string('username')->nullable(false)->change();
            $table->unique('username');
        });
    }

    public function down(): void
    {
        Schema::table('children', function (Blueprint $table) {
            $table->dropUnique(['username']);
            $table->dropColumn('username');
        });
    }
};
