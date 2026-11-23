<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Upload;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

$images = [
    1 => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80', // CCTV Camera
    2 => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80', // Backpack / Bag
    3 => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80', // Leather Bag
    4 => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80', // Dress
    5 => 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80', // Cleaning products
    6 => 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80', // Cleaning spray
    7 => 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80', // Desktop PC
    8 => 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80', // Intercom
    9 => 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80', // Smart WiFi Camera
    10 => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80', // HP EliteBook Laptop
    11 => 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80', // HP ENVY
    12 => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', // HP ENVY Laptop
    13 => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', // Mobile Phone
    14 => 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80', // Nokia Phone
    15 => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80', // Razer Mouse
    16 => 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80', // Smart Bulb Camera
    17 => 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80', // Spray
    18 => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', // Headphones
    19 => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80', // WiFi Router
    20 => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', // Running Shoes
    21 => 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80', // Xiaomi Camera
    22 => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', // MacBook Pro
    23 => 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80', // Samsung Galaxy
    24 => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', // Sony Alpha Camera
    25 => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80', // Coffee Beans
    26 => 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80', // Dell XPS
    27 => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80', // Oxford Shoes
];

echo "Updating uploads with product images...\n";

foreach ($images as $id => $url) {
    $upload = Upload::find($id);
    if (!$upload) {
        $upload = new Upload();
        $upload->id = $id;
        $upload->file_original_name = 'product_' . $id;
        $upload->file_name = 'uploads/all/product_' . $id . '.jpg';
        $upload->user_id = 9;
        $upload->file_size = 50000;
        $upload->extension = 'jpg';
        $upload->type = 'image';
    }
    $upload->external_link = $url;
    $upload->save();

    // Ensure product points to this upload
    $product = Product::find($id);
    if ($product) {
        $product->thumbnail_img = $upload->id;
        $product->photos = (string)$upload->id;
        $product->save();
        echo "  [Product {$id}] {$product->name} -> Upload {$upload->id}\n";
    }
}

Cache::flush();
echo "Done! All product images populated and cache cleared.\n";
