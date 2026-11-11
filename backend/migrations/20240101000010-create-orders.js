'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      order_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      customer_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      customer_phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      customer_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      order_type: {
        type: Sequelize.ENUM('delivery', 'dining', 'pickup'),
        allowNull: false,
        defaultValue: 'pickup',
      },
      payment_method: {
        type: Sequelize.ENUM('cash', 'card', 'upi', 'online'),
        allowNull: false,
        defaultValue: 'cash',
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      items: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('orders', ['order_number'], { unique: true });
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['payment_status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  },
};
