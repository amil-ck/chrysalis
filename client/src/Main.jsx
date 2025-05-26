import * as React from 'react';
import GenericList from './Components/lib/GenericList.jsx';
import GenericListItem from './Components/GenericListItem.jsx';
import SpellsList from './Components/lib/SpellsList.jsx';
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
        // const listItems = [];
        // for (let i = 0; i < 10; i++) {
        //     listItems.push(<GenericListItem>List item {i}</GenericListItem>)
        // }

        return (
            <div id='root'>
                <CreationFlow />
            </div>
        )
    }
}