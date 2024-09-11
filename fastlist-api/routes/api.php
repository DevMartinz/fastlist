<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Auth\LoginController;

// Login
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
  $request->user()->currentAccessToken()->delete();
  return response()->json(['message' => 'Logged out'], 200);
});

Route::post('/register', function (Request $request) {
  $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|confirmed',
  ]);

  $user = \App\Models\User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => bcrypt($request->password),
  ]);

  return response()->json(['message' => 'User registered successfully'], 201);
});

// Route::get('/users/{id}', [UserController::class, 'show']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
  return $request->user();
});

Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/shopping_lists', [ShoppingListController::class, 'index']);
Route::middleware('auth:sanctum')->post('/shopping_lists', [ShoppingListController::class, 'store']);

// Route::post('/shopping_lists', [ShoppingListController::class, 'store']);
Route::get('/shopping_lists/{id}', [ShoppingListController::class, 'show']);
Route::put('/shopping_lists/{id}', [ShoppingListController::class, 'update']);
Route::delete('/shopping_lists/{id}', [ShoppingListController::class, 'destroy']);

// Listar produtos de uma lista específica
Route::middleware('auth:sanctum')->get('/shopping-lists/{listId}/products', [ProductController::class, 'indexForList']);

// Adicionar produto a uma lista específica
Route::middleware('auth:sanctum')->post('/shopping-lists/{listId}/products', [ProductController::class, 'storeForList']);

Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);