<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Valida se a lista de compras existe
        $list = ShoppingList::findOrFail($listId);

        // Armazena a imagem e adiciona o caminho ao produto
        $data = $request->only(['name', 'value', 'quantity']);
        $data = $this->storeImage($request, $data);

        // Cria o produto e associa à lista de compras
        $product = $list->products()->create($data);

        return response()->json($product, 201);
    }

    private function storeImage(Request $request, array $data)
    {
        if ($request->hasFile('image')) {
            // Armazena a imagem e adiciona o caminho ao array de dados
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }
        return $data;
    }

    // Atualizar produto específico
    public function update(Request $request, $productId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'required|numeric',
            'quantity' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Encontra o produto
        $product = Product::findOrFail($productId);

        // Atualiza os dados e a imagem do produto
        $data = $request->only(['name', 'value', 'quantity']);
        $data = $this->updateImage($request, $data, $product);

        // Atualiza os dados do produto
        $product->update($data);

        return response()->json($product, 200);
    }

    private function updateImage(Request $request, array $data, Product $product)
    {
        if ($request->hasFile('image')) {
            // Remove a imagem anterior, se existir
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            // Armazena a nova imagem e atualiza o caminho
            $path = $request->file('image')->store('products', 'public');
            $data['image'] = $path;
        }
        return $data;
    }

    // Remover produto específico
    public function destroy($productId)
    {
        // Encontra o produto
        $product = Product::findOrFail($productId);

        // Remove a imagem associada, se existir
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        // Remove o produto
        $product->delete();

        return response()->json(['message' => 'Produto removido com sucesso'], 200);
    }
}
