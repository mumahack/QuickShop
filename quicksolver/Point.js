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

Point.prototype.getHash = function(){
    return this.x +":" +this.y;
}
Point.prototype.addPath = function(targetPoint,pathPoint){
    var hash = targetPoint.getHash();
    this.targetPaths[hash] = this.targetPaths[hash] || [];
    //console.log("Len:"+this.targetPaths[hash].length);
    //this.debug("Current Path: " );
    //targetPoint.debug ("TargetPoint: ");
    //pathPoint.debug ("Path:Point ");
    //console.log(pathPoint);

    this.targetPaths[hash].push(pathPoint);
};

Point.prototype.getPaths = function(targetPoint){
    var hash = targetPoint.getHash();
    this.targetPaths[hash] = this.targetPaths[hash] || [];
    return this.targetPaths[hash];
}

Point.prototype.getPathLen = function(targetPoint){
    var hash = targetPoint.getHash();
    this.targetPaths[hash] = this.targetPaths[hash] || [];
    //console.log("Len GetPath:"+this.targetPaths[hash].length + " TargetPoint"+targetPoint.x+":"+targetPoint.y);
    //console.log(this.targetPaths);
    return this.targetPaths[hash].length;
    /*
    console.log(this.targetPaths[targetPoint]);
    this.targetPaths[targetPoint] = this.targetPaths[targetPoint] || [];

    */
};
global.Point = Point;