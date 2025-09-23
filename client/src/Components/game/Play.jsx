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
                knownSpells: [],
                grantedSpells: ["ID_GGTR_SPELL_ENCODE_THOUGHTS", "ID_GGTR_SPELL_CHAOS_BOLT"],
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
                ]
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
                text: "Druid,(Abjuration||Conjuration)" // compare to 'supports'
            }
        }

        const spellcastings = [spellcasting]; // temporary



        return (
            <div className="play fullPane">
                <div className="playNavbar creationNavbar">
                    <button className={this.state.tab === 'battle' ? 'current' : ''} onClick={() => this.setState({ tab: 'battle' })}>Battle</button>
                    <button className={this.state.tab === 'inventory' ? 'current' : ''} onClick={() => this.setState({ tab: 'inventory' })}>Inventory</button>
                    {spellcastings.map(spellcasting => {
                        return <button className={this.state.tab === spellcasting.name.toLowerCase() ? 'current' : ''} onClick={() => this.setState({ tab: spellcasting.name.toLowerCase() })}>Magic ({spellcasting.name})</button>
                    })}
                </div>
                { this.state.tab === 'battle' && <Battle characterData={this.props.characterData} /> }
                { this.state.tab === 'inventory' && <div className="tab inventory">no inventory :(</div> }
                { this.state.tab !== 'battle' && this.state.tab !== 'inventory' && <Magic spellcasting={spellcastings.find(e => e.name.toLowerCase() === this.state.tab)} characterData={this.state.fakeCharacterData} updateCharacterData={this.updateFakeCharacterData} /> }
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