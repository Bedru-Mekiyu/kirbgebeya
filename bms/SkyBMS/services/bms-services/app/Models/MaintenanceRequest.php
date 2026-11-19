<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class MaintenanceRequest extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'building_unit_id',
        'request_date',
        'description',
        'status',
    ];

    public function buildingUnit()
    {
        return $this->belongsTo(BuildingUnit::class, 'building_unit_id');
    }

    public function workOrder()
    {
        return $this->hasMany(WorkOrder::class, 'request_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        // Generate UUID for new records
        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }
}
