<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    public function show()
    {
        return response()->json([
            'admin_email'         => Setting::get('admin_email'),
            'default_admin_email' => config('mail.admin_address'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'admin_email' => 'nullable|email',
        ]);

        Setting::set('admin_email', $data['admin_email'] ?? null);

        return response()->json([
            'admin_email'         => Setting::get('admin_email'),
            'default_admin_email' => config('mail.admin_address'),
        ]);
    }
}
