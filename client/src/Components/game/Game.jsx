import * as React from 'react';

export default class Game extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {}
    }

    render() {
        if (this.props.characterData.id === undefined) {
            return (<>No character selected</>)
        }

        return <>game</>
    }
}