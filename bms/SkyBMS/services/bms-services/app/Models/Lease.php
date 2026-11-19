<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lease extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id',
        'tenant_id',
        'building_unit_id',
        'lease_agreement_document',
        'start_date',
        'end_date',
        'monthly_rent',
        'status',
    ];

    public function buildingUnit()
    {
        return $this->belongsTo(BuildingUnit::class, 'building_unit_id', 'id');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class, 'tenant_id', 'id');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'lease_id', 'id');
    }
}
