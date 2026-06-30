<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'products'   => Product::count(),
            'categories' => Category::count(),
        ];
        return response()->json($stats);
    }
}
