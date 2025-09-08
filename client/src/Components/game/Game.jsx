import * as React from 'react';
import Battle from './Battle.jsx';
import Magic from './Magic.jsx';

export default class Game extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            tab: 'magic'
        }
    }

    render() {
        if (this.state.tab === 'battle') {
            return <Battle {...this.props} />
        } else if (this.state.tab === 'magic') {
            return <Magic {...this.props} />
        } else {
            return <>beep boop</>
        }
    }
}