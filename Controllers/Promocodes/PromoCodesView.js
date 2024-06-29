const PromocodesCntrl = require("./PromoCodesCntrl");
const {models} = require("../../sequelize");

async function loadFromCsv(req,res)
{
    const Result = await PromocodesCntrl.loadFromCsv(req.body);
    res.json(true);
}
async function grantOneCode(req,res)
{
    const Result = await PromocodesCntrl.grantOneCode();
    res.json(Result);
}
async function getPromoById(req,res)
{
    const Result = await PromocodesCntrl.getPromoById(req.query.id);
    res.json(Result);
}
async function grantOneMskCode(req,res)
{
    const Result = await PromocodesCntrl.grantOneMskCode();
    res.json(Result);
}
async function getPromoMskById(req,res)
{
    const Result = await PromocodesCntrl.getPromoMskById(req.query.id);
    res.json(Result);
}
async function GetCsv(req,res)
{
    const Result = await PromocodesCntrl.GetCsv();
    res.json(Result);
}
module.exports={
    loadFromCsv,
    grantOneCode,
    getPromoById,
    getPromoMskById,
    grantOneMskCode,
    GetCsv,

}


