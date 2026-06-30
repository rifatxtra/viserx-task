<?php

namespace App\Jobs;

use App\Mail\ProductSaved;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendProductSavedEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Product $product, public string $action)
    {
    }

    public function handle(): void
    {
        $recipient = Setting::get('admin_email') ?: config('mail.admin_address');

        Mail::to($recipient)->send(
            new ProductSaved($this->product, $this->action)
        );
    }
}
