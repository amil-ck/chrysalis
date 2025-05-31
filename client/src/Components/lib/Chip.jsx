import * as React from 'react';

export default class Chip extends React.Component {
    render() {
        return <span {...this.props} className={"chip " + this.props.className}><span>{this.props.text}</span></span>
    }
}