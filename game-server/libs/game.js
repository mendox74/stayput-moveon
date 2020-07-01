const Room = require('./room');

module.exports = class Game {
    start(io){
        const defaultDistance = 4000;
        const defaultHideTime = 15000;
        const defaultWatchCount = 8;
        const rooms = []; 
        io.on('connection', (socket) => {
            // 接続切断処理
            socket.on('disconnect', () => {
                if(!io.sockets.adapter.rooms[socket.roomId]){
                if(rooms.indexOf(socket.roomId) !== -1){
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
                    socket.roomId = rooms.find(room => io.sockets.adapter.rooms[room].length < 3);
                }
                if(!socket.roomId){
                    // 新しい部屋を生成
                    socket.roomId = makeKey();
                    rooms.push(socket.roomId);
                    rooms[socket.roomId] = new Room(io, socket.roomId);
                }
                socket.join(socket.roomId);

                console.log(io.sockets.sockets[socket.id].roomId, io.sockets.sockets[socket.id].userName, rooms);
                rooms[socket.roomId].menberList[socket.id] = {name: socket.userName};
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

            socket.on('move', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher)return;
                moveCount();
            });

            socket.on('stop', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher)return;
                clearInterval(socket.moveID);
            });

            socket.on('hide', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(!rooms[socket.roomId].menberList[socket.id].watcher)return;
                hide();
            });

            socket.on('watch', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg)return;
                if(!rooms[socket.roomId].menberList[socket.id].watcher)return;
                watch();
            });

            socket.on('start', () => {
                if(!socket.roomId)return;
                if(!rooms[socket.roomId].startFlg)return;
                if(Object.keys(rooms[socket.roomId].menberList).every((e) => {
                     return rooms[socket.roomId].menberList[e].join === true;})){
                    rooms[socket.roomId].endFlg = false;
                }
            });

            socket.on('auto', () => {
                if(!socket.roomId)return;
                rooms[socket.roomId].endFlg = false;
                rooms[socket.roomId].hideFlg = false;
                auto();
            });

            socket.on('reset', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].startFlg)return;
                rooms[socket.roomId].startFlg = true;
                rooms[socket.roomId].endFlg = true;
                rooms[socket.roomId].hideFlg = false;
                clearInterval(socket.moveID);
                clearInterval(rooms[socket.roomId].hideID);
                clearInterval(rooms[socket.roomId].autoID);
                rooms[socket.roomId].watchCount = defaultWatchCount;
                rooms[socket.roomId].hideTime = defaultHideTime;
                rooms[socket.roomId].watcherWin = undefined;
                rooms[socket.roomId].touncherWin = undefined;
            });

            socket.on('join', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].menberList[socket.id].join)return;
                if(Object.keys(rooms[socket.roomId].menberList).some((e) => { return rooms[socket.roomId].menberList[e].watcher === true; })){
                    rooms[socket.roomId].menberList[socket.id].distance = defaultDistance;
                } else {
                    rooms[socket.roomId].menberList[socket.id].watcher = true;
                }
                rooms[socket.roomId].menberList[socket.id].join = true;
            });

            function distanceCountDown () {
                let distance = rooms[socket.roomId].menberList[socket.id].distance -= 10;
                if(distance === 0 ){
                    result();
                    // rooms[socket.roomId].hideFlg = true;
                    // rooms[socket.roomId].endFlg = true;
                    // rooms[socket.roomId].startFlg = false;
                    // clearInterval(socket.moveID);
                    // clearInterval(rooms[socket.roomId].hideID);
                    // clearInterval(rooms[socket.roomId].autoID);
                    // if(rooms[socket.roomId].menberList[socket.id].watcher){
                    //     rooms[socket.roomId].watcherWin = socket.id;
                    // } else {
                    //     rooms[socket.roomId].touncherWin = socket.id;
                    // }
                    // Object.keys(rooms[socket.roomId].menberList).forEach((id) =>{
                    //     rooms[socket.roomId].menberList[id].join = false;
                    //     rooms[socket.roomId].menberList[id].watcher = false; 
                    // });
                }
            }

            function hideTimeCountDown () {
                rooms[socket.roomId].hideTime -= 10;
                if(rooms[socket.roomId].hideTime === 0 ){
                    result();
                    // rooms[socket.roomId].hideFlg = true;
                    // rooms[socket.roomId].endFlg = true;
                    // rooms[socket.roomId].startFlg = false;
                    // clearInterval(socket.moveID);
                    // clearInterval(rooms[socket.roomId].hideID);
                    // clearInterval(rooms[socket.roomId].autoID);
                    // if(rooms[socket.roomId].menberList[socket.id].watcher){
                    //     rooms[socket.roomId].watcherWin = socket.id;
                    // } else {
                    //     rooms[socket.roomId].touncherWin = socket.id;
                    // }
                    // Object.keys(rooms[socket.roomId].menberList).forEach((id) =>{
                    //     rooms[socket.roomId].menberList[id].join = false;
                    //     rooms[socket.roomId].menberList[id].watcher = false; 
                    // });
                }
            }

            function result () {
                let room = rooms[socket.roomId];
                room.hideFlg = true;
                room.endFlg = true;
                room.startFlg = false;
                clearInterval(socket.moveID);
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                if(room.menberList[socket.id].watcher){
                    room.watcherWin = socket.id;
                } else {
                    room.touncherWin = socket.id;
                }
                Object.keys(room.menberList).forEach((id) =>{
                    room.menberList[id].join = false;
                    room.menberList[id].watcher = false; 
                });
            }

            function moveCount () {
                if(rooms[socket.roomId].endFlg)return;
                if(rooms[socket.roomId].hideFlg){
                    socket.moveID = setTimeout(moveCount, 10);
                    let distance = rooms[socket.roomId].menberList[socket.id].distance -= 10;
                    if(distance === 0 ){
                        result();
                    }
                    // distanceCountDown();
                } else {
                    rooms[socket.roomId].menberList[socket.id].distance = defaultDistance;
                }
            }

            function hideCount () {
                if(rooms[socket.roomId].endFlg)return;
                rooms[socket.roomId].hideID = setTimeout(hideCount, 10);
                let distance = rooms[socket.roomId].hideTime -= 10;
                if(distance === 0 ){
                    result();
                }
                // hideTimeCountDown();
            }

            function hide () {
                if(rooms[socket.roomId].endFlg)return;
                rooms[socket.roomId].hideFlg = true;
                hideCount();
            }

            function watch () {
                if(rooms[socket.roomId].endFlg || rooms[socket.roomId].watchCount === 0)return;
                rooms[socket.roomId].hideFlg = false;
                rooms[socket.roomId].watchCount -= 1;
                clearInterval(rooms[socket.roomId].hideID);
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