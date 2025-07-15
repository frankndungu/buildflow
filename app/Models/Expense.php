<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'project_id',
        'description',
        'amount',
        'category',
        'spent_at',
        'uploaded_by',
        'receipt_path',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}

