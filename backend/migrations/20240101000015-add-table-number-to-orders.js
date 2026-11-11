'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'table_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addIndex('orders', ['table_number']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'table_number');
  },
};
