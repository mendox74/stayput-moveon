import _ from "lodash";
import { Box } from "./renderers";
import Matter from "matter-js";
import io from "socket.io-client";

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

let boxIds = 0;
let box = null;
let countID;

socket.on('connect', () => {
	console.log( 'connect : socket.id = %s', socket.id );
});

socket.on('update',() => {
});

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
		// let body = state.catchButton.body;
		// if(distance([body.position.x, body.position.y], Pos) < 50){
		// 	state.number.text += 1;
		// }
	});

	return state;
};

const MoveBox = (state, { touches }) => {
	// let constraint = state["physics"].constraint;

	//-- Handle start touch
	let start = touches.find(x => x.type === "start");

	if (start) {
		let startPos = [start.event.pageX, start.event.pageY];

		// let boxId = Object.keys(state).find(key => {
		// 	let body = state[key].body;

		// 	return (
		// 		body &&
		// 		distance([body.position.x, body.position.y], startPos) < 25
		// 	);
		// });

		// if (boxId) {
		// 	constraint.pointA = { x: startPos[0], y: startPos[1] };
		// 	constraint.bodyB = state[boxId].body;
		// 	constraint.pointB = { x: 0, y: 0 };
		// 	constraint.angleB = state[boxId].body.angle;
		// }
		let body = state.catchButton.body;
		if(distance([body.position.x, body.position.y], startPos) < 50){
			countID = setInterval(() => {
                state.number.text += 1;
                state.box.body.position.y -= 1;
			}, 10);
		}
	}

	//-- Handle move touch
	// let move = touches.find(x => x.type === "move");

	// if (move) {
	// 	constraint.pointA = { x: move.event.pageX, y: move.event.pageY };
	// }

	//-- Handle end touch
	let end = touches.find(x => x.type === "end");

	if (end) {
		clearInterval(countID);
		// constraint.pointA = null;
		// constraint.bodyB = null;
		// constraint.pointB = null;
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

export { Physics, CreateBox, MoveBox, CleanBoxes, SendBox };