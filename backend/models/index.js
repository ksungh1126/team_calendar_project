const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 정의
db.User = require('./User')(sequelize);
db.Event = require('./Event')(sequelize);
db.Team = require('./Team')(sequelize);
db.TeamMember = require('./TeamMember')(sequelize);
db.Friend = require('./Friend')(sequelize);

// 모델 간의 관계 설정
db.User.hasMany(db.Event, { foreignKey: 'userId' });
db.Event.belongsTo(db.User, { foreignKey: 'userId' });

db.Team.hasMany(db.TeamMember, { foreignKey: 'teamId' });
db.TeamMember.belongsTo(db.Team, { foreignKey: 'teamId' });

db.User.hasMany(db.TeamMember, { foreignKey: 'userId' });
db.TeamMember.belongsTo(db.User, { foreignKey: 'userId' });

// 친구 관계 설정
db.User.belongsToMany(db.User, {
  through: db.Friend,
  as: 'friends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

module.exports = db; 