import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions} from "react-native";
import Butterfly_1 from "../assets/icons/butterfly_1.svg"
import Butterfly_2 from "../assets/icons/butterfly_2.svg"
import Butterfly_3 from "../assets/icons/butterfly_3.svg"
import BigAirplane from "../assets/icons/bigAirplane.svg";
import CleaningRobot_1 from "../assets/icons/cleaningRobot_1.svg";
import CleaningRobot_2 from "../assets/icons/cleaningRobot_2.svg";
import CleaningRobot_3 from "../assets/icons/cleaningRobot_3.svg";
import CleaningRobot_4 from "../assets/icons/cleaningRobot_4.svg";
import Crab_1 from "../assets/icons/crab_1.svg";
import Drone_1 from "../assets/icons/drone_1.svg";
import Drone_2 from "../assets/icons/drone_2.svg";
import Squid_1 from "../assets/icons/squid_1.svg";
import Turtle_1 from "../assets/icons/turtle_1.svg";
import Beetle_1 from "../assets/icons/beetle_1.svg";
import Beetle_2 from "../assets/icons/beetle_2.svg";

const { width, height } = Dimensions.get("window");

export default class IconSelecter extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            icon: <CleaningRobot_1 />,
        }
    }

    setIcon = () => {
        switch (this.props.iconName){
            case 'bigAirplane':
                this.setState({ icon: <BigAirplane style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'butterfly_1':
                this.setState({ icon: <Butterfly_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'butterfly_2':
                this.setState({ icon: <Butterfly_2 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'butterfly_3':
                this.setState({ icon: <Butterfly_3 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'cleaningRobot_1':
                this.setState({ icon: <CleaningRobot_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'cleaningRobot_2':
                this.setState({ icon: <CleaningRobot_2 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'cleaningRobot_3':
                this.setState({ icon: <CleaningRobot_3 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'squid_1':
                this.setState({ icon: <Squid_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'crab_1':
                this.setState({ icon: <Crab_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'turtle_1':
                this.setState({ icon: <Turtle_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'beetle_1':
                this.setState({ icon: <Beetle_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            case 'beetle_2':
                this.setState({ icon: <Beetle_2 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
            default:
                this.setState({ icon: <CleaningRobot_1 style={{ fill: this.props.color || '#f2fdff',transform: [{rotate: this.props.angle || '0rad'}]}} />});
                break;
        }
    }
    
    componentDidMount (){
        this.setIcon();
    }

    componentDidUpdate (prevProps){
        if(this.props.angle && this.props.angle !== prevProps.angle){
            this.setIcon();
        }
        if(this.props.iconName && this.props.iconName !== prevProps.iconName){
            this.setIcon();
        }
        if(this.props.color && this.props.color !== prevProps.color){
            this.setIcon();
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