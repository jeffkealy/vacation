// Copy this file as config.js in the same folder, with the proper database connection URI.
require('dotenv').config();
module.exports =
{
  db: 'mongodb://'+process.env.username+':'+process.env.password+'@ds027348.mlab.com:27348/heroku_gbp2sgfl',
  db_dev: 'mongodb://'+process.env.username+':'+process.env.password+'@ds027348.mlab.com:27348/heroku_gbp2sgfl'
};
