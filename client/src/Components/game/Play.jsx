import * as React from 'react';
import Battle from './Battle.jsx';
import Magic from './Magic.jsx';

export default class Play extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            tab: 'battle',
            fakeCharacterData: {
                level: 8,
                preparedSpells: ["ID_PHB_SPELL_PRODUCE_FLAME"],
                knownSpells: [{ id: "ID_GGTR_SPELL_ENCODE_THOUGHTS", spellcasting: "Druid" }, { id: "ID_PHB_SPELL_PRODUCE_FLAME", spellcasting: "Druid" }],
                grantedSpells: [{ id: "ID_GGTR_SPELL_ENCODE_THOUGHTS" }, { id: "ID_GGTR_SPELL_CHAOS_BOLT" }],
                stats: [
                    {
                        "name": "druid:spellcasting:prepare",
                        "value": "wisdom:modifier"
                    },
                    {
                        "name": "druid:spellcasting:prepare",
                        "value": "level:druid"
                    },
                    {
                        name: "wisdom",
                        value: 16
                    },
                    {
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
                ],
                usedSpellSlots: {
                    "Druid": [0, 2, 1, 0, 0, 0, 0, 0, 0],
                }
            }
        }

        this.updateFakeCharacterData = this.updateFakeCharacterData.bind(this);
    }

    updateFakeCharacterData(data) {
        const newData = { ...this.state.fakeCharacterData, ...data };
        this.setState({
            fakeCharacterData: newData
        })
    }

    render() {
        const spellcasting = {
            name: "Druid",
            ability: "Wisdom",
            prepare: true,
            allowReplace: false,
            list: {
                known: true, // ignore whether spells are known or not
                text: "Druid" // compare to 'supports'
            }
        }

        const spellcastings = [spellcasting]; // temporary



        return (
            <div className="play fullPane">
                <div className="playNavbar creationNavbar">
                    <button className={this.state.tab === 'battle' ? 'current' : ''} onClick={() => this.setState({ tab: 'battle' })}>Battle</button>
                    <button className={this.state.tab === 'inventory' ? 'current' : ''} onClick={() => this.setState({ tab: 'inventory' })}>Inventory</button>
                    {spellcastings.map(spellcasting => {
                        return <button key={spellcasting.name} className={this.state.tab === spellcasting.name.toLowerCase() ? 'current' : ''} onClick={() => this.setState({ tab: spellcasting.name.toLowerCase() })}>Magic ({spellcasting.name})</button>
                    })}
                </div>
                {this.state.tab === 'battle' && <Battle characterData={this.props.characterData} openModal={this.props.openModal} />}
                {this.state.tab === 'inventory' && <div className="tab inventory">no inventory :(</div>}
                {this.state.tab !== 'battle' && this.state.tab !== 'inventory' && <Magic spellcasting={spellcastings.find(e => e.name.toLowerCase() === this.state.tab)} characterData={this.state.fakeCharacterData} updateCharacterData={this.updateFakeCharacterData} openModal={this.props.openModal} />}
            </div>

        )

        // if (this.state.tab === 'battle') {
        //     return <div className="play fullPane"><Battle {...this.props} /></div>
        // } else if (this.state.tab === 'magic') {
        //     return <div className="play fullPane"><Magic {...this.props} spellcasting={spellcasting} characterData={this.state.fakeCharacterData} updateCharacterData={this.updateFakeCharacterData} /></div>
        // } else {
        //     return <>beep boop</>
        // }
    }
}