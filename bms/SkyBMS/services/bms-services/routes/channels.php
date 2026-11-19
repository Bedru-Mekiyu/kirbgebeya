<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('notification-channel', function ($user) {
    return true;
});
