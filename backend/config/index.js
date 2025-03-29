const dbConfig = require('./db.config');
const appConfig = require('./app.config');

module.exports = {
  ...dbConfig,
  ...appConfig
}; 