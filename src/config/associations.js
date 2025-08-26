const User = require('../models/userModel');
const Task = require('../models/taskModel');

User.hasMany(Task, { foreignKey: 'user_id' });
Task.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Task };