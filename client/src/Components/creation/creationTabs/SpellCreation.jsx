import * as React from 'react';
import GenericList from '../../lib/GenericList.jsx';
import { EVERYTHING } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import SpellList from '../../lib/listTypes/SpellList.jsx';
import { checkRequirments, checkSupports } from '../../lib/supportUtils.js';


const SPELLS = EVERYTHING.filter(e => e.type === "Spell");
const id = "ID_WOTC_PHB_CLASS_FEATURE_SORCERER_SPELLCASTING_SORCERER";
const spellSlot = 3;

export default class SpellCreation extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        const grants = this.props.characterData.grants;
        // let selects = grants.flatMap(e => {
        //     if (this.getFromId(e.id)?.rules?.select !== undefined) {
        //         return this.getFromId(e.id).rules.select;
        //     }
        // });
        // selects = selects.filter(e => e?.type === "Spell");

        let selects = grants.flatMap(e => {
            let x = this.getFromId(e.id);
            if (x?.rules?.select !== undefined) {
                let list = x.rules.select.filter(sel => sel?.type === "Spell");
                
                let spellcastingList = "";
                if (x?.spellcasting?.list !== undefined) {
                    if (x.spellcasting.list.constructor == Object) {
                        spellcastingList = x.spellcasting.list.text;
                    } else {
                        spellcastingList = x.spellcasting.list;
                    }
                }

                let prepare = x?.spellcasting?.prepare || false

                list = list.map(sel => ({...sel, spellcastingList: spellcastingList, prepare: prepare}));

                return list;
            }

            return [];
        });

        console.log(selects);

        this.state = {
            level: this.props.characterData.level
        }

        const newSpellGrants = this.fixSpells(selects);
        const spellGrants = this.props.characterData.creationData.spellChoices || newSpellGrants;
        
        this.state = {
            level: this.props.characterData.level,
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
            spell.level === undefined && (spell.level = 1);

            if (spell.level <= this.state.level) {
                const amount = spell.number || 1;
                
                for (let i = 0; i < amount; i++) {
                    fixedSpells.push({...spell, "id": id, "spellId": null, "spellName": ""});
                    id++;
                }
            }
        }

        return fixedSpells;
    }

    // this function can only work once the spells are chose becuase it uses the picked spell to check if it is a cantrip
    makeCantripsGrants(spells) {
        spells = spells.map(spell => {
                if (spell.spellId !== null && this.getFromId(spell.spellId)?.setters?.level === "0") {
                    spell.prepare = false;
                }
                return spell
            }
        )

        return spells
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

    getSpellSupports(spell) {
        return [...spell.supports || [], spell.setters.level, spell.setters.school];
    }

    showSpells(spellGrant) {
        console.log(spellGrant);

        let list = spellGrant.supports[0]

        // if (list === "$(spellcasting:list)") {
        //     list = spellGrant.spellcastingList
        // }
        list = list.replace("$(spellcasting:list)", "("+spellGrant.spellcastingList+")");
        console.log(list);

        let filteredSpells = SPELLS.filter(e => checkRequirments(list, this.getSpellSupports(e)));

        let level = spellGrant.supports[1]
        if (level === "$(spellcasting:slots)") {
            level = spellSlot;
        }

        console.log(level);

        if (level == 0) {
            filteredSpells = filteredSpells.filter(e => e.setters.level <= level);
        } else {
            filteredSpells = filteredSpells.filter(e => e.setters.level <= level && e.setters.level != 0);
        }

        filteredSpells = filteredSpells.filter(e => !this.state.grantedSpells.includes(e.id) || e.id === this.state.pickedSpell.spellId);

        console.log(filteredSpells);

        const propsToPass = {
            data: filteredSpells,
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
        let spellGrants = this.makeCantripsGrants(this.state.spellGrants);
        spellGrants = spellGrants.filter(spell => spell.spellId !== null);

        let grantedSpells = spellGrants.filter(spell => spell.prepare === false);
        let knownSpells = spellGrants.filter(spell => spell.prepare === true);

        console.log(grantedSpells, knownSpells);

        grantedSpells = grantedSpells.map(
            spell => ({id: spell.spellId, spellcasting: spell.spellcasting})
        )

        knownSpells = knownSpells.map(
            spell => ({id: spell.spellId, spellcasting: spell.spellcasting})
        )

        console.log(grantedSpells, knownSpells);

        this.props.updateCharacterData({"grantedSpells": grantedSpells, "knownSpells": knownSpells, "spellGrants": this.state.spellGrants, "creationData": {...this.props.characterData.creationData, spellChoices: this.state.spellGrants}});
    }

    compareSpellObjects(obj1, obj2) {
        obj1 = {...obj1};
        obj2 = {...obj2};
        delete obj1.spellId; delete obj1.spellName; delete obj2.spellId; delete obj2.spellName; delete obj1.id; delete obj2.id;
        delete obj1.prepare; delete obj2.prepare;
        console.log(JSON.stringify(obj1));
        console.log(JSON.stringify(obj2));
        console.log(JSON.stringify(obj1) === JSON.stringify(obj2));
        return (JSON.stringify(obj1) === JSON.stringify(obj2));
    }

}