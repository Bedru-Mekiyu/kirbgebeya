<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Building;

class BuildingUnit extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'building_id',
        'floor_no',
        'room_type',
        'unit_number',
        'image',
        'width',
        'length',
        'area_in_sqm',
        'price_per_meter_sq',
        'estimate_price',
        'status',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'id');
    }

    public function roomType()
    {
        return $this->belongsTo(BuildingUnitRoomType::class, 'room_type');
    }

    public function lease()
    {
        return $this->hasMany(Lease::class, 'building_unit_id', 'id');
    }

    protected static function booted()
    {
        static::deleted(function ($buildingUnit) {
            $buildingUnit->notifications()->delete();
        });
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'unit');
    }
}
