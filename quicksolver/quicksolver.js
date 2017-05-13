var Random = require("random-js");
module.exports = {

    generateVoidArray: function () {
        var columns = 10;
        var width = columns;
        var height  = columns;
        var map = [
            []
        ];
        for (var x = 0; x < width; x++) {
            map[x] = [];
            for (var y = 0; y < height; y++) {
                map[x][y] = 0;
            }
        }



        var r = new Random(Random.engines.mt19937().autoSeed());


        for (var i = 0; i < 3; i++) {
            var x = r.integer(0, columns -1 )  ;
            var y = r.integer(0, columns -1);
            map[x][y] = 1;
        }


        return map;


    },
    setup: function () {

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

    solveNavigation: function () {
        var matrix = [
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
        var grid = new PF.Grid(matrix);
        var finder = new PF.AStarFinder();
        var path = finder.findPath(0, 0, 4, 0, grid);
        res.send(path);
    }
}