<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'dueDate',
    ];

    protected $casts = [
        'dueDate' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}