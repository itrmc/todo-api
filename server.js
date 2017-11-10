var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed.toLowerCase() === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    } else if (queryParams.hasOwnProperty('completed')) {
        res
            .status(400)
            .send();
    }

    res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) { //:id is an express notation. express knows to match that element and call it id
    var todoID = parseInt(req.params.id, 10);

    var response = _.findWhere(todos, {id: todoID}); //underscore library lets you maintain less code
    if (response) {
        res.json(response);
    } else {
        res
            .status(404)
            .send();
    }
    // res.send('Asking for todo with ID of '+req.params.id); //params is an express

});

// DELETE /todos/:id GET /todos/:id
app.delete('/todos/:id', function (req, res) { //:id is an express notation. express knows to match that element and call it id
    var todoID = parseInt(req.params.id);

    var response = _.findWhere(todos, {id: todoID}); //underscore library lets you maintain less code
    if (response) {
        todos = _.without(todos, response)
        res.json(response);
    } else {
        res
            .status(404)
            .send();
    }
    // res.send('Asking for todo with ID of '+req.params.id); //params is an express

});

app.patch('/todos/:id', function (req, res) {
    console.log("body:\n" + JSON.stringify(req.body));
    var body = _.pick(req.body, 'description', 'completed');
    console.log("body:\n" + JSON.stringify(body));
    var validAttributes = {};

    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoID}); //underscore library lets you maintain less code

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

    // eliminate unexpected data types
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res
            .status(400)
            .send(); //400 means bad data was provided
    }

    body.description = body
        .description
        .trim();
    body.id = todoNextID++;
    todos.push(body);
    res.json(body);

});

app.listen(PORT, function () {
    console.log('Express listening on PORT' + PORT);
});