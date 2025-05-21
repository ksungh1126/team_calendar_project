const User = require('./User');
const Team = require('./Team');
const Schedule = require('./Schedule');

// User와 Team 관계 설정
User.hasMany(Team, { foreignKey: 'created_by' });
Team.belongsTo(User, { foreignKey: 'created_by' });

// User와 Schedule 관계 설정
User.hasMany(Schedule, { foreignKey: 'created_by' });
Schedule.belongsTo(User, { foreignKey: 'created_by' });

// Team과 Schedule 관계 설정 (Team_Schedules 테이블을 통한 다대다 관계)
Team.belongsToMany(Schedule, { 
    through: 'team_schedules',
    foreignKey: 'team_id',
    otherKey: 'schedule_id'
});
Schedule.belongsToMany(Team, {
    through: 'team_schedules',
    foreignKey: 'schedule_id',
    otherKey: 'team_id'
});

// User와 Team 관계 설정 (Team_Members 테이블을 통한 다대다 관계)
User.belongsToMany(Team, {
    through: 'team_members',
    foreignKey: 'user_id',
    otherKey: 'team_id'
});
Team.belongsToMany(User, {
    through: 'team_members',
    foreignKey: 'team_id',
    otherKey: 'user_id'
});

module.exports = {
    User,
    Team,
    Schedule
}; 