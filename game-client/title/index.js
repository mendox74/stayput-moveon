import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TextInput, Modal, Dimensions, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import { AdMobBanner } from "expo-ads-admob";
import { socket } from "../socket";
import { storage } from "../storage"; 
import IconSelecter from "../title/iconSelecter"
import RigidBodies from "../app/index";

import StartImage from '../assets/menus/start.svg';

const { width, height } = Dimensions.get("window");

export default class Title extends PureComponent {
    constructor() {
        super();
        this.state = {
            isMoadlVisible: false,
            sceneVisible: false,
            scene: null,
            iconName: 'bigAirplane',
            roomId: null,
            hostname: null,
            protect: false,
        };
    }

    componentDidMount() {
        storage.load({
            key: 'user',
        }).then(data => {
            this.setState({ 
                inputValue: data.name ? data.name : 'unknown',
                iconName: data.iconName ? data.iconName : 'bigAirplane',
            });
        }).catch(err => {
            this.setState({ 
                inputValue: 'unknown',
                iconName: 'bigAirplane',
            });
        })
    }

    mountScene = () => {
        socket.emit('connect');
        this.setState({
            sceneVisible: true,
            scene: <RigidBodies
                    unMountScene={this.unMountScene}
                    name={this.state.inputValue}
                    icon={this.state.iconName}/>
        });
    };
  
    unMountScene = () => {
        this.setState({
            sceneVisible: false,
            scene: null
        });
    };

    accountSave = () => {
        storage.save({
            key: 'user',
            data: {
                name : this.state.inputValue,
                iconName: this.state.iconName,
            }
        })
        this.setState({ isModalVisible: !this.state.isModalVisible });
        storage.load({
            key: 'user',
        }).then(data => {
            this.setState({ 
                inputValue: data.name ? data.name : 'unknown',
                iconName: data.iconName ? data.iconName : 'bigAirplane',
            });
        }).catch(err => {
            this.setState({ 
                inputValue: 'unknown',
                iconName: 'bigAirplane',
            });
        })
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        storage.load({
            key: 'user',
        }).then(data => {
            this.setState({ 
                inputValue: data.name ? data.name : 'unknown',
                iconName: data.iconName ? data.iconName : 'bigAirplane',
            });
        }).catch(err => {
            this.setState({ 
                inputValue: 'unknown',
                iconName: 'bigAirplane',
            });
        })
    };
  
    _handleTextChange = inputValue => {
        this.setState({ inputValue });
    };

    getRoomId = () => {
        fetch('http://192.168.11.7:8080/generateRoomId')
        .then((data) => {
            this.setState({
                roomId: data.roomId,
                hostname: data.hostname,
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

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
                        <View style={styles.icon}>
                            <IconSelecter iconName={this.state.iconName}/>
                        </View>
                        <View>
                            <Text
                                style={{
                                    color: '#f2fdff',
                                    textAlign: 'center',
                                }}
                            >
                                NAME</Text>
                            <Text 
                                style={styles.name}
                            >
                                {this.state.inputValue}
                            </Text>
                        </View>
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
                            height: width/3,
                            borderRadius: width / 2,
                            borderWidth: 4,
                            borderColor: '#f2fdff',
                            backgroundColor: '#f2fdff',
                        }}
                    >
                        <StartImage />
                    </Animatable.View>
                </TouchableWithoutFeedback>

                <View>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#f2fdff',
                        }}
                    >
                        ROOM ID
                    </Text>
                    <Text 
                        style={styles.name}
                    >
                        {this.state.hostname}
                    </Text>
                    <Text 
                        style={styles.name}
                    >
                        {this.state.roomId}
                    </Text>
                    <View
                        style={{
                            marginTop: 3,
                            marginLeft: 25,
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={styles.button}
                            onPress={this.getRoomId}
                        >Generate
                        </Text>
                        <Text
                            style={styles.button}
                            onPress={}
                        >Share
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
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
                        bannerSize="smartBannerPortrait"
                        onDidFailToReceiveAdWithError={this.bannerError} 
                    />
                </View>
                <ModalAnimate 
                    animationIn="bounceIn"
                    animationOut="bounceOut"
                    isVisible={this.state.isModalVisible}
                >
                    <View style={styles.setting}>
                        <View
                            style={{
                                paddingTop: 20,
                                flexDirection: 'row',
                            }}
                        >
                            <View style={styles.icon}>
                                <IconSelecter iconName={this.state.iconName}/>
                            </View>
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: '#f2fdff',
                                    }}
                                >
                                    NAME
                                </Text>
                                <TextInput
                                    value={this.state.inputValue}
                                    onChangeText={this._handleTextChange}
                                    style={styles.textInput}
                                />
                                <View
                                    style={{
                                        marginTop: 3,
                                        marginLeft: 25,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text
                                        style={styles.button}
                                        onPress={this.accountSave}
                                    >OK
                                    </Text>
                                    <Text
                                        style={styles.button}
                                        title="CANCEL"
                                        onPress={this.toggleModal}
                                    >CANCEL
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text
                            style={{
                                margin: 5,
                                textAlign: 'center',
                                color: '#f2fdff',
                            }}
                        >
                            ICON SELECT
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {this.setState({iconName: 'bigAirplane'})}}
                            >
                                <View style={styles.iconSelect}>
                                    <IconSelecter iconName={'bigAirplane'}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback
                                onPress={() => {this.setState({iconName: 'beetle_1'})}}
                            >
                                <View style={styles.iconSelect}>
                                    <IconSelecter iconName={'beetle_1'}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'beetle_2'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'turtle_1'}/>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_1'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_2'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_3'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'crab_1'}/>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_1'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_2'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_3'}/>
                            </View>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'squid_1'}/>
                            </View>
                        </View>
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
        backgroundColor: '#101935',
    },
    watch: {
        position: "absolute",
        left: width * (2 / 10),
        top: height * (2.3 / 10),
        margin: 2,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f2fdff',
    },
    touch: {
        position: "absolute",
        left: width * (5.5 / 10),
        top: height * (3.3 / 10),
        margin: 2,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f2fdff',
    },
    or: {
        position: "absolute",
        top: height * (2.8 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f2fdff',
    },    
    name: {
        paddingTop: 9,
        marginLeft: -2,
        width: width/2,
        height:height/15,
        fontSize: 20,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center', 
        color: '#f2fdff',
        borderRadius: width / 20,
        borderColor: "#f2fdff",
        borderWidth: 3,
    },
    account: {
        flexDirection: 'row',
        position: "absolute",
        top: height * (4.3 / 10),
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
    setting: {
        height: height * (8 / 10),
        alignItems: 'center', 
        borderColor: "#f2fdff",
        borderWidth: 3,
        backgroundColor: "#101935" 
    },
    textInput: {
        width: 200, 
        height: 44, 
        fontSize: 20,
        textAlign: 'center',
        borderRadius: width / 20,
        borderColor: "#f2fdff",
        borderWidth: 3,
        color: '#f2fdff',
    },
    icon: {
        width: width / 5,
        height: width / 5,
        padding: 4,
        borderRadius: width / 2,
        borderColor: "#f2fdff",
        borderWidth:3,
    },
    iconSelect: {
        width: width / 7,
        height: width / 7,
        padding: 4,
        margin: 10,
    },
    button: {
        width: 80, 
        height: 35, 
        fontSize: 15,
        margin: 5,
        paddingTop: 5,
        textAlign: 'center',
        borderRadius: width / 30,
        borderColor: "#f2fdff",
        borderWidth: 3,
        color: '#f2fdff',
    },
  });