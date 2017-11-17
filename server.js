var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000; //heroku uses the env
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json()); //now anytime a request comes in we can parse it

app.get('/', function (req, res) {
    res.send('Todo API root');
});

//GET /todos
app.get('/todos', function (req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;
    if (queryParams.hasOwnProperty('completed') && queryParams.completed.toLowerCase() === 'true') {
        filteredTodos = _.where(filteredTodos, {
            completed: true
        });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed.toLowerCase() === 'false') {
        filteredTodos = _.where(filteredTodos, {
            completed: false
        });
    } else if (queryParams.hasOwnProperty('completed')) {
        res
            .status(400)
            .send();
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function (item) {
            return (item.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1)
        });
    }

    res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) { //:id is an express notation. express knows to match that element and call it id
    var todoID = parseInt(req.params.id, 10);


    db.todo.findById(todoID).then(function (todo) { //create takes a success and an error function argument
        if (!!todo) { //special converter to boolean !!
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();

    })
});

// DELETE /todos/:id GET /todos/:id
app.delete('/todos/:id', function (req, res) { //:id is an express notation. express knows to match that element and call it id
    var todoID = parseInt(req.params.id);

    db.todo.findByID(todoID).then(function (todo) { //create takes a success and an error function argument
        if (!!todo) { //special converter to boolean !!
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();

    })

});

app.patch('/todos/:id', function (req, res) {
    console.log("body:\n" + JSON.stringify(req.body));
    var body = _.pick(req.body, 'description', 'completed');
    console.log("body:\n" + JSON.stringify(body));
    var validAttributes = {};

    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoID
    }); //underscore library lets you maintain less code

    if (!matchedTodo) {
        return res
            .status(404)
            .send("Searching for ID " + todoID);
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        // all things are as expected
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        // things went wrong
        return res
            .status(400)
            .send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.length > 0) {
        // all things are as expected
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        // things went wrong
        return res
            .status(400)
            .send();
    }

    // things went right - we need to update the correct item underscore library
    // extend helps with this.
    console.log("body:\n" + JSON.stringify(body));
    console.log(_.isString(body.description));
    console.log(body.hasOwnProperty('description'));
    console.log(validAttributes);
    console.log(matchedTodo);
    matchedTodo = _.extend(matchedTodo, validAttributes); // passed by reference so extend does the heavy lifting
    res.json(matchedTodo);
});

//POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');


    //call create on db.todo
    // if successful, respond with 200 and value of todo object /toJSON
    // if fails, return error object res.status(400).json(e)
    db.todo.create(body).then(function (todo) { //create takes a success and an error function argument
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);

    })
});

db
    .sequelize
    .sync()
    .then(function () {

        app
            .listen(PORT, function () {
                console.log('Express listening on PORT' + PORT);
            });
    });