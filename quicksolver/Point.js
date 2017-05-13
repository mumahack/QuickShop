function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
}
Point.prototype.x = null;
Point.prototype.y = null;
Point.prototype.targetPaths = [];
Point.prototype.debug = function(prefixString){
    console.log(prefixString+ this.x +":" +this.y);
}
Point.prototype.addPath = function(targetPoint,pathPoint){
    this.debug("SourcePoint: " );
    targetPoint.debug ("TargetPoint: ");
    //console.log(pathPoint);
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];
    this.targetPaths[targetPoint].push(pathPoint);
};

Point.prototype.getPathLen = function(targetPoint){
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];
    return this.targetPaths[targetPoint].length;
};
global.Point = Point;