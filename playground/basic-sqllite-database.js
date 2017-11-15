var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: 'sqlite',
    storage: __dirname + '/dbBasic.sqlite',
    operatorsAliases: false
});

const Op = Sequelize.Op;

//build the data item model
var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

sequelize
    .sync()
    .then(function () { // add {force:true} to sync call to overwrite entire database
        console.log('Everything is synced');
    });

Todo.findById(22).then(todo => {
    if (todo) {
        console.log(todo.toJSON())
        return todo;
    } else
    {
        console.log("No item found by ID")
    }
})  

//create a single element using the model
/* Todo
    .create({description: 'Walk my dog', completed: false})
    .then(function (todo) {
        return Todo.create({description: 'Clean office'})
    })
    .then(function () {
        //return Todo.findById(1) where: {     completed: true }
        return Todo.findAll({
            where: {
                description: {
                    [Op.like] : '%different%'
                    }
                }
            })
            .then(function (todos) {
                if (todos) {
                    todos
                        .forEach(function (todo) {
                            console.log(todo.toJSON());
                        })
                } else {
                    console.log('No todos found');
                }
            })
            .catch(function (e) {
                console.log(e);
            })
    }) */