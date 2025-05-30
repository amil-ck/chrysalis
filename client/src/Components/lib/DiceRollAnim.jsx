import * as React from "react";
import diceRoll from "./diceRoll";
import Dice from "./Dice.jsx";

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
        let alreadyColour = false;

        let rolls = [...this.props.rolls];
        rolls.reverse();

        let dice = rolls.map(
            e => {
                if (this.props.advantage == "advantage" && (e !== lowest || alreadyColour)) {
                    return <Dice number={e} colour={"green"}/>
                } else if (this.props.advantage == "disadvantage" && (e !== highest || alreadyColour)) {
                    return <Dice number={e} colour={"red"}/>
                } else {
                    alreadyColour = true;
                    return <Dice number={e}/>
                }
            }
        )

        dice.reverse();
        rolls.reverse();
        rolls.splice(rolls.lastIndexOf(lowest), 1);

        let expression = rolls.map(e => {return [e, " + "]});
        expression[expression.length - 1].splice(1, 1);

        if (this.props.modifier !== undefined) {
            expression.push(<span style={{color: "green", fontSize: "24px"}}> + {this.props.modifier}</span>)
        }

        return (
            <>
            <div style={{display: "flex", flexDirection: "row"}}>
                {dice}
            </div>
            <span style={{alignItems: true}}>{expression}</span>
            </>
        )
    }
}