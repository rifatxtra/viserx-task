<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'category_id',
        'image_url',
    ];

    public $timestamps = true;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
