var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var low = require('lowdb')
var solver = require('node-tspsolver');
var app = express()
var PF = require('pathfinding');
var quickSolver = require('./quicksolver/quicksolver.js');
//console.log(quickSolver.generateVoidArray());


var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded


const db = low('db.json');
var matrix = quickSolver.generateVoidArray();

db.defaults({'matrix': matrix})
    .write()


app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/js/matrix.js', function (req, res) {

    db.read();
    var matrix = db.get('matrix').value();
    matrix = JSON.stringify(matrix, null, 4);
    matrix = "var matrix = " + matrix;

    res.send(matrix)
})

app.get('/navigation', function (req, res) {

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
