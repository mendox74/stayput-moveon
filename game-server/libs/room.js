module.exports = class Room {
    constructor(io, roomId){
        this.io = io;       
        this.roomId = roomId;
        this.hideTime = 0;
        this.watchCount = 0;
        this.stanbyCount = 0;
        this.random = undefined;
        this.hideFlg = false;
        this.hideFixed = false;
        this.stanbyFlg = false;
        this.startFlg = false;
        this.endFlg = true;
        this.autoID = undefined;
        this.hideID = undefined;
        this.stanbyID = undefined;
        this.menberList = {};
        this.winner = undefined;
        this.watcherWin = undefined;
        this.toucherWin = undefined;
        this.roopID = setInterval(() =>{
            io.to(this.roomId).emit('update',
            this.hideTime,
            this.watchCount,
            this.menberList,
            this.hideFlg,
            this.roomId,
            this.endFlg,
            this.watcherWin,
            this.toucherWin,
            this.stanbyFlg,
            this.stanbyCount,
            );
        },1000/ 30);
    }    
    
}