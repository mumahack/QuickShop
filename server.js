var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var low = require('lowdb')

var app = express()

var quickSolver = require('./quicksolver/quicksolver.js');
//console.log(quickSolver.generateVoidArray());


var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded


const db = low('db.json');
var matrix = quickSolver.generateMap();

db.defaults({'matrix': matrix})
    .write()


app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/js/matrix.js', function (req, res) {

    db.read();
    var matrix = db.get('matrix').value();
    //var matrix = quickSolver.generateMap();

    matrix = JSON.stringify(matrix, null, 4);
    matrix = "var matrix = " + matrix;

    res.send(matrix)
})

app.get('/setWall', function (req, res) {
    var x = req.param('x');
    var y = req.param('y');
    var query = "matrix[" + y + "][" + x + "]";
    db.set(query, 1).write();
    res.send(x + " " + y);
})

app.get('/setItem', function (req, res) {
    var x = req.param('x');
    var y = req.param('y');
    var query = "matrix[" + y + "][" + x + "]";
    db.set(query, 4).write();
    res.send(x + " " + y);
})
app.get('/eraseWall', function (req, res) {
    var x = req.param('x');
    var y = req.param('y');
    var query = "matrix[" + y + "][" + x + "]";
    db.set(query, 0).write();
    res.send(x + " " + y);
})
app.get('/eraseItem', function (req, res) {
    var x = req.param('x');
    var y = req.param('y');
    var query = "matrix[" + y + "][" + x + "]";
    db.set(query, 0).write();
    res.send(x + " " + y);
})




app.get('/solver', function (req, res) {


})

app.use(express.static('public'));

var server = http.createServer(app)

// Reload code here
reload(server, app)

server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})
