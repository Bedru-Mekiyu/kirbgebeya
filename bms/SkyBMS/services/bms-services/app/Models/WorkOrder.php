<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkOrder extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'contractor_id',
        'request_id',
        'work_description',
        'scheduled_date',
        'completion_date',
        'cost',
    ];

    public function contractor()
    {
        return $this->belongsTo(MaintenanceContractor::class, 'contractor_id');
    }

    public function request()
    {
        return $this->belongsTo(MaintenanceRequest::class, 'request_id');
    }
}
