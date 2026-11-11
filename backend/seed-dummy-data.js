'use strict';

const seeder = require('./seeders/20240101000002-demo-menu-data.js');
const { sequelize } = require('./dist/config/database');

async function run() {
  console.log('Seeding dummy menu data (Categories, SubCategories, Products, Banners, Offers)...');
  try {
    const queryInterface = sequelize.getQueryInterface();
    await seeder.up(queryInterface, sequelize.Sequelize);
    console.log('✔ Dummy menu data successfully seeded into database!');
  } catch (err) {
    if (err.message && err.message.includes('duplicate key')) {
      console.log('✔ Data already exists or duplicate key skipped.');
    } else {
      console.error('Seeding error:', err.message);
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

run();
