<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;
    public $incrementing = false;

    protected $fillable = ['business_id'];

    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id');
    }
    public function leases()
    {
        return $this->hasMany(Lease::class, 'tenant_id', 'id');
    }
}
