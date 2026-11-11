'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('offers', 'offer_kind', {
      type: Sequelize.STRING(30),
      allowNull: false,
      defaultValue: 'menu',
    });
    await queryInterface.addColumn('offers', 'min_order_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('offers', 'offer_kind');
    await queryInterface.removeColumn('offers', 'min_order_count');
  },
};