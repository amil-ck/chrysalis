import * as React from "react";
import diceRoll from "./diceRoll";

export default class Dice extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.cyclingNumbers = this.cyclingNumbers.bind(this);

        this.state = {
            trueNumber: this.props.number,
            number: diceRoll(6).value,
            colour: (this.props.colour === undefined) ? "purple" : this.props.colour,
            currentColour: "grey",
            cycle: 5,
            timeout: setTimeout(this.cyclingNumbers, 50)
        }
    }

    cyclingNumbers() {
        if (this.state.cycle === 0) {
            this.setState({number: this.state.trueNumber});
            this.setState({currentColour: this.state.colour})
        } else {
            this.setState({cycle: this.state.cycle - 1});
            this.setState({number: diceRoll(6).value});
            this.setState({timeout: setTimeout(this.cyclingNumbers, 50)});
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState(
                {trueNumber: this.props.number,
                colour: (this.props.colour === undefined) ? "purple" : this.props.colour}
            )

            clearTimeout(this.state.timeout);
            this.setState({timeout: setTimeout(this.cyclingNumbers, 50)});
            this.setState({cycle: 5});
            this.setState({currentColour: "grey"});

        }
    }

    render() {
        const diceStyle = {
            backgroundColor: this.state.currentColour,
            height: "20px",
            width: "20px",
            textAlign: "center",
            border: "1px solid white"
        };

        return (
            <div style={diceStyle}>{this.state.number}</div>
        )
    }
}