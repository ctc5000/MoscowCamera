const PhotoCntrl = require("./PhotoCntrl");
const {models} = require("../../sequelize");

async function uploadPhoto(req,res)
{
    const Result = await PhotoCntrl.uploadPhoto(req.body);
    res.json(Result);
}
async function unconfirmed(req,res)
{
    const Result = await PhotoCntrl.unconfirmed();
    res.json(Result);
}
async function getConfirmed(req,res)
{
    const Result = await PhotoCntrl.getConfirmed();
    res.json(Result);
}
async function getBygroup(req,res)
{
    const Result = await PhotoCntrl.getBygroup(req.query.groupId);
    res.json(Result);
}
async function setModeratingGroup(req,res)
{
    const Result = await PhotoCntrl.setModeratingGroup(req.body.groupId);
    res.json(Result);
}
module.exports={
    uploadPhoto,
    unconfirmed,
    getConfirmed,
    getBygroup,
    setModeratingGroup,
}


