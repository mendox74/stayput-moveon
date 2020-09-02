import React, { PureComponent } from "react";
import { StatusBar, Dimensions, StyleSheet } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { UpDate } from "./systems";
import { Box, MoveButton, Number, Logout, Ranking, Info } from "./renderers";

export default class RigidBodies extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { width, height } = Dimensions.get("window");
        const boxSize = Math.trunc(Math.max(width, height) * 0.015);
        const buttonSize = Math.trunc(Math.max(width, height) * 0.12);

        const logout = {position: {x: width / 5, y: height / 1.08 }};
        const moveBody = {position: { x: width / 2, y: height / 1.08 }};
        const watchCountBody = {position: { x: width / 1.25, y: height / 10 }};
        const InfoBody = {position: { x: width / 1.25, y: height / 1.08 }};
        const floor = {position: { x: width / 2, y: boxSize * 1.2 }};
        const rankBody = {position: { x: width / 5.3, y: height / 4.8 }};

        return (
            <GameEngine
                style={styles.container}
                systems={[ UpDate ]}
                entities={{
                logout: { body: logout, size: [width / 4, buttonSize / 2.5], close:this.props.unMountScene, renderer: Logout },
                moveButton: { body: moveBody, size: [buttonSize, buttonSize], color: "#f2fdff", renderer: MoveButton },
                watchCount: { body: watchCountBody, size: [buttonSize / 1.5, buttonSize / 1.5], text: 0, renderer: Number },
                info: { body: InfoBody, size: [width / 4, buttonSize / 2.5], height: height, menberList: [{name: 'Empty', icon: null, color: null}], renderer: Info },
                floor: { body: floor, size: [width, boxSize], color: "#f2fdff", hideTime: 0, renderer: Box },
                ranking: {body: rankBody, size: [buttonSize, buttonSize], color: "#f2fdff", renderer: Ranking }
            }}
            >

                <StatusBar hidden={true} />
            </GameEngine>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#101935',
    },
});