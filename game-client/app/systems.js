import _ from "lodash";
import { Dimensions } from "react-native";
import { Animal, Result, Stanby, Box, Join } from "./renderers";
import io from "socket.io-client";

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

let hideTime = 15000;
let watchCount = 5;
let menberList;
let hideFlg;
let roomId = undefined;
let endFlg;
let winner = [];
let stanbyFlg = false;
let stanbyCount = 5;
let autoFlg;

const defaultHideTime = 15000;
const { width, height } = Dimensions.get("window");
const animalSize = Math.trunc(Math.max(width, height) * 0.055);
const buttonSize = Math.trunc(Math.max(width, height) * 0.2);
const joinSize = Math.trunc(Math.max(width, height) * 0.2);

socket.on('connect', () => {
	console.log( 'connect : socket.id = %s', socket.id );
});

socket.on('update',(ht,wc,ml,hf,ri,ef,wn,sf,sc,af) => {
	hideTime = ht;
	watchCount = wc;
	menberList = ml;
	hideFlg = hf;
	roomId = ri;
	endFlg = ef;
	winner = wn
	stanbyFlg = sf;
	stanbyCount = sc;
	autoFlg = af;
});

const Login = (name) => {
	socket.emit('login', name);
}

const UpDate = (state) => {
	if(menberList){
		if(endFlg){
			if(!state.join){
				state.join = { 
					body: {position: { x: width / 2, y: height * ( 6 / 10)}}, 
					size: [joinSize, joinSize], 
					color: "pink", 
					renderer: Join, 
				}
			}
		} else {
			if(state.join){
				delete state.join;
			}
		}
		state.floor.size[0] = width * ( hideTime / defaultHideTime);
		state.watchCount.text = watchCount;
		if(stanbyFlg){
			if(!state.stanby){
				state.stanby = {
					body: {position: { x: width / 2, y: height / 2 }},
					size: [width, buttonSize],
					count: stanbyCount,
					animation: 'bounceIn',
					renderer: Stanby,
				}
			} else {
				if(state.stanby.count !== stanbyCount){
					if(stanbyCount === 0){
						state.stanby.count = 'START!';
					} else {
						state.stanby.count = stanbyCount;
					}
				}
			}
		} else {
			if(state.stanby){
				delete state.stanby;
			}
		}
		// 結果表示
		if(winner.length){
			if(!state.result){
				state.result = {
					body: {position: { x: width / 2, y: height / 2 }},
					size: [width, buttonSize],
					role: winner[0],
					name: winner[1],
					animation: 'bounceIn',
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
							body: {position: { x: width / 2, y: height * (1 / 13) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							angle: 180 + 'deg',
							renderer: Animal,
						};
					} else {
						if(hideFlg){
							state[e].angle = 0 + 'deg';
						} else {
							state[e].angle = 180 + 'deg';
						}
					}
				} else {
					if(!state[e]){
						let randPos = Math.floor(Math.random() * 1000) + 1;
						let widPos = randPos - 500;
						let angle = Math.atan2(
									(width * (randPos / 1000)) - (width / 2),
									(height * (8 / 10)) - height * (1 / 13),
									) * -1;
						state[e] = {
							id: e,
							widPos: widPos,
							body: {position: { x: width * (randPos / 1000), y: height * (8 / 10) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							angle: angle + 'rad',
							renderer: Animal,
						};
					} else if(menberList[e].distance >= 0){
						state[e].body.position.y = height * ((menberList[e].distance + 580) / 5800);
						state[e].body.position.x = width * ((500 + (state[e].widPos * (menberList[e].distance / 4000))) / 1000);
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
		let logout = state.logout.body;
		if(state.join){
			let join = state.join.body
			if(distance([join.position.x, join.position.y], Pos) < 25){
				socket.emit('join');
			}
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
			socket.emit('behavior');
		}
	}

	let end = touches.find(x => x.type === "end");
	if (end) {
		let endPos = [end.event.pageX, end.event.pageY];
		let body = state.moveButton.body;
		if(distance([body.position.x, body.position.y], endPos) < 50){
			socket.emit('repose');
		}
	}

	return state;
};

export { PressButton, Behavior, UpDate, Login };