import * as React from 'react';
import spells from '../data/spells';
import GenericList from './GenericList.jsx';

export default class SpellsList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        console.log(spells[0])

        this.state = {
            spellData: spells
        }

    }

    render() {

        return (
            <GenericList data={this.state.spellData} columns={["name", "source"]} />
        )
    }
}