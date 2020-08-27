module.exports = class Player {
    constructor(name, icon, color){
        this.name = name;
        this.icon = icon;
        this.color = color;
        this.join = false;
        this.watcher = false;
        this.distance = 0;
    }    
}