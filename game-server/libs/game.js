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
                if(socket.roomId){
                    logout();
                }
                console.log("disconnect", socket.userName);
            });

            socket.on('login', (userName, icon) => {
                if(socket.roomId)return;
                socket.userName = userName? userName: 'unknown';
                socket.icon = icon? icon: 'cleaningRobot_1';
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

                rooms[socket.roomId].menberList[socket.id] = new Player(socket.userName, icon);
                console.log(socket.roomId, socket.userName, rooms[socket.roomId].menberList);
            });

            socket.on('logout', () => {
                if(!socket.roomId)return;
                socket.leave(socket.roomId, () => {
                    logout();
                });
            });

            socket.on('behavior', () => {
                if(!socket.roomId)return;
                if(rooms[socket.roomId].endFlg || !rooms[socket.roomId].menberList[socket.id].join)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher){
                    if(rooms[socket.roomId].autoFlg){
                        clearInterval(rooms[socket.roomId].autoID);
                        rooms[socket.roomId].autoFlg = false;
                    }
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
                if(rooms[socket.roomId].endFlg || !rooms[socket.roomId].menberList[socket.id].join)return;
                if(rooms[socket.roomId].menberList[socket.id].watcher){
                    if(rooms[socket.roomId].autoFlg){
                        clearInterval(rooms[socket.roomId].autoID);
                        rooms[socket.roomId].autoFlg = false;
                    }
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
                let room = rooms[socket.roomId];
                if(room.endFlg || !room.menberList[socket.id].join || !room.menberList[socket.id].watcher)return;
                if(room.autoFlg){
                    clearInterval(room.autoID);
                } else {
                    auto();
                }
                room.autoFlg = !room.autoFlg;
            });

            socket.on('join', () => {
                if(!socket.roomId)return;
                let list = rooms[socket.roomId].menberList;
                let room = rooms[socket.roomId];
                if(!room.endFlg)return;
                if(list[socket.id].join){
                    list[socket.id].join = false;
                    if(list[socket.id].watcher){
                        list[socket.id].watcher = false;
                        Object.keys(list).some((e) => {
                            if(list[e].join){
                                list[e].watcher = true;
                                list[e].distance = 0;
                                return true;
                            }
                        });
                    }
                } else {
                    reset();
                    list[socket.id].join = true;
                    if(Object.keys(list).some((e) => {return list[e].watcher === true; })){
                        list[socket.id].distance = defaultDistance;
                        socket.moveFlg = false;
                    } else {
                        list[socket.id].watcher = true;
                        list[socket.id].distance = 0;
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

            function logout () {
                clearInterval(socket.moveID);
                let list = rooms[socket.roomId].menberList;
                let room = rooms[socket.roomId];
                // roomの有無を判定
                if(!io.sockets.adapter.rooms[socket.roomId]){
                    clearInterval(room.stanbyID);
                    clearInterval(room.hideID);
                    clearInterval(room.autoID);
                    clearInterval(room.watchLimitID);
                    clearInterval(room.roopID);
                    rooms.splice(rooms.indexOf(socket.roomId), 1);
                    delete rooms[socket.roomId];
                } else {
                    list[socket.id].join = false;
                    // game中かの判定
                    if(room.endFlg){
                        // join数の1以下判定
                        if(Object.keys(list).filter((e) => {return list[e].join === true}).length <= 1){
                            if(room.stanbyFlg){
                                room.stanbyFlg = false;
                                clearInterval(room.stanbyID);
                            }
                        // watcher判定
                        } else if(list[socket.id].watcher){
                            Object.keys(list).some((e) => {
                                if(list[e].join){
                                    list[e].watcher = true;
                                    list[e].distance = 0;
                                    return true;
                                }
                            });
                        }
                    } else {
                        // join数の1以下判定
                        if(Object.keys(list).filter((e) => {return list[e].join === true}).length <= 1){
                            cancel();
                        // watcher判定
                        } else if(list[socket.id].watcher){
                            room.autoFlg = false;
                            clearInterval(room.autoID);
                            clearInterval(room.watchLimitID);
                            list['autoWatcher'] = new Player('AUTO');
                            list['autoWatcher'].join = true;
                            list['autoWatcher'].watcher = true;
                            room.autoWatcher();
                        }
                    }
                    delete list[socket.id];
                }
                delete socket.roomId;
                console.log(rooms)
            }
            
            function stanbyCount () {
                let room = rooms[socket.roomId];
                if(room.stanbyCount > 0){
                    room.stanbyCount -= 1;
                    room.stanbyID = setTimeout(stanbyCount, 1000);
                } else {
                    room.stanbyFlg = false;
                    room.endFlg = false;
                    room.watchLimitID = setTimeout(watchLimit, 5000);
                }
            }

            function reset () {
                let room = rooms[socket.roomId];
                if(room.startFlg)return;
                room.startFlg = true;
                room.endFlg = true;
                room.hideFlg = false;
                room.hideFixed = false;
                room.autoFlg = false;
                clearInterval(socket.moveID);
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                clearInterval(room.watchLimitID);
                room.watchCount = defaultWatchCount;
                room.hideTime = defaultHideTime;
                room.winner = [];
                if(room.menberList['autoWatcher']){delete room.menberList['autoWatcher']}
            }

            function result () {
                let room = rooms[socket.roomId];
                room.startFlg = false;
                room.endFlg = true;
                room.hideFlg = false;
                room.hideFixed = false;
                room.autoFlg = false;
                clearInterval(socket.moveID);
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                clearInterval(room.watchLimitID);
                if(room.menberList[socket.id].watcher){
                    room.winner = ['watcher', room.menberList[socket.id].name];
                } else {
                    room.winner = ['toucher', room.menberList[socket.id].name];
                }
                Object.keys(room.menberList).forEach((id) =>{
                    room.menberList[id].join = false;
                    room.menberList[id].watcher = false; 
                });
            }

            function cancel () {
                let room = rooms[socket.roomId];
                room.startFlg = false;
                room.endFlg = true;
                room.hideFlg = false;
                room.hideFixed = false;
                room.autoFlg = false;
                clearInterval(room.hideID);
                clearInterval(room.autoID);
                clearInterval(room.watchLimitID);
                Object.keys(room.menberList).forEach((id) =>{
                    room.menberList[id].join = false;
                    room.menberList[id].watcher = false; 
                });
                if(room.menberList['autoWatcher']){delete room.menberList['autoWatcher']}
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
                    rooms[socket.roomId].menberList[socket.id].distance = defaultDistance + 10;
                }
            }

            function hideCount () {
                if(!rooms[socket.roomId])return;
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
                if(room.endFlg || room.hideFlg || room.hideFixed)return;
                if(room.watchCount === 0){room.hideFixed = true}
                room.hideFlg = true;
                clearInterval(room.watchLimitID);
                hideCount();
            }

            function watch () {
                let room = rooms[socket.roomId];
                if(room.endFlg || !room.hideFlg || room.watchCount === 0)return;
                room.hideFlg = false;
                room.watchCount -= 1;
                room.watchLimitID = setTimeout(watchLimit, 5000);
                clearInterval(room.hideID);
            }
            
            function watchLimit () {
                if(!socket.roomId)return;
                rooms[socket.roomId].autoFlg = true;
                auto();
            }

            function auto () {
                if(!socket.roomId)return;
                let room = rooms[socket.roomId];
                if(room.endFlg)return;
                let random = 500 + Math.floor(Math.random() * 3500);
                room.autoID = setTimeout(auto, random);
                if(room.hideFlg){
                    watch();
                } else {
                    hide();
                    if(room.watchCount === 0){
                        clearInterval(room.autoID);
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