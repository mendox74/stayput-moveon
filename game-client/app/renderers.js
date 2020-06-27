import React, { Component, PureComponent } from "react";
import SvgUri from "react-native-svg-uri";
import { StyleSheet, View, ART, Dimensions, Image, Text } from "react-native";
const dogImage = require('../assets/icons/dog.svg');

class Box extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    const angle = this.props.body.angle;
   
    return (
      <View
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            borderRadius: width / 2,
            transform: [{ rotate: angle + "rad" }],
            backgroundColor: this.props.color || "pink"
          }
        }
      />
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
    const angle = this.props.body.angle;
   
    return (
      <View
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
          }
        }
      >
        <SvgUri source={dogImage} />
        </ View>
    );
  }
}

class CatcherButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    const angle = this.props.body.angle;
   
    return (
      <View
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            borderRadius: width / 2,
            transform: [{ rotate: angle + "rad" }],
            backgroundColor: this.props.color || "pink"
          }
        }
      />
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
        style={
          {
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
          }
        }
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

export {
  Box, Animal, CatcherButton, Number
};