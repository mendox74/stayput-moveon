const Room = require('./room');
const Player = require('./player');

module.exports = class Game {
    start(io){
        const defaultDistance = 4000;
        const defaultHideTime = 15000;
        const defaultWatchCount = 8;
        const rooms = []; 
        io.on('connection', (socket) => {
            console.log(socket.id);
            // 接続切断処理
            socket.on('disconnect', () => {
                if(!io.sockets.adapter.rooms[socket.roomId]){
                if(rooms.indexOf(socket.roomId) !== -1){
                    clearInterval(rooms[socket.roomId].stanbyID);
                    clearInterval(rooms[socket.roomId].hideID);
                    clearInterval(rooms[socket.roomId].autoID);
                    clearInterval(rooms[socket.roomId].roopID);
                    rooms.splice(rooms.indexOf(socket.roomId), 1);
                    delete rooms[socket.roomId];
                }
                };
                console.log("disconnect", socket.userName, rooms);
            });

            socket.on('login', (userName) => {
                if(socket.roomId)return;
                socket.userName = userName;
                // 部屋の有無を判定
                if(rooms.length >= 1){
                    // 待機中の部屋を検索
                    socket.roomId = rooms.find(room => io.sockets.adapter.rooms[room].length <= 100);
                }
                if(!socket.roomId){
                    // 新しい部屋を生成
                    socket.roomId = makeKey();
                    rooms.push(socket.roomId);
                    rooms[socket.roomId] = new Room(io, socket.roomId);
                }
                socket.join(socket.roomId);

                console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName, rooms);
                rooms[socket.roomId].menberList[socket.id] = new Player(socket.userName);
            });

            socket.on('logout', () => {
                if(!socket.roomId)return;
                    socket.leave(socket.roomId, () => {
                    delete rooms[socket.roomId].menberList[socket.id];

                    if(!io.sockets.adapter.rooms[socket.roomId]){
                        clearInterval(rooms[socket.roomId].roopID);
                        rooms.splice(rooms.indexOf(socket.roomId), 1);
                        delete rooms[socket.roomId];
                    }
                    delete socket.roomId;
                    console.log(rooms)
                });
            });

            socket.on('behavior', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher){
                    hide();
                } else {
                    if(!socket.moveFlg){
                        socket.moveFlg = true;
                        moveCount();
                    }
                }
            });

            socket.on('repose', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher){
                    watch();
                } else {
                    if(socket.moveFlg){
                        socket.moveFlg = false;
                        clearInterval(socket.moveID);
                    }
                }
            });

            socket.on('auto', () => {
                if(!socket.roomId)return;
                rooms[socket.roomId].endFlg = false;
                rooms[socket.roomId].hideFlg = false;
                auto();
            });

            socket.on('join', () => {
                if(!socket.roomId)return;
                let list = rooms[socket.roomId].menberList;
                let room = rooms[socket.roomId];
                if(!room.endFlg)return;
                if(list[socket.id].join){
                    list[socket.id].join = false;
                    list[socket.id].watcher = false;
                } else {
                    reset();
                    list[socket.id].join = true;
                    if(Object.keys(list).some((e) => {return list[e].watcher === true; })){
                        list[socket.id].distance = defaultDistance;
                        socket.moveFlg = false;
                    } else {
                        list[socket.id].watcher = true;
                    }
                }
                // 2人以上joinでstanbyCountをスタート
                if(Object.keys(list).filter((e) => {return list[e].join === true}).length >= 2){
                    if(!room.stanbyFlg){
                        room.stanbyCount = 6;
                        room.stanbyFlg = true;
                        stanbyCount();
                    }
                } else {
                    if(room.stanbyFlg){
                        room.stanbyFlg = false;
                        clearInterval(room.stanbyID);
                    }
                }
            });
            
            function stanbyCount () {
                let room = rooms[socket.roomId];
                if(room.stanbyCount > 0){
                    room.stanbyCount -= 1;
                    room.stanbyID = setTimeout(stanbyCount, 1000);
                } else {
                    room.stanbyFlg = false;
                    room.endFlg = false;
                }
            }

            function reset () {
                let room = rooms[socket.roomId];
                if(room.startFlg)return;
                room.startFlg = true;
                room.endFlg = true;
                room.hideFlg = false;
                room.hideFixed = false;
                clearInterval(socket.moveID);
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                room.watchCount = defaultWatchCount;
                room.hideTime = defaultHideTime;
                room.watcherWin = undefined;
                room.toucherWin = undefined;
            }

            function result () {
                let room = rooms[socket.roomId];
                room.startFlg = false;
                room.endFlg = true;
                room.hideFlg = false;
                room.hideFixed = false;
                clearInterval(socket.moveID);
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                if(room.menberList[socket.id].watcher){
                    room.watcherWin = socket.id;
                } else {
                    room.toucherWin = socket.id;
                }
                Object.keys(room.menberList).forEach((id) =>{
                    room.menberList[id].join = false;
                    room.menberList[id].watcher = false; 
                });
            }

            function moveCount () {
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].hideFlg){
                    let distance = rooms[socket.roomId].menberList[socket.id].distance -= 10;
                    if(distance <= 0 ){
                        result();
                    } else {
                        socket.moveID = setTimeout(moveCount, 10);
                    }
                } else {
                    rooms[socket.roomId].menberList[socket.id].distance = defaultDistance;
                }
            }

            function hideCount () {
                if(rooms[socket.roomId].endFlg || !rooms[socket.roomId].hideFlg)return;
                let hideTime = rooms[socket.roomId].hideTime -= 10;
                if(hideTime <= 0 ){
                    result();
                } else {
                    rooms[socket.roomId].hideID = setTimeout(hideCount, 10);
                }
            }

            function hide () {
                let room = rooms[socket.roomId];
                if(room.endFlg || room.hideFlg || room.hideFixed || !room.menberList[socket.id].watcher)return;
                if(room.watchCount === 0){room.hideFixed = true}
                room.hideFlg = true;
                hideCount();
            }

            function watch () {
                let room = rooms[socket.roomId];
                if(room.endFlg || !room.hideFlg || room.watchCount === 0 || !room.menberList[socket.id].watcher)return;
                room.hideFlg = false;
                room.watchCount -= 1;
                clearInterval(room.hideID);
            }

            function auto () {
                rooms[socket.roomId].random = 500 + Math.floor(Math.random() * 3500);
                rooms[socket.roomId].autoID = setTimeout(auto, rooms[socket.roomId].random);
                if(rooms[socket.roomId].hideFlg){
                    watch();
                } else {
                    hide();
                    if(rooms[socket.roomId].watchCount === 0){
                        clearInterval(rooms[socket.roomId].autoID);
                    }
                }
            };

        });

        function makeKey () {
            let key = '';
            let maxLen = 10;
            let src = '0123456789'
            + 'abcdefghijklmnopqrstuvwxyz'
            + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
            for (let i = 0; i < maxLen; i++) {
                key += src[Math.floor(Math.random() * src.length)];
            }
            return key;
        }
    }
}