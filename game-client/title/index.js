import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, Button, Modal } from "react-native";
import ModalAnimate from "react-native-modal";
import RigidBodies from "../app/index";

export default class Title extends Component {
    constructor() {
      super();
      this.state = {
       inputValue: "No Name",
       isMoadlVisible: false,
       sceneVisible: false,
       scene: null,
      };
    }

    mountScene = () => {
      this.setState({
        sceneVisible: true,
        scene: <RigidBodies unMountScene={this.unMountScene}/>
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
                <Text style={styles.paragraph}>
                  WATCH or TOUCH
                </Text>
                <Text 
                style={styles.paragraph}
                onPress={this.toggleModal}
                >
                  {this.state.inputValue}
                </Text>
                <Button
                  title="GO"
                  onPress={this.mountScene}
                />
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
      margin: 24,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#34495e',
    },
  });