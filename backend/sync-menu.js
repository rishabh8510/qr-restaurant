'use strict';

require('dotenv').config();
const { Sequelize } = require('sequelize');
const { getMenuData } = require('./menu-seed-data.js');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const isSsl = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});

async function syncMenu() {
  console.log('🔗 Connecting to database...');
  try {
    await sequelize.authenticate();
    console.log('✔ Connected to database successfully.');

    const queryInterface = sequelize.getQueryInterface();

    console.log('🧹 Removing old menu data...');
    try {
      await queryInterface.bulkDelete('product_likes', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('dish_of_the_day', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('offers', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('banners', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('products', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('sub_categories', null, {});
    } catch (_) {}
    try {
      await queryInterface.bulkDelete('categories', null, {});
    } catch (_) {}

    console.log('🌱 Populating database with verified menu items from image...');
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

    console.log('======================================================');
    console.log('🎉 Menu synchronization complete!');
    console.log(`   📂 Categories:     ${data.categories.length}`);
    console.log(`   📁 Sub-Categories: ${data.subCategories.length}`);
    console.log(`   🍕 Products:       ${data.products.length}`);
    console.log('======================================================');
  } catch (err) {
    console.error('❌ Menu sync error:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

syncMenu();
