<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylor@laravel.com>
 */

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

$publicStripped = preg_replace('#^/public#', '', $uri);

if ($uri !== '/') {
    if (file_exists(__DIR__ . '/public' . $uri) && is_file(__DIR__ . '/public' . $uri)) {
        return false;
    }
    if (file_exists(__DIR__ . $uri) && is_file(__DIR__ . $uri)) {
        return false;
    }
    if ($publicStripped !== '' && file_exists(__DIR__ . '/public' . $publicStripped) && is_file(__DIR__ . '/public' . $publicStripped)) {
        $file = __DIR__ . '/public' . $publicStripped;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        $mimes = [
            'css'   => 'text/css',
            'js'    => 'application/javascript',
            'png'   => 'image/png',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'webp'  => 'image/webp',
            'svg'   => 'image/svg+xml',
            'gif'   => 'image/gif',
            'woff'  => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf'   => 'font/ttf',
            'eot'   => 'application/vnd.ms-fontobject',
            'ico'   => 'image/x-icon',
            'json'  => 'application/json',
            'map'   => 'application/json',
        ];
        if (isset($mimes[$ext])) {
            header('Content-Type: ' . $mimes[$ext]);
        }
        readfile($file);
        exit;
    }
}

if (file_exists(__DIR__ . '/public/index.php')) {
    require_once __DIR__ . '/public/index.php';
} else {
    require_once __DIR__ . '/index.php';
}
