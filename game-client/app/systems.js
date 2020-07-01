import _ from "lodash";
import { Dimensions } from "react-native";
import { Box, Animal } from "./renderers";
import Matter from "matter-js";
import io from "socket.io-client";

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

let boxIds = 0;
let box = null;

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
// const body = Matter.Bodies.rectangle(width * (2 / 10) , height * (9 / 10), animalSize, animalSize,{ isStatic:true });

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

const UpDate = (state, {screen}) => {
	let world = state["physics"].world;
	state.floor.size[0] = width * ( hideTime / defaultHideTime);
	state.watchCount.text = watchCount;
	if(menberList){
		if(menberList[socket.id].name){
			state.roomId.text = menberList[socket.id].name;
		}
		if(watcherWin || toucherWin){
			if(!state.result.role){
				if(watcherWin){
					state.result.role = 'GUARD!';
					state.result.name = menberList[watcherWin].name;
				} else if(toucherWin){
					state.result.role = 'TOUCH!';
					state.result.name = menberList[toucherWin].name;
				}
			}
		} else {
			if(state.result.role){state.result.role = undefined}
			if(state.result.name){state.result.name = undefined}
		}
		Object.keys(menberList).forEach((e) =>{
			if(menberList[e].join){
				if(e === socket.id){
					if(menberList[e].watcher){
						state.number.text = hideTime;
					} else{
						if(!state[e]){
							let body = Matter.Bodies.rectangle(
								width * (2 / 10) ,
								height * (9 / 10),
								animalSize,
								animalSize,
								{ isStatic:true }
								);
							Matter.World.add(world, [body]);
							state[e] = {
								body: body,
								size: [animalSize, animalSize],
								text: menberList[e].name,
								renderer: Animal,
							};
						} else if(menberList[e].distance >= 0){
							state.number.text = menberList[socket.id].distance;
							state[e].body.position.y = height * ((menberList[e].distance + 500) / 5000);
							state[e].body.position.x = width * ((menberList[e].distance + 5000) / 10000);
						}
					} 
				} else {
					if(!menberList[e].watcher){
						if(!state[e]){
							let body = Matter.Bodies.rectangle(
								width * (2 / 10) ,
								height * (9 / 10),
								animalSize,
								animalSize,
								{ isStatic:true }
								);
							Matter.World.add(world, [body]);
							state[e] = {
								body: body,
								size: [animalSize, animalSize],
								text: menberList[e].name,
								renderer: Animal,
							};
						} else if(menberList[e].distance >= 0){
							state[e].body.position.y = height * ((menberList[e].distance + 500) / 5000);
							state[e].body.position.x = width * ((menberList[e].distance + 5000) / 10000);
						}
					}
				}
			}
		});
	}
	return state;
}

const SendBox = (state, {screen}) => {
	let world = state["physics"].world;
	let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075);

	if(box){
		let body = Matter.Bodies.rectangle(
			...box,
			boxSize,
			boxSize,
			{ frictionAir: 0.021 }
		);
		Matter.World.add(world, [body]);

		state[++boxIds] = {
			body: body,
			size: [boxSize, boxSize],
			color: boxIds % 2 == 0 ? "pink" : "#B8E986",
			renderer: Box
		};
	}

	box = null;
	return state;
}


const distance = ([x1, y1], [x2, y2]) =>
	Math.sqrt(Math.abs(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));

const Physics = (state, { touches, time }) => {
	let engine = state["physics"].engine;

	Matter.Engine.update(engine, time.delta);

	return state;
};

const CreateBox = (state, { touches, screen }) => {

	touches.filter(t => t.type === "press").forEach(t => {
		let Pos = [t.event.pageX, t.event.pageY];
		let join = state.join.body;
		if(distance([join.position.x, join.position.y], Pos) < 25){
			socket.emit('login', 'TEST');
			socket.emit('join');
			socket.emit('reset');
			socket.emit('start');
		}
	});

	return state;
};

const MoveBox = (state, { touches }) => {
	let start = touches.find(x => x.type === "start");
	if (start) {
		let startPos = [start.event.pageX, start.event.pageY];
		let body = state.catchButton.body;
		if(distance([body.position.x, body.position.y], startPos) < 50){
			socket.emit('move');
			socket.emit('hide');
		}
	}

	let end = touches.find(x => x.type === "end");
	if (end) {
		let endPos = [end.event.pageX, end.event.pageY];
		let body = state.catchButton.body;
		if(distance([body.position.x, body.position.y], endPos) < 50){
			socket.emit('stop');
			socket.emit('watch');
		}
	}

	return state;
};

const CleanBoxes = (state, { touches, screen }) => {
	let world = state["physics"].world;

	Object.keys(state)
		.filter(key => state[key].body && state[key].body.position.y > screen.height * 2)
		.forEach(key => {
			Matter.Composite.remove(world, state[key].body);
			delete state[key];
		});

	return state;
};

export { Physics, CreateBox, MoveBox, CleanBoxes, SendBox, UpDate };