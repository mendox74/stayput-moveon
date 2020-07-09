import _ from "lodash";
import { Dimensions } from "react-native";
import { Animal, Result } from "./renderers";
import io from "socket.io-client";

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

let hideTime = 15000;
let watchCount = 5;
let menberList;
let hideFlg;
let roomId = undefined;
let endFlg;
let watcherWin = undefined;
let toucherWin = undefined;

const defaultHideTime = 15000;
const { width, height } = Dimensions.get("window");
const animalSize = Math.trunc(Math.max(width, height) * 0.075);
const buttonSize = Math.trunc(Math.max(width, height) * 0.2);

socket.on('connect', () => {
	console.log( 'connect : socket.id = %s', socket.id );
});

socket.on('update',(ht,wc,ml,hf,ri,ef,ww,tw) => {
	hideTime = ht;
	watchCount = wc;
	menberList = ml;
	hideFlg = hf;
	roomId = ri;
	endFlg = ef;
	watcherWin = ww;
	toucherWin = tw;
});

const Login = (name) => {
	socket.emit('login', name);
}

const UpDate = (state) => {
	if(menberList){
		state.floor.size[0] = width * ( hideTime / defaultHideTime);
		state.watchCount.text = watchCount;
		// 結果表示
		if(watcherWin || toucherWin){
			if(!state.result){
				let role;
				let name;
				let animation;
				if(watcherWin){
					role = 'GUARD!';
					name = menberList[watcherWin].name;
					animation = 'bounceInDown';
				} else if(toucherWin){
					role = 'TOUCH!';
					name = menberList[toucherWin].name;
					animation = 'bounceIn';
				}
				state.result = {
					body: {position: { x: width / 2, y: height / 2 }},
					size: [width, buttonSize],
					role: role,
					name: name,
					animation: animation,
					renderer: Result,
				};
			}
		} else {
			if(state.result){delete state.result}
		}
		// menberListにないstateを削除
		let currentId = Object.keys(menberList);
		Object.keys(state).forEach((e) => {
			if(state[e].id){
				if(currentId.indexOf(e) === -1){
					delete state[e];
				}
			}
		})
		Object.keys(menberList).forEach((e) =>{
			if(menberList[e].join){
				if(menberList[e].watcher){
					if(!state[e]){
						state[e] = {
							id: e,
							body: {position: { x: width / 2, y: height * (1 / 10) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							renderer: Animal,
						};
					}
				} else {
					if(!state[e]){
						state[e] = {
							id: e,
							body: {position: { x: width * (2 / 10), y: height * (9 / 10) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							renderer: Animal,
						};
					} else if(menberList[e].distance >= 0){
						state[e].body.position.y = height * ((menberList[e].distance + 500) / 5000);
						state[e].body.position.x = width * ((menberList[e].distance + 5000) / 10000);
					}
				}
			} else {
				if(state[e]){delete state[e]}
			}
		});
	}
	return state;
}

const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const PressButton = (state, { touches }) => {
	touches.filter(t => t.type === "press").forEach(t => {
		let Pos = [t.event.pageX, t.event.pageY];
		let join = state.join.body;
		let logout = state.logout.body;
		if(distance([join.position.x, join.position.y], Pos) < 25){
			// socket.emit('login', state.roomId.text);
			socket.emit('join');
			socket.emit('reset');
			// socket.emit('start');
		}
		if(distance([logout.position.x, logout.position.y], Pos) < 25){
			socket.emit('logout');
			state.logout.close();
		}
	});

	return state;
};

const Behavior = (state, { touches }) => {
	let start = touches.find(x => x.type === "start");
	if (start) {
		let startPos = [start.event.pageX, start.event.pageY];
		let body = state.moveButton.body;
		if(distance([body.position.x, body.position.y], startPos) < 50){
			// socket.emit('move');
			// socket.emit('hide');
			socket.emit('behavior');
		}
	}

	let end = touches.find(x => x.type === "end");
	if (end) {
		let endPos = [end.event.pageX, end.event.pageY];
		let body = state.moveButton.body;
		if(distance([body.position.x, body.position.y], endPos) < 50){
			// socket.emit('stop');
			// socket.emit('watch');
			socket.emit('repose');
		}
	}

	return state;
};

export { PressButton, Behavior, UpDate, Login };