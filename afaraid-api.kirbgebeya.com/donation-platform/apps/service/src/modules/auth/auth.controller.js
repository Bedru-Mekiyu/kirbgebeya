// src/modules/auth/auth.controller.js
import AuthService from "./auth.service.js";

class AuthController {
  async createUser(req, res) {
    try {
      const user = await AuthService.createUser(req.body);
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      const statusCode =
        error.message.includes("exists") || error.message.includes("required")
          ? 400
          : 500;

      return res.status(statusCode).json({
        success: false,
        message:
          statusCode === 400
            ? error.message
            : "An unexpected error occurred while creating the user",
      });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await AuthService.getUsers();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await AuthService.getUserById(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await AuthService.updateUser(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await AuthService.deleteUser(req.params.id);
      res.json({ success: true, message: "User deleted" });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async activateUser(req, res) {
    try {
      const user = await AuthService.activateUser(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deactivateUser(req, res) {
    try {
      const user = await AuthService.deactivateUser(req.params.id);
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async createRole(req, res) {
    try {
      const role = await AuthService.createRole(req.body);
      res.status(201).json({ success: true, data: role });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getRoles(req, res) {
    try {
      const roles = await AuthService.getRoles();
      res.json({ success: true, data: roles });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async assignRole(req, res) {
    try {
      const user = await AuthService.assignRoleToUser(
        req.params.userId,
        req.body.roleId
      );
      res.json({ success: true, data: user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllPermissions(req, res) {
    try {
      const permissions = await AuthService.getAllPermissions();
      res.json({ success: true, data: permissions });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async createPermission(req, res) {
    try {
      const permission = await AuthService.createPermission(req.body);
      res.status(201).json({ success: true, data: permission });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async assignPermission(req, res) {
    try {
      const role = await AuthService.assignPermissionToRole(
        req.params.roleId,
        req.body.permissionId
      );
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, token: result.token });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  async getRolesWithUserCount(req, res) {
    try {
      const roles = await AuthService.getRolesWithUserCount();
      res.json({ success: true, data: roles });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getRoleById(req, res) {
    try {
      const role = await AuthService.getRoleById(req.params.id);
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async updateRole(req, res) {
    try {
      const role = await AuthService.updateRole(req.params.id, req.body);
      res.json({ success: true, data: role });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteRole(req, res) {
    try {
      await AuthService.deleteRole(req.params.id);
      res.json({ success: true, message: "Role deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async searchRoles(req, res) {
    try {
      const { q } = req.query;
      const roles = await AuthService.searchRoles(q);
      res.json({ success: true, data: roles });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async assignRolesToUser(req, res) {
    try {
      await AuthService.assignRolesToUser(
        req.params.userId,
        req.body.roleIds
      );
      res.json({ success: true, message: "Roles assigned successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async removeRolesFromUser(req, res) {
    try {
      await AuthService.removeRolesFromUser(
        req.params.userId,
        req.body.roleIds
      );
      res.json({ success: true, message: "Roles removed successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getUserRoles(req, res) {
    try {
      const roles = await AuthService.getUserRoles(req.params.userId);
      res.json({ success: true, data: roles });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getPermissionById(req, res) {
    try {
      const permission = await AuthService.getPermissionById(req.params.id);
      res.json({ success: true, data: permission });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async updatePermission(req, res) {
    try {
      const permission = await AuthService.updatePermission(req.params.id, req.body);
      res.json({ success: true, data: permission });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deletePermission(req, res) {
    try {
      await AuthService.deletePermission(req.params.id);
      res.json({ success: true, message: "Permission deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getRolePermissions(req, res) {
    try {
      const permissions = await AuthService.getRolePermissions(req.params.roleId);
      res.json({ success: true, data: permissions });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async assignPermissionsToRole(req, res) {
    try {
      const rolePermissions = await AuthService.assignPermissionsToRole(
        req.params.roleId,
        req.body.permissionIds
      );
      res.json({ success: true, data: rolePermissions });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async syncRolePermissions(req, res) {
    try {
      const rolePermissions = await AuthService.syncRolePermissions(
        req.params.roleId,
        req.body.permissionIds
      );
      res.json({ success: true, data: rolePermissions });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async removePermissionsFromRole(req, res) {
    try {
      await AuthService.removePermissionsFromRole(
        req.params.roleId,
        req.body.permissionIds
      );
      res.json({ success: true, message: "Permissions removed successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

}

export default new AuthController();
