<?php

namespace App\Observers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryObserver
{
    public function created(Category $category): void
    {
        $this->clearCache();
    }

    public function updated(Category $category): void
    {

        $this->clearProductDetails($category);
        $this->clearCache();
    }

    public function deleting(Category $category): void
    {
        $this->clearProductDetails($category);
    }

    public function deleted(Category $category): void
    {
        $this->clearCache();
    }

    private function clearProductDetails(Category $category): void
    {
        foreach ($category->products()->pluck('slug') as $slug) {
            Cache::forget('products.show.' . $slug);
        }
    }

    private function clearCache(): void
    {
        Cache::forget('categories.index');
        Cache::forget('products.index');
        Cache::forget('stats');
    }
}
