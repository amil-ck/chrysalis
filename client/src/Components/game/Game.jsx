import * as React from 'react';
import Battle from './Battle.jsx';
import Magic from './Magic.jsx';

export default class Game extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            tab: 'magic',
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

        if (this.state.tab === 'battle') {
            return <div className="play fullPane"><Battle {...this.props} /></div>
        } else if (this.state.tab === 'magic') {
            return <div className="play fullPane"><Magic {...this.props} spellcasting={spellcasting} characterData={this.state.fakeCharacterData} updateCharacterData={this.updateFakeCharacterData} /></div>
        } else {
            return <>beep boop</>
        }
    }
}