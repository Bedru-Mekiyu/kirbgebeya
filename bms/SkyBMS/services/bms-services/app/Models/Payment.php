<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false; // Since 'id' is UUID
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'lease_id',
        'number_of_months',
        'start_month',
        'end_month',
        'due_date',
        'paid_date',
        'rent_fee',
        'penalty_fee',
        'utility_fee',
        'other_fee',
        'invoice_number',
        'payment_method',
        'remark',
        'bank_name',
        'slip',
        'status',
    ];

    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }
}
