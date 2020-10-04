import io from "socket.io-client";

export const socket = io('http://watch-or-touch-alb-627500481.ap-northeast-1.elb.amazonaws.com',{transports: ['websocket'], autoConnect: false, reconnection: false});
