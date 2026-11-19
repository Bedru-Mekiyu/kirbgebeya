'use strict';

import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      donorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Donors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      campaignId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Campaigns',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      donationType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'goats',
      },
      goatDetails: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dedication: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      newsletter: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('Donations', ['donorId']);
    await queryInterface.addIndex('Donations', ['campaignId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Donations');
  },
};
