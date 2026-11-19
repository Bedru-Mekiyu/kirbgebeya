<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    public $incrementing = false;
    protected $fillable = [
        'name',
        'owner_id',
        'business_phone_number',
        'type_of_business',
    ];
    public function owner()
    {
        return $this->belongsTo(BusinessOwner::class, 'owner_id');
    }
}
