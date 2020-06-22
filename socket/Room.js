module.exports = class Room {
    constructor(io, roomId){
        this.io = io;       
        this.roomId = roomId;
        this.hideTime = 0;
        this.watchCount = 0;
        this.random = undefined;
        this.hideFlg = true;
        this.startFlg = false;
        this.endFlg = true;
        this.autoID = undefined;
        this.hideID = undefined;
        this.menberList = {};
        this.winner = undefined;
        this.roopID = setInterval(() =>{
            io.to(this.roomId).emit('update',
            this.hideTime,
            this.watchCount,
            this.menberList,
            this.winner,
            this.hideFlg,
            this.roomId,
            this.endFlg,
            );
        },1000/ 30);
    }    
    
}