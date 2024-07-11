const { Sequelize } = require('sequelize');

// Database connection details
const sequelize = new Sequelize({
  dialect: 'postgres', // Specify your database dialect here
  host: 'localhost',   // Your database host
  port: 5432,          // Your database port
  username: 'postgres', // Your database username
  password: 'root',    // Your database password
  database: 'PTEDI_Interview', // Your database name
});

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the testConnection function to verify database connectivity
testConnection();

module.exports = sequelize;
