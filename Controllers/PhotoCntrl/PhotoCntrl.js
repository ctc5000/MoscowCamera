const {models} = require('../../sequelize');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config()
const QRCode = require('qrcode');
const appSocket = require("../../app");

// Обработка POST запроса на /uploadSnapshot


async function CreatePhotoGroup() {
    let timestamp = Date.now();
    let PhotoGroup = await models.photogroup.create({
        name: timestamp,
        moderating: false,
        active: true,
        rejected: false
    });
    return PhotoGroup;
}

async function uploadPhoto(fileName, groupId) {

    /* let timestamp = Date.now();
     if (!photodata.snapshot) {
         return handleError('No snapshot data found', res);
     }

     //snapshot 1
     let fileName = `yandexgo_${timestamp}_${uuidv4()}p1.png`;
     let filePath = path.join('uploads', 'preview', fileName);
     let base64Data = photodata.snapshot.replace(/^data:image\/png;base64,/, '');

     await fs.writeFile(filePath, base64Data, 'base64', (err) => {
         if (err) {
             return err;
         }
     });*/

    //http://msksamapi.ru//img/uploads/preview/yqndexgo_1719178910696.jpg
    console.log(groupId);
    await models.photos.create({
        name: fileName,
        url: process.env.SITEURL + "img/" + fileName,
        active: false,
        photogroupId: groupId
    });

    let address = process.env.SITEURL + 'api/photos/myphoto?groupId=' + groupId;

    // Создаем QR-код
    const qrImage = await QRCode.toDataURL(address);
    await appSocket.SS(JSON.stringify({status: "new photos uploaded", photo: groupId}));
    return qrImage;

}

async function unconfirmed() {

    let PhotoByGroup = await models.photogroup.findAll({

        where: {moderating: false, rejected: false},
        include:
            [{
                model: models.photos
            }]
    });
    return PhotoByGroup;
}

async function getConfirmed() {

    let photos = await models.slide.findAll({
        where:
            {
                active: true,
            },
        attributes: ['name', 'url']
    });
    return photos;
}

async function getBygroup(groupid) {

    let photos = await models.photos.findAll({
        where:
            {
                photogroupId: groupid
            },
        include: {
            model: models.photogroup,
            where: {moderating: true},
            attributes: ['id']
        },
        attributes: ['name', 'url', 'id']
    });
    if (photos.length != 0) {
        return {
            photos: photos,
            status: "confirmed"
        };
    } else {
        return {
            photos: photos,
            status: "unconfirmed"
        };
    }
}

async function setModeratingGroup(groupid) {
    try {
        let group = await models.photogroup.update({moderating: true}, {
            where:
                {
                    id: groupid
                }
        });
        await appSocket.SS(JSON.stringify({status: "group comfirmed", group: groupid}));
        return group;
    } catch (e) {
        return false
    }

}

async function rejectGroup(groupid) {

    try {
        let group = await models.photogroup.update({rejected: true}, {
            where:
                {
                    id: groupid
                }
        });
        await appSocket.SS(JSON.stringify({status: "group rejected", group: groupid}));
        return group;
    } catch (e) {
        return false
    }

}

async function deleteGroup(groupid) {

    try {
        let group = await models.photogroup.destroy({
            where:
                {
                    id: groupid
                }
        });
        await appSocket.SS(JSON.stringify({status: "group destroyed", group: groupid}));
        return true;
    } catch (e) {
        return false
    }

}

async function acceptPhoto(photoId) {

    let photo = await models.photos.update({active: true}, {
        where:
            {
                id: photoId
            }
    });
    let Photo = await models.photos.findOne({where: {id: photoId}});
    await appSocket.SS(JSON.stringify({status: "photo accepted", photo: Photo}));
    return photo;
}


async function GetPhotoFile(fileId) {
    let fileData = await models.photos.findOne({where: {id: fileId}});
    const path = require('path');
    let filePath = path.join('uploads', 'preview', fileData.name);
    // Проверка, существует ли файл
    return filePath;
}
async function GetPhotoSlideFile(fileId) {
    let fileData = await models.slide.findOne({where: {id: fileId}});
    const path = require('path');
    let filePath = path.join('uploads', 'preview', fileData.name);
    // Проверка, существует ли файл
    return filePath;
}

module.exports = {
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
    GetPhotoSlideFile,
}