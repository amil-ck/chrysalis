import * as React from 'react';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import SpellList from '../lib/listTypes/SpellList.jsx';
import { SPELLS } from '../lib/indexData.js';
import SpellcastingList from './SpellcastingList.jsx';
import { calculateStat } from '../lib/statUtils.js';
import Slots from '../lib/Slots.jsx';

export default class Magic extends React.Component {
    constructor(props) {
        super();

        this.props = props;
        // PROPS: characterData etc., spellcasting: spellcasting object

        const availableSpells = this.props.spellcasting.list.known === true ? this.filterBySupports(this.props.spellcasting.list.text, SPELLS) : SPELLS.filter(spell => this.props.characterData.knownSpells.find(s => s.id === spell.id));

        const relevantExtents = this.props.extents.filter(e => e.name === this.props.spellcasting.name || e.all == true);
        for (const extent of relevantExtents) {
            // Check whether list of spells, or reference to class
            // --- THIS MIGHT BREAK --- 
            // THIS IS ALSO HIGHLY INEFFICIENT AND CAN BE EASILY OPTIMISED IF I USE MY BRAIN
            if (extent.extend[1].text.toUpperCase() === extent.extend[1].text) {
                // Text is in all uppercase, hopefully an ID
                // Get rid of silly .text
                const ids = extent.extend.map(e => e.text ? e.text : e);
                availableSpells.push(...SPELLS.filter(s => ids.includes(s.id)).filter(s => !availableSpells.find(spell => spell.id === s.id)));

            } else {
                // Text is hopefully a class name
                availableSpells.push(...this.filterBySupports(extent.extend[1].text, SPELLS).filter(s => !availableSpells.find(spell => spell.id === s.id)));
            }
        }

        this.state = {
            selectedItemData: undefined,
            selectedItemID: '',
            preparedSpells: SPELLS.filter(spell => this.props.characterData.preparedSpells.includes(spell.id)), // list of spell objects
            availableSpells: availableSpells, // list of spell objects
            usedSpellSlots: this.props.characterData.usedSpellSlots[this.props.spellcasting.name] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            upcasting: {}
        }
        // TODO: add to available spells based on 'extends' stuff

        this.handleItemSelected = this.handleItemSelected.bind(this);
        this.closeInfoPane = this.closeInfoPane.bind(this);
        this.prepareSpell = this.prepareSpell.bind(this);
        this.unprepareSpell = this.unprepareSpell.bind(this);
        this.castSpell = this.castSpell.bind(this);
        this.clearSpellSlot = this.clearSpellSlot.bind(this);
        this.getUsedSpellSlots = this.getUsedSpellSlots.bind(this);
        this.castSpellAtLevel = this.castSpellAtLevel.bind(this);
        this.updateCastLevel = this.updateCastLevel.bind(this);
        this.updateSorceryPoints = this.updateSorceryPoints.bind(this);
        this.updateSpellSlots = this.updateSpellSlots.bind(this);

        this.maxSorceryPoints = calculateStat("sorcery-points", this.props.characterData);

    }

    componentDidMount() {
        // Make sure preparedSpells only contains available spells
        const availableSpells = this.props.spellcasting.list.known === true ? this.filterBySupports(this.props.spellcasting.list.text, SPELLS) : SPELLS.filter(spell => this.props.characterData.knownSpells.find(s => s.id === spell.id));
        const shouldBePrepared = this.props.characterData.preparedSpells.filter(id => availableSpells.find(spell => spell.id === id));

        // Initialise sorcery pts
        if (this.maxSorceryPoints > 0 && this.props.characterData.usedSorceryPoints === undefined) {
            this.props.updateCharacterData({
                usedSorceryPoints: 0
            })
        }

        if (shouldBePrepared.length !== this.props.characterData.preparedSpells.length) {
            this.props.updateCharacterData({
                preparedSpells: shouldBePrepared
            })
        }
    }

    getUsedSpellSlots() {
        return this.props.characterData.usedSpellSlots[this.props.spellcasting.name] || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    prepareSpell(id) {

        if (this.props.characterData.grantedSpells.find(spell => spell.id === id)) {
            // Granted, no need to prepare
            return;
        }

        if (this.props.characterData.preparedSpells.includes(id)) {
            // Already prepared, unprepare
            return this.unprepareSpell(id);
        }

        if (this.props.characterData.preparedSpells.length < this.getPrepareSlots()) {
            // Can prepare more spells
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
        // TODO: some kind of popup confirmation
        //this.castSpellAtLevel(id, this.getSpellByID(id).setters.level);

        // this.props.openModal('confirm', 
        //     'Upcast',
        //     <div>Cast at level: <button onClick={() => this.castSpellAtLevel(id, "3")}>3</button></div>,
        //     'Ok',
        //     'Ok',
        //     () => {},
        //     () => {}
        // )

        if (this.state.upcasting[id] !== undefined) {
            this.castSpellAtLevel(id, this.state.upcasting[id]);
            this.setState({
                upcasting: { ...this.state.upcasting, [id]: undefined } // THIS IS WEIRD THIS MAY BE CAUSING ANY PROBLEMS THAT OCCUR
            })
        } else {
            this.castSpellAtLevel(id, this.getSpellByID(id).setters.level);
        }

    }

    castSpellAtLevel(id, level) {

        if (level.trim() === "Cantrip") level = 0;
        const totalSlots = this.getSpellSlots()[level];
        const usedSlots = this.getUsedSpellSlots()[level];
        if (level == 0 || usedSlots < totalSlots) {
            const newUsedSlots = [...this.getUsedSpellSlots()];
            newUsedSlots[level] += 1;
            console.log('successfully casting spell', id);
            this.props.updateCharacterData({
                usedSpellSlots: { ...this.props.characterData.usedSpellSlots, [this.props.spellcasting.name]: newUsedSlots }
            })
        }
    }

    updateCastLevel(id, level) {
        this.setState({
            upcasting: { ...this.state.upcasting, [id]: level }
        })
    }

    clearSpellSlot(level) {
        const newSlots = [...this.getUsedSpellSlots()];
        newSlots[level] = Math.max(0, newSlots[level] - 1);
        console.log(newSlots, this.getUsedSpellSlots())
        this.props.updateCharacterData({
            usedSpellSlots: { ...this.props.characterData.usedSpellSlots, [this.props.spellcasting.name]: newSlots }
        })
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
        
        return filteredList.filter(i => i.setters.level === "0" || i.setters.level.trim() === "Cantrip" || this.getSpellSlots()[i.setters.level] > 0);
    }

    getSpellByID(id) {
        return SPELLS.find(spell => spell.id === id);
    }

    getSpellSlots() {
        const charLevel = this.props.characterData.level;

        // Get all spellcasting slot stats
        const searchStr = `${this.props.spellcasting.name.toLowerCase()}:spellcasting:slots:`;
        const slotStats = this.props.characterData.stats.filter(stat => stat.name.includes(searchStr));
        const slots = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

    plusify(value) {
        return Number(value) >= 0 ? `+${value}` : `${value}`;
    }

    toggleSorceryPoint(i) {
        if (i < this.props.characterData.usedSorceryPoints) {
            this.props.updateCharacterData({
                usedSorceryPoints: this.props.characterData.usedSorceryPoints - 1
            })
        } else {
            this.props.updateCharacterData({
                usedSorceryPoints: this.props.characterData.usedSorceryPoints + 1
            })
        }
    }

    updateSorceryPoints(newValue) {
        this.props.updateCharacterData({
            usedSorceryPoints: newValue
        })
    }

    updateSpellSlots(level, newValue) {
        const newSlots = [...this.getUsedSpellSlots()];
        newSlots[level] = Math.max(0, Math.min(newValue, this.getSpellSlots()[level]))
        console.log(newSlots, this.getUsedSpellSlots())
        this.props.updateCharacterData({
            usedSpellSlots: { ...this.props.characterData.usedSpellSlots, [this.props.spellcasting.name]: newSlots }
        })
    }

    render() {

        const spellSlots = this.getSpellSlots();

        // makes the format uniform
        if (typeof this.props.spellcasting.list === "string") this.props.spellcasting.list = { text: this.props.spellcasting.list };

        const yourSpells = [...this.props.characterData.grantedSpells.map(spell => {
            return this.getSpellByID(spell.id)
        }), ...this.props.characterData.preparedSpells.map(id => {
            return { ...this.getSpellByID(id), prepared: true }
        })];

        const selectedSpells = [...this.props.characterData.preparedSpells, ...this.props.characterData.grantedSpells.filter(spell => this.state.availableSpells.find(s => s.id === spell.id)).map(spell => spell.id)];

        const spellcastingModifier = calculateStat(`${this.props.spellcasting.ability.toLowerCase()}:modifier`, this.props.characterData);
        const spellSaveDC = calculateStat(`spellcasting:dc:${this.props.spellcasting.ability.toLowerCase().slice(0, 3)}`, this.props.characterData);
        const spellAttack = calculateStat(`spellcasting:attack:${this.props.spellcasting.ability.toLowerCase().slice(0, 3)}`, this.props.characterData);

        console.log("sorcery", this.maxSorceryPoints)

        return (
            <div className="tab magic">
                <div className="main">
                    <div className="spellcastingWrapper">
                        <div className="title">
                            Your spells
                            {this.props.spellcasting.prepare && <span className="preparedCount">&bull; {this.props.characterData.preparedSpells.length}/{this.getPrepareSlots()} prepared</span>}
                        </div>
                        <div className="stats list card">
                            <div className="body">
                                <div>
                                    <span className="name">Spellcasting modifier ({this.props.spellcasting.ability})</span>
                                    <span className="value">{this.plusify(spellcastingModifier)}</span>
                                </div>
                                <div>
                                    <span className="name">Spell attack modifier</span>
                                    <span className="value">{this.plusify(spellAttack)}</span>
                                </div>
                                <div>
                                    <span className="name">Spell save DC</span>
                                    <span className="value">{spellSaveDC}</span>
                                </div>
                            </div>
                            {this.maxSorceryPoints > 0 &&
                                <Slots className={"sorceryPoints"} label={"Sorcery points: "} value={this.props.characterData.usedSorceryPoints} max={this.maxSorceryPoints} onChange={this.updateSorceryPoints} />
                            }
                        </div>
                        <SpellcastingList data={yourSpells} upcasting={this.state.upcasting} updateCastLevel={this.updateCastLevel} spellSlots={spellSlots} usedSpellSlots={this.getUsedSpellSlots()} castSpell={this.castSpell} unprepareSpell={this.unprepareSpell} updateSpellSlots={this.updateSpellSlots} onItemSelected={this.handleItemSelected} selectedItemID={this.state.selectedItemID} />
                    </div>

                    {this.props.spellcasting.prepare &&
                        <SpellList startMinimised={this.props.characterData.preparedSpells.length === this.getPrepareSlots()} hideSelected={true} data={this.state.availableSpells} title={"Available spells"} selectedItemID={this.state.selectedItemID} onItemSelected={this.handleItemSelected} onItemDoubleSelected={this.prepareSpell} doubleSelectedItems={selectedSpells} />
                    }
                </div>

                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.closeInfoPane} />
            </div>
        )
    }
}