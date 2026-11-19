// src/modules/auth/models/auth.models.js
import User from "./user.model.js";
import Role from "./role.model.js";
import Permission from "./permission.model.js";
import UserRole from "./userRole.model.js";
import RolePermission from "./rolePermission.model.js";

const models = { User, Role, Permission, UserRole, RolePermission };

export default models;
