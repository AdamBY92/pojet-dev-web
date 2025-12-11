const User = require('./User');
const Event = require('./Event');
const Category = require('./Category');
const Registration = require('./Registration');

// Association User - Event (Creator)
User.hasMany(Event, { 
  foreignKey: 'createdBy',
  as: 'events' 
});
Event.belongsTo(User, { 
  foreignKey: 'createdBy',
  as: 'creator' 
});

// Association Event - Category
Event.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});
Category.hasMany(Event, {
  foreignKey: 'categoryId',
  as: 'events'
});

// Association Registration
User.hasMany(Registration, { 
  foreignKey: 'userId' 
});
Registration.belongsTo(User, { 
  foreignKey: 'userId' 
});

Event.hasMany(Registration, { 
  foreignKey: 'eventId' 
});
Registration.belongsTo(Event, { 
  foreignKey: 'eventId' 
});

module.exports = {
  User,
  Event,
  Category,
  Registration
};
