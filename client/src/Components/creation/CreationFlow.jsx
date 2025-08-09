import * as React from 'react';
import CreationNavbar from './CreationNavBar.jsx';
import CreationTab from './CreationTab.jsx';
import { loadCharacter, saveCharacter } from '../lib/fileUtils.js';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            navigationTab: 'Test',
            characterData: {},
            creationData: {}
        }

        this.onNavigate = this.onNavigate.bind(this);
        this.updateCharacterData = this.updateCharacterData.bind(this);
    }

    async onNavigate(tab) {
        // TODO: save tab & character data etc. to file

        // console.log(await window.appSettings.set("bye", "world"));
        // console.log(await window.appSettings.get("bye"));

        // console.log(await saveCharacter("anid", {"hello": "world"}));

        // console.log(await loadCharacter("anid"));

        this.setState({
            navigationTab: tab
        });
    }

    updateCharacterData(data) {
        console.log('UPDATING DATA', data)
        this.setState({
            characterData: data
        })
    }

    render() {
        return (
            <div className='creationFlow fullPane'>
                <CreationNavbar navigationTab={this.state.navigationTab} onNavigate={this.onNavigate} />
                <CreationTab tab={this.state.navigationTab} characterData={this.state.characterData} creationData={this.state.creationData} updateCharacterData={this.updateCharacterData} />
            </div>
        )
    }
}