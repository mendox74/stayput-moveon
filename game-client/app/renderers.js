import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, FlatList, Share, Platform } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import { Audio } from "expo-av";
import { AdMobBanner } from "expo-ads-admob";
import { socket } from "../socket";
import IconSelecter from "../title/iconSelecter"

import Entry from '../assets/menus/entry.svg' 
import ExitImage from '../assets/menus/exit.svg';
import Laurel from '../assets/menus/laurel.svg';

const decisionSound = new Audio.Sound();
const cancelSound = new Audio.Sound();
const infoSound = new Audio.Sound();
const exitSound = new Audio.Sound();

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
        this.bgmObjectSet();
    }

    _onPress = () => {
        socket.emit('join');
        if(this.props.text === 'JOIN!'){
            this.decisionSoundPlay()
        } else {
            this.cancelSoundPlay();
        }
    }

    async bgmObjectSet () {
        try{
            await decisionSound.loadAsync(require('../assets/sounds/decision.mp3'))
            await decisionSound.setVolumeAsync(0.1)
            await cancelSound.loadAsync(require('../assets/sounds/cancel.mp3'))
            await cancelSound.setVolumeAsync(0.1)
        } catch(e) {
        
        }        
    }

    async decisionSoundPlay () {
        await decisionSound.replayAsync()
    }

    async cancelSoundPlay () {
        await cancelSound.replayAsync()
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        const color = this.props.color || "#dc143c";
        const text = this.props.text || 'JOIN!';
   
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
                        backgroundColor: color,
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
                        {text}
                    </Text>
                </Animatable.View>
            </TouchableWithoutFeedback>
        );
    }
}

class Logout extends PureComponent {
    constructor(props) {
        super(props);
        this.bgmObjectSet();
    }

    _onPress = () => {
        socket.emit('logout');
        socket.close();
        this.props.close();
        this.exitSoundPlay();
    }

    async bgmObjectSet () {
        try{
            await exitSound.loadAsync(require('../assets/sounds/cancel.mp3'))
            await exitSound.setVolumeAsync(0.1)
        } catch(e) {
        
        }        
    }

    async exitSoundPlay () {
        await exitSound.replayAsync()
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
                        width: width * 2.5,
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
        const color = this.props.text > 4? 'limegreen': this.props.text > 2? 'yellow': 'red';
        let amount = [];
        for (let i = 0; i < this.props.text; i++){
            amount.push(
                <View
                    key={i}
                    style={{
                        width:10,
                        height:30,
                        margin: 2,
                        borderRadius: 3,
                        backgroundColor: color,
                    }}
                ></View>
            );
        }
    
        return (
            <View
                style={{
                    flexDirection: 'row',
                    position: "absolute",
                    left: x,
                    top: y,
                    width: width,
                    height: height,
                    alignItems:'center',
                }}
            >
                    {amount}
            </View>
        );
    }
}

class Info extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isMoadlVisible: false,
        }
        this.bgmObjectSet();
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.infoSoundPlay();
    };

    onShare = async (host, Id) => {
        try {
          await Share.share({
            message:
              host + Id,
          });
        } catch (error) {
          alert(error.message);
        }
    };

    assignShare = () => {
        this.onShare(this.props.server ,this.props.roomId)
        this.infoSoundPlay();
    }

    async bgmObjectSet () {
        try{
            await infoSound.loadAsync(require('../assets/sounds/cancel.mp3'))
            await infoSound.setVolumeAsync(0.1)
        } catch(e) {
        
        }        
    }

    async infoSoundPlay () {
        await infoSound.replayAsync()
    }

    render() {
        const width = this.props.size[0];
        const height = this.props.size[1];
        const modalHeight = this.props.height;
        const x = this.props.body.position.x - width / 2;
        const y = this.props.body.position.y - height / 2;
        const data = this.props.menberList || [{id: '999999999',name: 'Empty', icon: null, color: null}];
        const roomId = this.props.roomId || '';
        const server = this.props.server || '';
        let text = this.props.text;
    
        return (
            <>
            <TouchableWithoutFeedback
                onPress={this.toggleModal}
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
                        alignItems:'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                        color:'#f2fdff',
                        fontSize: 15,
                        }}
                    >Info</Text>
                </View>
            </TouchableWithoutFeedback>
            <ModalAnimate
                animationIn="bounceIn"
                animationOut="bounceOut"
                isVisible={this.state.isModalVisible}
            >
                <View
                    style={{
                        zIndex: 5,
                        height: modalHeight * (8 / 10),
                        alignItems: 'center', 
                        borderColor: "#f2fdff",
                        borderWidth: 3,
                        backgroundColor: "#101935" 
                    }}
                >
                    <Text
                        style={{
                            marginTop: 5,
                            textAlign: 'center',
                            color: '#f2fdff',
                        }}
                    >
                        ROOM ID
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text 
                            style={{
                                width: width * 2,
                                height:height,
                                paddingTop: 5,
                                fontSize: 15,
                                textAlign: "center",
                                justifyContent: 'center',
                                alignItems: 'center', 
                                color: '#f2fdff',
                                borderRadius: 10,
                                borderColor: "#f2fdff",
                                borderWidth: 2,
                            }}
                        >
                            {server + roomId}
                        </Text>
                        <Text
                            style={{
                                width: 80, 
                                height: height,
                                fontSize: 15,
                                marginLeft: 5,
                                paddingTop: 5,
                                textAlign: 'center',
                                borderRadius: 10,
                                borderColor: "#f2fdff",
                                borderWidth: 2,
                                color: '#f2fdff',
                            }}
                            onPress={this.assignShare}
                        >Share
                        </Text>
                    </View>
                    <FlatList
                        data={data}
                        renderItem={({item, index}) => {
                            return <View style={{
                                            marginTop: 3,
                                            width: width * 2,
                                            height: height,
                                            flexDirection:'row',
                                            justifyContent: 'left',
                                            alignItems: 'center', 
                                        }}>
                                        <Text style={{width: 40, textAlign: 'center',color:'#f2fdff'}}>{index + 1}</Text>
                                        <View
                                            style={{
                                                width: 20,
                                                marginRight: 5,
                                            }}
                                        >
                                            <IconSelecter iconName={item.icon} color={item.color}/>
                                        </View>
                                        <Text style={{textAlign: 'left',color:'#f2fdff'}}>{item.name}</Text>
                                    </View>
                        }}
                        keyExtractor={item => item.id}
                    >
                    </FlatList>
                    <Text
                        style={{
                            width: width, 
                            height: height,
                            fontSize: 15,
                            margin: 5,
                            paddingTop: 5,
                            textAlign: 'center',
                            borderRadius: 10,
                            borderColor: "#f2fdff",
                            borderWidth: 2,
                            color: '#f2fdff',
                        }}
                        onPress={this.toggleModal}
                    >CLOSE
                    </Text>
                </View>
            </ModalAnimate>
            </>
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
        let laurel = this.props.rank === 1? <Laurel style={{ position: "absolute", width: 120, height: 120}}/>: null;
    
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
                            backgroundColor: "#f2fdff",
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
                            {laurel}
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
                                    ios: "ca-app-pub-3476089354434972/8862410843" ,
                                    android:"ca-app-pub-3476089354434972/7138265631" ,
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
    Box, Animal, MoveButton, Number, Result, Logout, Stanby, Join, Ranking, Info
};