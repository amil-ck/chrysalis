import * as React from 'react';
import Battle from './Battle.jsx';
import Magic from './Magic.jsx';
import Inventory from './Inventory.jsx';
import { saveCharacter } from '../lib/fileUtils.js';

export default class Play extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            tab: 'battle'
        }

        this.onNavigate = this.onNavigate.bind(this);
    }

    async componentDidMount() {
        // Remember recent tab
        const recentTab = await window.appSettings.get("recentPlayTab");
        if (recentTab && recentTab !== this.state.tab) {
            return this.setState({
                tab: recentTab
            })
        }

        // First time setup of spell data
        if (this.props.characterData.spellcastings === undefined || this.props.characterData.spellcastings.length === 0) return; // No spellcasting, so no need to set up

        const toUpdate = {};
        if (this.props.characterData.preparedSpells === undefined) {
            toUpdate.preparedSpells = [];
        }
        if (this.props.characterData.usedSpellSlots === undefined) {
            toUpdate.usedSpellSlots = {
                [this.props.characterData.spellcastings[0].name]: [0, 0, 0, 0, 0, 0, 0, 0, 0]
            };
        }
        if (this.props.characterData.grantedSpells === undefined) {
            toUpdate.grantedSpells = [];
        }
        if (this.props.characterData.knownSpells === undefined) {
            toUpdate.knownSpells = [];
        }

        // Update if necessary
        if (Object.keys(toUpdate).length > 0) this.props.updateCharacterData(toUpdate);
    }

    async onNavigate(tab) {
        await saveCharacter(this.props.characterData.id, this.props.characterData);

        await window.appSettings.set("recentPlayTab", tab);

        this.setState({
            tab: tab
        });
    }

    render() {
        const spellcastings = this.props.characterData.spellcastings || [];

        return (
            <div className="play fullPane">
                <div className="playNavbar creationNavbar">
                    <button className={this.state.tab === 'battle' ? 'current' : ''} onClick={() => this.onNavigate('battle')}>Battle</button>
                    <button className={this.state.tab === 'inventory' ? 'current' : ''} onClick={() => this.onNavigate('inventory')}>Inventory</button>
                    {spellcastings.map(spellcasting => {
                        return <button key={spellcasting.name} className={this.state.tab === spellcasting.name?.toLowerCase() ? 'current' : ''} onClick={() => this.onNavigate(spellcasting.name.toLowerCase())}>Magic ({spellcasting.name})</button>
                    })}
                </div>
                {this.state.tab === 'battle' && <Battle characterData={this.props.characterData} updateCharacterData={this.props.updateCharacterData} openModal={this.props.openModal} />}
                {this.state.tab === 'inventory' && <Inventory characterData={this.props.characterData} updateCharacterData={this.props.updateCharacterData} />}
                {this.state.tab !== 'battle' && this.state.tab !== 'inventory' && <Magic spellcasting={spellcastings.find(e => e.name.toLowerCase() === this.state.tab)} characterData={this.props.characterData} updateCharacterData={this.props.updateCharacterData} openModal={this.props.openModal} />}
            </div>

        )
    }
}