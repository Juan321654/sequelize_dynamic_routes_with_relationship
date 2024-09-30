'use strict';
const {
     Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
     class User extends Model {
          /**
           * Helper method for defining associations.
           * This method is not a part of Sequelize lifecycle.
           * The `models/index` file will call this method automatically.
           */
          static associate(models) {
               // define association here

               User.hasMany(models.Post, {
                    foreignKey: 'userId',
                    as: 'posts',
               });

          }
     }
     User.init({
          name: DataTypes.STRING,
          roleId: DataTypes.INTEGER
     }, {
          sequelize,
          modelName: 'User',
     });

     User.beforeDestroy(async (user, options) => {
          await sequelize.models.Post.destroy({
               where: {
                    userId: user.id
               }
          });
     });

     return User;
};