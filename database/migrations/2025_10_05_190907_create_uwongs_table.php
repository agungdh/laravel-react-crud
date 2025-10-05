<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('uwongs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('name');
            $table->boolean('gender');
            $table->date('birthday');
            $table->string('phone');
            $table->text('address');
            $table->timestamps();
        });

        DB::statement('CREATE INDEX uwongs_uuid_hash_index ON uwongs USING hash (uuid);');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uwongs');
    }
};
