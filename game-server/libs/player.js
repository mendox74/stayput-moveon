module.exports = class Player {
    constructor(name, icon){
        this.name = name;
        this.icon = icon;
        this.join = false;
        this.watcher = false;
        this.distance = 0;
    }    
}