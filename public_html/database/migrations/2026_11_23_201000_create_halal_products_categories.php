<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Category;
use App\Models\Upload;
use Illuminate\Support\Facades\Cache;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 1. Upload media records for Halal Categories
        $uploadsData = [
            'halal_root_banner' => [
                'file_name' => 'uploads/all/halal_root_banner.jpg',
                'file_original_name' => 'halal_root_banner',
                'external_link' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1400&auto=format&fit=crop&q=80',
            ],
            'halal_root_icon' => [
                'file_name' => 'uploads/all/halal_root_icon.png',
                'file_original_name' => 'halal_root_icon',
                'external_link' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=64&auto=format&fit=crop&q=80',
            ],
            'halal_sub_meat' => [
                'file_name' => 'uploads/all/halal_meat.jpg',
                'file_original_name' => 'halal_sub_meat',
                'external_link' => 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
            ],
            'halal_sub_groceries' => [
                'file_name' => 'uploads/all/halal_groceries.jpg',
                'file_original_name' => 'halal_sub_groceries',
                'external_link' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
            ],
            'halal_sub_dairy' => [
                'file_name' => 'uploads/all/halal_dairy.jpg',
                'file_original_name' => 'halal_sub_dairy',
                'external_link' => 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80',
            ],
            'halal_sub_sweets' => [
                'file_name' => 'uploads/all/halal_sweets.jpg',
                'file_original_name' => 'halal_sub_sweets',
                'external_link' => 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
            ],
            'halal_sub_personal_care' => [
                'file_name' => 'uploads/all/halal_personal_care.jpg',
                'file_original_name' => 'halal_sub_personal_care',
                'external_link' => 'https://images.unsplash.com/photo-1608248597359-597551062f6b?w=600&auto=format&fit=crop&q=80',
            ],
            'halal_sub_lifestyle' => [
                'file_name' => 'uploads/all/halal_lifestyle.jpg',
                'file_original_name' => 'halal_sub_lifestyle',
                'external_link' => 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&auto=format&fit=crop&q=80',
            ],
        ];

        $uploadIds = [];
        foreach ($uploadsData as $key => $data) {
            $upload = Upload::where('file_original_name', $data['file_original_name'])->first();
            if (!$upload) {
                $upload = new Upload();
                $upload->file_original_name = $data['file_original_name'];
            }
            $upload->file_name = $data['file_name'];
            $upload->user_id = 9;
            $upload->file_size = 85000;
            $upload->extension = 'jpg';
            $upload->type = 'image';
            $upload->external_link = $data['external_link'];
            $upload->save();
            $uploadIds[$key] = $upload->id;
        }

        // 2. Create Root Halal Products Category (level 0, parent_id 0)
        $rootCategory = Category::where('slug', 'halal-products')->first();
        if (!$rootCategory) {
            $rootCategory = new Category();
            $rootCategory->slug = 'halal-products';
        }
        $rootCategory->name = 'Halal Products';
        $rootCategory->parent_id = 0;
        $rootCategory->level = 0;
        $rootCategory->order_level = 1;
        $rootCategory->commision_rate = 0;
        $rootCategory->featured = 1;
        $rootCategory->top = 1;
        $rootCategory->digital = 0;
        $rootCategory->banner = $uploadIds['halal_root_banner'] ?? null;
        $rootCategory->icon = $uploadIds['halal_root_icon'] ?? null;
        $rootCategory->cover_image = $uploadIds['halal_root_banner'] ?? null;
        $rootCategory->meta_title = 'Halal Certified Products - Kirb Gebeya';
        $rootCategory->meta_description = 'Shop 100% certified Halal fresh meats, groceries, dairy, sweets, and modest lifestyle goods on Kirb Gebeya.';
        $rootCategory->save();

        // 3. Subcategories (level 1, parent_id = rootCategory->id)
        $subcategories = [
            [
                'name' => 'Halal Meat & Poultry',
                'slug' => 'halal-meat-poultry',
                'upload_key' => 'halal_sub_meat',
                'meta_title' => 'Fresh Halal Meat & Poultry - Kirb Gebeya',
                'meta_description' => 'Certified fresh Halal beef, lamb, goat, and poultry.'
            ],
            [
                'name' => 'Halal Groceries & Spices',
                'slug' => 'halal-groceries-spices',
                'upload_key' => 'halal_sub_groceries',
                'meta_title' => 'Halal Groceries & Spices - Kirb Gebeya',
                'meta_description' => 'Halal certified seasonings, grains, oils, and spices.'
            ],
            [
                'name' => 'Halal Dairy & Cheese',
                'slug' => 'halal-dairy-cheese',
                'upload_key' => 'halal_sub_dairy',
                'meta_title' => 'Halal Dairy & Cheese - Kirb Gebeya',
                'meta_description' => 'Pure halal dairy, microbial-rennet cheeses, and butter.'
            ],
            [
                'name' => 'Halal Sweets & Dates',
                'slug' => 'halal-sweets-dates',
                'upload_key' => 'halal_sub_sweets',
                'meta_title' => 'Halal Sweets, Honey & Dates - Kirb Gebeya',
                'meta_description' => 'Gelatin-free confectionery, Medina dates, and pure honey.'
            ],
            [
                'name' => 'Halal Personal Care',
                'slug' => 'halal-personal-care',
                'upload_key' => 'halal_sub_personal_care',
                'meta_title' => 'Halal Personal Care & Cosmetics - Kirb Gebeya',
                'meta_description' => 'Alcohol-free fragrances, halal skincare, and soaps.'
            ],
            [
                'name' => 'Islamic Lifestyle & Goods',
                'slug' => 'islamic-lifestyle-goods',
                'upload_key' => 'halal_sub_lifestyle',
                'meta_title' => 'Islamic Lifestyle & Modest Goods - Kirb Gebeya',
                'meta_description' => 'Prayer mats, modest lifestyle items, and incense.'
            ],
        ];

        foreach ($subcategories as $sub) {
            $child = Category::where('slug', $sub['slug'])->first();
            if (!$child) {
                $child = new Category();
                $child->slug = $sub['slug'];
            }
            $child->name = $sub['name'];
            $child->parent_id = $rootCategory->id;
            $child->level = 1;
            $child->order_level = 0;
            $child->commision_rate = 0;
            $child->featured = 1;
            $child->top = 0;
            $child->digital = 0;
            $imageId = $uploadIds[$sub['upload_key']] ?? null;
            $child->banner = $imageId;
            $child->icon = $imageId;
            $child->cover_image = $imageId;
            $child->meta_title = $sub['meta_title'];
            $child->meta_description = $sub['meta_description'];
            $child->save();
        }

        Cache::flush();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $rootCategory = Category::where('slug', 'halal-products')->first();
        if ($rootCategory) {
            Category::where('parent_id', $rootCategory->id)->delete();
            $rootCategory->delete();
        }

        Upload::whereIn('file_original_name', [
            'halal_root_banner',
            'halal_root_icon',
            'halal_sub_meat',
            'halal_sub_groceries',
            'halal_sub_dairy',
            'halal_sub_sweets',
            'halal_sub_personal_care',
            'halal_sub_lifestyle'
        ])->delete();

        Cache::flush();
    }
};
