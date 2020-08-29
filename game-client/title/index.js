import React, { PureComponent } from "react";
import { StyleSheet, View, Text, TextInput, Modal, Dimensions, TouchableWithoutFeedback } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import ScrollableTabView from "react-native-scrollable-tab-view";
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
            color: '#f2fdff',
            roomId: null,
            hostname: null,
            protect: false,
        };
    }

    componentDidMount() {
        this.storageLoad();
    }

    mountScene = () => {
        socket.open();
        socket.emit('login', this.state.inputValue, this.state.iconName, this.state.color);
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
                color: this.state.color,
            }
        })
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.storageLoad();
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
        this.storageLoad();
    };
  
    _handleTextChange = inputValue => {
        this.setState({ inputValue });
    };

    getRoomId = () => {
        fetch('http://192.168.11.7:8080/generateRoomId')
        .then((response) => response.json())
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

    storageLoad = () => {
        storage.load({
            key: 'user',
        }).then(data => {
            this.setState({ 
                inputValue: data.name || 'unknown',
                iconName: data.iconName || 'bigAirplane',
                color: data.color || '#f2fdff',
            });
        }).catch(err => {
            this.setState({ 
                inputValue: 'unknown',
                iconName: 'bigAirplane',
                color: '#f2fdff',
            });
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <View
                    style={styles.title}
                >
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
                </View>
                <TouchableWithoutFeedback
                    onPress={this.toggleModal}
                >
                    <View
                        style={styles.account}
                    >
                        <View style={styles.icon}>
                            <IconSelecter iconName={this.state.iconName} color={this.state.color}/>
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
                <View
                    style={styles.createRoom}
                >
                <ScrollableTabView
                tabBarTextStyle={{
                    color: '#f2fdff',
                }}
                >
                <View tabLabel="OPEN"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: width/2,
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={this.mountScene}
                    >
                        <Animatable.View
                            animation = "pulse"
                            iterationCount = {"infinite"}
                            style={{
                                width: width/1.3,
                                height: width/4.5,
                                borderRadius: width / 20,
                                borderWidth: 6,
                                borderColor: '#f2fdff',
                                backgroundColor: '#dc143c',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                                <Text
                                    style={{
                                        color: '#f2fdff',
                                        fontSize: 30,
                                    }}
                                >CONNECT</Text>
                        </Animatable.View>
                    </TouchableWithoutFeedback>
                </View>

                <View tabLabel="SELECT"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: width/2,
                    }}
                >
                    <TouchableWithoutFeedback
                        onPress={this.mountScene}
                    >
                        <Animatable.View
                            animation = "pulse"
                            iterationCount = {"infinite"}
                            style={{
                                width: width/1.3,
                                height: width/6,
                                borderRadius: width / 20,
                                borderWidth: 6,
                                borderColor: '#f2fdff',
                                backgroundColor: '#dc143c',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                                <Text
                                    style={{
                                        color: '#f2fdff',
                                        fontSize: 20,
                                    }}
                                >CONNECT</Text>
                        </Animatable.View>
                    </TouchableWithoutFeedback>
                    <Text
                        style={{
                            textAlign: 'center',
                            color: '#f2fdff',
                        }}
                    >
                        ROOM ID
                    </Text>
                    <Text 
                        style={styles.roomId}
                    >
                        {this.state.hostname}
                    </Text>
                    <Text 
                        style={styles.roomId}
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
                            onPress={this.getRoomId}
                        >Share
                        </Text>
                    </View>
                </View>
                </ScrollableTabView>
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
                                <IconSelecter iconName={this.state.iconName} color={this.state.color}/>
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
                            COLOR SELECT
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => {this.setState({color: '#f2fdff'})}}>
                                <View style={{...styles.colorSelect, backgroundColor: '#f2fdff'}}></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({color: '#1e90ff'})}}>
                                <View style={{...styles.colorSelect, backgroundColor: '#1e90ff'}}></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({color: '#ffff00'})}}>
                                <View style={{...styles.colorSelect, backgroundColor: '#ffff00'}}></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({color: '#dc143c'})}}>
                                <View style={{...styles.colorSelect, backgroundColor: '#dc143c'}}></View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({color: '#7cfc00'})}}>
                                <View style={{...styles.colorSelect, backgroundColor: '#7cfc00'}}></View>
                            </TouchableWithoutFeedback>
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
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'bigAirplane'})}}>
                                <View style={styles.iconSelect}>
                                    <IconSelecter iconName={'bigAirplane'}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'beetle_1'})}}>
                                <View style={styles.iconSelect}>
                                    <IconSelecter iconName={'beetle_1'}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'beetle_2'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'beetle_2'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'turtle_1'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'turtle_1'}/>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'cleaningRobot_1'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_1'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'cleaningRobot_2'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_2'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'cleaningRobot_3'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'cleaningRobot_3'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'crab_1'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'crab_1'}/>
                            </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'butterfly_1'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_1'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'butterfly_2'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_2'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'butterfly_3'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'butterfly_3'}/>
                            </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {this.setState({iconName: 'squid_1'})}}>
                            <View style={styles.iconSelect}>
                                <IconSelecter iconName={'squid_1'}/>
                            </View>
                            </TouchableWithoutFeedback>
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
    title:{
        position: "absolute",
        top: height * (1 / 10),
        width: width /1.3,
    },
    watch: {
        margin: 2,
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#f2fdff',
    },
    touch: {
        margin: 2,
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#f2fdff',
    },
    or: {
        margin: 3,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f2fdff',
    },    
    name: {
        paddingTop: 9,
        marginLeft: -2,
        width: width/1.8,
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
        top: height * (3.5 / 10),
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
        padding: 6,
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
    colorSelect: {
        width: width / 10,
        height: width / 10,
        borderRadius: width / 2,
        padding: 4,
        margin: 10,
    },
    button: {
        width: 80, 
        height:height/25,
        fontSize: 15,
        margin: 5,
        paddingTop: 2,
        textAlign: 'center',
        borderRadius: 10,
        borderColor: "#f2fdff",
        borderWidth: 2,
        color: '#f2fdff',
    },
    createRoom: {
        position: "absolute",
        top: height * (5 / 10),
    },
    roomId: {
        paddingTop: 2,
        marginLeft: -2,
        width: width/1.8,
        height:height/25,
        fontSize: 15,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center', 
        color: '#f2fdff',
        borderRadius: 10,
        borderColor: "#f2fdff",
        borderWidth: 2,
    },
  });