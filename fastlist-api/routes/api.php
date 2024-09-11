<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ShoppingListController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

// Login
Route::post('/login', function (Request $request) {
  $credentials = $request->only('email', 'password');

  // Verifica se as credenciais estão corretas
  if (!Auth::attempt($credentials)) {
      return response()->json(['message' => 'Unauthorized'], 401);
  }

  // Verifique se o usuário está autenticado
if (!Auth::check()) {
  Log::info('User is not authenticated');
  return response()->json(['message' => 'Unauthorized'], 401);
}

  // Obtém o usuário autenticado
  $user = Auth::user();

  // Verifica se o usuário foi corretamente autenticado
  if (!$user) {
      return response()->json(['message' => 'User not found'], 404);
  }

  // Gera o token de acesso
  $token = $user->createToken('mobile-app-token')->plainTextToken;

  Log::info('User Details:', ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]);


  // Retorna o token e as informações do usuário
  return response()->json([
      'token' => $token,
      'user' => [
          'id' => $user->id,  
          'name' => $user->name,
          'email' => $user->email
      ]
  ], 200);
});

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

Route::get('/shopping_lists', [ShoppingListController::class, 'index']);
// Route::post('/shopping_lists', [ShoppingListController::class, 'store']);
Route::get('/shopping_lists/{id}', [ShoppingListController::class, 'show']);
Route::put('/shopping_lists/{id}', [ShoppingListController::class, 'update']);
Route::delete('/shopping_lists/{id}', [ShoppingListController::class, 'destroy']);

Route::middleware('auth:sanctum')->post('/shopping_lists', function (Request $request) {
  return response()->json([
      'message' => 'Token is valid!',
      'user' => $request->user()
  ]);
});

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);