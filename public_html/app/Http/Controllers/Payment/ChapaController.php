<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CheckoutController;
use App\Models\CombinedOrder;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class ChapaController extends Controller
{
    public function pay(Request $request)
    {
        try {
            $combined_order_id = Session::get('combined_order_id');
            if (!$combined_order_id) {
                throw new \Exception('Combined order ID not found in session.');
            }
            
            $combined_order = CombinedOrder::findOrFail($combined_order_id);
            $user = $combined_order->user;
            if (!$user) {
                throw new \Exception('User not found for the combined order.');
            }

            $tx_ref = 'kirbgebeya-' . $combined_order->id . '-' . Str::uuid();
            $name_parts = explode(' ', $user->name, 2);
            $sanitized_order_code = preg_replace('/[^A-Za-z0-9 \-_.]/', '', $combined_order->code);

            $data = [
                'amount'        => (string)$combined_order->grand_total,
                'currency'      => 'ETB',
                'email'         => $user->email,
                'first_name'    => $name_parts[0],
                'last_name'     => isset($name_parts[1]) ? $name_parts[1] : 'User',
                'tx_ref'        => $tx_ref,
                'callback_url'  => route('chapa.callback'),
                'return_url'    => route('order_confirmed'),
                'customization' => [
                    'title'       => get_setting('site_name'),
                    // ***************************************************************
                    // ******************* START: THE FINAL FIX **********************
                    // The error was the colon ':' in "Payment for Order:".
                    // We are changing the description to a simpler, safer format that
                    // is guaranteed to pass Chapa's validation.
                    // ***************************************************************
                    'description' => 'Order ' . $sanitized_order_code
                    // ***************************************************************
                    // ******************** END: THE FINAL FIX ***********************
                    // ***************************************************************
                ]
            ];
            
            $secret_key = config('services.chapa.secret');
            if (empty($secret_key)) {
                throw new \Exception('Chapa secret key is not configured.');
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secret_key,
                'Content-Type'  => 'application/json'
            ])->post('https://api.chapa.co/v1/transaction/initialize', $data);

            if ($response->successful() && $response->json()['status'] == 'success') {
                foreach ($combined_order->orders as $order) {
                    $order->payment_details = json_encode(['tx_ref' => $tx_ref, 'payment_method' => 'chapa']);
                    $order->save();
                }
                return redirect($response->json()['data']['checkout_url']);
            }
            
            throw new \Exception('Chapa API request was not successful.');

        } catch (\Exception $e) {
            // No need to keep the full debug code anymore, but we can leave it for now.
            Log::error('CHAPA INITIATION FAILED', [
                'exception_message' => $e->getMessage(),
                'chapa_response_body' => isset($response) ? $response->body() : 'No Response Body',
                'data_sent_to_chapa' => $data ?? 'Data not prepared'
            ]);

            flash(translate('Sorry, the payment gateway is currently unavailable. Please try again later.'))->error();
            return redirect()->route('checkout.shipping_info');
        }
    }

    public function callback(Request $request)
    {
        //new addded
        Log::info('--- CHAPA CALLBACK RECEIVED ---', ['all_request_data' => $request->all()]);
        
        $tx_ref = $request->input('trx_ref');

        if (!$tx_ref) {
        Log::warning('Callback failed: No trx_ref found in the request body.');
        return response('Callback failed.', 200);
        }

        Log::info('Found trx_ref: ' . $tx_ref . '. Verifying with Chapa API...');

        try {
        // IMPORTANT: We still use 'tx_ref' when verifying with Chapa's API endpoint.
        // It seems they use different names in different places.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.chapa.secret')
            ])->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

            if ($response->successful() && $response->json()['data']['status'] == 'success') {
                Log::info('Chapa API Verification Successful. Finding order in database...');

                $order = null;
                $tx_parts = explode('-', $tx_ref);
                if (count($tx_parts) >= 3 && $tx_parts[0] === 'kirbgebeya' && is_numeric($tx_parts[1])) {
                    $combined_order = CombinedOrder::find((int)$tx_parts[1]);
                    if ($combined_order) {
                        $order = $combined_order->orders()->first();
                    }
                }
                if (!$order) {
                    $order = Order::where('payment_details', 'like', '%"tx_ref":"' . $tx_ref . '"%')->first();
                }
            
                if ($order) {
                    Log::info('Order found! ID: ' . $order->id . '. Current payment status: ' . $order->payment_status);
                    if ($order->payment_status != 'paid') {
                        Log::info('Updating order status to paid...');
                        (new CheckoutController)->checkout_done($order->combined_order_id, json_encode($response->json()));
                        Log::info('--- ORDER STATUS UPDATED SUCCESSFULLY ---');
                    } else {
                        Log::info('Order status was already paid. No action taken.');
                    }
                } else {
                    Log::error('CRITICAL ERROR: Could not find an order matching the verified tx_ref!', ['tx_ref' => $tx_ref]);
                }
            } else {
                Log::warning('Chapa API Verification FAILED.', ['response' => $response->body()]);
            }
        } catch (\Exception $e) {
        Log::error('CRITICAL EXCEPTION IN CALLBACK', ['message' => $e->getMessage()]);
        }
    
        return response('Callback processed.', 200);
    }
}