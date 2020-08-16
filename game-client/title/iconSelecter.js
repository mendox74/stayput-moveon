import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions} from "react-native";
import BigAirplane from "../assets/icons/bigAirplane.svg";
import CleaningRobot_1 from "../assets/icons/cleaningRobot_1.svg";

const { width, height } = Dimensions.get("window");

export default class IconSelecter extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            icon: <CleaningRobot_1 />,
        }
    }
    
    componentDidMount (){
        switch (this.props.iconName){
            case 'bigAirplane':
                this.setState({ icon: <BigAirplane style={{ transform: [{rotate: this.props.angle? this.props.angle: '0rad'}]}} />});
                break;
            case 'cleaningRobot_1':
                this.setState({ icon: <CleaningRobot_1 style={{ transform: [{rotate: this.props.angle? this.props.angle: '0rad'}]}} />});
                break;
            default:
                this.setState({ icon: <CleaningRobot_1 style={{ transform: [{rotate: this.props.angle? this.props.angle: '0rad'}]}} />});
                break;
        }
    }

    componentDidUpdate (prevProps){
        if(this.props.angle && this.props.angle !== prevProps.angle){
            switch (this.props.iconName){
                case 'bigAirplane':
                    this.setState({ icon: <BigAirplane style={{ transform: [{rotate: this.props.angle}]}} />});
                    break;
                case 'cleaningRobot_1':
                    this.setState({ icon: <CleaningRobot_1 style={{ transform: [{rotate: this.props.angle}]}} />});
                    break;
                default:
                    this.setState({ icon: <CleaningRobot_1 style={{ transform: [{rotate: this.props.angle}]}} />});
                    break;
            }
        }
    }
    render(){
        return(
            <>
                {this.state.icon}
            </>
        );
    }
}