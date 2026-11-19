<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use App\Mail\UserRegistered;
use App\Models\Sms;
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::with('roles')->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::findOrFail($id);
    }

    /**
     * Get the count of users.
     *
     * @return \Illuminate\Http\Response
     */
    public function count()
    {
        try {
            $count = User::whereHas('roles', function ($query) {
                $query->where('name', 'user'); // Replace 'name' with your actual column for role name
            })->count();
            return response()->json(
                [
                    'message' => "Total number of users",
                    'count' => $count,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to fetch user count',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_name' => 'required|string|max:255|unique:users',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:255|unique:users',
            'email' => 'nullable|email|unique:users',
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

        User::create($userData)->assignRole('user');
        // $this->sendPassword(
        //     $request->phone_number,
        //     $password,
        //     $request->user_name
        // );
        // $this->sendPasswordToApi($request->phone_number, $password);

        $this->storePasswordInDatabase(
            $request->phone_number,
            $password,
            $request->user_name
        );

        return response()->json(
            [
                'message' => 'User registered successfully',
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

    // private function sendPasswordToApi($phoneNumber, $password)
    // {
    //     $response = Http::post('https://sms.yegara.com/api3/send', [
    //         'id' => '1',
    //         'domain' => 'localhost',
    //         'to' => $phoneNumber,
    //         'otp' => $password,
    //     ]);

    //     if ($response->failed()) {
    //         return response()->json(
    //             [
    //                 'message' => 'Failed to send SMS via API',
    //             ],
    //             500
    //         );
    //     }
    // }

    private function sendPassword($phoneNumber, $password, $user_name)
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $twilioNumber = config('services.twilio.phone_number');

        $client = new Client($sid, $token);

        $message = "Hello, your username is $user_name and your password is $password for your SkyBMS account. Please do not share this message with others.";
        $client->messages->create($phoneNumber, [
            'from' => $twilioNumber,
            'body' => $message,
        ]);
    }

    /**
     * Update the specified resource in storage.
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

        $user = User::findOrFail($id);
        $user->user_name = $request->user_name;
        $user->full_name = $request->full_name;

        if ($request->has('email')) {
            $user->email = $request->email;
        }
        $user->save();

        return response()->json(
            [
                'message' => 'User updated successfully',
            ],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(
                [
                    'error' => 'User not found',
                    'message' => 'No user exists with the provided ID.',
                ],
                404
            );
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json(
                [
                    'error' => 'An error occurred',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
