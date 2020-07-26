import React, { Component } from "react";
import { StyleSheet, View, ART, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import { socket } from "../socket";
import AirplaneImage from '../assets/icons/bigAirplane.svg';
import Entry from '../assets/menus/entry.svg' 
import ExitImage from '../assets/menus/exit.svg';
// const dogImage = require('../assets/icons/dog.svg');

class Box extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
   
        return (
            <View
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                borderRadius: width / 2,
                backgroundColor: this.props.color || "pink"
            }}
            />
        );
    }
}

class Join extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        socket.emit('join');
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
   
        return (
            <TouchableWithoutFeedback
            onPress={this._onPress}
            >
                <Animatable.View
                    animation = "pulse"
                    iterationCount = {"infinite"}
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                        // borderRadius: width / 2,
                        // backgroundColor: this.props.color || "pink"
                }}
                >
                    <Entry />
                </Animatable.View>
            </TouchableWithoutFeedback>
        );
    }
}

class Logout extends Component {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        socket.emit('logout');
        this.props.close();
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        return (
            <TouchableWithoutFeedback
            onPress={this._onPress}
            >
                <View
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                        // borderRadius: width / 2,
                        // borderColor: "#000000",
                        // borderWidth: 4,
                    }}
                >
                    <ExitImage />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

class Animal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        const text = this.props.text;
        const angle = this.props.angle;
   
        return (
            <View
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    alignItems:'center',
                    justifyContent: 'center',
                    // borderColor: "#000000",
                    // borderWidth: 4,
                }}
            >
                <AirplaneImage 
                    style={{
                        transform: [{rotate: angle}],
                    }}
                />
            </ View>
        );
    }
}

class MoveButton extends Component {
    constructor(props) {
        super(props);
    }

    _onPressIn = () => {
        socket.emit('behavior')
    }

    _onPressOut = () => {
        socket.emit('repose')
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;

        return (
            <TouchableWithoutFeedback
             onPressIn={this._onPressIn}
             onPressOut={this._onPressOut}
            >
                <View
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                        width: width,
                        height: height,
                        borderRadius: width / 2,
                        backgroundColor: this.props.color || "pink"
                    }}
                />
            </TouchableWithoutFeedback>
        );
    }
}

class Number extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        let text = this.props.text;
    
        return (
            <View
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    borderColor: "#CCC",
                    borderWidth: 4,
                    borderRadius: width,
                    alignItems:'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                    fontSize: 20,
                    }}
                >{text}</Text>
            </View>
        );
    }
}

class Result extends Component {
    constructor(props) {
        super(props);
        this.state = { isVisible: false}
    }

    static getDerivedStateFromProps( nextProps, prevState){
        if(nextProps.isVisible){
            if(!prevState.isVisible){
                return { isVisible: true};
            }
        }
        return null;
    }

    hideModal = () => {
        this.setState({ isVisible: false});
    };

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        let role = this.props.role;
        let name = this.props.name;
        let animationIn = this.props.animationIn;
        let animationOut = this.props.animationOut;
    
        return (
            <TouchableWithoutFeedback
                onPress={this.hideModal}
            >
                < ModalAnimate
                    isVisible = {this.state.isVisible}
                    animationIn="bounceIn"
                    animationOut="bounceOut"
                >
                    <View
                        style={{
                            // position: "absolute",
                            // left: x,
                            // top: y,
                            width: width * (9/10),
                            height: height,
                            // borderColor: "#FFF",
                            // borderWidth: 2,
                            alignItems:'center',
                            justifyContent: 'center',
                            backgroundColor: '#AC0'
                        }}
                    >
                        <Text
                            style={{
                            fontSize: 40,
                            }}
                        >{role}
                        </Text>
                        <Text
                            style={{
                            fontSize: 20,
                            }}
                        >{name}
                        </Text>
                    </View>
                </ ModalAnimate>
            </TouchableWithoutFeedback>
        );
    }
}

class Stanby extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        let count = this.props.count;
        let animation = this.props.animation;
    
        return (
            < Animatable.View
                animation={animation}
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    borderColor: "#FFF",
                    borderWidth: 2,
                    alignItems:'center',
                    justifyContent: 'center',
                    backgroundColor: 'pink',
                }}
            >
                <Text
                    style={{
                    fontSize: 40,
                    }}
                >{count}
                </Text>
            </ Animatable.View>
        );
    }
}

export {
    Box, Animal, MoveButton, Number, Result, Logout, Stanby, Join
};