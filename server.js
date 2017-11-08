var express = require('express');
var bodyParser = require('body-parser');

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
    var todoID = req.params.id;
    var response = null;
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id == todoID) {
            response = todos[i];
            break;
        } //use of break prevents unnecessary execution of stuff
    }
    if (response) {
        res.json(response);
    } else {
        res
            .status(404)
            .send();
    }
    //
    // res.send('Asking for todo with ID of '+req.params.id); //params is an express
    // construct
});


//POST /todos
app.post('/todos', function (req,res){
    var body = req.body;
    console.log('description: '+body.description);
    body.id = todoNextID++;
    todos.push(body);
    


    res.json(body);

});


app.listen(PORT, function () {
    console.log('Express listening on PORT' + PORT);
});