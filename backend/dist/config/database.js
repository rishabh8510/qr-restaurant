"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.connectDatabase = connectDatabase;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
exports.sequelize = new sequelize_1.Sequelize(env_1.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env_1.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: env_1.env.NODE_ENV === 'production' &&
        !env_1.env.DATABASE_URL.includes('@db:') &&
        !env_1.env.DATABASE_URL.includes('@localhost') &&
        !env_1.env.DATABASE_URL.includes('@127.0.0.1')
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }
        : {},
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
async function connectDatabase() {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        process.exit(1);
    }
}
//# sourceMappingURL=database.js.map