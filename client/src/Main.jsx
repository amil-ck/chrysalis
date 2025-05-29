import * as React from 'react';
import CreationFlow from './Components/creation/CreationFlow.jsx';

export default class Main extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            stage: 'creation'
        }
    }

    render() {

        return (
            <div id='root'>
                <CreationFlow />
            </div>
        )
    }
}