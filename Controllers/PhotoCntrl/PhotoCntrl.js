const {models} = require('../../sequelize');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config()
const QRCode = require('qrcode');
const appSocket = require("../../app");
const sharp = require('sharp');

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
    // try {
    let group = await models.photogroup.update({moderating: true}, {
        where:
            {
                id: groupid
            }
    });
    let Photos = await models.photos.findAll({where: {photogroupId: groupid}});
    for (let i = 0; i < Photos.length; i++) {
        let filePath = path.join('uploads', 'preview', Photos[i].name);
        const outputImagePath = path.join('uploads', 'preview', "1_result_" + Photos[i].name); // Путь для сохранения результирующего изображения

        const PathsArray = ['uploads/whatermarks/1.png', 'uploads/whatermarks/2.png', 'uploads/whatermarks/3.png', 'uploads/whatermarks/4.png', 'uploads/whatermarks/5.png'];
        let randomIndex = Math.floor(Math.random() * PathsArray.length);
        let watermarkImagePath = PathsArray[randomIndex];
        await sharp(filePath).metadata()
            .then(baseMetadata => {
                // Загрузка наложенного изображения и масштабирование к размеру основного
                sharp(watermarkImagePath)
                    .resize({
                        width: baseMetadata.width,
                        height: baseMetadata.height
                    })
                    .toBuffer()
                    .then(overlayBuffer => {
                        // Наложение наложенного изображения на основное
                        sharp(filePath)
                            .composite([{
                                input: overlayBuffer,
                                gravity: sharp.gravity.center // позиционирование по центру
                            }])
                            .toFile(outputImagePath)
                            .then(() => {
                                console.log('Изображения успешно наложены.');

                            })
                            .catch(err => {
                                console.error('Ошибка при наложении изображений:', err);
                            });
                    })
                    .catch(err => {
                        console.error('Ошибка при масштабировании наложенного изображения:', err);
                    });
            })
            .catch(err => {
                console.error('Ошибка при загрузке основного изображения:', err);
            });




        await models.photos.update({
            name: "1_result_" + Photos[i].name,
            url: process.env.SITEURL + "img/" + "1_result_" + Photos[i].name,
        },{
            where:
                {
                    id:Photos[i].id
                }
        })
    }


    await appSocket.SS(JSON.stringify({status: "group comfirmed", group: groupid}));
    return group;
    /* } catch (e) {
         return false
     }*/

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
    const outputImagePath = path.join('uploads', 'preview', "new_" + fileData.name); // Путь для сохранения результирующего изображения


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