'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_orders_order_type" ADD VALUE IF NOT EXISTS 'drive_in';`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_orders_order_type" ADD VALUE IF NOT EXISTS 'drive-in';`
      );
    } catch (err) {
      console.log('Notice adding enum value for drive-in:', err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    // In PostgreSQL, removing an enum value requires re-creating the enum type.
  },
};
