const { Sequelize } = require('sequelize');
const config = require('../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: dbConfig.logging,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {
  sequelize,
  Sequelize
};

// 모델 정의
db.User = require('./User')(sequelize);
db.Subject = require('./Subject')(sequelize);
db.Team = require('./Team')(sequelize);
db.TeamMember = require('./TeamMember')(sequelize);
db.Friend = require('./Friend')(sequelize);
db.Event = require('./Event')(sequelize);

// 관계 정의
// User - Subject (1:N)
db.User.hasMany(db.Subject, { foreignKey: 'userId' });
db.Subject.belongsTo(db.User, { foreignKey: 'userId' });

// User - Event (1:N)
db.User.hasMany(db.Event, { foreignKey: 'userId' });
db.Event.belongsTo(db.User, { foreignKey: 'userId' });

// Team - Event (1:N)
db.Team.hasMany(db.Event, { foreignKey: 'teamId' });
db.Event.belongsTo(db.Team, { foreignKey: 'teamId' });

// User - Team (N:M through TeamMember)
db.User.belongsToMany(db.Team, { 
  through: db.TeamMember,
  foreignKey: 'userId',
  otherKey: 'teamId'
});
db.Team.belongsToMany(db.User, { 
  through: db.TeamMember,
  foreignKey: 'teamId',
  otherKey: 'userId'
});

// TeamMember 관계
db.TeamMember.belongsTo(db.User, { foreignKey: 'userId' });
db.TeamMember.belongsTo(db.Team, { foreignKey: 'teamId' });

// User - Friend (N:M)
db.User.belongsToMany(db.User, {
  through: db.Friend,
  as: 'friends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

// Friend - User (요청자/수신자)
db.Friend.belongsTo(db.User, { as: 'requester', foreignKey: 'userId' });
db.Friend.belongsTo(db.User, { as: 'receiver', foreignKey: 'friendId' });

module.exports = db; 