const {Sequelize} = require('sequelize');
const {applyExtraSetup} = require('./extra-setup');
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.BASELOGIN,
    process.env.BASEPASSWORD,
    {
        host: process.env.BASEPHOST,
        dialect: 'postgres',
        // logging: false
    }
)

const modelDefiners = [
    require('../Models/Photo/PhotoItem.model'),
    require('../Models/Photo/PhotoGroup.model'),
    require('../Models/PromoCodes/PromoCodes.model'),
    require('../Models/PromoCodes/PromoCodesMsk.model'),



];
// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
