function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
    this.targetPaths = [];
}
Point.prototype.x = null;
Point.prototype.y = null;
Point.prototype.targetPaths = null;
Point.prototype.debug = function(prefixString){
    console.log(prefixString+ this.x +":" +this.y);
}
Point.prototype.addPath = function(targetPoint,pathPoint){
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];
    console.log("Len:"+this.targetPaths[targetPoint].length);
    //this.debug("Current Path: " );
    //targetPoint.debug ("TargetPoint: ");
    //pathPoint.debug ("Path:Point ");
    //console.log(pathPoint);

    this.targetPaths[targetPoint].push(pathPoint);
};

Point.prototype.getPathLen = function(targetPoint){
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];
    console.log("Len GetPath:"+this.targetPaths[targetPoint].length + " TargetPoint"+targetPoint.x+":"+targetPoint.y);
    console.log(this.targetPaths);
    return this.targetPaths[targetPoint].length;
    /*
    console.log(this.targetPaths[targetPoint]);
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];

    */
};
global.Point = Point;