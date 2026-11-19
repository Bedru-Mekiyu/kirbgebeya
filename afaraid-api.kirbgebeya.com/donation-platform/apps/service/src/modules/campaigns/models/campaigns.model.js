import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
      defaultValue: "Active",
    },
    isHot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    hasSpecificGoatPricing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: "has_specific_goat_pricing",
    },
  },
  {
    timestamps: true,
    tableName: "campaigns",
  }
);

export default Campaign;
