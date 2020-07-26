import React, { Component, Fragment } from "react";
import { StyleSheet, View, Dimensions} from "react-native";
import BigAirplane from "../assets/icons/bigAirplane.svg";
import CleaningRobot_1 from "../assets/icons/cleaningRobot_1.svg";

const { width, height } = Dimensions.get("window");

export default class IconSelecter extends Component {
    constructor(props){
        super(props)
        this.state = {
            iconName: <CleaningRobot_1 />
        }
    }
    
    componentDidMount (){
        switch (this.props.iconName){
            case 'bigAirplane':
                this.setState({ iconName: <BigAirplane width = {width / 10} height = {width / 10} />});
                break;
            default:
                this.setState({ iconName: <CleaningRobot_1 width = {width / 10} height = {width / 10} />});
                break;
        }
    }
    render(){
        return(
            <View style={styles.icon}>
                {this.state.iconName}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        padding: 4,
        borderRadius: width / 2,
        borderColor: "#000000",
        borderWidth:5,
    },
});
