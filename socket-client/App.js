import React, { PureComponent, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, ThemeProvider } from 'react-native-elements';
import io from 'socket.io-client';

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

function Display() {
  const [distance, setDistance] = useState();
  const [hideTime, setHideTime] = useState();
  const [watchCount, setWatchCount] = useState();

  socket.on('distance', (count) => {
    setDistance(count);
  });
  socket.on('hideTime', (count) => {
    setHideTime(count);
  });
  socket.on('watch', (count) => {
    setWatchCount(count);
  });
  socket.on('result', (name) => {
    if(name === 'distance'){
      setDistance('TOUCHER-WIN');
    } else {
      setHideTime('WATCHER-WIN');
    }
  });

  socket.on('set', (status, watchCount) => {
    setWatchCount(watchCount);
    setHideTime(status.hideTime);
    setDistance(status.distance);
  });
  socket.on('delete', () => {
    setDistance();
    setHideTime();
    setWatchCount();
  });

  return (
    <View>
      <Text h3>{distance}</Text>
      <Text h3>{hideTime}</Text>
      <Text h4>{watchCount}</Text>
    </View>
  )
}

function Player() {
  const [toucher, setToucher] = useState('STOP');
  const [watcher, setWatcher] = useState('HIDE');

  socket.on('hide', () => {
    setWatcher('HIDE');
  });
  socket.on('watch', () => {
    setWatcher('WATCH');
  });
  socket.on('move', () => {
    setToucher('MOVE');
  });
  socket.on('stop', () => {
    setToucher('STOP');
  });
  socket.on('out', () => {
    setToucher('OUT');
  });
  socket.on('result', () => {
    setToucher('STOP');
  });

  return(
    <View>
      <Button
        title={watcher}
        onPressIn={() => socket.emit('watch')}
        onPressOut={() => socket.emit('hide')}
      />
      <Button
        title={toucher}
        onPressIn={() => socket.emit('move')}
        onPressOut={() => socket.emit('stop')}
      />
    </View>
  )
}

function Room() {
  const [userName, setUserName] = useState('hitoshi');
  const [roomNumber, setRoomNumber] = useState('10');
  const [roomMenber, setRoomMenber] = useState();

  socket.on('roomNumber', (key) => {
    setRoomNumber(key);
  });
  socket.on('roomMenber', (menber) => {
    setRoomMenber(menber);
  });
  socket.on('myName', (userName) => {
    setUserName(userName);
  });
  socket.on('delete', () =>{
    setRoomMenber();
    setRoomNumber();
  });

  return(
    <View>
      <Text >{userName}</Text>
      <Text >{roomMenber}</Text>
      <Text >{roomNumber}</Text>
    </View>
  )
}

export default class App extends PureComponent {
  constructor() {
    super();
  }

  render() {

    socket.on('connect', () => {
      socket.emit('setUserName');
    })
    return (
      <View style ={styles.container}>
        <ThemeProvider theme={theme}>
          <Display />
          <Player />
          <Button
            title="START"
            onPress={() => socket.emit('start')}
          />
          <Button
            title="AUTO"
            onPress={() => socket.emit('auto')}
          />
          <Button
            title="RESET"
            onPress={() => socket.emit('reset')}
          />
          <Room />
          <Button
              title="IN"
              onPress={() => socket.emit('login')}
            />
          <Button
            title="OUT"
            onPress={() => socket.emit('logout')}
          />
        </ThemeProvider>
      </View>
    );
  }
}

const theme = {
  Button: {
    raised: true,
    containerStyle: {
      marginTop: 20,
      width: 100,
    }
  },
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: 'center',
    justifyContent: 'center',
  }
});