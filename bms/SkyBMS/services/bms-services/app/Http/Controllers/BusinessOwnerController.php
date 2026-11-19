<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BusinessOwner;
use App\Models\Sms;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BusinessOwnerController extends Controller
{
    public function index()
    {
        $businessOwners = BusinessOwner::with('user')->get();
        return response()->json([
            'success' => true,
            'message' => 'Business owners retrieved successfully',
            'data' => $businessOwners,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string|max:255|unique:users',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255|unique:users',
            'email' => 'nullable|email|unique:users',
            'citizenship' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $password = $this->generateRandomPassword();
        $prefixedPhoneNumber = '+251' . $request->phone_number;

        $userData = [
            'full_name' => $request->full_name,
            'user_name' => $request->user_name,
            'password' => bcrypt($password),
            'unhashed_password' => $password,
            'phone_number' => $prefixedPhoneNumber,
        ];

        if ($request->has('email')) {
            $userData['email'] = $request->email;
        }

        $user = User::create($userData);
        $user->assignRole('user');

        $this->storePasswordInDatabase(
            $request->phone_number,
            $password,
            $request->user_name
        );
        $existingBusinessOwner = BusinessOwner::where(
            'user_id',
            $user->id
        )->first();
        if ($existingBusinessOwner) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'User already exists as a business owner',
                ],
                422
            );
        }

        $businessOwner = new BusinessOwner();
        $businessOwner->id = (string) Str::uuid();
        $businessOwner->user_id = $user->id;
        $businessOwner->citizenship = $request->citizenship;
        $businessOwner->save();

        return response()->json(
            [
                'success' => true,
                'message' => 'Business owner created successfully',
                'data' => $businessOwner,
            ],
            201
        );
    }

    private function generateRandomPassword()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $length = 6;
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $password;
    }

    private function storePasswordInDatabase(
        $phoneNumber,
        $password,
        $user_name
    ) {
        Sms::create([
            'phone_number' => $phoneNumber,
            'message' => "Hello, your username is $user_name and your password is $password for your SkyBMS account. Please do not share this message with others.",
            'status' => 'pending',
        ]);
    }

    public function show(BusinessOwner $businessOwner)
    {
        return response()->json([
            'success' => true,
            'message' => 'Business owner retrieved successfully',
            'data' => $businessOwner,
        ]);
    }

    public function update(Request $request, BusinessOwner $businessOwner)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'citizenship' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ],
                422
            );
        }

        $businessOwner->update($validator->validated());

        return response()->json(
            [
                'success' => true,
                'message' => 'Business owner updated successfully',
                'data' => $businessOwner,
            ],
            200
        );
    }

    public function destroy(BusinessOwner $businessOwner)
    {
        $businessOwner->delete();

        return response()->json(
            [
                'success' => true,
                'message' => 'Business owner deleted successfully',
            ],
            204
        );
    }
}
