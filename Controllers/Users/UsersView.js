const UsersCntrl = require("./UsersCntrl");
const {models} = require("../../sequelize");

async function auth(req,res)
{
    const Result = await UsersCntrl.auth(req.body);
    res.json(Result);
}
async function createUser(req,res)
{
    const Result = await UsersCntrl.create(req.body);
    res.json(Result);
}
async function dropuser(req,res)
{
    const Result = await UsersCntrl.dropuser(req.body.id);
    res.json(Result);
}

module.exports={
    auth,
    createUser,
    dropuser,
}


