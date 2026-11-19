// src/modules/auth/auth.service.js
import jwt from "jsonwebtoken";
import models from "./models/auth.models.js";
import bcrypt from "bcryptjs";
import attachAuthAssociations from "./models/auth.associations.js";
import { Op } from "sequelize";
import UserRole from "./models/userRole.model.js";
attachAuthAssociations(models);
const { User, Role, Permission } = models;

class ForbiddenError extends Error {
  constructor(message = "Access denied", status = 403) {
    super(message);
    this.name = "ForbiddenError";
    this.status = status;
  }
}

class AuthService {
  async createUser(data) {
    try {
      if (!data?.email || !data?.username) {
        throw new Error("Email and username are required");
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new Error("Email already exists");
        }
        if (existingUser.username === data.username) {
          throw new Error("Username already exists");
        }
      }
      const user = await User.create(data);
      return user;
    } catch (err) {
      console.error("Error creating user:", err.message);
      throw new Error(
        `Failed to create user: ${err.message || JSON.stringify(err)}`
      );
    }
  }

  async getUsers() {
    return await User.findAll({
      include: { model: Role, as: "roles", include: "permissions" },
    });
  }

  async getUserById(id) {
    const user = await User.findByPk(id, {
      include: { model: Role, as: "roles", include: "permissions" },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    await user.update(data);
    return user;
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    await user.destroy();
    return true;
  }

  async activateUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    user.active = true;
    await user.save();
    return user;
  }

  async deactivateUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    user.active = false;
    await user.save();
    return user;
  }

  async createRole(data) {
    const role = await Role.create(data);
    return role;
  }

  async getRoles() {
    return await Role.findAll({ include: "permissions" });
  }

  async getRoleById(id) {
    const role = await Role.findByPk(id, { include: "permissions" });
    if (!role) throw new Error("Role not found");
    return role;
  }

  async updateRole(id, data) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");
    await role.update(data);
    return role;
  }

  async deleteRole(id) {
    const role = await Role.findByPk(id);
    if (!role) throw new Error("Role not found");
    await role.destroy();
    return true;
  }

  async assignRoleToUser(userId, roleId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error("Role not found");

    user.roleId = roleId;
    await user.save();
    return user;
  }

  async createPermission(data) {
    return await Permission.create(data);
  }

  async getAllPermissions() {
    return await Permission.findAll();
  }

  async assignPermissionToRole(roleId, permissionId) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error("Role not found");
    const permission = await Permission.findByPk(permissionId);
    if (!permission) throw new Error("Permission not found");

    await role.addPermission(permission);
    return role;
  }

  async login(email, password) {
    const user = await User.findOne({
      where: { email },
      include: { model: Role, as: "roles" },
    });
    if (!user) throw new Error("User not found");
    if (!user.isActive) throw new Error("User inactive");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      roles: user.roles?.map((r) => r.id),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    return { user, token };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid token");
    }
  }

  checkRole(user, roles = []) {
    if (!roles.includes(user.role))
      throw new Error("Access denied: insufficient role");
  }

  async checkPermission(user, action, resource) {
    const roles = user.roles || [];
    if (roles.length === 0) {
      throw new ForbiddenError("Access denied: user has no roles assigned");
    }
    const roleIds = roles.map((r) => r);
    const rolesWithPermissions = await Role.findAll({
      where: { id: roleIds },
      include: {
        model: Permission,
        as: "permissions",
      },
    });
    const permissions = rolesWithPermissions.flatMap((role) => {
      if (!role.permissions) return [];
      return role.permissions.flatMap((p) => ({
        action: p.action,
        resource: p.resource,
      }));
    });

    const hasPermission = permissions.some(
      (p) => p.action === action && p.resource === resource
    );

    if (!hasPermission) {
      throw new ForbiddenError(
        `Access denied: insufficient permission for action '${action}' on resource '${resource}'`
      );
    }
  }

  async getRolesWithUserCount() {
    try {
      // Get all roles with their permissions
      const roles = await Role.findAll({
        include: [
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] }
          }
        ]
      });

      // Manually count users for each role
      const rolesWithCounts = await Promise.all(
        roles.map(async (role) => {
          const userCount = await UserRole.count({
            where: { roleId: role.id }
          });

          return {
            ...role.toJSON(),
            userCount
          };
        })
      );

      return rolesWithCounts;
    } catch (error) {
      console.error('Error in getRolesWithUserCount:', error);
      throw new Error('Failed to fetch roles with user count');
    }
  }

  async searchRoles(query) {
    return await Role.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: { model: Permission, as: "permissions" }
    });
  }

  async assignRolesToUser(userId, roleIds) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const roles = await Role.findAll({ where: { id: roleIds } });
    if (roles.length !== roleIds.length) {
      throw new Error("One or more roles not found");
    }

    await user.setRoles(roles);
    return true;
  }

  async removeRolesFromUser(userId, roleIds) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const roles = await Role.findAll({ where: { id: roleIds } });
    await user.removeRoles(roles);
    return true;
  }

  async getUserRoles(userId) {
    const user = await User.findByPk(userId, {
      include: { model: Role, as: "roles" }
    });
    if (!user) throw new Error("User not found");
    return user.roles;
  }

  async getPermissionById(id) {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error("Permission not found");
    return permission;
  }

  async updatePermission(id, data) {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error("Permission not found");
    await permission.update(data);
    return permission;
  }

  async deletePermission(id) {
    const permission = await Permission.findByPk(id);
    if (!permission) throw new Error("Permission not found");

    // Check if permission is assigned to any roles
    const roleCount = await RolePermission.count({ where: { permissionId: id } });
    if (roleCount > 0) {
      throw new Error(`Cannot delete permission: it is assigned to ${roleCount} role(s)`);
    }

    await permission.destroy();
    return true;
  }

  async getRolePermissions(roleId) {
    const role = await Role.findByPk(roleId, {
      include: { model: Permission, as: "permissions" }
    });
    if (!role) throw new Error("Role not found");
    return role.permissions;
  }

  async assignPermissionsToRole(roleId, permissionIds) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error("Role not found");

    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    if (permissions.length !== permissionIds.length) {
      throw new Error("One or more permissions not found");
    }

    await role.addPermissions(permissions);
    return await this.getRolePermissions(roleId);
  }

  async syncRolePermissions(roleId, permissionIds) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error("Role not found");

    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    await role.setPermissions(permissions);
    return await this.getRolePermissions(roleId);
  }

  async removePermissionsFromRole(roleId, permissionIds) {
    const role = await Role.findByPk(roleId);
    if (!role) throw new Error("Role not found");

    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    await role.removePermissions(permissions);
    return true;
  }
}

export default new AuthService();
