const {models} = require('../../sequelize');
async function SynchBd()
{
    await models.photogroup.sync({force: false, alter: true });
    await models.photos.sync({force: false, alter: true });
    await models.promocode.sync({force: false, alter: true });
    await models.promocodemsk.sync({force: false, alter: true });
    await models.users.sync({force: false, alter: true });
}
async function RebuildBd()
{
    await models.photogroup.sync({force: true, alter: true });
    await models.photos.sync({force: true, alter: true });
    await models.promocode.sync({force: true, alter: true });
    await models.promocodemsk.sync({force: true, alter: true });
    await models.users.sync({force: true, alter: true });

}
async function ClearPhoto()
{
    await models.photogroup.sync({force: true, alter: true });
    await models.photos.sync({force: true, alter: true });
    await models.users.sync({force: true, alter: true });

}
module.exports = {
    SynchBd,
    RebuildBd,
    ClearPhoto
};