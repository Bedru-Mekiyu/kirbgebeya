<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ListOfBanks;
use Illuminate\Http\Request;

class ListOfBanksController extends Controller
{
    public function index()
    {
        return ListOfBanks::all();
    }
}
