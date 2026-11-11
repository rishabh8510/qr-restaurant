'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Categories: slug
    await queryInterface.addColumn('categories', 'slug', {
      type: Sequelize.STRING(120),
      allowNull: true,
    });
    await queryInterface.addIndex('categories', ['slug']);

    // Sub-categories: slug
    await queryInterface.addColumn('sub_categories', 'slug', {
      type: Sequelize.STRING(120),
      allowNull: true,
    });
    await queryInterface.addIndex('sub_categories', ['slug']);

    // Products: menu item fields (Swiggy/Zomato style)
    await queryInterface.addColumn('products', 'old_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'discount', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'weight', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'prep_time', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'is_veg', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('products', 'is_egg', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('products', 'is_vegan', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('products', 'is_new', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('products', 'is_bestseller', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('products', 'tags', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
    await queryInterface.addColumn('products', 'rating', {
      type: Sequelize.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('products', 'review_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('products', 'order_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('categories', 'slug');
    await queryInterface.removeColumn('sub_categories', 'slug');
    await queryInterface.removeColumn('products', 'old_price');
    await queryInterface.removeColumn('products', 'discount');
    await queryInterface.removeColumn('products', 'weight');
    await queryInterface.removeColumn('products', 'prep_time');
    await queryInterface.removeColumn('products', 'is_veg');
    await queryInterface.removeColumn('products', 'is_egg');
    await queryInterface.removeColumn('products', 'is_vegan');
    await queryInterface.removeColumn('products', 'is_new');
    await queryInterface.removeColumn('products', 'is_bestseller');
    await queryInterface.removeColumn('products', 'tags');
    await queryInterface.removeColumn('products', 'rating');
    await queryInterface.removeColumn('products', 'review_count');
    await queryInterface.removeColumn('products', 'order_count');
  },
};
