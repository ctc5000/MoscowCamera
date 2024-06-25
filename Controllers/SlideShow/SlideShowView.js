const SlideShowCntrl = require("./SlideShowCntrl");
const {models} = require("../../sequelize");

async function SetNewSlide(req,res)
{
    const Result = await SlideShowCntrl.SetNewSlide(req.body.id);
    res.json(Result);
}

module.exports={
    SetNewSlide,
}


