<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    public function created(Product $product): void
    {
        $this->clearCache();
    }

    public function updated(Product $product): void
    {
        Cache::forget('products.show.' . $product->slug);
        if ($product->wasChanged('slug')) {
            Cache::forget('products.show.' . $product->getOriginal('slug'));
        }
        $this->clearCache();
    }

    public function deleted(Product $product): void
    {
        Cache::forget('products.show.' . $product->slug);
        $this->clearCache();
    }

    private function clearCache(): void
    {
        Cache::forget('products.index');
        Cache::forget('stats');
    }
}
