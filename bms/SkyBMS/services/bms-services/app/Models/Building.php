<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    /**
     * The primary key is not auto-incrementing and is a UUID.
     *
     * @var bool
     */
    public $incrementing = false;
    protected $primaryKey = 'id';
    protected $fillable = ['name', 'address', 'building_id', 'created_by', 'updated_by', 'image'];

}
