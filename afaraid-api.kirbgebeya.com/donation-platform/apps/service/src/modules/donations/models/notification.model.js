import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipientType: {
      type: DataTypes.ENUM("donor", "admin"),
      allowNull: false,
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("donation", "campaign", "system"),
      defaultValue: "system",
    },
    channel: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: null,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
