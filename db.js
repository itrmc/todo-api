var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var sequelize;
if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    })
        
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        dialect: 'sqlite',
        storage: __dirname + '/data/dev-todo-api.sqlite',
        operatorsAliases: false 
    })
}

var db = {};

db.todo = sequelize.import (__dirname+"/models/todo.js"); //lets you load in definitions from separate files.
db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db; //setting this to an object lets you return multiple things

