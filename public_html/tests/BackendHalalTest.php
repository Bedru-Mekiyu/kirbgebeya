<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductStock;
use App\Models\Upload;
use App\Utility\CategoryUtility;
use Illuminate\Support\Str;

echo "=========================================================\n";
echo "   KIRB GEBEYA: HALAL PRODUCTS BACKEND INTEGRATION TEST  \n";
echo "=========================================================\n\n";

$passCount = 0;
$failCount = 0;

function assertTest($name, $condition, $details = '') {
    global $passCount, $failCount;
    if ($condition) {
        $passCount++;
        echo " [PASS] $name\n";
        if ($details) echo "        $details\n";
    } else {
        $failCount++;
        echo " [FAIL] $name\n";
        if ($details) echo "        $details\n";
    }
}

// -----------------------------------------------------------------------------
// TEST 1: CATEGORY CREATION & HIERARCHY RETRIEVAL
// -----------------------------------------------------------------------------
echo "--- 1. CATEGORY & HIERARCHY RETRIEVAL TEST ---\n";
$rootCat = Category::with('childrenCategories')->where('slug', 'halal-products')->first();
assertTest("Root Category 'Halal Products' exists", $rootCat !== null, "ID: {$rootCat?->id}, Level: {$rootCat?->level}, Parent ID: {$rootCat?->parent_id}");
assertTest("Root Category is featured and active", $rootCat?->featured == 1 && $rootCat?->parent_id == 0);

$children = $rootCat ? $rootCat->childrenCategories : collect();
assertTest("Root Category has exactly 6 subcategories", $children->count() === 6, "Found: {$children->count()} subcategories");

$subSlugs = [
    'halal-meat-poultry',
    'halal-groceries-spices',
    'halal-dairy-cheese',
    'halal-sweets-dates',
    'halal-personal-care',
    'islamic-lifestyle-goods'
];

foreach ($subSlugs as $slug) {
    $sub = Category::where('slug', $slug)->first();
    assertTest("Subcategory '$slug' exists with correct parent", $sub !== null && $sub->parent_id == $rootCat->id && $sub->level == 1);
}

$childIds = CategoryUtility::children_ids($rootCat->id);
assertTest("CategoryUtility::children_ids returns all 6 child IDs", count($childIds) === 6, "Child IDs: " . implode(', ', $childIds));


// -----------------------------------------------------------------------------
// TEST 2: PRODUCT ASSIGNMENT & SEEDING
// -----------------------------------------------------------------------------
echo "\n--- 2. PRODUCT ASSIGNMENT & INVENTORY SEEDING ---\n";

$productsData = [
    [
        'name' => 'Fresh Halal Beef Prime Cuts (1kg)',
        'slug' => 'fresh-halal-beef-prime-cuts-1kg',
        'sub_slug' => 'halal-meat-poultry',
        'sku' => 'HL-MEAT-001',
        'price' => 950.00,
        'stock' => 50,
        'tags' => 'halal, beef, meat, fresh, certified',
        'image_url' => 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
        'description' => '100% Halal certified fresh beef prime cuts, hand-slaughtered in accordance with Islamic principles.'
    ],
    [
        'name' => 'Organic Halal Whole Chicken (1.5kg)',
        'slug' => 'organic-halal-whole-chicken-15kg',
        'sub_slug' => 'halal-meat-poultry',
        'sku' => 'HL-MEAT-002',
        'price' => 650.00,
        'stock' => 40,
        'tags' => 'halal, chicken, poultry, fresh, organic',
        'image_url' => 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
        'description' => 'Locally raised farm fresh organic chicken, certified Halal.'
    ],
    [
        'name' => 'Premium Basmati Rice (5kg)',
        'slug' => 'premium-basmati-rice-5kg',
        'sub_slug' => 'halal-groceries-spices',
        'sku' => 'HL-GROC-001',
        'price' => 1200.00,
        'stock' => 35,
        'tags' => 'halal, rice, grains, grocery, basmati',
        'image_url' => 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        'description' => 'Aromatic long-grain aged Basmati rice.'
    ],
    [
        'name' => 'Pure Halal Cold-Pressed Olive Oil (1L)',
        'slug' => 'pure-halal-cold-pressed-olive-oil-1l',
        'sub_slug' => 'halal-groceries-spices',
        'sku' => 'HL-GROC-002',
        'price' => 850.00,
        'stock' => 60,
        'tags' => 'halal, olive oil, cooking oil, organic',
        'image_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        'description' => 'Extra virgin cold-pressed olive oil, 100% pure.'
    ],
    [
        'name' => 'Artisanal Halal Gouda Cheese (500g)',
        'slug' => 'artisanal-halal-gouda-cheese-500g',
        'sub_slug' => 'halal-dairy-cheese',
        'sku' => 'HL-DAIRY-001',
        'price' => 550.00,
        'stock' => 30,
        'tags' => 'halal, cheese, dairy, microbial-rennet, gouda',
        'image_url' => 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80',
        'description' => 'Authentic Dutch Gouda cheese crafted with certified microbial rennet.'
    ],
    [
        'name' => 'Medina Ajwa Premium Dates (500g)',
        'slug' => 'medina-ajwa-premium-dates-500g',
        'sub_slug' => 'halal-sweets-dates',
        'sku' => 'HL-SWT-001',
        'price' => 750.00,
        'stock' => 80,
        'tags' => 'halal, dates, ajwa, sweets, sunnah, organic',
        'image_url' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        'description' => 'Authentic Ajwa dates imported directly from Medina, soft and naturally sweet.'
    ],
    [
        'name' => 'Turkish Pistachio Baklava Box (750g)',
        'slug' => 'turkish-pistachio-baklava-box-750g',
        'sub_slug' => 'halal-sweets-dates',
        'sku' => 'HL-SWT-002',
        'price' => 900.00,
        'stock' => 25,
        'tags' => 'halal, baklava, sweets, dessert, pastry',
        'image_url' => 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
        'description' => 'Handcrafted flaky pastry with premium Antep pistachios and pure sugar cane syrup.'
    ],
    [
        'name' => 'Alcohol-Free Arabian Oud Perfume Oil (12ml)',
        'slug' => 'alcohol-free-arabian-oud-perfume-oil-12ml',
        'sub_slug' => 'halal-personal-care',
        'sku' => 'HL-PC-001',
        'price' => 1100.00,
        'stock' => 45,
        'tags' => 'halal, oud, perfume, alcohol-free, fragrance',
        'image_url' => 'https://images.unsplash.com/photo-1608248597359-597551062f6b?w=600&auto=format&fit=crop&q=80',
        'description' => 'Concentrated pure oud attar, completely alcohol-free and long-lasting.'
    ],
    [
        'name' => 'Handwoven Velvet Prayer Rug / Mat',
        'slug' => 'handwoven-velvet-prayer-rug-mat',
        'sub_slug' => 'islamic-lifestyle-goods',
        'sku' => 'HL-LIFE-001',
        'price' => 800.00,
        'stock' => 50,
        'tags' => 'prayer mat, prayer rug, lifestyle, islamic, velvet',
        'image_url' => 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&auto=format&fit=crop&q=80',
        'description' => 'Premium padded velvet prayer mat with classic arch motif and tassel edges.'
    ]
];

$seededProducts = [];

foreach ($productsData as $pData) {
    $subCategory = Category::where('slug', $pData['sub_slug'])->first();
    if (!$subCategory) continue;

    // Create / fetch upload
    $uploadName = 'prod_' . Str::slug($pData['slug']);
    $upload = Upload::where('file_original_name', $uploadName)->first();
    if (!$upload) {
        $upload = new Upload();
        $upload->file_original_name = $uploadName;
    }
    $upload->file_name = 'uploads/all/' . $uploadName . '.jpg';
    $upload->user_id = 9;
    $upload->file_size = 95000;
    $upload->extension = 'jpg';
    $upload->type = 'image';
    $upload->external_link = $pData['image_url'];
    $upload->save();

    // Create / fetch product
    $product = Product::where('slug', $pData['slug'])->first();
    if (!$product) {
        $product = new Product();
        $product->slug = $pData['slug'];
    }
    $product->name = $pData['name'];
    $product->added_by = 'admin';
    $product->user_id = 9;
    $product->category_id = $subCategory->id;
    $product->photos = (string)$upload->id;
    $product->thumbnail_img = (string)$upload->id;
    $product->unit_price = $pData['price'];
    $product->purchase_price = $pData['price'] * 0.8;
    $product->unit = 'piece';
    $product->current_stock = $pData['stock'];
    $product->published = 1;
    $product->approved = 1;
    $product->tags = $pData['tags'];
    $product->description = $pData['description'];
    $product->tax = 0;
    $product->tax_type = 'amount';
    $product->discount = 0;
    $product->discount_type = 'amount';
    $product->num_of_sale = 0;
    $product->rating = 5.0;
    $product->save();

    // Ensure product_categories pivot has both subcategory and parent category
    $pcSub = ProductCategory::where('product_id', $product->id)->where('category_id', $subCategory->id)->first();
    if (!$pcSub) {
        $pcSub = new ProductCategory();
        $pcSub->product_id = $product->id;
        $pcSub->category_id = $subCategory->id;
        $pcSub->save();
    }

    $pcRoot = ProductCategory::where('product_id', $product->id)->where('category_id', $rootCat->id)->first();
    if (!$pcRoot) {
        $pcRoot = new ProductCategory();
        $pcRoot->product_id = $product->id;
        $pcRoot->category_id = $rootCat->id;
        $pcRoot->save();
    }

    // Product stock record
    $stock = ProductStock::where('product_id', $product->id)->first();
    if (!$stock) {
        $stock = new ProductStock();
        $stock->product_id = $product->id;
    }
    $stock->variant = '';
    $stock->sku = $pData['sku'];
    $stock->price = $pData['price'];
    $stock->qty = $pData['stock'];
    $stock->image = null;
    $stock->save();

    $seededProducts[] = $product;
}

assertTest("All 9 Halal products successfully seeded", count($seededProducts) === 9, "Seeded: " . count($seededProducts) . " products");


// -----------------------------------------------------------------------------
// TEST 3: CRUD, RETRIEVAL & RELATIONSHIPS
// -----------------------------------------------------------------------------
echo "\n--- 3. CRUD & MODEL RELATIONSHIP OPERATIONS ---\n";

// Test retrieving by slug
$testProduct = Product::where('slug', 'fresh-halal-beef-prime-cuts-1kg')->first();
assertTest("Product retrieval by slug", $testProduct !== null && $testProduct->current_stock == 50);

// Test subcategory products relationship
$meatCategory = Category::where('slug', 'halal-meat-poultry')->first();
$meatProducts = $meatCategory->products;
assertTest("Subcategory -> products relationship works", $meatProducts->count() >= 2, "Found: {$meatProducts->count()} products in Halal Meat");

// Test parent category aggregation query (using CategoryUtility::children_ids)
$allHalalCategoryIds = array_merge([$rootCat->id], $childIds);
$aggregateCount = Product::whereIn('category_id', $allHalalCategoryIds)->count();
assertTest("Parent Halal category aggregate query finds all products", $aggregateCount >= 9, "Aggregated count: $aggregateCount");

// Test product update (CRUD Update)
$testProduct->current_stock = 55;
$testProduct->save();
$updatedProduct = Product::find($testProduct->id);
assertTest("Product update operation (stock change)", $updatedProduct->current_stock == 55);
// Restore stock
$testProduct->current_stock = 50;
$testProduct->save();


// -----------------------------------------------------------------------------
// TEST 4: REGRESSION CHECK ON EXISTING CATEGORIES & PRODUCTS
// -----------------------------------------------------------------------------
echo "\n--- 4. REGRESSION CHECKS ---\n";

$otherCategories = Category::where('parent_id', 0)->where('slug', '!=', 'halal-products')->count();
assertTest("Existing top-level categories are preserved", $otherCategories >= 12, "Count: $otherCategories");

$totalProducts = Product::count();
assertTest("Catalog contains original + new products", $totalProducts >= 36, "Total catalog products: $totalProducts");

// Verify tags search
$taggedCount = Product::where('published', 1)->where('tags', 'like', '%halal%')->count();
assertTest("Search index tags query for 'halal' returns seeded products", $taggedCount >= 8, "Products matching 'halal' tag: $taggedCount");

// -----------------------------------------------------------------------------
// TEST 5: API CONTROLLER CONTRACT VERIFICATION
// -----------------------------------------------------------------------------
echo "\n--- 5. API V2 CONTRACT VERIFICATION ---\n";

$catApiCtrl = new \App\Http\Controllers\Api\V2\CategoryController();
$apiRootResponse = $catApiCtrl->index()->toArray(request());
$apiRootCats = $apiRootResponse['data'] ?? [];
$foundHalalInApi = false;
$halalApiRecord = null;
foreach ($apiRootCats as $c) {
    if (isset($c['slug']) && $c['slug'] === 'halal-products') {
        $foundHalalInApi = true;
        $halalApiRecord = $c;
        break;
    }
}
assertTest("API V2 CategoryController::index() includes 'Halal Products'", $foundHalalInApi, "ID: {$halalApiRecord['id']}, Children: {$halalApiRecord['number_of_children']}");

$subApiCtrl = new \App\Http\Controllers\Api\V2\SubCategoryController();
$apiSubResponse = $subApiCtrl->index($rootCat->id)->toArray(request());
$apiSubCats = $apiSubResponse['data'] ?? [];
assertTest("API V2 SubCategoryController::index(27) returns all 6 subcategories", count($apiSubCats) === 6, "API Subcategories count: " . count($apiSubCats));

$prodApiCtrl = new \App\Http\Controllers\Api\V2\ProductController();
$meatSub = Category::where('slug', 'halal-meat-poultry')->first();
$apiProdResponse = $prodApiCtrl->category($meatSub->slug, request())->toArray(request());
$apiProds = $apiProdResponse['data'] ?? [];
assertTest("API V2 ProductController::category('{$meatSub->slug}') returns products", count($apiProds) >= 2, "API Products returned: " . count($apiProds));

echo "\n=========================================================\n";
echo " TEST SUMMARY: $passCount PASSED, $failCount FAILED\n";
echo "=========================================================\n";

if ($failCount === 0) {
    exit(0);
} else {
    exit(1);
}
