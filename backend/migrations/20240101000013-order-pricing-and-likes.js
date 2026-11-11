'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'tax', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('orders', 'discount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('orders', 'pricing_meta', {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.createTable('product_likes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      guest_key: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('product_likes', ['product_id']);
    await queryInterface.addIndex('product_likes', ['user_id']);
    await queryInterface.addIndex('product_likes', ['guest_key']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_likes');
    await queryInterface.removeColumn('orders', 'tax');
    await queryInterface.removeColumn('orders', 'discount');
    await queryInterface.removeColumn('orders', 'pricing_meta');
  },
};