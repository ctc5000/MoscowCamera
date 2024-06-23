const {models} = require("../../sequelize");

async function auth(data) {
    const user = await models.users.findOne({where: {login: data.login, password: data.password}});
    if (user) {
        return true; // Логин и пароль совпадают
    } else {
        return false; // Логин или пароль неверны
    }
}

async function create(data) {
    const user = await models.users.create({login: data.login, password: data.password, name: data.name});
    return user;
}

async function dropuser(id) {
    const user = await models.users.destroy({where: {id: id}});
    return true;
}

module.exports = {
    auth,
    create,
    dropuser,
}


