<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'value',
        'quantity',
        'shopping_list_id', // Adicione isso para preencher o campo ao criar o produto
    ];

    public function shoppingList(){
        return $this->belongsTo(ShoppingList::class);
}

    public function categories(){
        return $this->belongsToMany(Category::class, 'category_product');
}
}
