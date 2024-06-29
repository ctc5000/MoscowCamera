const {models} = require('../../sequelize');
require('dotenv').config()
const fs = require('fs');
const csv = require('csv-parser');
const CsvReadableStream = require('csv-reader');

async function loadFromCsv() {
    await models.promocode.sync({force: true, alter: true});
    await models.promocode.sync({force: false, alter: true});
    await models.promocodemsk.sync({force: true, alter: true});
    await models.promocodemsk.sync({force: false, alter: true});
    let inputStream = fs.createReadStream('promocodes.csv', 'utf8');
    let ArData = [];
    await inputStream
        .pipe(new CsvReadableStream({parseNumbers: true, parseBooleans: true, trim: true}))
        .on('data', async function (row) {
            let code =
                {
                    value: row[0],
                }
            if (row[0] !== 'code') ArData.push(code);

        })
        .on('end', async function () {
            for (let i = 0; i < ArData.length; i++) {
                if (i <= 10000) {
                    let promo = await models.promocode.create({value: ArData[i].value});
                } else {
                    let promo = await models.promocodemsk.create({value: ArData[i].value});
                }
            }
        });
    return true;
}

async function grantOneCode() {

    let promo = await models.promocode.findOne({
        where: {activated: false}
        , attributes: ['id', 'value',]
    });
    await models.promocode.update({
            activated: true,
        }, {where: {id: promo.id}}
    )
    return promo;
}
async function grantOneMskCode() {

    let promo = await models.promocodemsk.findOne({
        where: {activated: false}
        , attributes: ['id', 'value',]
    });
    await models.promocode.update({
            activated: true,
        }, {where: {id: promo.id}}
    )
    return promo;
}

async function getPromoById(id) {

    let promo = await models.promocodemsk.findOne({
        where: {id: id}
        , attributes: ['id', 'value',]
    });

    return promo;
}
async function getPromoMskById(id) {

    let promo = await models.promocode.findOne({
        where: {id: id}
        , attributes: ['id', 'value',]
    });

    return promo;
}
async function GetCsv() {

    let promo = await models.promocodemsk.findAll({where:{activated:false}});
   const csvData = promo.map(user => `${promo.id},${promo.value},${promo.activated}`).join('\n');
   fs.writeFileSync('promomsk.csv', csvData);
    console.log('CSV файл успешно создан');
   let promoSPB = await models.promocodemsk.findAll({where:{activated:false}});
   const csvDataSPB = promo.map(user => `${promoSPB.id},${promoSPB.value},${promoSPB.activated}`).join('\n');
   fs.writeFileSync('promomsk.csv', csvDataSPB);
   console.log('CSV файл успешно создан');

    return promo;
}

module.exports = {
    loadFromCsv,
    grantOneCode,
    getPromoById,
    getPromoMskById,
    grantOneMskCode,
    GetCsv,

}