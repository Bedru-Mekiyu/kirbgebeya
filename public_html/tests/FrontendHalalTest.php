<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Http\Request;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SearchController;

echo "=========================================================\n";
echo "   KIRB GEBEYA: HALAL PRODUCTS FRONTEND & UX TEST SUITE  \n";
echo "=========================================================\n\n";

$pass = 0;
$fail = 0;

function report($name, $ok, $info = '') {
    global $pass, $fail;
    if ($ok) {
        $pass++;
        echo " [PASS] $name\n";
        if ($info) echo "        $info\n";
    } else {
        $fail++;
        echo " [FAIL] $name\n";
        if ($info) echo "        $info\n";
    }
}

// 1. NAVIGATION & MENU
echo "--- 1. NAVIGATION INTEGRATION ---\n";
$lvlZero = get_level_zero_categories();
$firstCategory = $lvlZero->first();
report("Halal Products is #1 in Level-0 Category Navigation", $firstCategory?->slug === 'halal-products', "First category: {$firstCategory?->name} (order_level: {$firstCategory?->order_level})");

// Test AJAX subcategories call
$homeCtrl = new HomeController();
$navReq = Request::create('/category/nav-element-list', 'POST', ['id' => $firstCategory->id]);
$navView = $homeCtrl->get_category_items($navReq)->render();
$hasAllSubs = str_contains($navView, 'halal-meat-poultry') &&
              str_contains($navView, 'halal-groceries-spices') &&
              str_contains($navView, 'halal-dairy-cheese') &&
              str_contains($navView, 'halal-sweets-dates') &&
              str_contains($navView, 'halal-personal-care') &&
              str_contains($navView, 'islamic-lifestyle-goods');
report("Mega-Menu AJAX renders all 6 Halal subcategories", $hasAllSubs);

// 2. HOMEPAGE FEATURED CATEGORIES
echo "\n--- 2. HOMEPAGE INTEGRATION ---\n";
$featuredCats = Category::with('bannerImage')->where('featured', 1)->where('level', 0)->orderBy('order_level', 'desc')->get();
$firstFeatured = $featuredCats->first();
report("Halal Products is #1 Featured Category on Homepage", $firstFeatured?->slug === 'halal-products', "Featured #1: {$firstFeatured?->name}");

// 3. CATEGORY LISTING & SUBCATEGORY PILLS
echo "\n--- 3. CATEGORY LISTING & FILTERING ---\n";
$searchCtrl = new SearchController();
$catReq = Request::create('/category/halal-products', 'GET');
$catView = $searchCtrl->listingByCategory($catReq, 'halal-products')->render();
report("Parent Category page renders with 'Halal Products' title", str_contains($catView, 'Halal Products'));
report("Parent Category page displays Subcategory pill bar", str_contains($catView, 'btn-soft-primary') && str_contains($catView, 'halal-meat-poultry'));
report("Parent Category page contains Halal products in catalog grid", str_contains($catView, 'Fresh Halal Beef Prime Cuts') && str_contains($catView, 'Medina Ajwa Premium Dates'));

// Subcategory direct listing
$subReq = Request::create('/category/halal-meat-poultry', 'GET');
$subView = $searchCtrl->listingByCategory($subReq, 'halal-meat-poultry')->render();
report("Subcategory page renders specifically with Meat & Poultry items", str_contains($subView, 'Fresh Halal Beef') && str_contains($subView, 'Organic Halal Whole Chicken'));

// 4. SEARCH KEYWORD
echo "\n--- 4. SEARCH FUNCTIONALITY ---\n";
$kwReq = Request::create('/search', 'GET', ['keyword' => 'halal']);
$kwView = $searchCtrl->index($kwReq)->render();
report("Keyword search for 'halal' yields Halal product results", str_contains($kwView, 'Fresh Halal Beef Prime Cuts') || str_contains($kwView, 'Medina Ajwa'));

// 5. PRODUCT DETAILS & BADGING
echo "\n--- 5. PRODUCT DETAIL & BRAND IDENTIFICATION ---\n";
$beefProduct = Product::where('slug', 'fresh-halal-beef-prime-cuts-1kg')->first();
$detailReq = Request::create('/product/' . $beefProduct->slug, 'GET');
$detailView = $homeCtrl->product($detailReq, $beefProduct->slug)->render();
report("Product details view renders product title", str_contains($detailView, 'Fresh Halal Beef Prime Cuts (1kg)'));
report("Product details view features 100% Halal Certified badge", str_contains($detailView, '100% Halal Certified'));
report("Product details view displays accurate price in ETB", str_contains($detailView, '950'));

// 6. ADD TO CART FUNCTIONALITY
echo "\n--- 6. SHOPPING CART FUNCTIONALITY ---\n";
$cartCtrl = new CartController();
$sessionTempId = 'test_halal_' . bin2hex(random_bytes(4));
session()->put('temp_user_id', $sessionTempId);

$cartReq = Request::create('/cart/addtocart', 'POST', [
    'id' => $beefProduct->id,
    'quantity' => 2
]);
$cartReq->setLaravelSession(session());

$cartResult = $cartCtrl->addToCart($cartReq);
report("Add to Cart returns success status", isset($cartResult['status']) && $cartResult['status'] == 1);

$cartRecord = Cart::where('temp_user_id', $sessionTempId)->where('product_id', $beefProduct->id)->first();
report("Cart item persists in database with correct quantity (2)", $cartRecord !== null && $cartRecord->quantity == 2);
report("Cart item price is accurate (950.00 x 2 = 1,900.00)", $cartRecord !== null && ($cartRecord->price * $cartRecord->quantity) == 1900.00);

// Cleanup test cart item
if ($cartRecord) {
    $cartRecord->delete();
}

echo "\n=========================================================\n";
echo " FRONTEND TEST SUMMARY: $pass PASSED, $fail FAILED\n";
echo "=========================================================\n";

if ($fail === 0) {
    exit(0);
} else {
    exit(1);
}
