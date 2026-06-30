<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use App\Jobs\SendProductSavedEmail;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $fetch = function () use ($request) {
            return Product::with('category:id,name,slug')
                ->when($request->filled('name'), function ($query) use ($request) {
                    $query->where('name', 'like', '%' . $request->name . '%');
                })
                ->when($request->filled('category_id'), function ($query) use ($request) {
                    $query->where('category_id', $request->category_id);
                })
                ->when($request->filled('min_price'), function ($query) use ($request) {
                    $query->where('price', '>=', $request->min_price);
                })
                ->when($request->filled('max_price'), function ($query) use ($request) {
                    $query->where('price', '<=', $request->max_price);
                })
                ->select('id', 'name', 'slug', 'price', 'image_url', 'category_id')
                ->latest()
                ->paginate(9);
        };
        $products = $request->hasAny(['name', 'category_id', 'min_price', 'max_price', 'page'])
            ? $fetch()
            : Cache::remember('products.index', 3600, $fetch);

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Cache::remember('products.show.' . $slug, 3600, function () use ($slug) {
            return Product::with('category:id,name,slug')
                ->where('slug', $slug)
                ->firstOrFail();
        });

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:products,name',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
        ]);

        $imageUrl = $data['image_url'] ?? null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::disk('public')->url($path);
        }

        $product = Product::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'category_id' => $data['category_id'],
            'image_url' => $imageUrl,
        ]);

        SendProductSavedEmail::dispatch($product, 'created');

        return response()->json($product, 201);
    }

    public function edit(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:products,name,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'image' => 'nullable|image|max:2048',
        ]);

        $imageUrl = $data['image_url'] ?? $product->image_url;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::disk('public')->url($path);
        }

        $product->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'category_id' => $data['category_id'],
            'image_url' => $imageUrl,
        ]);

        SendProductSavedEmail::dispatch($product, 'updated');

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
