var Random = require("random-js");
var PF = require('pathfinding');
require("./Point.js");
var solver = require('node-tspsolver');
const columns = 30;


//var r = new Random(Random.engines.mt19937().autoSeed());


module.exports = {
    r: new Random(Random.engines.mt19937().autoSeed()),

    columns: columns,
    map: [[]],
    startPoint: new Point(0, 0),
    stopPoint: new Point(columns - 1, columns - 1),
    passPoints: [[]],
    itemPoints: [],
    solvingMatrix: [[]],

    generateRandomPoints: function () {
        for (var i = 0; i < 3; i++) {
            var point = this.generateRandomPoint();
            this.passPoints.push(point);
            this.itemPoints.push(point);
        }
    },
    loadMap: function (map) {
        this.map = map;
        if (map[0].length == 0) {
            this.generateVoidArray();
        }
        this.passPoints = [];

        var width = this.columns;
        var height = this.columns;


        for (var x = 0; x < width; x++) {
            this.solvingMatrix[x] = [];
            for (var y = 0; y < height; y++) {
                this.solvingMatrix[x][y] = 0;
            }
        }


        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var point = new Point(x, y);
                switch (this.map[x][y]) {
                    case 1:
                        this.passPoints.push(point);
                        this.startPoint = point;
                        break;
                    case 2:
                        this.passPoints.push(point);
                        this.stopPoint = point;
                        break;
                    case 4:
                        this.passPoints.push(point);
                        break;
                    case 5:
                        this.map[x][y] = 0;
                        break;
                    case 3:
                        this.solvingMatrix[y][x] = 1;
                        break;
                }


            }
        }
        console.log("First Point: " + this.startPoint.getHash()  + " StopPoint: "+ this.stopPoint.getHash() + " passpoints:" + + this.passPoints)

        this.generateNavigationPoints();

        return this.map;

    },
    generateMap: function () {
        //this.r = new Random(Random.engines.mt19937().seedWithArray([0x12345678, 0x90abcdef]));
        //this.r = new Random(Random.engines.mt19937().autoSeed());

        //this.passPoints = [];
        //this.generateVoidArray();


        //this.passPoints.push(this.startPoint);
        //this.passPoints.push(this.stopPoint);
        //this.passPoints.push(this.stopPoint);

        //this.generateNavigationPoints();

        /*
         for (var i = 0; i < this.itemPoints.length; i++) {
         var point = this.itemPoints[i];
         this.setPoint(point, 1);
         }
         */
        //this.setPoint(this.startPoint, 2);
        //this.setPoint(this.stopPoint, 3);


        return this.map;
    },
    generateVoidArray: function () {
        var width = this.columns;
        var height = this.columns;
        for (var x = 0; x < width; x++) {
            this.map[x] = [];
            for (var y = 0; y < height; y++) {
                this.map[x][y] = 0;
            }
        }
    },
    generateRandomPoint: function () {

        var x = this.r.integer(0, this.columns - 1);
        var y = this.r.integer(0, this.columns - 1);
        return new Point(x, y);
    },
    setPoint: function (point, color) {
        if (this.map[point.x][point.y] == 0) {
            this.map[point.x][point.y] = color;
        }

    },

    solveTravellerProblem: function () {
        var costMatrix = [
            [0, 1, 3, 4],
            [1, 0, 2, 3],
            [3, 2, 0, 5],
            [4, 3, 5, 0]
        ];

        solver
            .solveTsp(costMatrix, true, {})
            .then(function (result) {
                res.send(result);
            });
    },
    generateNavigationPoints: function () {
        if (this.passPoints.length == 0) {
            return;
        }
        //console.log("Passpoint Lenght:" + this.passPoints.length);

        var costMatrix = [[]];
        for (var passPointNr1 = 0; passPointNr1 < this.passPoints.length; passPointNr1++) {
            var currentPoint = this.passPoints[passPointNr1];
            costMatrix[passPointNr1] = [];
            for (var passPointNr2 = 0; passPointNr2 < this.passPoints.length; passPointNr2++) {
                var targetPoint = this.passPoints[passPointNr2];
                if (passPointNr1 == passPointNr2) {
                    // Do Nothing...
                } else {
                    //console.log("Generating Navigation Points for "+ targetPoint.x+":"+targetPoint.y);
                    var navigationPoints = this.solveNavigation(currentPoint, targetPoint);
                    for (var i = 0, len = navigationPoints.length; i < len; i++) {
                        var coordinates = navigationPoints[i];
                        var point = new Point(coordinates[0], coordinates[1]);
                        currentPoint.addPath(targetPoint, point);
                    }
                }
                // Fill Cost Array:

                costMatrix[passPointNr1][passPointNr2] = currentPoint.getPathLen(targetPoint);
            }
        }
        // Find all Combinations:
        var Combinatorics = require('js-combinatorics');
        var cmb = Combinatorics.permutation(this.passPoints).toArray();
        var shortestPath = 1000000;
        var shortestCombination;
        for (var combinationNumber = 0; combinationNumber < cmb.length - 1; combinationNumber++) {
            var combination = cmb[combinationNumber];
            var currentPathLen = 0;

            if (combination[0].getHash() !== this.startPoint.getHash() || combination[combination.length-1].getHash() !== this.stopPoint.getHash()) {
                continue;
            }

            for (var elementCounter = 0; elementCounter < combination.length - 1; elementCounter++) {
                currentPoint = combination[elementCounter];
                targetPoint = combination[elementCounter + 1];
                console.log("Element counter" + elementCounter + " First point:"+ currentPoint.getHash() + "  start point:" + this.startPoint.getHash());
                currentPathLen += currentPoint.getPathLen(targetPoint);
            }
            if (currentPathLen < shortestPath) {
                shortestPath = currentPathLen;
                shortestCombination = combination;
            }

        }
        // Find the shortest Path:

        //console.log(shortestPath);
        //console.log(shortestCombination);

        // Add the Shortest Path to the Map:
        for (var elementCounter = 0; elementCounter < shortestCombination.length - 1; elementCounter++) {

            currentPoint = combination[elementCounter];
            targetPoint = combination[elementCounter + 1];
            var paths = currentPoint.getPaths(targetPoint);
            for (var pathId = 0; pathId < paths.length; pathId++) {
                this.setPoint(paths[pathId], 5);
            }
        }


    },

    solveNavigation: function (point1, point2) {

        var grid = new PF.Grid(this.solvingMatrix);
        //console.log("Matrix:");
        //console.log(this.solvingMatrix);
        //console.log(point1.x, point1.y, point2.x, point2.y);
        var finder = new PF.AStarFinder();
        var pointsArr = finder.findPath(point1.x, point1.y, point2.x, point2.y, grid);
        //console.log("PointsArr");
        //console.log(pointsArr);
        //console.log("PointsArr End");
        return pointsArr;
    }
}