const {models} = require('../../sequelize');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config()
const multer = require('multer');
const QRCode = require('qrcode');
const appSocket = require("../../app");

// Обработка POST запроса на /uploadSnapshot
async function uploadPhoto(photodata) {

    let timestamp = Date.now();
    if (!photodata.snapshot && !photodata.snapshot2 && !photodata.snapshot3) {
        return handleError('No snapshot data found', res);
    }

    let PhotoGroup = await models.photogroup.create({
        name: timestamp,
        moderating: false,
        active: true
    });

    //snapshot 1
    let fileName = `snapshot_${timestamp}_${uuidv4()}.png`;
    let filePath = process.env.PHOTODIR;// path.join('uploads', 'preview', fileName);
    let base64Data = photodata.snapshot.replace(/^data:image\/png;base64,/, '');

    await fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return err;
        }
    });
    await models.photos.create({
        name: fileName,
        url: process.env.SITEURL + "/img/" + fileName,
        active: false,
        photogroupId: PhotoGroup.id
    });
    //snapshot 2
    fileName = `snapshot_${timestamp}_${uuidv4()}.png`;
    filePath = path.join('uploads', 'preview', fileName);
    base64Data = photodata.snapshot2.replace(/^data:image\/png;base64,/, '');

    await fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return err;
        }
    });
    await models.photos.create({
        name: fileName,
        url: process.env.SITEURL + "/img/" + fileName,
        active: false,
        photogroupId: PhotoGroup.id
    });
    //snapshot 3
    fileName = `snapshot_${timestamp}_${uuidv4()}.png`;
    filePath = path.join('uploads', 'preview', fileName);
    base64Data = photodata.snapshot3.replace(/^data:image\/png;base64,/, '');

    await fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return err;
        }
    });
    await models.photos.create({
        name: fileName,
        url: process.env.SITEURL + "/img/" + fileName,
        active: false,
        photogroupId: PhotoGroup.id
    });


    let address = process.env.SITEURL + 'api/photos/myphoto?groupId=' + PhotoGroup.id;

    // Создаем QR-код
    const qrImage = await QRCode.toDataURL(address);
    await appSocket.SS(JSON.stringify({status: "new photos uploaded", photo: PhotoGroup}));
    return qrImage;

}

async function unconfirmed() {

    let PhotoByGroup = await models.photogroup.findAll({
        include:
            [{
                model: models.photos
            }]
    });
    return PhotoByGroup;
}

async function getConfirmed() {

    let photos = await models.photos.findAll({
        where:
            {
                active: true
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


module.exports = {
    uploadPhoto,
    unconfirmed,
    getConfirmed,
    getBygroup,
    setModeratingGroup,
    acceptPhoto,
    rejectGroup,
}