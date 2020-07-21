import React, { Component } from "react";
// import SvgUri from "react-native-svg-uri";
import { StyleSheet, View, Text, TextInput, Button, Modal, Dimensions, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import RigidBodies from "../app/index";
// const cleaningRobot_1 = require('../assets/icons/cleaningRobot_1.svg')

const { width, height } = Dimensions.get("window");
const startImage = require('../assets/menus/start.svg');

export default class Title extends Component {
    constructor() {
        super();
        this.state = {
            inputValue: "noName",
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

    render() {
        return(
            <View style={styles.container}>
                <Animatable.Text 
                    animation = "flash"
                    style={styles.watch}>
                    WATCH
                </Animatable.Text>
                <Animatable.Text 
                    animation = "fadeIn"
                    delay = {500}
                    style={styles.or}>
                    or
                </Animatable.Text>
                <Animatable.Text 
                    animation = "bounceInRight"
                    delay = {1000}
                    style={styles.touch}>
                    TOUCH
                </Animatable.Text>
                <TouchableWithoutFeedback
                    onPress={this.toggleModal}
                >
                    <View
                        style={styles.account}
                    >
                        <View
                            style={styles.icon}
                        >
                            {/* <SvgUri 
                            width = {width / 10}
                            height = {width / 10}
                            source={cleaningRobot_1}/> */}
                        </View>
                        <Text 
                            style={styles.name}
                        >
                            {this.state.inputValue}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={this.mountScene}
                >
                    <Animatable.View
                        animation = "pulse"
                        iterationCount = {"infinite"}
                        style={{
                            position: "absolute",
                            top: height * (6 / 10),
                            width: width/3,
                            height: height/5,
                            borderRadius: width / 2,
                            backgroundColor: "pink"
                        }}
                    >
                        {/* <SvgUri source={startImage} /> */}
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
    watch: {
        position: "absolute",
        left: width * (2 / 10),
        top: height * (2.3 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    touch: {
        position: "absolute",
        left: width * (5.5 / 10),
        top: height * (3.3 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
    or: {
        position: "absolute",
        top: height * (2.8 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },    
    name: {
        marginVertical: 6,
        marginLeft: -4,
        width: width/2.5,
        height:height/16,
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        color: '#34495e',
        borderRadius: width / 20,
        borderColor: "#000000",
        borderWidth: 5,
    },
    account: {
        flexDirection: 'row',
        position: "absolute",
        top: height * (4.5 / 10),
    },
    icon: {
        padding: 4,
        borderRadius: width / 2,
        borderColor: "#000000",
        borderWidth:5,
    },
    paragraph: {
        position: "absolute",
        top: height * (5 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
    },
  });