const SettingsCntrl = require("./SettingsCntrl");
const {models} = require("../../sequelize");

async function SynchBd(req,res)
{
    const Result = await SettingsCntrl.SynchBd();
    res.json(true);
}
async function RebuildBd(req,res)
{
    const Result = await SettingsCntrl.RebuildBd();
    res.json(true);
}

module.exports={
    SynchBd,
    RebuildBd,
}


