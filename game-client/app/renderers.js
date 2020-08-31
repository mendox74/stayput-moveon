import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import { AdMobBanner } from "expo-ads-admob";
import { socket } from "../socket";
import IconSelecter from "../title/iconSelecter"

import Entry from '../assets/menus/entry.svg' 
import ExitImage from '../assets/menus/exit.svg';
import Laurel from '../assets/menus/laurel.svg';
// const dogImage = require('../assets/icons/dog.svg');

class Box extends PureComponent {
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

class Join extends PureComponent {
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
                        borderRadius: width / 2,
                        borderColor: "#f2fdff",
                        borderWidth: 3,
                        backgroundColor: "#dc143c",
                        alignItems:'center',
                        justifyContent: 'center',
                }}
                >
                    <Text
                        style={{
                            color:'#f2fdff',
                            fontSize: width/5,
                        }}
                    >
                        JOIN!
                    </Text>
                </Animatable.View>
            </TouchableWithoutFeedback>
        );
    }
}

class Logout extends PureComponent {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        socket.emit('logout');
        socket.close();
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
                        borderColor: "#f2fdff",
                        borderWidth: 3,
                        borderRadius: width / 20,
                    }}
                >
                    <ExitImage />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

class Animal extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        const z = this.props.zIndex;
        const borderColor = this.props.borderColor;
        const borderWidth = this.props.borderWidth;
        const text = this.props.text;
        const icon = this.props.icon;
   
        return (
            <View
                style={{
                    padding: 5,
                    position: "absolute",
                    left: x,
                    top: y,
                    zIndex: z,
                    width: width,
                    height: height,
                    alignItems:'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        padding: 2,
                        width: width,
                        height: height,
                        borderRadius: width / 2,
                        borderColor: borderColor,
                        borderWidth: borderWidth,
                    }}
                >
                    <IconSelecter 
                        iconName={icon}
                        color={this.props.color}
                        angle={this.props.angle}
                    />
                </View>
                <Text 
                    style={{
                        color:'#f2fdff',
                        width: width * 2,
                        textAlign:'center',
                        fontSize: 10,
                    }} 
                >
                    {text}</Text>
            </View>
        );
    }
}

class MoveButton extends PureComponent {
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

class Number extends PureComponent {
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
                    borderColor: "#f2fdff",
                    borderWidth: 3,
                    borderRadius: width / 20,
                    alignItems:'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                    color:'#f2fdff',
                    fontSize: 15,
                    }}
                >{text}</Text>
            </View>
        );
    }
}

class Result extends PureComponent {
    constructor(props) {
        super(props);
    }

    _onPress = () => {
        this.props.close();
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        let role = this.props.role;
        let name = this.props.name;
        let rank = this.props.rank;
        let animationIn = this.props.animationIn;
        let animationOut = this.props.animationOut;
    
        return (
            <TouchableWithoutFeedback
                onPress={this._onPress}
            >
                    <Animatable.View
                        animation={'bounceIn'}
                        style={{
                            position: "absolute",
                            left: x,
                            top: y,
                            zIndex: 2,
                            width: width,
                            height: height,
                            alignItems:'center',
                            backgroundColor: '#FFFFBB'
                        }}
                    >
                        <Text
                            style={{
                            margin: 10,
                            width: width,
                            textAlign: 'center',
                            fontSize: 20,
                            }}
                        >WINNER
                        </Text>
                        <Text
                            style={{
                            width: width,
                            textAlign: 'center',
                            fontSize: 30,
                            }}
                        >{role}
                        </Text>
                        <Text
                            style={{
                            fontSize: 40,
                            }}
                        >{name}
                        </Text>
                        <Text
                            style={{
                            marginTop: 10,
                            marginBottom: -10,
                            fontSize: 20,
                            }}
                        >RANK
                        </Text>
                        <View
                            style={{
                                alignItems:'center',
                            }}
                        >
                            <Laurel 
                                style={{
                                    position: "absolute",
                                    width: 120,
                                    height: 120,
                                }}/>
                            <Text
                                style={{
                                    position: "absolute",
                                    width: 120,
                                    height: 120,
                                    marginTop: 25,
                                    fontSize: 50,
                                    textAlign: 'center',
                                }}
                            >{rank}
                            </Text>
                        </View>
                        <View
                            style={{
                                marginTop: 140
                            }}
                        >
                            <AdMobBanner
                                adUnitID={
                                    __DEV__ ? "ca-app-pub-3940256099942544/6300978111"
                                    : Platform.select({
                                    ios: "" ,
                                    android:"" ,
                                    })
                                }
                                bannerSize="mediumRectangle"
                                onDidFailToReceiveAdWithError={this.bannerError} 
                            />
                        </View>
                    </Animatable.View>
            </TouchableWithoutFeedback>
        );
    }
}

class Stanby extends PureComponent {
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
                    // borderColor: "#FFF",
                    // borderWidth: 2,
                    alignItems:'center',
                    justifyContent: 'center',
                    // backgroundColor: 'pink',
                }}
            >
                <Text
                    style={{
                    color:'#f2fdff',
                    fontSize: 110,
                    }}
                >{count}
                </Text>
            </ Animatable.View>
        );
    }
}

class Ranking extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        let rank = this.props.rank || '-';
        let entry = this.props.entry || '0';
    
        return (
            <View>
                <Text
                    style={{
                    position: "absolute",
                    left: x - width / 2.5,
                    top: y - height / 1.2,
                    width: width * 1.4,
                    color:'#f2fdff',
                    textAlign: 'center',
                    fontSize: 50,
                    }}
                >{rank}
                </Text>
            <View
                style={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height / 15,
                    backgroundColor:'#f2fdff',
                    transform:[{rotate: '-30deg'}]
                }}
            >
            </View>
                <Text
                    style={{
                    position: "absolute",
                    left: x + width / 5,
                    top: y + height / 8,
                    width: width * 1.3,
                    color:'#f2fdff',
                    textAlign: 'center',
                    fontSize: 30,
                    }}
                >{entry}
                </Text>
            </View>
        );
    }
}

export {
    Box, Animal, MoveButton, Number, Result, Logout, Stanby, Join, Ranking
};