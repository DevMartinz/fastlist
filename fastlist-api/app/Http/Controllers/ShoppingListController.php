<?php

namespace App\Http\Controllers;

use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShoppingListController extends Controller
{
    public function index(Request $request)
    {
        // Obtém o usuário autenticado
        $user = $request->user();
    
        // Filtra as listas associadas ao user_id do usuário autenticado
        $shopping_lists = ShoppingList::where('user_id', $user->id)->get();
    
        return response()->json($shopping_lists);
    }

    public function store(Request $request)
    {

        \Log::info('Store method called', $request->all());
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        // Certifique-se de que o usuário está autenticado
        $user = $request->user(); // Aqui você obtém o usuário autenticado
    
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
    
        $shoppingList = ShoppingList::create([
            'name' => $request->name,
            'user_id' => $user->id,
        ]);
    
        return response()->json([
            'message' => 'Shopping list created successfully',
            'shoppingList' => $shoppingList
        ], 201);
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