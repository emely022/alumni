const path = require('path');
const dotenv = require('dotenv');

// Load .env configuration from current dir, backend dir, or root dir
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { testDbConnection } = require('./config/db');
const { runMigrations } = require('./config/migrate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger API Documentation
app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api/swagger`);
  const isDbConnected = await testDbConnection();
  if (isDbConnected) {
    try {
      await runMigrations();
    } catch (migErr) {
      console.error('Migration execution failed:', migErr.message);
    }
  }
});

module.exports = app;
