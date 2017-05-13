var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
var low = require('lowdb')

var app = express()
var PF = require('pathfinding');

var publicDir = path.join(__dirname, 'public')

app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded

const db = low('db.json');
var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];
db.defaults({'matrix': matrix})
    .write()


app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'))
})

app.get('/matrix', function (req, res) {

    db.read();
    res.send(db.get('matrix')

        .value())
})

app.get('/navigation', function (req, res) {
    var matrix = [
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
    var grid = new PF.Grid(matrix);
    var finder = new PF.AStarFinder();
    var path = finder.findPath(0, 0, 4, 0, grid);
    res.send(path);


})


var server = http.createServer(app)

// Reload code here
reload(server, app)

server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
})
