import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, Modal, Dimensions, TouchableWithoutFeedback, processColor } from "react-native";
import * as Animatable from 'react-native-animatable';
import ModalAnimate from "react-native-modal";
import { AdMobBanner } from "expo-ads-admob";
import { storage } from "../storage"; 
import IconSelecter from "../title/iconSelecter"
import RigidBodies from "../app/index";

import CleaningRobot_1 from '../assets/icons/bigAirplane.svg';
import StartImage from '../assets/menus/start.svg';

const { width, height } = Dimensions.get("window");

export default class Title extends Component {
    constructor() {
        super();
        this.state = {
            isMoadlVisible: false,
            sceneVisible: false,
            scene: null,
            iconName: 'bigAirplane',
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
                name : this.state.inputValue
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
                        <Text>NAME</Text>
                        <TextInput
                            value={this.state.inputValue}
                            onChangeText={this._handleTextChange}
                            style={styles.textInput}
                        />
                        <View style={styles.icon}>
                            <IconSelecter iconName={this.state.iconName}/>
                        </View>
                        <Button
                            title="OK"
                            onPress={this.accountSave}
                        />
                        <Button
                            title="CANCEL"
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
        backgroundColor: '#101935',
    },
    watch: {
        position: "absolute",
        left: width * (2 / 10),
        top: height * (2.3 / 10),
        margin: 2,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f2fdff',
    },
    touch: {
        position: "absolute",
        left: width * (5.5 / 10),
        top: height * (3.3 / 10),
        margin: 2,
        fontSize: 28,
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
        marginVertical: 6,
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
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: "#fff" 
    },
    textInput: {
        width: 200, 
        height: 44, 
        padding: 8, 
        textAlign: 'center',
    },
    icon: {
        width: width / 7,
        height: width / 7,
        padding: 4,
        borderRadius: width / 2,
        borderColor: "#f2fdff",
        borderWidth:3,
    },
  });