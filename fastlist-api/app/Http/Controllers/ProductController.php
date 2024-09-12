<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Listar produtos de uma lista específica
    public function indexForList($listId)
    {
        // Valida se a lista de compras existe
        $list = ShoppingList::findOrFail($listId);

        // Assume que há um relacionamento entre ShoppingList e Product
        $products = $list->products; // Obtém produtos associados à lista

        return response()->json($products);
    }

    // Adicionar produto a uma lista específica
    public function storeForList(Request $request, $listId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        // Valida se a lista de compras existe
        $list = ShoppingList::findOrFail($listId);

        // Cria o produto e associa à lista de compras
        $product = $list->products()->create([
            'name' => $request->name,
            'value' => $request->value,
            'quantity' => $request->quantity,
            'shopping_list_id' => $listId,
        ]);

        return response()->json($product, 201);
    }

    // Atualizar produto específico
    public function update(Request $request, $productId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        // Encontra o produto
        $product = Product::findOrFail($productId);

        // Atualiza os dados do produto
        $product->update([
            'name' => $request->name,
            'value' => $request->value,
            'quantity' => $request->quantity,
        ]);

        return response()->json($product, 200);
    }

    // Remover produto específico
    public function destroy($productId)
    {
        // Encontra o produto
        $product = Product::findOrFail($productId);

        // Remove o produto
        $product->delete();

        return response()->json(['message' => 'Produto removido com sucesso'], 200);
    }
}
