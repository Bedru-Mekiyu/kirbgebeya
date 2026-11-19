<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\Sms;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Update the specified user profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'user_name' => 'required|string|max:255',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255',
            'email' => 'nullable|email',
        ]);

        try {
            $user = User::findOrFail($id);
            if (
                $request->has('new_password') &&
                !is_null($request->new_password)
            ) {
                if (
                    $request->has('current_password') &&
                    !is_null($request->current_password)
                ) {
                    $currentPassword = trim($request->current_password);
                    Log::info($request->current_password);
                    Log::info($request->new_password);

                    if (!Hash::check($currentPassword, $user->password)) {
                        return response()->json(
                            [
                                'error' => 'Current password is incorrect',
                            ],
                            400
                        );
                    }
                } else {
                    return response()->json(
                        [
                            'error' => 'Current password is required',
                        ],
                        400
                    );
                }

                $user->password = bcrypt($request->new_password);
                $user->unhashed_password = "";
                $user->save();
                return response()->json(
                    [
                        'message' => 'Password updated successfully',
                    ],
                    200
                );
            }

            $user->user_name = $request->user_name;
            $user->full_name = $request->full_name;
            $user->phone_number = $request->phone_number;
            $user->email = $request->email;
            $user->save();

            return response()->json(
                [
                    'message' => 'User updated successfully',
                ],
                200
            );
        } catch (ModelNotFoundException $e) {
            return response()->json(
                [
                    'error' => 'User not found',
                    'message' => 'No user exists with the provided ID.',
                ],
                404
            );
        }
    }
}
