<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ShoppingListController extends Controller
{
    public function index()
    {
        $shopping_lists = ShoppingList::all();
        return response()->json($shopping_lists);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        // Certifique-se de que o usuário está autenticado
        $user = $request->user(); // Aqui você obtém o usuário autenticado
    
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        // Criar uma nova lista de compras associada ao usuário autenticado
        $shoppingList = new ShoppingList();
        $shoppingList->name = $request->name;
        $shoppingList->user_id = $user->id; // Associar a lista ao usuário
        $shoppingList->save();
    
        return response()->json(['message' => 'Shopping list created successfully'], 201);
    }

    public function show($id)
    {
        $shopping_lists = ShoppingList::findOrFail($id);
        return response()->json($shopping_lists);
    }

    public function update(Request $request, $id)
    {
        $shopping_lists = ShoppingList::findOrFail($id);
        $shopping_lists->update($request->all());
        return response()->json(['message' => 'List updated successfully']);
    }

    public function destroy($id)
    {
        ShoppingList::findOrFail($id)->delete();
        return response()->json(['message' => 'List deleted successfully']);
    }
}