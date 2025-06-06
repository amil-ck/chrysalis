import * as React from 'react';
import FeatList from '../../lib/listTypes/FeatList.jsx';
import SpellList from '../../lib/listTypes/SpellList.jsx';
import { SPELLS, FEATS } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';

export default class TestCreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            selectedItemData: undefined,
            selectedFeatID: null,
            selectedSpellID: null,
            doubleSelectedFeats: [],
            doubleSelectedSpells: []
        };

        this.onFeatSelected = this.onFeatSelected.bind(this);
        this.onSpellSelected = this.onSpellSelected.bind(this);
        this.onFeatDoubleSelected = this.onFeatDoubleSelected.bind(this);
        this.onSpellDoubleSelected = this.onSpellDoubleSelected.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);
    }

    onFeatSelected(id) {
        this.setState({
            selectedFeatID: id,
            selectedItemData: FEATS.find(value => value.id === id)
        })
    }

    onFeatDoubleSelected(id) {
        if (!this.state.doubleSelectedFeats.includes(id)) {
            console.log('feat added: ' + id);
            this.setState({
                doubleSelectedFeats: [...this.state.doubleSelectedFeats, id]
            });
        } else {
            console.log('feat removed: ' + id)
            this.setState({
                doubleSelectedFeats: this.state.doubleSelectedFeats.filter((o) => o !== id)
            });
        }
    }
    
    onSpellSelected(id) {
        this.setState({
            selectedSpellID: id,
            selectedItemData: SPELLS.find(value => value.id === id)
        })
    }

    onSpellDoubleSelected(id) {
        if (!this.state.doubleSelectedSpells.includes(id)) {
            console.log('spell added: ' + id);
            this.setState({
                doubleSelectedSpells: [...this.state.doubleSelectedSpells, id]
            });
        } else {
            console.log('spell removed: ' + id)
            this.setState({
                doubleSelectedSpells: this.state.doubleSelectedSpells.filter((o) => o !== id)
            });
        }
    }

    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined,
            selectedFeatID: null,
            selectedSpellID: null
        })
    }

    render() {
        // const currentSpell = SPELLS.find(value => value.id === this.state.selectedSpellID);
        // console.log(currentSpell, this.state.selectedSpellID);
        // const tempInfoData = (currentSpell !== undefined ? {
        //     title: currentSpell.name,
        //     subtitle: currentSpell.setters.school,
        //     attributes: {
        //         Duration: currentSpell.setters.duration,
        //         Level: currentSpell.setters.level
        //     },
        //     description: currentSpell.description,
        //     source: currentSpell.source
        // } : {});

        return (
            <div className='tab'>
                <div className='main'>
                    <FeatList maxDoubleSelected={1} onItemSelected={this.onFeatSelected} selectedItemID={this.state.selectedFeatID} onItemDoubleSelected={this.onFeatDoubleSelected} doubleSelectedItems={this.state.doubleSelectedFeats} />
                    <SpellList maxDoubleSelected={3} onItemSelected={this.onSpellSelected} selectedItemID={this.state.selectedSpellID} onItemDoubleSelected={this.onSpellDoubleSelected} doubleSelectedItems={this.state.doubleSelectedSpells} />
                </div>
                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
            </div>
        )
    }
}