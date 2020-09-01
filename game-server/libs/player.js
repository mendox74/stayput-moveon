module.exports = class Player {
    constructor(name, icon, color){
        this.name = name || 'unknown';
        this.icon = icon || 'cleaningRobot_1';
        this.color = color || '#f2fdff';
        this.join = false;
        this.watcher = false;
        this.distance = 0;
    }    
}