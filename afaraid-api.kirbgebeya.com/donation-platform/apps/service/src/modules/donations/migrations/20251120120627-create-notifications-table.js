"use strict";

import { DataTypes } from "sequelize";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notifications", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
        allowNull: false,
        defaultValue: "system",
      },
      channel: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("notifications", ["recipientId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("notifications");
  },
};
