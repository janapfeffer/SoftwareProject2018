require('dotenv').config(); //instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mongoDB';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'event_finder';
CONFIG.db_user = process.env.DB_USER || 'SCRAM_user';
CONFIG.db_password = process.env.MONGO_ATLAS_PW || "EventFinder2018"

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || 'HS256';
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;
