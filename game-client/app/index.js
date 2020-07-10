import React, { Component } from "react";
import { StatusBar, Dimensions, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { PressButton, Behavior, UpDate, Login} from "./systems";
import { Box, MoveButton, Number, Logout } from "./renderers";
// import Matter from "matter-js";

export default class RigidBodies extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { width, height } = Dimensions.get("window");
    const boxSize = Math.trunc(Math.max(width, height) * 0.015);
    const joinSize = Math.trunc(Math.max(width, height) * 0.1);
    const buttonSize = Math.trunc(Math.max(width, height) * 0.12);

    // const join = {position: {x: width / 1.3, y: height / 1.3 }};
    const logout = {position: {x: width / 5, y: height / 1.08 }};
    const moveBody = {position: { x: width / 2, y: height / 1.08 }};
    const watchCountBody = {position: { x: width / 1.25, y: height / 10 }};
    const roomIdBody = {position: { x: width / 1.22, y: height / 1.08 }};
    const floor = {position: { x: width / 2, y: boxSize }};

    Login(this.props.name);

    return (
      <GameEngine
        style={styles.container}
        systems={[PressButton, Behavior, UpDate]}
        entities={{
          // join: { body: join, size: [joinSize, joinSize], color: "pink", renderer: Box },
          logout: { body: logout, size: [joinSize, joinSize], color: "blue", close:this.props.unMountScene, renderer: Logout },
          moveButton: { body: moveBody, size: [buttonSize, buttonSize], color: "#00ebc7", renderer: MoveButton },
          watchCount: { body: watchCountBody, size: [width / 3, buttonSize / 2], text: 0, renderer: Number },
          roomId: { body: roomIdBody, size: [width / 3, buttonSize / 2], text: this.props.name, renderer: Number },
          floor: { body: floor, size: [width, boxSize], color: "blue", renderer: Box },
        }}
      >

        <StatusBar hidden={true} />
      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f7d7',
  },
});