import * as React from "react";
import diceRoll from "./diceRoll";

export default class DiceRollAnim extends React.Component {
    constructor(props) {
        super();

        this.props = props;
        this.state = {
            visible: true
        }
    }

    dice(number, colour="purple") {
        const diceStyle = {
            backgroundColor: colour,
            height: "20px",
            width: "20px",
            textAlign: "center",
            border: "1px solid black"
        };

        return (
            <div style={diceStyle}>{number}</div>
        )
    }

    render() {
        const highest = Math.max(...this.props.rolls);
        const lowest = Math.min(...this.props.rolls);

        const dice = this.props.rolls.map(
            e => {
                if (this.props.advantage == "advantage" && e !== lowest) {
                    return this.dice(e, "green");
                } else if (this.props.advantage == "disadvantage" && e !== highest) {
                    return this.dice(e, "red");
                } else {
                    return this.dice(e);
                }
            }
        )

        setTimeout(() => {
            this.setState({visible: false});
        }, 3000);


        return (
            this.state.visible && <div className="flex-container">
                {dice}
            </div>
        )
    }
}