import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Animatable from 'react-native-animatable';


export default class Title extends Component {
    constructor() {
      super();
    }
    
    render() {
        return(
            <View style={styles.container}>
                <Text>Title</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#C0E4A9',
    },
  });