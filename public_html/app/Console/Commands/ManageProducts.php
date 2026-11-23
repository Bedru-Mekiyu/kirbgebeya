<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class ManageProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:manage 
                            {action : The action to perform (list, add, modify, import, delete)}
                            {--id= : Product ID to modify or delete}
                            {--name= : Product Name}
                            {--category_id= : Category ID}
                            {--price= : Unit Price in ETB}
                            {--stock= : Stock quantity}
                            {--published= : Publish status (1 or 0)}
                            {--discount= : Discount amount}
                            {--file= : CSV file path for bulk import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add, modify, list, or import products into Kirb Gebeya';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $action = strtolower($this->argument('action'));

        switch ($action) {
            case 'list':
                return $this->listProducts();
            case 'add':
                return $this->addProduct();
            case 'modify':
                return $this->modifyProduct();
            case 'import':
                return $this->importProducts();
            case 'delete':
                return $this->deleteProduct();
            default:
                $this->error("Unknown action: {$action}. Use list, add, modify, import, or delete.");
                return 1;
        }
    }

    protected function listProducts()
    {
        $products = Product::with('category')->orderBy('id', 'desc')->take(30)->get();

        $rows = [];
        foreach ($products as $p) {
            $rows[] = [
                $p->id,
                $p->name,
                $p->category ? $p->category->name : 'N/A',
                number_format($p->unit_price, 2) . ' ETB',
                $p->current_stock,
                $p->published ? 'Yes' : 'No',
                $p->num_of_sale,
                $p->rating
            ];
        }

        $this->table(['ID', 'Name', 'Category', 'Price', 'Stock', 'Published', 'Sales', 'Rating'], $rows);
        $this->info("Total products in catalog: " . Product::count());
        return 0;
    }

    protected function addProduct()
    {
        $name = $this->option('name') ?: $this->ask('Product Name');
        $categoryId = $this->option('category_id') ?: $this->ask('Category ID (e.g. 15=Cellphones, 16=Cameras, 20=Computers)');
        $price = $this->option('price') ?: $this->ask('Unit Price in ETB');
        $stock = $this->option('stock') ?: $this->ask('Current Stock Quantity', 50);

        $admin = User::where('user_type', 'admin')->first();
        $adminId = $admin ? $admin->id : 9;

        $slug = Str::slug($name);
        if (empty($slug)) {
            $slug = 'product-' . Str::random(6);
        }
        $slug = $slug . '-' . Str::random(5);

        $product = new Product();
        $product->name = $name;
        $product->added_by = 'admin';
        $product->user_id = $adminId;
        $product->category_id = (int)$categoryId;
        $product->unit_price = (float)$price;
        $product->current_stock = (int)$stock;
        $product->published = 1;
        $product->approved = 1;
        $product->slug = $slug;
        $product->unit = 'pc';
        $product->min_qty = 1;
        $product->shipping_type = 'flat_rate';
        $product->shipping_cost = 0;
        $product->attributes = '[]';
        $product->colors = '[]';
        $product->choice_options = '[]';
        $product->variations = '[]';
        $product->tags = Str::slug($name, ',');
        $product->save();

        // Create initial stock entry
        $stockRecord = new ProductStock();
        $stockRecord->product_id = $product->id;
        $stockRecord->variant = '';
        $stockRecord->price = (float)$price;
        $stockRecord->qty = (int)$stock;
        $stockRecord->sku = 'SKU-' . $product->id . '-' . Str::upper(Str::random(4));
        $stockRecord->save();

        Cache::flush();

        $this->info("Successfully added product [ID: {$product->id}] '{$product->name}' at {$product->unit_price} ETB (Stock: {$product->current_stock}).");
        return 0;
    }

    protected function modifyProduct()
    {
        $id = $this->option('id') ?: $this->ask('Product ID to modify');
        $product = Product::find($id);

        if (!$product) {
            $this->error("Product with ID {$id} not found.");
            return 1;
        }

        $modified = false;

        if ($this->option('name') !== null) {
            $product->name = $this->option('name');
            $modified = true;
        }
        if ($this->option('price') !== null) {
            $product->unit_price = (float)$this->option('price');
            $modified = true;
        }
        if ($this->option('stock') !== null) {
            $product->current_stock = (int)$this->option('stock');
            $modified = true;
        }
        if ($this->option('published') !== null) {
            $product->published = (int)$this->option('published');
            $modified = true;
        }
        if ($this->option('discount') !== null) {
            $product->discount = (float)$this->option('discount');
            $modified = true;
        }
        if ($this->option('category_id') !== null) {
            $product->category_id = (int)$this->option('category_id');
            $modified = true;
        }

        if (!$modified) {
            $this->warn("No fields specified to modify. Use --name, --price, --stock, --published, --discount, or --category_id.");
            return 1;
        }

        $product->save();

        // Update product_stocks entry if price or stock changed
        $stockRecord = ProductStock::where('product_id', $product->id)->first();
        if ($stockRecord) {
            if ($this->option('price') !== null) {
                $stockRecord->price = (float)$this->option('price');
            }
            if ($this->option('stock') !== null) {
                $stockRecord->qty = (int)$this->option('stock');
            }
            $stockRecord->save();
        }

        Cache::flush();

        $this->info("Successfully updated product [ID: {$product->id}] '{$product->name}'.");
        return 0;
    }

    protected function deleteProduct()
    {
        $id = $this->option('id') ?: $this->ask('Product ID to delete');
        $product = Product::find($id);

        if (!$product) {
            $this->error("Product with ID {$id} not found.");
            return 1;
        }

        ProductStock::where('product_id', $product->id)->delete();
        $name = $product->name;
        $product->delete();

        Cache::flush();

        $this->info("Deleted product [ID: {$id}] '{$name}'.");
        return 0;
    }

    protected function importProducts()
    {
        $filePath = $this->option('file') ?: $this->ask('Path to CSV file');

        if (!file_exists($filePath)) {
            $this->error("File does not exist: {$filePath}");
            return 1;
        }

        $handle = fopen($filePath, 'r');
        if (!$handle) {
            $this->error("Unable to open CSV file.");
            return 1;
        }

        $header = fgetcsv($handle);
        if (!$header) {
            $this->error("Empty CSV file.");
            fclose($handle);
            return 1;
        }

        $header = array_map(function($h) {
            return strtolower(trim(str_replace([' ', '_'], '', $h)));
        }, $header);

        $admin = User::where('user_type', 'admin')->first();
        $adminId = $admin ? $admin->id : 9;

        $count = 0;
        while (($row = fgetcsv($handle)) !== false) {
            if (empty(array_filter($row))) {
                continue;
            }

            $data = array_combine(array_slice($header, 0, count($row)), $row);

            $name = $data['name'] ?? null;
            if (!$name) {
                continue;
            }

            $categoryId = (int)($data['categoryid'] ?? $data['category'] ?? 20);
            $price = (float)($data['unitprice'] ?? $data['price'] ?? 0);
            $stock = (int)($data['currentstock'] ?? $data['stock'] ?? 10);
            $description = $data['description'] ?? $name;
            $unit = $data['unit'] ?? 'pc';

            $slug = Str::slug($name);
            if (empty($slug)) {
                $slug = 'product-' . Str::random(6);
            }
            $slug = $slug . '-' . Str::random(5);

            $product = new Product();
            $product->name = $name;
            $product->description = $description;
            $product->added_by = 'admin';
            $product->user_id = $adminId;
            $product->category_id = $categoryId;
            $product->unit_price = $price;
            $product->current_stock = $stock;
            $product->published = 1;
            $product->approved = 1;
            $product->slug = $slug;
            $product->unit = $unit;
            $product->min_qty = 1;
            $product->shipping_type = 'flat_rate';
            $product->shipping_cost = 0;
            $product->attributes = '[]';
            $product->colors = '[]';
            $product->choice_options = '[]';
            $product->variations = '[]';
            $product->tags = Str::slug($name, ',');
            $product->save();

            $stockRecord = new ProductStock();
            $stockRecord->product_id = $product->id;
            $stockRecord->variant = '';
            $stockRecord->price = $price;
            $stockRecord->qty = $stock;
            $stockRecord->sku = 'SKU-' . $product->id . '-' . Str::upper(Str::random(4));
            $stockRecord->save();

            $count++;
        }

        fclose($handle);
        Cache::flush();

        $this->info("Bulk import completed! Successfully imported {$count} products.");
        return 0;
    }
}
