import * as React from 'react';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import SpellList from '../lib/listTypes/SpellList.jsx';
import { SPELLS } from '../lib/indexData.js';
import SpellcastingList from './SpellcastingList.jsx';

export default class Magic extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            selectedItemData: undefined,
            selectedItemID: ''
        }

        // Assume that the character CAN spellcast
        this.spellcasting = {
            name: "Druid",
            ability: "Wisdom",
            prepare: true,
            allowReplace: false,
            list: {
                known: true, // ignore whether spells are known or not
                text: "Druid,(Abjuration||Conjuration)" // compare to 'supports'
            }
        };

        // makes the format uniform
        if (typeof this.spellcasting.list === "string") this.spellcasting.list = { text: this.spellcasting.list };

        // Simulating characterdata for now
        const characterData = {};
        characterData.preparedSpells = ["ID_PHB_SPELL_PRODUCE_FLAME"];
        characterData.knownSpells = [];
        characterData.grantedSpells = [];

        this.preparedSpells = SPELLS.filter(spell => characterData.preparedSpells.includes(spell.id));
        this.availableSpells = this.spellcasting.list.known === true ? this.filterBySupports(this.spellcasting.list.text, SPELLS) : this.filterBySupports(this.spellcasting.list.text, characterData.knownSpells);
        // TODO: add to available spells based on 


        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.closeInfoPane = this.closeInfoPane.bind(this);
        this.prepareSpell = this.prepareSpell.bind(this);
    }

    prepareSpell(id) {

    }

    handleItemSelected(id) {
        this.setState({
            selectedItemID: id,
            selectedItemData: this.availableSpells.find(i => i.id === id)
        });
    }

    closeInfoPane() {
        this.setState({
            selectedItemData: undefined
        })
    }

    filterBySupports(filterStr, list = SPELLS) {
        // Very much unstable; based on guesswork and could break at any moment

        const filters = filterStr.split(",");

        let filteredList = list.filter(i => {
            return i.supports && i.supports.includes(filters[0]);
        });

        if (filters[1]) {
            const filter = filters[1].replace("(", "").replace(")", "");
            const options = filter.split("||");
            filteredList = filteredList.filter(i => options.includes(i.setters.school));
        }

        return filteredList;
    }

    render() {

        // TODO: display spells added in create flow
        return (
            <div className="tab magic">
                <div className="main">
                    <div className="spellcastingWrapper">
                        <span className="title">Your spells</span>
                        <SpellcastingList />
                    </div>

                    {this.spellcasting.prepare &&
                        <SpellList data={this.availableSpells} title={"Available spells"} selectedItemID={this.state.selectedItemID} onItemSelected={this.handleItemSelected} onItemDoubleSelected={this.prepareSpell} />
                    }
                </div>

                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.closeInfoPane} />
            </div>
        )
    }
}