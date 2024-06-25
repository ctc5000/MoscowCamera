const PhotoCntrl = require("./PhotoCntrl");
const {models} = require("../../sequelize");

async function CreatePhotoGroup(req,res)
{
    const Result = await PhotoCntrl.CreatePhotoGroup();
    //res.send(`<img src="${Result}" alt="QR Code">`);
    res.send(Result);
}
async function uploadPhoto(req,res)
{
    const Result = await PhotoCntrl.uploadPhoto(req.body);
    //res.send(`<img src="${Result}" alt="QR Code">`);
    res.send(Result);
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
async function rejectGroup(req,res)
{
    const Result = await PhotoCntrl.rejectGroup(req.body.groupId);
    res.json(Result);
}
async function acceptPhoto(req,res)
{
    const Result = await PhotoCntrl.acceptPhoto(req.body.photoId);
    res.json(Result);
}
async function deleteGroup(req,res)
{
    const Result = await PhotoCntrl.deleteGroup(req.body.groupId);
    res.json(Result);
}async function GetPhotoFile(req,res)
{
    const Result = await PhotoCntrl.GetPhotoFile(req.query.photoId);
    const path = require('path');
    console.log(Result);
    res.sendFile(path.resolve(Result));
}

module.exports={
    uploadPhoto,
    unconfirmed,
    getConfirmed,
    getBygroup,
    setModeratingGroup,
    acceptPhoto,
    rejectGroup,
    deleteGroup,
    CreatePhotoGroup,
    GetPhotoFile,
}


