import * as React from 'react';
import { FiChevronDown, FiTrash2 } from 'react-icons/fi';
import Slots from '../lib/Slots.jsx';

export default class SpellcastingList extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            levelCollapse: []
        }

        // PROPS: data: [{}], spellSlots: number[], usedSpellSlots=[], onItemSelected: function(id), selectedItemID: string, 
        this.onUnprepareClick = this.onUnprepareClick.bind(this);
        this.onCastClick = this.onCastClick.bind(this);
        this.onCollapseLevel = this.onCollapseLevel.bind(this);
    }

    onUnprepareClick(e, id) {
        e.stopPropagation();
        this.props.unprepareSpell(id);
    }

    onCastClick(e, id) {
        e.stopPropagation();
        this.props.castSpell(id);
    }

    onUpcastUpdate(e, id) {
        e.stopPropagation();
        this.props.updateCastLevel(id, e.target.value);
    }

    onCollapseLevel(lvl) {
        const prev = this.state.levelCollapse[lvl];
        this.setState({
            levelCollapse: {...this.state.levelCollapse, [lvl]: !prev}
        })
    }

    render() {

        const spellsByLevel = {
            0: []
        };
        for (const i in this.props.spellSlots) {
            if (this.props.spellSlots[i] > 0) spellsByLevel[i] = [];
        }
        for (const o of this.props.data) {
            if (!o || Object.keys(o) === 0) continue;
            
            spellsByLevel[o.setters.level]?.push(o);
        }

        return (
            <div className="spellcastingList">
                {Object.entries(spellsByLevel).map(([lvl, list]) =>
                    <div className="level" key={lvl}>
                        <div className="header">
                            <span className="title">{lvl === "0" ? "Cantrips" : `Level ${lvl}`}</span>
                            <hr />
                            {lvl !== "0" &&
                                <Slots label={"Spell slots: "} value={this.props.usedSpellSlots[lvl]} max={this.props.spellSlots[lvl]} onChange={(value) => this.props.updateSpellSlots(lvl, value)} />
                            }
                            <button type="button" className={this.state.levelCollapse[lvl] ? "collapse collapsed" : "collapse"} onClick={() => this.onCollapseLevel(lvl)}><FiChevronDown /></button>
                        </div>
                        <div className={this.state.levelCollapse[lvl] ? "list collapsible collapsed" : "list collapsible"}>
                            {list.map(spell =>
                                <div className="spell" key={spell.id} onClick={() => this.props.onItemSelected(spell.id)}>
                                    <div className="left">
                                        <span className="name">{spell.name}</span>
                                        <span className="range">{spell.setters.range} {spell.setters.isConcentration && <>&bull; Concentration</>}</span>
                                    </div>
                                    <div className="right">
                                        {spell.prepared && <button type="button" onClick={(e) => this.onUnprepareClick(e, spell.id)}><FiTrash2 size={18} /></button>}

                                        {lvl !== "0" &&
                                        
                                        <select value={this.props.upcasting[spell.id] || lvl} onChange={e => this.onUpcastUpdate(e, spell.id)} onClick={e => e.stopPropagation()}>
                                            {[...Array(this.props.spellSlots.length).keys()].filter(i => i >= (Number(spell.setters.level)||0) && (i == "0" || this.props.spellSlots[i] > 0)).map(level => <option key={level} value={level}>{level}</option>)}
                                        </select>
                                        
                                        }
                                    
                                        <button type='button' onClick={(e) => this.onCastClick(e, spell.id)}>Cast</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}