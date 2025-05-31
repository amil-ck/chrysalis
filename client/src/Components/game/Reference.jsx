import * as React from 'react';

export default class Reference extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            characterData: {}
        }
    }

    render() {
        return <>reference</>
    }
}