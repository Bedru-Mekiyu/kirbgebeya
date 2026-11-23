<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Address;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\Order;
use App\Models\CombinedOrder;
use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

echo "=== TESTING CUSTOMER ORDER CHECKOUT FLOW ===\n";

// 1. Authenticate as Customer
$customer = User::where('user_type', 'customer')->first();
if (!$customer) {
    die("Error: No customer account found.\n");
}
Auth::login($customer);
echo "[1] Logged in as customer: {$customer->name} ({$customer->email})\n";

// 2. Ensure customer has a valid address
$country = Country::first();
$countryId = $country ? $country->id : 1;
$state = State::first();
$stateId = $state ? $state->id : 1;
$city = City::first();
$cityId = $city ? $city->id : 1;

$address = Address::where('user_id', $customer->id)->first();
if (!$address) {
    $address = new Address();
    $address->user_id = $customer->id;
    $address->address = 'Bole Subcity, House 421';
    $address->country_id = $countryId;
    $address->state_id = $stateId;
    $address->city_id = $cityId;
    $address->postal_code = '1000';
    $address->phone = '+251911223344';
    $address->set_default = 1;
    $address->save();
    echo "[2] Created new address for customer [ID: {$address->id}].\n";
} else {
    echo "[2] Existing address found [ID: {$address->id}]: {$address->address}, Phone: {$address->phone}\n";
}

// 3. Select a product
$product = Product::where('published', 1)->where('current_stock', '>', 5)->orderBy('id', 'desc')->first();
if (!$product) {
    die("Error: No available product found.\n");
}
echo "[3] Selected product: [ID: {$product->id}] '{$product->name}' - Price: {$product->unit_price} ETB (Stock: {$product->current_stock})\n";

$initialStock = $product->current_stock;

// 4. Add to Cart
Cart::where('user_id', $customer->id)->delete(); // clean previous cart if any

$cart = new Cart();
$cart->user_id = $customer->id;
$cart->product_id = $product->id;
$cart->address_id = $address->id;
$cart->variation = '';
$cart->price = $product->unit_price;
$cart->tax = 0;
$cart->shipping_cost = 0;
$cart->shipping_type = 'home_delivery';
$cart->discount = 0;
$cart->quantity = 1;
$cart->save();
echo "[4] Product added to cart [Cart ID: {$cart->id}].\n";

// 5. Checkout with Cash on Delivery
$session = app('session.store');
$session->start();

$request = Request::create('/checkout', 'POST', [
    'payment_option' => 'cash_on_delivery',
    'additional_info' => 'Please call upon arrival at Bole Road.',
]);
$request->setLaravelSession($session);

$checkoutController = new CheckoutController();

try {
    $response = $checkoutController->checkout($request);
    echo "[5] Checkout executed successfully!\n";
    
    // Check combined order
    $combinedOrderId = $session->get('combined_order_id');
    echo "    Combined Order ID: {$combinedOrderId}\n";

    $order = Order::where('combined_order_id', $combinedOrderId)->first();
    if ($order) {
        echo "[6] Order Confirmed!\n";
        echo "    Order Code: {$order->code}\n";
        echo "    Grand Total: " . number_format($order->grand_total, 2) . " ETB\n";
        echo "    Payment Status: {$order->payment_status}\n";
        echo "    Delivery Status: {$order->delivery_status}\n";
        echo "    Shipping Address: {$order->shipping_address}\n";
        echo "    Additional Info: {$order->additional_info}\n";

        // Check stock deduction
        $product->refresh();
        echo "[7] Stock updated: {$initialStock} -> {$product->current_stock}\n";

        // Test rendering order_confirmed view
        $session->put('combined_order_id', $combinedOrderId);
        $confirmedView = $checkoutController->order_confirmed();
        $html = $confirmedView->render();
        echo "[8] Order Confirmation View successfully rendered! (HTML length: " . strlen($html) . " bytes)\n";

        echo "\nSUCCESS: Full customer purchase flow completed without errors!\n";
    } else {
        echo "Error: Order record not found.\n";
    }

} catch (\Throwable $e) {
    echo "ERROR during checkout: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
