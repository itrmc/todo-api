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
    res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) { //:id is an express notation. express knows to match that element and call it id
    var todoID = parseInt(req.params.id);

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

//POST /todos
app.post('/todos', function (req, res) {
    try {
        var body = req.body
    } catch (e) {
        return res
            .status(400)
            .send(e); //400 means bad data was provided
    }

    //    console.log('description: '+body.description); eliminate malformed body
    /*
try {JSON.parse(body) }
catch (e) {
    return res.status(400).send(e); //400 means bad data was provided
    }
*/
    // eliminate unexpected objects or elements
    body = _.pick(body, 'description', 'completed');

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