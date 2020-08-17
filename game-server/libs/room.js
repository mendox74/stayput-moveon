module.exports = class Room {
    constructor(io, roomId){
        this.io = io;       
        this.roomId = roomId;
        this.hideTime = 0;
        this.watchCount = 0;
        this.stanbyCount = 0;
        this.hideFlg = false;
        this.hideFixed = false;
        this.autoFlg = false;
        this.stanbyFlg = false;
        this.startFlg = false;
        this.endFlg = true;
        this.autoID = undefined;
        this.hideID = undefined;
        this.stanbyID = undefined;
        this.watchLimitID = undefined;
        this.menberList = {};
        this.rank = {};
        this.winner = [];
        this.roopID = setInterval(() =>{
            this.ranking();
            io.to(this.roomId).emit('update',
            this.hideTime,
            this.watchCount,
            this.menberList,
            this.hideFlg,
            this.roomId,
            this.endFlg,
            this.winner,
            this.stanbyFlg,
            this.stanbyCount,
            this.autoFlg,
            this.rank,
            );
        },1000/ 30);

        this.autoWatcher = () => {
            if(!this.menberList['autoWatcher'])return;
            if(this.endFlg)return;
            let random = 500 + Math.floor(Math.random() * 3500);
            this.autoID = setTimeout(this.autoWatcher, random);
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
            this.winner = ['WATHCHER', 'AUTO MACHINE'];
            Object.keys(this.menberList).forEach((id) =>{
                this.menberList[id].join = false;
                this.menberList[id].watcher = false; 
            });
        }

        this.ranking = () => {
            let entry = [];
            this.rank = {};
            if(!Object.keys(this.menberList).length){return;}
            Object.keys(this.menberList).forEach((id) =>{
                if(this.menberList[id].join && !this.menberList[id].watcher){
                    entry.push({id: id, distance: this.menberList[id].distance})
                }
            });
            if(entry.length){
                entry.sort((a, b) => {
                    if(a.distance < b.distance) return -1;
                    if(a.distance > b.distance) return 1;
                    return 0;
                });
                for(let i = 0; i< entry.length; i++){
                    this.rank[entry[i].id] = entry[i].distance < 4000? i+1: entry.length;
                }
            }
        }
    }    
    
}