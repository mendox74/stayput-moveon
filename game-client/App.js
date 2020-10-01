import React, { PureComponent } from "react";
import { AppRegistry, Platform } from "react-native";
import * as Linking from 'expo-linking';
import Title from "./title/index"

export default class Game extends PureComponent {
    constructor() {
        super();
        this.state = {
            server : null,
            roomId : null
        }
    }

    componentDidMount () {
        if (Platform.OS === 'android') {
          Linking.getInitialURL()
            .then(url => {
              if (url) {
                this.openFromUrlScheme(url)
              }
            })
            .catch(e => {
              console.log(e)
            })
        } else if (Platform.OS === 'ios') {
          Linking.addEventListener('url', this.handleOpenURL)
        }
      }
    
      componentWillUnmount () {
        Linking.removeEventListener('url', this.handleOpenURL)
      }
    
      handleOpenURL = event => {
        if (event.url) {
          this.openFromUrlScheme(event.url)
        }
      }
    
      openFromUrlScheme = url => {
        console.log(url)
        const { path, queryParams } = Linking.parse(url)
        this.setState({ 
            server : queryParams.server,
            roomId : queryParams.roomId
        })
      }    
 
    render() {
        return (
            <Title 
                reqServer={this.state.server}
                reqRoomId={this.state.roomId}
            />
        );
    }
}
 
AppRegistry.registerComponent("Game", () => Game);