'use strict';

import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      donationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Donations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'ETB',
      },
      tx_ref: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      externalReference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'completed',
          'failed',
          'cancelled',
          'refunded'
        ),
        defaultValue: 'pending',
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });

    await queryInterface.addIndex('Payments', ['donationId']);
    await queryInterface.addIndex('Payments', ['tx_ref']);
    await queryInterface.addIndex('Payments', ['provider']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Payments');
  },
};
