import * as React from 'react';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import SpellList from '../lib/listTypes/SpellList.jsx';
import { SPELLS } from '../lib/indexData.js';
import SpellcastingList from './SpellcastingList.jsx';
import { calculateStat } from '../lib/statUtils.js';

export default class Magic extends React.Component {
    constructor(props) {
        super();

        this.props = props;
        // PROPS: characterData etc., spellcasting: spellcasting object

        this.state = {
            selectedItemData: undefined,
            selectedItemID: '',
            preparedSpells: SPELLS.filter(spell => this.props.characterData.preparedSpells.includes(spell.id)),
            availableSpells: this.props.spellcasting.list.known === true ? this.filterBySupports(this.props.spellcasting.list.text, SPELLS) : this.filterBySupports(this.props.spellcasting.list.text, this.props.characterData.knownSpells),
            usedSpellSlots: [0,2,3,0,0,0,0,0,0,0]
        }
        // TODO: add to available spells based on 'extends' stuff

        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.closeInfoPane = this.closeInfoPane.bind(this);
        this.prepareSpell = this.prepareSpell.bind(this);
        this.unprepareSpell = this.unprepareSpell.bind(this);
        this.castSpell = this.castSpell.bind(this);
    }

    prepareSpell(id) {

        if (this.props.characterData.preparedSpells.includes(id)) {
            return this.unprepareSpell(id);
        }

        if (this.props.characterData.preparedSpells.length < this.getPrepareSlots()) {
            // Character can prepare more spells
            this.props.updateCharacterData({
                preparedSpells: [...this.props.characterData.preparedSpells, id]
            })
        }
    }

    unprepareSpell(id) {
        console.log('unprepareing')
        this.props.updateCharacterData({
            preparedSpells: this.props.characterData.preparedSpells.filter(i => i !== id)
        })
    }

    castSpell(id) {

    }

    handleItemSelected(id) {
        this.setState({
            selectedItemID: id,
            selectedItemData: SPELLS.find(i => i.id === id)
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

        return filteredList.filter(i => i.setters.level === "0" || i.setters.level.trim() === "Cantrip" || this.getSpellSlots()[i.setters.level] !== 0);
    }

    getSpellByID(id) {
        return SPELLS.find(spell => spell.id === id);
    }

    getSpellSlots() {
        const charLevel = this.props.characterData.level;

        const fakeStats = [{
            "name": "druid:spellcasting:slots:1",
            "value": "2",
            "level": "1"
        },
        {
            "name": "druid:spellcasting:slots:1",
            "value": "1",
            "level": "2"
        },
        {
            "name": "druid:spellcasting:slots:1",
            "value": "1",
            "level": "3"
        },
        {
            "name": "druid:spellcasting:slots:2",
            "value": "2",
            "level": "3"
        },
        {
            "name": "druid:spellcasting:slots:2",
            "value": "1",
            "level": "4"
        },
        {
            "name": "druid:spellcasting:slots:3",
            "value": "2",
            "level": "5"
        },
        {
            "name": "druid:spellcasting:slots:3",
            "value": "1",
            "level": "6"
        },
        {
            "name": "druid:spellcasting:slots:4",
            "value": "1",
            "level": "7"
        },
        {
            "name": "druid:spellcasting:slots:4",
            "value": "1",
            "level": "8"
        },
        {
            "name": "druid:spellcasting:slots:4",
            "value": "1",
            "level": "9"
        },
        {
            "name": "druid:spellcasting:slots:5",
            "value": "1",
            "level": "9"
        },
        {
            "name": "druid:spellcasting:slots:5",
            "value": "1",
            "level": "10"
        },
        {
            "name": "druid:spellcasting:slots:5",
            "value": "1",
            "level": "18"
        },
        {
            "name": "druid:spellcasting:slots:6",
            "value": "1",
            "level": "11"
        },
        {
            "name": "druid:spellcasting:slots:6",
            "value": "1",
            "level": "19"
        },
        {
            "name": "druid:spellcasting:slots:7",
            "value": "1",
            "level": "13"
        },
        {
            "name": "druid:spellcasting:slots:7",
            "value": "1",
            "level": "20"
        },
        {
            "name": "druid:spellcasting:slots:8",
            "value": "1",
            "level": "15"
        },
        {
            "name": "druid:spellcasting:slots:9",
            "value": "1",
            "level": "17"
        },
        {
            "name": "druid:spellcasting:prepare",
            "value": "wisdom:modifier"
        },
        {
            "name": "druid:spellcasting:prepare",
            "value": "level:druid"
        }]

        // Get all spellcasting slot stats
        const searchStr = `${this.props.spellcasting.name.toLowerCase()}:spellcasting:slots:`;
        const slotStats = fakeStats.filter(stat => stat.name.includes(searchStr));
        const slots = [0,0,0,0,0,0,0,0,0,0];

        for (const stat of slotStats) {
            const slotLevel = Number(stat.name.replace(searchStr, ''));
            if (Number(stat.level) <= charLevel) {
                slots[slotLevel] += Number(stat.value);
            }
        }
        
        return slots;
    }

    getPrepareSlots() {
        return calculateStat(`${this.props.spellcasting.name.toLowerCase()}:spellcasting:prepare`, this.props.characterData);
    }

    render() {

        // Assume that the character CAN spellcast
        const spellSlots = this.getSpellSlots();

        // makes the format uniform
        if (typeof this.props.spellcasting.list === "string") this.props.spellcasting.list = { text: this.props.spellcasting.list };

         
        const yourSpells = [...this.props.characterData.grantedSpells.map(id => {
            return this.getSpellByID(id)
        }), ...this.props.characterData.preparedSpells.map(id => {
            return { ...this.getSpellByID(id), prepared: true }
        })];


        // // TESTING STAT UTILS
        // const fakeStats = [
        //     {
        //         name: "beep:boop",
        //         value: "3"
        //     },
        //     {
        //         name: "beep:boop",
        //         value: "5",
        //         bonus: "peepee"
        //     },
        //     {
        //         name: "wahoo",
        //         value: "beep:boop"
        //     },
        //     { 
        //         name: "beep:boop",
        //         value: "4",
        //         bonus: "poopoo"
        //     },
        //     {
        //         name: "beep:boop",
        //         value: "3",
        //         bonus: "poopoo"
        //     },
        //     {
        //         name: 'dexterity',
        //         value: 2
        //     },
        //     {
        //         name: 'dexterity:score:set',
        //         value: 13,
        //         bonus: 'base'
        //     },
        //     {
        //         name: 'dexterity:misc',
        //         value: 2
        //     }
        // ];

        // console.log(calculateStat("bing bong", {stats: fakeStats}));




        // TODO: display spells added in create flow
        return (
            <div className="tab magic">
                <div className="main">
                    <div className="spellcastingWrapper">
                        <div className="title">Your spells <span className="preparedCount">{this.props.characterData.preparedSpells.length}/{this.getPrepareSlots()} prepared</span></div>
                        <SpellcastingList data={yourSpells} spellSlots={spellSlots} usedSpellSlots={this.state.usedSpellSlots} castSpell={this.castSpell} unprepareSpell={this.unprepareSpell} onItemSelected={this.handleItemSelected} selectedItemID={this.state.selectedItemID} />
                    </div>

                    {this.props.spellcasting.prepare &&
                        <SpellList data={this.state.availableSpells} title={"Available spells"} selectedItemID={this.state.selectedItemID} onItemSelected={this.handleItemSelected} onItemDoubleSelected={this.prepareSpell} doubleSelectedItems={this.props.characterData.preparedSpells} />
                    }
                </div>

                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.closeInfoPane} />
            </div>
        )
    }
}