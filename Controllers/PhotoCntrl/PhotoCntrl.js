const {models} = require('../../sequelize');
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');
require('dotenv').config()
const multer = require('multer');
// Мультипарт парсер для обработки файлов


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
    let filePath = path.join('uploads', 'preview', fileName);
    let base64Data = photodata.snapshot.replace(/^data:image\/png;base64,/, '');

    await fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            return err;
        }
    });
    await models.photos.create({
        name: fileName,
        url: fileName,
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
        url: fileName,
        active: false,
        photogroupId: PhotoGroup.id
    });
    //snapshot 2
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
        url: fileName,
        active: false,
        photogroupId: PhotoGroup.id
    });
    return PhotoGroup;

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
    return photos;
}
async function setModeratingGroup(groupid) {

    let group = await models.photogroup.update({moderating:true},{
        where:
            {
                id: groupid
            }
    });
    return group;
}

module.exports = {
    uploadPhoto,
    unconfirmed,
    getConfirmed,
    getBygroup,
    setModeratingGroup,
}