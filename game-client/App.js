import React, { PureComponent } from "react";
import { AppRegistry, Dimensions } from "react-native";
import Title from "./title/index"

export default class Game extends PureComponent {
    constructor() {
        super();
    }
 
    render() {
        return (
            <Title />
        );
    }
}
 
AppRegistry.registerComponent("Game", () => Game);