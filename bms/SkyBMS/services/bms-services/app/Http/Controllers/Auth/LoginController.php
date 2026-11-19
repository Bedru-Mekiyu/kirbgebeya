<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('user_name', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if ($user->roles->isEmpty()) {
                return response()->json(
                    ['message' => 'User has no roles assigned'],
                    403
                );
            }

            $roles = $user->roles->pluck('name');

            return response()->json(
                [
                    'message' => 'Authenticated',
                    'user' => $user,
                    'roles' => $roles,
                ],
                200
            );
        }

        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out'], 200);
    }
}
