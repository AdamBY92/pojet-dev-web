const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

let sequelize;

// If DATABASE_URL is provided and looks like sqlite, use sqlite dialect
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('sqlite')) {
    const storagePath = process.env.DATABASE_URL.replace('sqlite://', '') || 'database.sqlite';
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: storagePath,
      logging: false,
    });
  } else {
    // Default to postgres when a DATABASE_URL is provided
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
  }
} else {
  // No DATABASE_URL: use a local sqlite file so the app can run without Postgres
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;