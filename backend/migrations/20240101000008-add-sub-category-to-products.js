'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'sub_category_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'sub_categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('products', ['sub_category_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('products', ['sub_category_id']);
    await queryInterface.removeColumn('products', 'sub_category_id');
  },
};
