"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("campaign_details", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "campaigns",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      beneficiaries: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      raisedAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      goalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      donors: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      longDescription: {
        type: Sequelize.TEXT("long"),
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("campaign_details");
  },
};
