import * as React from 'react';
import GenericList from './Components/GenericList.jsx';
import GenericListItem from './Components/GenericListItem.jsx';

export default class Main extends React.Component {
    constructor(props) {
        super();

        this.props = props;
    }

    render() {
        const listItems = [];
        for (let i = 0; i < 10; i++) {
            listItems.push(<GenericListItem>List item {i}</GenericListItem>)
        }

        return (
            <GenericList>
                {listItems}
            </GenericList>
        )
    }
}