'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Deactivate all existing offers so no offer discount applies
    await queryInterface.bulkUpdate('offers', { is_active: false }, {});

    // 2. Clear old discounts from products
    await queryInterface.bulkUpdate('products', { discount: null, old_price: null }, {});
  },

  async down(queryInterface) {
    // No-op
  },
};
