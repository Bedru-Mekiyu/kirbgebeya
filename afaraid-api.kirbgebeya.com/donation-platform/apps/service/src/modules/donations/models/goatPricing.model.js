import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const GoatPricing = sequelize.define(
  "GoatPricing",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    goatPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 50.0,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "ETB",
      allowNull: false,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "campaigns",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "goat_pricing",
  }
);

export default GoatPricing;
