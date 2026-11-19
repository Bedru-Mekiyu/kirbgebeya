<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'notifiable', 'type', 'data', 'read', 'unit'];

    public function buildingUnit()
    {
        return $this->belongsTo(BuildingUnit::class, 'unit');
    }
}
