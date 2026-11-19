<?php

namespace App\Http\Controllers;

use App\Models\BusinessType;
use Illuminate\Http\Request;

class BusinessTypeController extends Controller
{
    public function index()
    {
        return BusinessType::all();
    }

}
