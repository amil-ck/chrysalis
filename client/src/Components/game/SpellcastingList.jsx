import * as React from 'react';

export default class SpellcastingList extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        // PROPS: data: [{}], spellSlots: number[], usedSpellSlots=[], onItemSelected: function(id), selectedItemID: string, 
        this.onUnprepareClick = this.onUnprepareClick.bind(this);
        this.onCastClick = this.onCastClick.bind(this);
    }

    onUnprepareClick(e, id) {
        e.stopPropagation();
        this.props.unprepareSpell(id);
    }

    onCastClick(e, id) {
        e.stopPropagation();
        this.props.castSpell(id);
    }

    render() {

        const spellsByLevel = {
            0: []
        };
        for (const i in this.props.spellSlots) {
            if (this.props.spellSlots[i] > 0) spellsByLevel[i] = [];
        }
        for (const o of this.props.data) {
            if (o.setters.level.trim() === "Cantrip") {
                spellsByLevel["0"].push(o);
                continue;
            }
            
            spellsByLevel[o.setters.level]?.push(o);
        }

        // TODO: UPCASTING

        return (
            <div className="spellcastingList">
                {Object.entries(spellsByLevel).map(([lvl, list]) =>
                    <div className="level">
                        <div className="header">
                            <span className="title">{lvl === "0" ? "Cantrips" : `Level ${lvl}`}</span>
                            <hr />
                            {lvl !== "0" &&

                                <div className="slots">
                                    <div className="label">Spell slots: </div>
                                    {[...Array(this.props.spellSlots[lvl]).keys()].map(i =>

                                        <div className={i < this.props.usedSpellSlots[lvl] ? "slot used" : "slot"} onClick={() => i < this.props.usedSpellSlots[lvl] && this.props.clearSpellSlot(lvl)}></div>

                                    )}
                                </div>

                            }
                            <button type="button">v</button>
                        </div>
                        <div className="list">
                            {list.map(spell =>
                                <div className="spell" onClick={() => this.props.onItemSelected(spell.id)}>
                                    <div className="left">
                                        <span className="name">{spell.name}</span>
                                        <span className="range">{spell.setters.range}</span>
                                    </div>
                                    <div className="right">
                                        {spell.prepared && <button type="button" onClick={(e) => this.onUnprepareClick(e, spell.id)}>del</button>}
                                    
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