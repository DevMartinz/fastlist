<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public function shopping_lists(){
        return $this->belongsTo(ShoppingList::class);
}

    public function categories(){
        return $this->belongsToMany(Category::class, 'category_product');
}
}
