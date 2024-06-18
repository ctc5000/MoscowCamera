const app = require('./app');
const Settings = require('./Controllers/Settings/SettingsCntrl');
const sequelize = require('./sequelize');
const {models} = require("./sequelize");
const PORT = process.env.PORT;



async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}


async function init() {
    await assertDatabaseConnectionOk();
    app.listen(PORT, () => {
        console.log(`Сервер успешно запущен на порту: ${PORT}. доступ к апи '/api/'.`);
    });
   // await models.photos.sync({force: true, alter: true });
   // await models.photogroup.sync({force: true, alter: true });
    //await Settings.SynchBd();
}

init();


module.exports = {
    sequelize: sequelize,
};


