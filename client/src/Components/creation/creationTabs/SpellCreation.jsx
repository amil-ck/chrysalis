import * as React from 'react';
import GenericList from '../../lib/GenericList.jsx';
import { EVERYTHING } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import SpellList from '../../lib/listTypes/SpellList.jsx';


const SPELLS = EVERYTHING.filter(e => e.type === "Spell");
const id = "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_SPELLCASTING_SORCERER";
const level = 10;
const spellSlot = 3;

export default class SpellCreation extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        const spellcast = this.getFromId(id);
        // console.log(spellcast.rules.select);
        // const newSpellGrants = this.fixSpells(spellcast.rules.select.concat(this.getFromId("ID_WOTC_PHB_CLASS_FEATURE_DRUID_SPELLCASTING_DRUID").rules.select));
        // const newSpellGrants = this.fixSpells(spellcast.rules.select);/78
        const newSpellGrants = this.fixSpells(this.getFromId("ID_WOTC_PHB_CLASS_FEATURE_DRUID_SPELLCASTING_DRUID").rules.select);
        const spellGrants = this.props.characterData.creationData.spellChoices || newSpellGrants;
        
        this.state = {
            spellGrants: this.compareSpellGrants(spellGrants, newSpellGrants),
            pickedSpell: undefined,
            grantedSpells: [],
            selectedItemData: undefined,
        }

        console.log(this.state.spellGrants);

        this.spellGrantSelected = this.spellGrantSelected.bind(this);
        this.spellSelected = this.spellSelected.bind(this);
        this.spellDescription = this.spellDescription.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);
    }

    render() {
        return (
            <>
                <div className='tab'>
                    <div className='main'>
                        {this.show(this.state.spellGrants)}
                        {(this.state.pickedSpell !== undefined) && this.showSpells(this.state.pickedSpell)}
                    </div>
                    <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
                </div>
            </>
        );
    }


    getFromId(id) {
        return EVERYTHING.find(e => e.id === id);
    }

    fixSpells(spells) {
        const fixedSpells = [];

        let id = 0;
        for (const spell of spells) {
            // const spell = spells[i];
            if (spell.level <= level) {
                const amount = spell.number || 1;
                
                for (let i = 0; i < amount; i++) {
                    fixedSpells.push({...spell, "id": id, "spellId": null, "spellName": ""});
                    id++;
                }
            }
        }

        return fixedSpells;
    }

    compareSpellGrants(spellGrants, newSpellGrants) {
        spellGrants = [...spellGrants]

        for (const spell of newSpellGrants) {
            const foundSpell = spellGrants.find(e => this.compareSpellObjects(spell, e));
            if (foundSpell !== undefined) {
                spell.spellId = foundSpell.spellId;
                spell.spellName = foundSpell.spellName;
                spellGrants.splice(spellGrants.indexOf(foundSpell), 1);
            }
        }

        return newSpellGrants;
    }

    spellGrantSelected(id) {
        console.log(this.state);
        this.onInfoPaneClose();

        const spellGrant = this.state.spellGrants.find(e => e.id === id);

        this.spellDescription(spellGrant.spellId);

        this.setState({"pickedSpell": spellGrant});
    }

    spellDescription(id) {
        this.setState({
            selectedItemData: SPELLS.find(e => e.id === id)
        })
    }

    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined
        })
    }

    spellSelected(id) {
        const spell = this.getFromId(id);
        // this.setState({pickedSpell: {...this.state.pickedSpell, "spellId": id, "spellName": spell.name}});
        const newGrantedSpells = this.state.grantedSpells.filter(e => e !== this.state.pickedSpell.spellId);
        newGrantedSpells.push(id);

        this.state.pickedSpell.spellId = id;
        this.state.pickedSpell.spellName = spell.name;
        this.setState({pickedSpell : this.state.pickedSpell, grantedSpells: newGrantedSpells});

        this.saveData();
    }

    showSpells(spellGrant) {
        console.log(spellGrant);

        let a = SPELLS.filter(e => e?.supports?.includes(spellGrant.spellcasting));

        let level = spellGrant.supports[1]
        if (level === "$(spellcasting:slots)") {
            level = spellSlot;
        }

        console.log(level);

        if (level == 0) {
            a = a.filter(e => e.setters.level <= level);
        } else {
            a = a.filter(e => e.setters.level <= level && e.setters.level != 0);
        }

        a = a.filter(e => !this.state.grantedSpells.includes(e.id) || e.id === this.state.pickedSpell.spellId);

        console.log(a);

        const propsToPass = {
            data: a,
            title: this.state.pickedSpell.name,
            columnNames: ["Name"],
            shownColumns: ["Name"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["name"],
            multiValueColumns: [],
            presetFilters: {},

            selectedItemID: null,
            onItemSelected: this.spellDescription,
            onItemDoubleSelected: this.spellSelected,
            doubleSelectedItems: (this.state.pickedSpell.spellId === null) ? [] : [this.state.pickedSpell.spellId]
        };

        return <GenericList {...propsToPass}/>
    }

    show(spells) {
        const propsToPass = {
            data: spells,
            title: "Spells",
            columnNames: ["Name", "Gained on Level", "Chosen Spell"],
            shownColumns: ["Name", "Gained on Level", "Chosen Spell"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["name", "level", "spellName"],
            multiValueColumns: [],
            presetFilters: {},

            selectedItemID: null,
            doubleSelectedItems: (this.state.pickedSpell === undefined) ? [] : [this.state.pickedSpell.id],
            onItemSelected: this.spellGrantSelected
        };

        // this.showSpells(spells[7]);

        return <GenericList {...propsToPass}/>
    }

    saveData() {
        this.props.updateCharacterData({"spellGrants": this.state.spellGrants, "creationData": {...this.props.characterData.creationData, spellChoices: this.state.spellGrants}});
    }

    compareSpellObjects(obj1, obj2) {
        obj1 = {...obj1};
        obj2 = {...obj2};
        delete obj1.spellId; delete obj1.spellName; delete obj2.spellId; delete obj2.spellName; delete obj1.id; delete obj2.id;
        console.log(JSON.stringify(obj1));
        console.log(JSON.stringify(obj2));
        console.log(JSON.stringify(obj1) === JSON.stringify(obj2));
        return (JSON.stringify(obj1) === JSON.stringify(obj2));
    }

}