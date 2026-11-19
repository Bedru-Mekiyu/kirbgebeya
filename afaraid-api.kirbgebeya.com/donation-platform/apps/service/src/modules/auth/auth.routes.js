import { Router } from "express";
import AuthController from "./auth.controller.js";
import AuthMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", AuthController.login);

router.get(
  "/users",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "users"),
  AuthController.getUsers
);

router.post(
  "/users",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("create", "users"),
  AuthController.createUser
);

router.get(
  "/users/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "users"),
  AuthController.getUserById
);

router.put(
  "/users/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.updateUser
);

router.delete(
  "/users/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("delete", "users"),
  AuthController.deleteUser
);

router.put(
  "/users/:id/activate",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.activateUser
);
router.put(
  "/users/:id/deactivate",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.deactivateUser
);

router.post(
  "/roles",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("create", "roles"),
  AuthController.createRole
);

router.get(
  "/roles",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "roles"),
  AuthController.getRoles
);

router.put(
  "/users/:userId/role",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.assignRole
);

router.get(
  "/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "permissions"),
  AuthController.getAllPermissions
);

router.post(
  "/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("create", "permissions"),
  AuthController.createPermission
);

router.put(
  "/roles/:roleId/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "roles"),
  AuthController.assignPermission
);

router.get(
  "/roles/with-user-count",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "roles"),
  AuthController.getRolesWithUserCount
);

router.get(
  "/roles/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "roles"),
  AuthController.getRoleById
);

router.put(
  "/roles/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "roles"),
  AuthController.updateRole
);

router.delete(
  "/roles/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("delete", "roles"),
  AuthController.deleteRole
);

router.get(
  "/roles/search",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "roles"),
  AuthController.searchRoles
);

// User-Role assignment - additional endpoints
router.post(
  "/users/:userId/roles",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.assignRolesToUser
);

router.delete(
  "/users/:userId/roles",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "users"),
  AuthController.removeRolesFromUser
);

router.get(
  "/users/:userId/roles",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "users"),
  AuthController.getUserRoles
);

// Permission management - additional endpoints
router.get(
  "/permissions/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "permissions"),
  AuthController.getPermissionById
);

router.put(
  "/permissions/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "permissions"),
  AuthController.updatePermission
);

router.delete(
  "/permissions/:id",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("delete", "permissions"),
  AuthController.deletePermission
);

// Role-Permission management - additional endpoints
router.get(
  "/roles/:roleId/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("read", "roles"),
  AuthController.getRolePermissions
);

router.post(
  "/roles/:roleId/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "roles"),
  AuthController.assignPermissionsToRole
);

router.put(
  "/roles/:roleId/permissions/sync",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "roles"),
  AuthController.syncRolePermissions
);

router.delete(
  "/roles/:roleId/permissions",
  AuthMiddleware.verifyToken,
  AuthMiddleware.authorizePermissions("update", "roles"),
  AuthController.removePermissionsFromRole
);

export default router;
