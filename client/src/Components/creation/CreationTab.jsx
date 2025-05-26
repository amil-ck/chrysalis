import * as React from 'react';
import GenericList from '../lib/GenericList.jsx';
import FeatList from '../lib/listTypes/FeatList.jsx';
import SpellList from '../lib/listTypes/SpellList.jsx';
import InfoPane from '../lib/InfoPane.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            selectedFeatID: null,
            selectedSpellID: null
        };

        this.onFeatSelected = this.onFeatSelected.bind(this);
        this.onSpellSelected = this.onSpellSelected.bind(this);
    }

    onFeatSelected(id) {
        this.setState({
            selectedFeatID: id
        })
    }
    
    onSpellSelected(id) {
        this.setState({
            selectedSpellID: id
        })
    }

    render() {
        return (
            <div className='tab'>
                <div className='lists'>
                    <FeatList onItemSelected={this.onFeatSelected} selectedItemID={this.state.selectedFeatID} />
                    <SpellList onItemSelected={this.onSpellSelected} selectedItemID={this.state.selectedSpellID} />
                </div>
                <InfoPane />
            </div>
        )
    }
}