'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Extend orders table
    await queryInterface.addColumn('orders', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('orders', 'assigned_staff_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('orders', 'order_source', {
      type: Sequelize.ENUM('website', 'staff', 'admin'),
      allowNull: false,
      defaultValue: 'website',
    });
    await queryInterface.addColumn('orders', 'accepted_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['assigned_staff_id']);
    await queryInterface.addIndex('orders', ['order_source']);
    await queryInterface.addIndex('orders', ['status', 'assigned_staff_id']);

    // OTP table for mobile login
    await queryInterface.createTable('otps', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.addIndex('otps', ['phone']);
    await queryInterface.addIndex('otps', ['phone', 'code']);

    // Allow customer role and make email/password optional for customers
    // Note: ENUM alteration is DB-specific; for Postgres we can add value
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'customer';`
    ).catch(() => {});

    // Make email nullable and not unique for customers (we'll handle uniqueness in app)
    // Safer: keep email unique but allow null by changing constraint if needed
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'user_id');
    await queryInterface.removeColumn('orders', 'assigned_staff_id');
    await queryInterface.removeColumn('orders', 'order_source');
    await queryInterface.removeColumn('orders', 'accepted_at');
    await queryInterface.dropTable('otps');
  },
};
