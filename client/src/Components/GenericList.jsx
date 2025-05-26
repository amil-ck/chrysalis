import * as React from 'react';

export default class GenericList extends React.Component {
    constructor(props) {
        super();

        this.props = props;
    }

    render() {
        return (
            <ul>
                {this.props.children}
            </ul>
        )
    }
}