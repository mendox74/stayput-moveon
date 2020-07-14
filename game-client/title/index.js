import React, { Component } from "react";
import SvgUri from "react-native-svg-uri";
import { StyleSheet, View, Text, TextInput, Button, Modal, Dimensions, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import RigidBodies from "../app/index";

const { width, height } = Dimensions.get("window");
const startImage = require('../assets/menus/start.svg');

export default class Title extends Component {
    constructor() {
        super();
        this.state = {
            inputValue: "Name",
            isMoadlVisible: false,
            sceneVisible: false,
            scene: null,
        };
    }

    mountScene = () => {
        this.setState({
            sceneVisible: true,
            scene: <RigidBodies
                    unMountScene={this.unMountScene}
                    name={this.state.inputValue}/>
        });
    };
  
    unMountScene = () => {
        this.setState({
            sceneVisible: false,
            scene: null
        });
    };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
  
    _handleTextChange = inputValue => {
        this.setState({ inputValue });
    };

    _onPress = () => {
        this.AnimationRef.bounce();
    }

    render() {
        return(
            <View style={styles.container}>
                <Animatable.Text 
                    animation = "flash"
                    style={styles.paragraph}>
                    WATCH
                </Animatable.Text>
                <Animatable.Text 
                    animation = "fadeIn"
                    delay = {500}
                    style={styles.paragraph}>
                    or
                </Animatable.Text>
                <Animatable.Text 
                    animation = "bounceInRight"
                    delay = {1000}
                    style={styles.paragraph}>
                    TOUCH
                </Animatable.Text>
                <Text 
                    style={styles.paragraph}
                    onPress={this.toggleModal}
                >
                    {this.state.inputValue}
                </Text>
                <TouchableWithoutFeedback
                    onPress={this.mountScene}
                >
                    <Animatable.View
                        animation = "pulse"
                        iterationCount = {"infinite"}
                        style={{
                            width: width/3,
                            height: height/5,
                        }}
                    >
                        <SvgUri source={startImage} />
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPressIn={this._onPress}>
                    <Animatable.View ref={ref => (this.AnimationRef = ref)}>
                        <Text>Bounce me!</Text>
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <ModalAnimate 
                    animationIn="bounceIn"
                    animationOut="bounceOut"
                    isVisible={this.state.isModalVisible}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                        <Text>NAME</Text>
                        <TextInput
                            value={this.state.inputValue}
                            onChangeText={this._handleTextChange}
                            style={{ width: 200, height: 44, padding: 8, textAlign: 'center',}}
                        />
                        <Button
                            title="OK"
                            onPress={this.toggleModal}
                        />
                    </View>
                </ModalAnimate>
                <Modal
                    animationType={"none"}
                    transparent={false}
                    visible={this.state.sceneVisible}
                    onRequestClose={_ => {}}
                >
                    {this.state.scene}
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    paragraph: {
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
  });