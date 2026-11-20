<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Category;
use App\Models\Product;
use App\Models\Cart;
use App\Models\User;

class CommerceRegressionTest extends TestCase
{
    /**
     * Test storefront home page loads cleanly.
     */
    public function test_homepage_loads_successfully()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test categories page renders and lists root categories including Halal Products.
     */
    public function test_categories_page_renders_with_halal_products()
    {
        $response = $this->get('/categories');
        $response->assertStatus(200);
        $response->assertSee('Halal Products');
    }

    /**
     * Test parent-child category filter allows descendant products to appear on root category page.
     */
    public function test_parent_category_lists_sub_category_products()
    {
        $response = $this->get('/category/halal-products');
        $response->assertStatus(200);
        $response->assertSee('Certified Ethiopian Halal Beef');
    }

    /**
     * Test subcategory page renders products scoped to that subcategory.
     */
    public function test_subcategory_page_renders_scoped_products()
    {
        $response = $this->get('/category/halal-foods-beverages');
        $response->assertStatus(200);
        $response->assertSee('Certified Ethiopian Halal Beef');
    }

    /**
     * Test single product detail page renders with pricing and stock.
     */
    public function test_product_detail_page_loads_with_price()
    {
        $response = $this->get('/product/certified-ethiopian-halal-beef-1kg');
        $response->assertStatus(200);
        $response->assertSee('650');
    }

    /**
     * Test public order tracking route renders without authentication.
     */
    public function test_public_track_order_page_accessible()
    {
        $response = $this->get('/track-your-order');
        $response->assertStatus(200);
    }

    /**
     * Test that neutralized RCE backdoor endpoint is rejected.
     */
    public function test_rce_import_data_endpoint_is_blocked()
    {
        $response = $this->post('/import-data');
        $this->assertTrue(in_array($response->getStatusCode(), [404, 405]));
    }

    /**
     * Test cart calculation integrity.
     */
    public function test_cart_calculation_and_shipping_integrity()
    {
        $product = Product::where('slug', 'certified-ethiopian-halal-beef-1kg')->first();
        $this->assertNotNull($product);

        $customer = User::where('user_type', 'customer')->first();
        $userId = $customer ? $customer->id : 8;

        $cart = Cart::create([
            'user_id' => $userId,
            'product_id' => $product->id,
            'variation' => '',
            'price' => $product->unit_price,
            'tax' => 0.00,
            'shipping_cost' => 50.00,
            'shipping_type' => 'flat_rate',
            'quantity' => 2
        ]);

        $subtotal = $cart->price * $cart->quantity;
        $total = $subtotal + $cart->shipping_cost;

        $this->assertEquals(1300.00, $subtotal);
        $this->assertEquals(1350.00, $total);

        // Clean up test cart
        $cart->delete();
    }
}
