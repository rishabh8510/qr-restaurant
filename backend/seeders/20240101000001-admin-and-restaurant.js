'use strict';

const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const adminId = uuidv4();
    const restaurantId = uuidv4();

    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const hashed = await argon2.hash(password);

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: process.env.ADMIN_NAME || 'Admin User',
        email: (process.env.ADMIN_EMAIL || 'admin@restaurant.com').toLowerCase(),
        phone: null,
        password: hashed,
        role: 'admin',
        is_active: true,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    ]);

    await queryInterface.bulkInsert('restaurants', [
      {
        id: restaurantId,
        name: 'Lotus Hut',
        description: 'Lotus Hut Cafe & Bistro',
        logo: '/logo.jpeg',
        cover_image: null,
        address: 'MG Road, Bhopal, Madhya Pradesh 462001',
        phone: '+91 98765 43210',
        email: 'contact@lotushut.com',
        opening_hours: JSON.stringify({
          monday: '09:00-22:00',
          tuesday: '09:00-22:00',
          wednesday: '09:00-22:00',
          thursday: '09:00-22:00',
          friday: '09:00-23:00',
          saturday: '10:00-23:00',
          sunday: '10:00-21:00',
        }),
        social_links: JSON.stringify({
          facebook: '',
          instagram: '',
          twitter: '',
        }),
        settings: JSON.stringify({
          currency: 'USD',
          timezone: 'UTC',
        }),
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('restaurants', null, {});
    await queryInterface.bulkDelete('users', { role: 'admin' }, {});
  },
};
