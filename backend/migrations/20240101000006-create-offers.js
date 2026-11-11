'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discount_type: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      applicable_to: {
        type: Sequelize.ENUM('all', 'products', 'categories'),
        allowNull: false,
        defaultValue: 'all',
      },
      product_ids: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      category_ids: {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(500),
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('offers', ['is_active']);
    await queryInterface.addIndex('offers', ['start_date']);
    await queryInterface.addIndex('offers', ['end_date']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('offers');
  },
};
