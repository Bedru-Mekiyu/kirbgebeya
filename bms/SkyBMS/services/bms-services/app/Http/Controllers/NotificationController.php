<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use App\Events\NotificationEvent;

class NotificationController extends Controller
{
    /**
     * Retrieve all notifications for the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $notifications = Notification::all();
        return response()->json($notifications);
    }

    /**
     * Retrieve a specific notification.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $notifications = Notification::where('notifiable', $id)
            ->where('read', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Mark a specific notification as read.
     *
     * @param  string  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($id)
    {
        $notifications = Notification::where('notifiable', $id)->get();

        foreach ($notifications as $notification) {
            $notification->read = true;
            $notification->save();
        }
        return response()->json(['message' => 'Notification marked as read']);
    }
}
