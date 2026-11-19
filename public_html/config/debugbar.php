<?php

return [
    /*
     |--------------------------------------------------------------------------
     | Debugbar Settings
     |--------------------------------------------------------------------------
     |
     | Debugbar is disabled to prevent internal system and query profiling info
     | from being exposed or displayed on the public website interface.
     |
     */
    'enabled' => env('DEBUGBAR_ENABLED', false),
    'except' => [
        'telescope*',
        'horizon*',
    ],
    'storage' => [
        'enabled' => false,
    ],
    'inject' => false,
];
