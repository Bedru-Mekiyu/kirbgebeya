import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";
import Donor from "./donor.model.js";
import Campaign from "../../campaigns/models/campaigns.model.js";

const Donation = sequelize.define(
  "Donation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    donorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Donor,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Campaign,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    donationType: {
      type: DataTypes.ENUM("goats", "amount"),
      defaultValue: "goats",
    },
    goatDetails: { type: DataTypes.JSON },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    dedication: { type: DataTypes.TEXT },
    anonymous: { type: DataTypes.BOOLEAN, defaultValue: false },
    newsletter: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "donations",
  }
);

export default Donation;
