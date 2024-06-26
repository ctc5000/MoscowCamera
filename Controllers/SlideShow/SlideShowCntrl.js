const {models} = require('../../sequelize');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config()
const QRCode = require('qrcode');
const appSocket = require("../../app");

// Обработка POST запроса на /uploadSnapshot


async function uploadPhoto(fileName) {

    let slide = await models.slide.create({
        name: fileName,
        url: process.env.SITEURL + "img/" + fileName,
        active: true
    });
    await appSocket.SS(JSON.stringify({status: "new slide uploaded", slide: slide.id}));
    return true;
}
async function SetNewSlide(id) {

    let photo = await models.photos.findOne(
      {
        where:
            {
                id:id
            }
    })
    let slide = await models.slide.create({
        name: photo.name,
        url: photo.url,
        active: true
    });
    await appSocket.SS(JSON.stringify({status: "new slide seted", slide: slide.id}));
    return true;
}

async function DropSlide(id) {

    let photo = await models.slide.destroy(
        {
            where:
                {
                    id:id
                }
        })
    return true;
}

module.exports = {
    uploadPhoto,
    SetNewSlide,
    DropSlide,

}