const path = require('path');
const dotenv = require('dotenv');

// Load .env configuration from current dir, backend dir, or root dir
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const routes = require('./routes');
const { testDbConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', routes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await testDbConnection();
});

module.exports = app;
