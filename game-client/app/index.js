import React, { Component } from "react";
import { StatusBar, Dimensions, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Physics, CreateBox, MoveBox, UpDate} from "./systems";
import { Box, CatcherButton, Number, Result } from "./renderers";
import Matter from "matter-js";

Matter.Common.isElement = () => false;

export default class RigidBodies extends Component {
  constructor() {
    super();
  }
  
  render() {
    const { width, height } = Dimensions.get("window");
    const boxSize = Math.trunc(Math.max(width, height) * 0.035);
    const animalSize = Math.trunc(Math.max(width, height) * 0.075);
    const joinSize = Math.trunc(Math.max(width, height) * 0.1);
    const buttonSize = Math.trunc(Math.max(width, height) * 0.2);

    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const body = Matter.Bodies.rectangle(width / 10, height / 2, animalSize, animalSize, { isStatic:true });
    const join = Matter.Bodies.rectangle(width / 1.3, height / 1.3, joinSize, joinSize, { isStatic:true });
    const catchBody = Matter.Bodies.rectangle(width / 2, height / 1.12, buttonSize, buttonSize, { isStatic:true });
    const numberBody = Matter.Bodies.rectangle(width / 2, height / 4.5, buttonSize, buttonSize, { isStatic:true });
    const watchCountBody = Matter.Bodies.rectangle(width / 1.3, height / 4.5, buttonSize, buttonSize, { isStatic:true });
    const roomIdBody = Matter.Bodies.rectangle(width / 5, height / 1.1, buttonSize, buttonSize, { isStatic:true });
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
        style={styles.container}
        systems={[Physics, MoveBox, CreateBox, UpDate]}
        entities={{
          physics: { engine: engine, world: world, constraint: constraint },
          join: { body: join, size: [joinSize, joinSize], color: "pink", renderer: Box },
          catchButton: { body: catchBody, size: [buttonSize, buttonSize], color: "green", renderer: CatcherButton },
          number: { body: numberBody, size: [width / 2, buttonSize], text: 10, renderer: Number },
          watchCount: { body: watchCountBody, size: [width / 3, buttonSize / 2], text: 0, renderer: Number },
          roomId: { body: roomIdBody, size: [width / 3, buttonSize / 2], text: '', renderer: Number },
          floor: { body: floor, size: [width, boxSize], color: "#961837", renderer: Box },
        }}
      >

        <StatusBar hidden={true} />

      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C0E4A9',
  },
});