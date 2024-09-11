<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id', // Adicione outros campos se necessário
    ];

    public function user(){
        return $this->belongsTo(User::class); 
}

    public function products(){
        return $this->hasMany(Product::class);
}
}
