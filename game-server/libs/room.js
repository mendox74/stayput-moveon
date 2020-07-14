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
        this.autoFlg = false;
        this.stanbyFlg = false;
        this.startFlg = false;
        this.endFlg = true;
        this.autoID = undefined;
        this.hideID = undefined;
        this.stanbyID = undefined;
        this.menberList = {};
        this.winner = [];
        // this.watcherWin = undefined;
        // this.toucherWin = undefined;
        this.roopID = setInterval(() =>{
            io.to(this.roomId).emit('update',
            this.hideTime,
            this.watchCount,
            this.menberList,
            this.hideFlg,
            this.roomId,
            this.endFlg,
            this.winner,
            // this.watcherWin,
            // this.toucherWin,
            this.stanbyFlg,
            this.stanbyCount,
            this.autoFlg,
            );
        },1000/ 30);

        this.autoWatcher = () => {
            if(!this.menberList['autoWatcher'])return;
            if(this.endFlg)return;
            this.random = 500 + Math.floor(Math.random() * 3500);
            this.autoID = setTimeout(this.autoWatcher, this.random);
            if(this.hideFlg){
                if( this.watchCount === 0)return;
                this.hideFlg = false;
                this.watchCount -= 1;
                clearInterval(this.hideID);
            } else {
                if(this.hideFixed)return;
                if(this.watchCount === 0){this.hideFixed = true}
                this.hideFlg = true;
                this.hideCount();
                if(this.watchCount === 0){
                    clearInterval(this.autoID);
                }
            }
        }
    
        this.hideCount = () => {
            if(!this.menberList['autoWatcher'])return;
            if(this.endFlg || !this.hideFlg)return;
            let hideTime = this.hideTime -= 10;
            if(hideTime <= 0 ){
                this.result();
            } else {
                this.hideID = setTimeout(this.hideCount, 10);
            }
        }
    
        this.result = () => {
            if(!this.menberList['autoWatcher'])return;
            this.startFlg = false;
            this.endFlg = true;
            this.hideFlg = false;
            this.hideFixed = false;
            this.autoFlg = false;
            clearInterval(this.hideID);
            clearInterval(this.autoID);
            this.winner = ['watcher', 'AUTOWatcher'];
            Object.keys(this.menberList).forEach((id) =>{
                this.menberList[id].join = false;
                this.menberList[id].watcher = false; 
            });
            // if(this.menberList['autoWatcher']){delete this.menberList['autoWatcher']}
        }
    }    
    
}