import * as React from 'react';

export default class Switch extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            toggle: this.props.value
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value !== this.props.value) {
            this.setState({toggle: this.props.value})
        }
    }

    render() {
        const toggle = this.state.toggle ? " toggled" : ""

        return <button type="button" className={"switch" + toggle} onClick={this.props.onChange}>
            <div className={"switch-thumb" + toggle}></div>
        </button>
    }
}
