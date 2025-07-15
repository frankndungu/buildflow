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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('description');
            $table->decimal('amount', 15, 2);
            $table->string('category'); // e.g. material, labor, logistics
            $table->date('spent_at')->nullable(); // optional but useful
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->string('receipt_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
