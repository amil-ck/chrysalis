import * as React from 'react';

export default class Slots extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        // Props: label: string, value: number, max: number, onChange: function(value)

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(index) {
        if (index < this.props.value) {
            // Decrement value
            this.props.onChange(this.props.value - 1);
        } else {
            // Increment value
            this.props.onChange(this.props.value + 1);
        }
    }

    render() {
        return (
            <div {...this.props} className={"slotWrapper " + (this.props.className || '')}>
                <div className="label">{this.props.label}</div>
                {[...Array(this.props.max).keys()].map(idx => (
                    <div className={idx < this.props.value ? "slot used" : "slot"} onClick={() => this.handleClick(idx)} key={idx}></div>
                ))}
            </div>
        )
    }
}