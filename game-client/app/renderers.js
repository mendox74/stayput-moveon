import React, { Component } from "react";
import SvgUri from "react-native-svg-uri";
import { StyleSheet, View, ART, Dimensions, Text, Button } from "react-native";
import * as Animatable from 'react-native-animatable';
const dogImage = require('../assets/icons/dog.svg');
const exitImage = require('../assets/menus/exit.svg')

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
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            borderRadius: width / 2,
            backgroundColor: this.props.color || "pink"
          }
        }
      />
    );
  }
}

class Logout extends Component {
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
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            borderRadius: width / 2,
            // borderColor: "#000000",
            // borderWidth: 4,
          }
        }
      >
        <SvgUri 
        source = {exitImage} />
      </View>
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
        <Text>{text}</Text>
      </ View>
    );
  }
}

class MoveButton extends Component {
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

class Result extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = this.props.size[0];
    const height = this.props.size[1];
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;
    let role = this.props.role;
    let name = this.props.name;
    let animation = this.props.animation;
   
    return (
      < Animatable.View animation={animation}
        style={
          {
            position: "absolute",
            left: x,
            top: y,
            width: width,
            height: height,
            borderColor: "#FFF",
            borderWidth: 2,
            alignItems:'center',
            justifyContent: 'center',
            backgroundColor: '#AC0'
          }
        }
      >
      <Text
        style={{
           fontSize: 40,
          }}
      >{role}</Text>
            <Text
        style={{
           fontSize: 20,
          }}
      >{name}</Text>
      </ Animatable.View>
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
      < Animatable.View animation={animation}
        style={
          {
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
          }
        }
      >
      <Text
        style={{
          fontSize: 40,
        }}
      >{count}</Text>
      </ Animatable.View>
    );
  }
}

export {
  Box, Animal, MoveButton, Number, Result, Logout, Stanby
};