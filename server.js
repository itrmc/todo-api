var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000; //heroku uses the env
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json()); //now anytime a request comes in we can parse it

// Notice the new error argument ERROR handler for uncaught stuff
app.use(function (error, req, res, next) {
    // Check if the error is a SyntaxError
    if (error instanceof SyntaxError) {
      // Send back some custom error code and message
    } else {
      // No error? Continue on.
      next();
    }
  });

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

app.put('/todos:id', function(){
    var body = _.pick(req.body, 'description', 'completed'); //this line filters only the useful items from the body
    var validAttributes = {};

    var todoID = parseInt(req.params.id);  
    var matchedTodo = _.findWhere(todos, {id: todoID}); //underscore library lets you maintain less code

    if (!matchedTodo) {
        return res.status(404).send();
    }
    
    if (body.hasOwnProperty('completed') && _isBoolean(body.completed) ) {
        // all things are as expected
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        // things went wrong
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _isString(body.description) && body.description.length > 0 ) {
        // all things are as expected
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        // things went wrong
        return res.status(400).send();
    }

    //things went right - we need to update the correct item
    //underscore library extend helps with this.

    _.extend(matchedTodo, validAttributes);  // passed by reference so extend does the heavy lifting
    
} );

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