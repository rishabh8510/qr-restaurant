#!/bin/sh
set -e

echo "Waiting for PostgreSQL database to be ready..."
# Wait for the database using a simple Node test script
node -e '
const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function check() {
  for (let i = 0; i < 30; i++) {
    try {
      await client.connect();
      console.log("Database connection successful!");
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log("Waiting for database connection...", err.message);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  console.error("Timeout connecting to database.");
  process.exit(1);
}
check();
'

echo "Running migrations..."
npx sequelize-cli db:migrate

echo "Running seeders (if not seeded)..."
npx sequelize-cli db:seed:all || echo "Seeders skipped or already applied."

echo "Starting server..."
exec node dist/server.js
