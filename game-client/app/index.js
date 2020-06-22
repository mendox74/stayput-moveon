import React, { Component } from "react";
import { StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox, CleanBoxes, SendBox } from "./systems";
import { Box, CatcherButton, Number } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false;

export default class RigidBodies extends Component {
  constructor() {
    super();
  }
  
  render() {
    const { width, height } = Dimensions.get("window");
    const boxSize = Math.trunc(Math.max(width, height) * 0.035);
    const buttonSize = Math.trunc(Math.max(width, height) * 0.2);

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const body = Matter.Bodies.rectangle(width / 2, height / 1.3, boxSize, boxSize, { isStatic:true });
    const catchBody = Matter.Bodies.rectangle(width / 2, height / 1.12, buttonSize, buttonSize, { isStatic:true });
    const numberBody = Matter.Bodies.rectangle(width / 2, height / 4.5, buttonSize, buttonSize, { isStatic:true });
    const floor = Matter.Bodies.rectangle(width / 2, boxSize, width, boxSize, { isStatic: true });
    const constraint = Matter.Constraint.create({
      label: "Drag Constraint",
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1
    });

    Matter.World.add(world, [body, floor]);
    Matter.World.addConstraint(world, constraint);

    return (
      <GameEngine
        systems={[Physics, MoveBox ]}
        entities={{
          physics: { engine: engine, world: world, constraint: constraint },
          box: { body: body, size: [boxSize, boxSize], color: "blue", renderer: Box },
          catchButton: { body: catchBody, size: [buttonSize, buttonSize], color: "green", renderer: CatcherButton },
          number: { body: numberBody, size: [width / 2, buttonSize], text: 10, renderer: Number },
          floor: { body: floor, size: [width, boxSize], color: "#86E9BE", renderer: Box }
        }}
      >

        <StatusBar hidden={true} />

      </GameEngine>
    );
  }
}