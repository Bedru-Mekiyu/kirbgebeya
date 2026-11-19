import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
  },
  {
    timestamps: true,
    tableName: "roles",
  }
);

export default Role;
