import React, { PureComponent } from "react";
import Arrow_1 from "../assets/icons/arrow_1.svg";
import Arrow_2 from "../assets/icons/arrow_2.svg";
import Beetle_2 from "../assets/icons/beetle_2.svg";
import BigAirplane_1 from "../assets/icons/bigAirplane_1.svg";
import BigAirplane_2 from "../assets/icons/bigAirplane_2.svg";
import Butterfly_2 from "../assets/icons/butterfly_2.svg"
import CleaningRobot_1 from "../assets/icons/cleaningRobot_1.svg";
import CleaningRobot_2 from "../assets/icons/cleaningRobot_2.svg";
import Crab_1 from "../assets/icons/crab_1.svg";
import Cursor_1 from "../assets/icons/cursor_1.svg";
import Cursor_2 from "../assets/icons/cursor_2.svg";
import Firefly_1 from "../assets/icons/firefly_1.svg";
import Hand_1 from "../assets/icons/hand_1.svg";
import Hand_2 from "../assets/icons/hand_2.svg";
import Mouse_1 from "../assets/icons/mouse_1.svg";
import Pencil_1 from "../assets/icons/pencil_1.svg";
import Spider_1 from "../assets/icons/spider_1.svg";
import Squid_1 from "../assets/icons/squid_1.svg";
import Squid_2 from "../assets/icons/squid_2.svg";
import Turtle_1 from "../assets/icons/turtle_1.svg";

export default class IconSelecter extends PureComponent {
    constructor(props){
        super(props)
        this.state = {
            icon: <CleaningRobot_1 />,
        }
    }

    setIcon = () => {
        let color = this.props.color || '#f2fdff';
        let angle = this.props.angle || '0rad';
        switch (this.props.iconName){
            case 'arrow_1':
                this.setState({ icon: <Arrow_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'arrow_2':
                this.setState({ icon: <Arrow_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'bigAirplane_1':
                this.setState({ icon: <BigAirplane_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'bigAirplane_2':
                this.setState({ icon: <BigAirplane_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'butterfly_2':
                this.setState({ icon: <Butterfly_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'cleaningRobot_1':
                this.setState({ icon: <CleaningRobot_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'cleaningRobot_2':
                this.setState({ icon: <CleaningRobot_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'squid_1':
                this.setState({ icon: <Squid_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'squid_2':
                this.setState({ icon: <Squid_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'crab_1':
                this.setState({ icon: <Crab_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'cursor_1':
                this.setState({ icon: <Cursor_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'cursor_2':
                this.setState({ icon: <Cursor_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'firefly_1':
                this.setState({ icon: <Firefly_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'hand_1':
                this.setState({ icon: <Hand_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'hand_2':
                this.setState({ icon: <Hand_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'mouse_1':
                this.setState({ icon: <Mouse_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'pencil_1':
                this.setState({ icon: <Pencil_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'spider_1':
                this.setState({ icon: <Spider_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'turtle_1':
                this.setState({ icon: <Turtle_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            case 'beetle_2':
                this.setState({ icon: <Beetle_2 style={{ fill: color,transform: [{rotate: angle}]}} />});
                break;
            default:
                this.setState({ icon: <CleaningRobot_1 style={{ fill: color,transform: [{rotate: angle}]}} />});
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