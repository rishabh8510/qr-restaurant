'use strict';

const path = require('path');
const { getMenuData } = require('../menu-seed-data.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Cleaning old menu data...');
    // 1. Remove references and old data
    try {
      await queryInterface.bulkDelete('product_likes', null, {});
    } catch (e) {
      console.log('Note: product_likes table clean skipped or empty.');
    }

    try {
      await queryInterface.bulkDelete('dish_of_the_day', null, {});
    } catch (e) {
      console.log('Note: dish_of_the_day clean skipped.');
    }

    try {
      await queryInterface.bulkDelete('offers', null, {});
    } catch (e) {
      console.log('Note: offers clean skipped.');
    }

    try {
      await queryInterface.bulkDelete('banners', null, {});
    } catch (e) {
      console.log('Note: banners clean skipped.');
    }

    try {
      await queryInterface.bulkDelete('products', null, {});
    } catch (e) {
      console.log('Note: products clean skipped.');
    }

    try {
      await queryInterface.bulkDelete('sub_categories', null, {});
    } catch (e) {
      console.log('Note: sub_categories clean skipped.');
    }

    try {
      await queryInterface.bulkDelete('categories', null, {});
    } catch (e) {
      console.log('Note: categories clean skipped.');
    }

    console.log('🌱 Inserting new verified menu from menu image...');
    const data = getMenuData();

    await queryInterface.bulkInsert('categories', data.categories);
    await queryInterface.bulkInsert('sub_categories', data.subCategories);
    await queryInterface.bulkInsert('products', data.products);
    await queryInterface.bulkInsert('banners', data.banners);
    await queryInterface.bulkInsert('dish_of_the_day', data.dishesOfTheDay);
    await queryInterface.bulkInsert('offers', data.offers);

    try {
      await queryInterface.bulkUpdate('restaurants', {
        name: 'Lotus Hut',
        description: 'Lotus Hut Cafe & Bistro',
        logo: '/logo.jpeg',
      }, {});
    } catch (_) {}

    console.log(`✅ Successfully loaded ${data.categories.length} categories, ${data.subCategories.length} subcategories, and ${data.products.length} products!`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('offers', null, {});
    await queryInterface.bulkDelete('dish_of_the_day', null, {});
    await queryInterface.bulkDelete('banners', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('sub_categories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
