import * as React from "react";

export default class GenericListItem extends React.Component {
    constructor(props) {
        super();

        this.props = props;


    }

    render() {
        return (
            <li>
                {this.props.children}
            </li>
        )
    }
}