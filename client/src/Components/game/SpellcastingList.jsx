import * as React from 'react';

export default class SpellcastingList extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        // PROPS: data: [{}], spellSlots: number[], usedSpellSlots=[], onItemSelected: function(id), selectedItemID: string, 
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
                            <span className="title">{lvl === "0" ? "Cantrip" : `Level ${lvl}`}</span>
                            <hr />
                            {lvl !== "0" &&

                                <div className="slots">
                                    <div className="label">Spell slots: </div>
                                    {[...Array(this.props.spellSlots[lvl]).keys()].map(i =>

                                        <div className={i < this.props.usedSpellSlots[lvl] ? "slot used" : "slot"}></div>

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
                                        {spell.prepared && <button type="button">del</button>}
                                    
                                        <button type='button'>Cast</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* <div className="level">
                    <div className="header">
                        <span className="title">Cantrips</span>
                        <hr />
                        <button type="button">v</button>
                    </div>
                    <div className="list"></div>
                </div>
                <div className="level">
                    <div className="header">
                        <span className="title">Level 1</span>
                        <hr />
                        <div className="slots">
                            <span className="slot used"></span>
                            <span className="slot used"></span>
                            <span className="slot"></span>
                            <span className="slot"></span>
                        </div>
                        <button type="button">v</button>
                    </div>
                    <div className="list"></div>
                </div> */}
            </div>
        )
    }
}