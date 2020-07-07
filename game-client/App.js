import React, { PureComponent } from "react";
import { AppRegistry, Dimensions } from "react-native";
import RigidBodies from "./app/index";
import Title from "./title/index"

export default class Game extends PureComponent {
  constructor() {
    super();
  }
 
  render() {
    return (
      <Title />
      // <RigidBodies />
    );
  }
}
 
AppRegistry.registerComponent("Game", () => Game);