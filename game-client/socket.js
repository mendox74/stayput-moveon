import io from "socket.io-client";

export const socket = io('http://192.168.11.7:8080', {transports: ['websocket'], autoConnect: false});
