<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\BuildingUnitController;
use App\Http\Controllers\BusinessOwnerController;
use App\Http\Controllers\BusinessController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BusinessTypeController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\LeaseController;
use App\Http\Controllers\RegisterUserController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\MaintenanceContractorController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\BuildingUnitRoomTypeController;
use App\Http\Controllers\FinancialReportController;
use App\Http\Controllers\LeaseExpiryReportController;
use App\Http\Controllers\MaintenanceRequestReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TenantReportController;
use App\Http\Controllers\ListOfBanksController;
use App\Http\Controllers\ProfileController;

Route::post('/login', [LoginController::class, 'login']);

Route::post('/logout', [LoginController::class, 'logout']);

Route::post('/register', [RegisterUserController::class, 'register']);

// User Endpoints
// Route::middleware(['auth'])->group(function () {
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::get('/user/count', [UserController::class, 'count']);

// Building Endpoints
Route::get('/buildings', [BuildingController::class, 'index']);
Route::post('/buildings', [BuildingController::class, 'store']);
Route::get('/buildings/{id}', [BuildingController::class, 'show']);
Route::post('/buildings/{id}', [BuildingController::class, 'update']);
Route::delete('/buildings/{id}', [BuildingController::class, 'destroy']);

// BuildingUnit Endpoints
Route::post('/building-units', [BuildingUnitController::class, 'create']);
Route::get('/building-units', [BuildingUnitController::class, 'index']);
Route::get('/building-units-all', [BuildingUnitController::class, 'all']);
Route::get('/building-units/{id}', [BuildingUnitController::class, 'show']);
Route::post('/building-units/{id}', [BuildingUnitController::class, 'update']);
Route::delete('/building-units/{id}', [
    BuildingUnitController::class,
    'destroy',
]);
Route::get('/building-unit/count', [BuildingUnitController::class, 'count']);

// Business Owner Endpoints
Route::get('/business-owners', [BusinessOwnerController::class, 'index']);
Route::post('/business-owners', [BusinessOwnerController::class, 'store']);
Route::get('/business-owners/{businessOwner}', [
    BusinessOwnerController::class,
    'show',
]);
Route::put('/business-owners/{businessOwner}', [
    BusinessOwnerController::class,
    'update',
]);
Route::delete('/business-owners/{businessOwner}', [
    BusinessOwnerController::class,
    'destroy',
]);

// Business Endpoints
Route::get('/businesses', [BusinessController::class, 'index']);
Route::post('/businesses', [BusinessController::class, 'store']);
Route::get('/businesses/{id}', [BusinessController::class, 'show']);
Route::put('/businesses/{id}', [BusinessController::class, 'update']);
Route::delete('/businesses/{id}', [BusinessController::class, 'destroy']);

// Business Type Endpoints
Route::get('/business-types', [BusinessTypeController::class, 'index']);

// Tenant Endpoints
Route::get('/tenants', [TenantController::class, 'index']);
Route::post('/tenants', [TenantController::class, 'store']);
Route::get('/tenants/{tenant}', [TenantController::class, 'show']);
Route::put('/tenants/{tenant}', [TenantController::class, 'update']);
Route::delete('/tenants/{tenant}', [TenantController::class, 'destroy']);
Route::get('/tenantcount', [TenantController::class, 'tenantCount']);

// Lease Endpoints
Route::get('/leases', [LeaseController::class, 'index']);
Route::post('/leases', [LeaseController::class, 'store']);
Route::get('/leases/{lease}', [LeaseController::class, 'show']);
Route::post('/leases/{lease}', [LeaseController::class, 'update']);
Route::delete('/leases/{id}/{property_id}', [
    LeaseController::class,
    'destroy',
]);
Route::get('/leases/user/{userId}', [
    LeaseController::class,
    'getLeaseByUserId',
]);
Route::get('/lease/count', [LeaseController::class, 'leaseCount']);
Route::get('/pending-payments-by-month', [
    LeaseController::class,
    'countPendingPaymentsByMonth',
]);
Route::get('/paid-payments-by-month', [
    LeaseController::class,
    'countPaidPaymentsByMonth',
]);
Route::get('/late-payments-by-month', [
    LeaseController::class,
    'countLatePaymentsByMonth',
]);

// Payment Endpoints
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/payments/{id}', [PaymentController::class, 'show']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::post('/payments/payment/{id}', [PaymentController::class, 'update']);
Route::post('/payments/{id}', [PaymentController::class, 'updatePayment']);
Route::put('/payments/approve/{id}', [
    PaymentController::class,
    'approvePayment',
]);
Route::put('/payments/reject/{id}', [
    PaymentController::class,
    'rejectPayment',
]);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
Route::get('payments/lease/{leaseId}', [
    PaymentController::class,
    'getPaymentsByLeaseId',
]);

// Maintenance Request Endpoints
Route::get('/maintenance-requests', [
    MaintenanceRequestController::class,
    'index',
]);
Route::post('/maintenance-requests', [
    MaintenanceRequestController::class,
    'store',
]);
Route::get('/maintenance-requests/{id}', [
    MaintenanceRequestController::class,
    'show',
]);
Route::put('/maintenance-requests/{id}', [
    MaintenanceRequestController::class,
    'update',
]);
Route::delete('/maintenance-requests/{id}', [
    MaintenanceRequestController::class,
    'destroy',
]);
Route::get('/maintenance-requests-count', [
    MaintenanceRequestController::class,
    'maintenanceRequestsCount',
]);
Route::get('/maintenance-requests/user/{userId}', [
    MaintenanceRequestController::class,
    'getRequestByUserId',
]);

// Maintenance Contractor Endpoints
Route::get('/maintenance-contractors', [
    MaintenanceContractorController::class,
    'index',
]);
Route::post('/maintenance-contractors', [
    MaintenanceContractorController::class,
    'store',
]);
Route::get('/maintenance-contractors/{id}', [
    MaintenanceContractorController::class,
    'show',
]);
Route::put('/maintenance-contractors/{id}', [
    MaintenanceContractorController::class,
    'update',
]);
Route::delete('/maintenance-contractors/{id}', [
    MaintenanceContractorController::class,
    'destroy',
]);

// Work Order Endpoints
Route::get('/work-orders', [WorkOrderController::class, 'index']);
Route::post('/work-orders', [WorkOrderController::class, 'store']);
Route::get('/work-orders/{id}', [WorkOrderController::class, 'show']);
Route::put('/work-orders/{id}', [WorkOrderController::class, 'update']);
Route::delete('/work-orders/{id}', [WorkOrderController::class, 'destroy']);
Route::patch('work-orders/{id}/complete', [
    WorkOrderController::class,
    'completeWorkOrder',
]);
Route::patch('work-orders/{id}/cancel', [
    WorkOrderController::class,
    'cancelWorkOrder',
]);

// Room Type Endpoints
Route::get('room-types', [BuildingUnitRoomTypeController::class, 'index']);
Route::post('room-types', [BuildingUnitRoomTypeController::class, 'store']);
Route::get('room-types/{id}', [BuildingUnitRoomTypeController::class, 'show']);
Route::put('room-types/{id}', [
    BuildingUnitRoomTypeController::class,
    'update',
]);
Route::delete('room-types/{id}', [
    BuildingUnitRoomTypeController::class,
    'destroy',
]);

Route::get('/notifications', [NotificationController::class, 'index']);
Route::get('/notifications/{id}', [NotificationController::class, 'show']);
Route::patch('/notifications/{id}/read', [
    NotificationController::class,
    'markAsRead',
]);

// Reports
Route::get('/tenant-report', [TenantReportController::class, 'index']);
Route::get('/maintenance-request-report', [
    MaintenanceRequestReportController::class,
    'index',
]);
Route::get('/lease-expiry-report', [
    LeaseExpiryReportController::class,
    'index',
]);
Route::get('/financial-report', [FinancialReportController::class, 'index']);

// List of Banks
Route::get('/list-of-banks', [ListOfBanksController::class, 'index']);

// Profile Endpoints
Route::post('/profile/{id}', [ProfileController::class, 'update']);

// });
