import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "role_id",
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "permission_id",
    },
  },
  {
    tableName: "rolepermissions",
    timestamps: true,
  }
);

RolePermission.associate = (models) => {
  RolePermission.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
  RolePermission.belongsTo(models.Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });
};

export default RolePermission;
