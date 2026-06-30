<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category:id,name,slug')
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
            ->paginate(10);
        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::with('category:id,name,slug')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($product);
    }
}
