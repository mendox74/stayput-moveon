import React, { PureComponent, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, ThemeProvider } from 'react-native-elements';
import io from 'socket.io-client';

const socket = io('http://192.168.11.7:8080', {transports: ['websocket']} );

function Display() {
  const [distance, setDistance] = useState();
  const [hideTime, setHideTime] = useState();
  const [watchCount, setWatchCount] = useState();
  const [toucher, setToucher] = useState('STOP');
  const [watcher, setWatcher] = useState('WATCH');
  const [moveFlg, setMoveFlg] = useState(false);
  const [hideFlg, setHideFlg] = useState(false);

  useEffect(() => {
    if(moveFlg){
    setTimeout(() => setDistance(distance - 10), 10);
    }
  },[distance, moveFlg]);

  useEffect(() => {
    if(hideFlg){
    setTimeout(() => setHideTime(hideTime - 10), 10);
    }
  },[hideTime, hideFlg]);

  socket.on('distance', (count) => {
    setDistance(count);
  });
  socket.on('hideTime', (count) => {
    setHideTime(count);
  });
  socket.on('watch', (count) => {
    setHideFlg(false);
    setWatchCount(count);
    setWatcher('WATCH');
  });
  socket.on('result', (name) => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    if(watcher === 'HIDE'){setHideFlg(false)};
    setToucher('STOP');
    setWatcher('WATCH');
    if(name === 'distance'){
      setDistance('TOUCHER-WIN');
    } else {
      setHideTime('WATCHER-WIN');
    }
  });

  socket.on('hide', () => {
    setWatcher('HIDE');
    setHideFlg(true);
  });
  socket.on('move', (count) => {
    setDistance(count);
    setToucher('MOVE');
    setMoveFlg(true);
  });
  socket.on('stop', (count) => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    setToucher('STOP');
    setDistance(count);
  });
  socket.on('out', () => {
    if(toucher === 'MOVE'){setMoveFlg(false)};
    setToucher('OUT');
  });

  socket.on('set', (hideTime, watchCount) => {
    setWatchCount(watchCount);
    setHideTime(hideTime);
    setMoveFlg(false);
    setHideFlg(false);
  });

  socket.on('join', (distance) => {
    setDistance(distance);
    setMoveFlg(false);
  })

  socket.on('delete', () => {
    setDistance();
    setHideTime();
    setWatchCount();
  });

  socket.on('result player', () => {
    if(toucher === 'move'){setMoveFlg(false)};
    if(watcher === 'hide'){setHideFlg(false)};
    setToucher('STOP');
    setWatcher('WATCH');
  });

  return (
    <View>
      <Text h3>{hideTime}</Text>
      <Text h4>{watchCount}</Text>
      <Text h3>{distance}</Text>
      <Button
        title={watcher}
        onPressIn={() => socket.emit('hide')}
        onPressOut={() => socket.emit('watch')}
      />
      <Button
        title={toucher}
        onPressIn={() => socket.emit('move')}
        onPressOut={() => socket.emit('stop')}
      />
    </View>
  )
}

function Join() {
  const [player, setPlayer] = useState(['test']);

  socket.on('add player', (name) => {

  });
  socket.on('remove player', (name) => {

  });
  socket.on('player', (name,distance) => {

  });
  socket.on('result player', (name) => {

  });

  return
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
          <Button
            title="JOIN"
            onPress={() => socket.emit('join')}
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