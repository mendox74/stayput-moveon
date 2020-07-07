module.exports = class Player {
    constructor(name){
        this.name = name;
        this.join = false;
        this.watcher = false;
        this.distance = 0;
    }    
}