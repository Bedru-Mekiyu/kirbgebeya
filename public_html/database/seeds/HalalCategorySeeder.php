<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\CategoryTranslation;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\ProductCategory;
use App\Models\ProductTranslation;
use App\Models\User;
use Illuminate\Support\Str;

class HalalCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::where('user_type', 'admin')->first();
        $admin_id = $admin ? $admin->id : 1;

        // 1. Root Category: Halal Products
        $rootCategory = Category::firstOrNew(['slug' => 'halal-products']);
        $rootCategory->name = 'Halal Products';
        $rootCategory->parent_id = 0;
        $rootCategory->level = 0;
        $rootCategory->order_level = 100;
        $rootCategory->commision_rate = 0.00;
        $rootCategory->featured = 1;
        $rootCategory->top = 1;
        $rootCategory->digital = 0;
        $rootCategory->meta_title = 'Halal Products - Kirb Gebeya';
        $rootCategory->meta_description = 'Shop certified Halal foods, cosmetics, pharmaceuticals, and modest lifestyle products on Kirb Gebeya Ethiopia.';
        $rootCategory->save();

        CategoryTranslation::firstOrCreate([
            'category_id' => $rootCategory->id,
            'lang' => env('DEFAULT_LANGUAGE', 'en'),
        ], [
            'name' => 'Halal Products'
        ]);

        // 2. Taxonomy Structure: [Subcategory => [Sub-Subcategories]]
        $taxonomy = [
            'Halal Foods & Beverages' => [
                'slug' => 'halal-foods-beverages',
                'order' => 10,
                'children' => [
                    'Fresh Meat & Poultry' => 'halal-fresh-meat-poultry',
                    'Dairy & Pantry Essentials' => 'halal-dairy-pantry',
                    'Snacks & Confectionery' => 'halal-snacks-confectionery',
                ]
            ],
            'Halal Cosmetics & Personal Care' => [
                'slug' => 'halal-cosmetics-personal-care',
                'order' => 20,
                'children' => [
                    'Halal Skincare & Fragrances' => 'halal-skincare-fragrances',
                    'Halal Haircare & Hygiene' => 'halal-haircare-hygiene',
                ]
            ],
            'Halal Pharmaceuticals & Supplements' => [
                'slug' => 'halal-pharmaceuticals-supplements',
                'order' => 30,
                'children' => [
                    'Halal Vitamins & Supplements' => 'halal-vitamins-supplements',
                    'Herbal & Sunnah Remedies' => 'herbal-sunnah-remedies',
                ]
            ],
            'Modest Fashion & Islamic Lifestyle' => [
                'slug' => 'modest-fashion-islamic-lifestyle',
                'order' => 40,
                'children' => [
                    'Abayas, Hijabs & Jilbabs' => 'abayas-hijabs-jilbabs',
                    'Prayer Essentials & Quran Accessories' => 'prayer-essentials',
                ]
            ],
        ];

        $categoryMap = [];
        $categoryMap['root'] = $rootCategory->id;

        foreach ($taxonomy as $subName => $subData) {
            $subCategory = Category::firstOrNew(['slug' => $subData['slug']]);
            $subCategory->name = $subName;
            $subCategory->parent_id = $rootCategory->id;
            $subCategory->level = 1;
            $subCategory->order_level = $subData['order'];
            $subCategory->featured = 1;
            $subCategory->digital = 0;
            $subCategory->meta_title = "$subName - Kirb Gebeya";
            $subCategory->meta_description = "Explore high-quality $subName verified for Halal compliance.";
            $subCategory->save();

            CategoryTranslation::firstOrCreate([
                'category_id' => $subCategory->id,
                'lang' => env('DEFAULT_LANGUAGE', 'en'),
            ], ['name' => $subName]);

            $categoryMap[$subData['slug']] = $subCategory->id;

            foreach ($subData['children'] as $childName => $childSlug) {
                $childCategory = Category::firstOrNew(['slug' => $childSlug]);
                $childCategory->name = $childName;
                $childCategory->parent_id = $subCategory->id;
                $childCategory->level = 2;
                $childCategory->order_level = 0;
                $childCategory->featured = 0;
                $childCategory->digital = 0;
                $childCategory->meta_title = "$childName - Kirb Gebeya";
                $childCategory->meta_description = "Certified Halal $childName with fast delivery in Ethiopia.";
                $childCategory->save();

                CategoryTranslation::firstOrCreate([
                    'category_id' => $childCategory->id,
                    'lang' => env('DEFAULT_LANGUAGE', 'en'),
                ], ['name' => $childName]);

                $categoryMap[$childSlug] = $childCategory->id;
            }
        }

        // 3. Sample Verified Halal Products for Instant Testing
        $sampleProducts = [
            [
                'name' => 'Certified Ethiopian Halal Beef (Fresh Cut 1kg)',
                'slug' => 'certified-ethiopian-halal-beef-1kg',
                'category_slug' => 'halal-fresh-meat-poultry',
                'parent_slug' => 'halal-foods-beverages',
                'price' => 650.00,
                'qty' => 50,
                'sku' => 'HL-BEEF-001',
                'unit' => 'kg',
                'description' => '<p>100% Halal certified fresh Ethiopian beef, ethically raised and hand-slaughtered (Zabiha) adhering strictly to Islamic principles. Inspected and certified by the Ethiopian Islamic Affairs Supreme Council (EIASC). Perfect for family meals, stews, and traditional dishes.</p>',
            ],
            [
                'name' => 'Pure Ethiopian Black Seed Oil (Habba Sawda - 100ml)',
                'slug' => 'pure-ethiopian-black-seed-oil-100ml',
                'category_slug' => 'herbal-sunnah-remedies',
                'parent_slug' => 'halal-pharmaceuticals-supplements',
                'price' => 380.00,
                'qty' => 120,
                'sku' => 'HL-HABBA-100',
                'unit' => 'bottle',
                'description' => '<p>Premium cold-pressed Virgin Ethiopian Black Seed Oil (Nigella Sativa / Habba Sawda). 100% pure, natural, solvent-free, and Halal certified. Revered for its potent immune-boosting and holistic wellness benefits.</p>',
            ],
            [
                'name' => 'Halal Rose & Oud Alcohol-Free Attar (12ml)',
                'slug' => 'halal-rose-oud-alcohol-free-attar-12ml',
                'category_slug' => 'halal-skincare-fragrances',
                'parent_slug' => 'halal-cosmetics-personal-care',
                'price' => 450.00,
                'qty' => 75,
                'sku' => 'HL-ATTAR-012',
                'unit' => 'piece',
                'description' => '<p>Exquisite non-alcoholic Halal concentrated perfume oil (Attar) blending pure Damascene Rose with rich Arabian Agarwood (Oud). Long-lasting, skin-safe, and permissible for daily and prayer wear.</p>',
            ],
        ];

        foreach ($sampleProducts as $prod) {
            $catId = $categoryMap[$prod['category_slug']];
            $parentCatId = $categoryMap[$prod['parent_slug']];
            $rootCatId = $categoryMap['root'];

            $product = Product::firstOrNew(['slug' => $prod['slug']]);
            $product->name = $prod['name'];
            $product->added_by = 'admin';
            $product->user_id = $admin_id;
            $product->category_id = $catId;
            $product->unit_price = $prod['price'];
            $product->purchase_price = $prod['price'] * 0.8;
            $product->unit = $prod['unit'];
            $product->current_stock = $prod['qty'];
            $product->min_qty = 1;
            $product->discount = 0.00;
            $product->discount_type = 'amount';
            $product->tax = 0.00;
            $product->tax_type = 'amount';
            $product->shipping_type = 'flat_rate';
            $product->shipping_cost = 50.00;
            $product->published = 1;
            $product->approved = 1;
            $product->cash_on_delivery = 1;
            $product->description = $prod['description'];
            $product->meta_title = $prod['name'] . ' - Kirb Gebeya';
            $product->meta_description = strip_tags($prod['description']);
            $product->tags = 'halal, certified, ethiopia, kirbgebeya';
            $product->attributes = '[]';
            $product->choice_options = '[]';
            $product->colors = '[]';
            $product->variations = '[]';
            $product->save();

            // Attach to Category Hierarchy in pivot: Leaf, Subcategory, and Root
            $product->categories()->syncWithoutDetaching([$catId, $parentCatId, $rootCatId]);

            // Stock Entry
            ProductStock::updateOrCreate(
                ['product_id' => $product->id, 'variant' => ''],
                [
                    'sku' => $prod['sku'],
                    'price' => $prod['price'],
                    'qty' => $prod['qty']
                ]
            );

            // Translation
            ProductTranslation::firstOrCreate(
                ['product_id' => $product->id, 'lang' => env('DEFAULT_LANGUAGE', 'en')],
                [
                    'name' => $prod['name'],
                    'unit' => $prod['unit'],
                    'description' => $prod['description']
                ]
            );
        }

        \Artisan::call('cache:clear');
        \Artisan::call('view:clear');
    }
}
