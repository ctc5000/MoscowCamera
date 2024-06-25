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


module.exports = {
    uploadPhoto,

}