import { v4 as uuidv4 } from "uuid";
import sequelize from "../../../config/db.js";
import models from "../models/auth.models.js";

const { User, Role, Permission, UserRole, RolePermission } = models;

export default {
  up: async () => {
    const transaction = await sequelize.transaction();

    try {
      const [adminRole] = await Role.findOrCreate({
        where: { name: "admin" },
        defaults: {
          id: uuidv4(),
          name: "admin",
          description: "Administrator role with full access",
        },
        transaction,
      });

      const [adminUser] = await User.findOrCreate({
        where: { email: "admin@example.com" },
        defaults: {
          id: uuidv4(),
          email: "admin@example.com",
          username: "admin",
          first_name: "System",
          last_name: "Administrator",
          password: "Admin@123",
          isActive: true,
        },
        transaction,
      });

      const resources = ["users", "roles", "permissions", "campaigns"];
      const actions = ["create", "read", "update", "delete"];
      const permissions = [];

      for (const resource of resources) {
        for (const action of actions) {
          const [perm] = await Permission.findOrCreate({
            where: { resource, action },
            defaults: {
              id: uuidv4(),
              resource,
              action,
            },
            transaction,
          });
          permissions.push(perm);
        }
      }

      await UserRole.findOrCreate({
        where: { userId: adminUser.id, roleId: adminRole.id },
        defaults: {
          id: uuidv4(),
          userId: adminUser.id,
          roleId: adminRole.id,
        },
        transaction,
      });

      for (const perm of permissions) {
        await RolePermission.findOrCreate({
          where: { roleId: adminRole.id, permissionId: perm.id },
          defaults: {
            id: uuidv4(),
            roleId: adminRole.id,
            permissionId: perm.id,
          },
          transaction,
        });
      }

      await transaction.commit();
      console.log("✅ Admin user, role, and permissions seeded successfully.");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Seeding failed:", error);
    }
  },

  down: async () => {
    const transaction = await sequelize.transaction();
    try {
      const adminUser = await User.findOne({
        where: { email: "admin@example.com" },
      });
      const adminRole = await Role.findOne({ where: { name: "admin" } });

      if (adminUser && adminRole) {
        await UserRole.destroy({
          where: { userId: adminUser.id },
          transaction,
        });
        await RolePermission.destroy({
          where: { roleId: adminRole.id },
          transaction,
        });
        await User.destroy({ where: { id: adminUser.id }, transaction });
        await Role.destroy({ where: { id: adminRole.id }, transaction });
      }

      await transaction.commit();
      console.log("🧹 Admin seed reverted successfully.");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Failed to revert admin seed:", error);
    }
  },
};
