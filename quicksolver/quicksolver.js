var Random = require("random-js");
var PF = require('pathfinding');
const columns = 30;
module.exports = {
    columns: columns,
    map: [[]],
    startPoint: [0, 0],
    stopPoint: [columns - 1, columns - 1],
    passPoints: [[]],
    generateMap: function () {
        this.passPoints = [];
        this.generateVoidArray();


        this.setPoint(this.startPoint, 2);
        this.setPoint(this.stopPoint, 3);
        this.passPoints.push(this.startPoint);
        this.passPoints.push(this.stopPoint);


        for (var i = 0; i < 3; i++) {
            this.setPoint(this.generateRandomPoint(), 1);
        }
        this.generateNavigationPoints();


        return this.map;
    },
    generateVoidArray: function () {
        var columns = 10;
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
        var r = new Random(Random.engines.mt19937().autoSeed());
        var x = r.integer(0, this.columns - 1);
        var y = r.integer(0, this.columns - 1);
        return [x, y];
    },
    setPoint: function (pointArray, color) {
        this.map[pointArray[0]][pointArray[1]] = color;
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
        console.log("Passpoint Lenght:" + this.passPoints.length);
        for (var x = 0; x < this.passPoints.length - 1; x++) {
            var currentPoint = this.passPoints[x];
            var nextPoint = this.passPoints[x + 1];

            var navigationPoints = this.solveNavigation(currentPoint, nextPoint);
            for (var i = 0, len = navigationPoints.length; i < len; i++) {
                this.setPoint(navigationPoints[i], 4);
            }

        }
    },

    solveNavigation: function (point1, point2) {
        var width = this.columns;
        var height = this.columns;
        var matrix = [];

        for (var x = 0; x < width; x++) {
            matrix[x] = [];
            for (var y = 0; y < height; y++) {
                matrix[x][y] = 0;
            }
        }
        var grid = new PF.Grid(matrix);
        //console.log(point1[0], point1[1], point2[0], point2[1]);
        var finder = new PF.AStarFinder();
        var pointsArr = finder.findPath(point1[0], point1[1], point2[0], point2[1], grid);
        return pointsArr;
    }
}