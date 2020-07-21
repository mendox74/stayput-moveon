import _ from "lodash";
import { Dimensions } from "react-native";
import { Animal, Result, Stanby, Box, Join } from "./renderers";
import { socket } from "../socket";

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
	// joinButton処理
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
	// stanbyCount処理
	if(stanbyFlg){
		if(!state.stanby){
			state.stanby = {
				body: {position: { x: width / 2, y: height / 4 }},
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
	// hidetime処理
	if(state.floor.hideTime !== hideTime){
		state.floor.hideTime = hideTime;
		state.floor.size[0] = width * ( hideTime / defaultHideTime);
	}
	if(state.watchCount.text !== watchCount){
		state.watchCount.text = watchCount;
	}
	// 結果表示
	if(winner.length){
		if(!state.result){
			state.result = {
				body: {position: { x: width / 2, y: height / 4 }},
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
	// updateループ処理
	if(menberList){
		Object.keys(menberList).forEach((e) =>{
			if(menberList[e].join){
				if(state[e]){
					if(menberList[e].watcher){
						if(state[e].role === 'toucher'){
							state[e].role = 'watcher';
							state[e].angle = 3.14159 + 'rad',
							state[e].body = {position: { x: width / 2, y: height * (1 / 13) }};
						}
						if(hideFlg){
							if(state[e].angle !== '0rad'){
								state[e].angle = 0 + 'rad';
							}
						} else {
							if(state[e].angle !== '3.14159rad'){
								state[e].angle = 3.14159 + 'rad';
							}
						}
					} else {
						if(menberList[e].distance >= 0){
							if(state[e].distance !== menberList[e].distance){
								state[e].distance = menberList[e].distance;
								state[e].body.position.y = height * ((menberList[e].distance + 580) / 5800);
								state[e].body.position.x = width * ((500 + (state[e].widPos * (menberList[e].distance / 4000))) / 1000);
							}
						}
					}
				} else {
					if(menberList[e].watcher){
						state[e] = {
							id: e,
							role: 'watcher',
							body: {position: { x: width / 2, y: height * (1 / 13) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							angle: 3.142 + 'rad',
							renderer: Animal,
						};
					} else {
						let randPos = Math.floor(Math.random() * 1000) + 1;
						let widPos = randPos - 500;
						let angle = Math.atan2(
									(width * (randPos / 1000)) - (width / 2),
									(height * (8 / 10)) - height * (1 / 13),
									) * -1;
						state[e] = {
							id: e,
							role: 'toucher',
							widPos: widPos,
							distance: 0,
							body: {position: { x: width * (randPos / 1000), y: height * (8 / 10) }},
							size: [animalSize, animalSize],
							text: menberList[e].name,
							angle: angle + 'rad',
							renderer: Animal,
						};
					}
				}
			} else {
				if(state[e]){delete state[e]}
			}
		});
		// menberListにないstateを削除
		let currentId = Object.keys(menberList);
		Object.keys(state).forEach((e) => {
			if(state[e].id){
				if(currentId.indexOf(e) === -1){
					delete state[e];
				}
			}
		});
	}
	return state;
}

export { UpDate, Login, socket };