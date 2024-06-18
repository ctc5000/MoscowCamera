function applyExtraSetup(sequelize) {
    const {
        photos,
        photogroup,


    } = sequelize.models;

   // photogroup.hasMany(photos);
   // photos.belongsTo(photogroup);


}


module.exports = {applyExtraSetup};
