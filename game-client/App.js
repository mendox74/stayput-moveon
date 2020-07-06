import React, { PureComponent } from "react";
import { AppRegistry, Dimensions } from "react-native";
import RigidBodies from "./app/index";

// const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
// const RADIUS = 25;
 
export default class Game extends PureComponent {
  constructor() {
    super();
    // this.state = {
    //   x: WIDTH / 2 - RADIUS,
    //   y: HEIGHT / 2 - RADIUS
    // };
  }
 
  // updateHandler = ({ touches, screen, layout, time }) => {
  //   let move = touches.find(x => x.type === "move");
  //   if (move) {
  //     this.setState({
  //       x: this.state.x + move.delta.pageX,
  //       y: this.state.y + move.delta.pageY
  //     });
  //   }
  // };
 
  render() {
    return (
      <RigidBodies />
    );
  }
}
 
AppRegistry.registerComponent("Game", () => Game);