'use strict';

const { getMenuData } = require('../menu-seed-data.js');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = getMenuData();

    await queryInterface.bulkInsert('categories', data.categories);
    await queryInterface.bulkInsert('sub_categories', data.subCategories);
    await queryInterface.bulkInsert('products', data.products);
    await queryInterface.bulkInsert('banners', data.banners);
    await queryInterface.bulkInsert('dish_of_the_day', data.dishesOfTheDay);
    await queryInterface.bulkInsert('offers', data.offers);

    console.log(`✔ Demo menu seeded: ${data.products.length} products inserted.`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('offers', null, {});
    await queryInterface.bulkDelete('dish_of_the_day', null, {});
    await queryInterface.bulkDelete('banners', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('sub_categories', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};
