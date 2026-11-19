'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("campaign_details", "currency", {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("campaign_details", "currency");
  },
};

