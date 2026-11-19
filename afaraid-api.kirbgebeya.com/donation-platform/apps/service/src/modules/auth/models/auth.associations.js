export default function attachAuthAssociations(models) {
  const { User, Role, Permission, UserRole, RolePermission } = models;
  if (!User || !Role) return;

  if (User.belongsToMany && !User.associations?.roles) {
    User.belongsToMany(Role, {
      through: UserRole,
      foreignKey: "userId",
      otherKey: "roleId",
      as: "roles",
    });
  }
  if (Role.belongsToMany && !Role.associations?.users) {
    Role.belongsToMany(User, {
      through: UserRole,
      foreignKey: "roleId",
      otherKey: "userId",
      as: "users",
    });
  }

  if (Role.belongsToMany && !Role.associations?.permissions) {
    Role.belongsToMany(Permission, {
      through: RolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions",
    });
  }
  if (Permission.belongsToMany && !Permission.associations?.roles) {
    Permission.belongsToMany(Role, {
      through: RolePermission,
      foreignKey: "permissionId",
      otherKey: "roleId",
      as: "roles",
    });
  }
};
