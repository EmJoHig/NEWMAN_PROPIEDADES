const config = require("dotenv").config();


const configurations = {
  PORT: process.env.PORT || 3000,
  MONGODB_HOST: process.env.MONGODB_HOST || "localhost",
  MONGODB_DATABASE: process.env.MONGODB_DB || "inmobiliaria-app",
  MONGODB_URI: `mongodb://${process.env.MONGODB_HOST || "localhost"}/${
    process.env.MONGODB_DATABASE || "inmobiliaria-app"
  }`,
};

// export default configurations;
module.exports = configurations;