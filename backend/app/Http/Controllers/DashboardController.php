<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = Cache::remember('stats', 3600, function () {
            return [
                'products'   => Product::count(),
                'categories' => Category::count(),
            ];
        });
        return response()->json($stats);
    }
}
