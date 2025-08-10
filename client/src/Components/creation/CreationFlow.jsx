import * as React from 'react';
import CreationNavbar from './CreationNavBar.jsx';
import CreationTab from './CreationTab.jsx';
import { loadCharacter, saveCharacter } from '../lib/fileUtils.js';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            navigationTab: 'Class'
        }

        if (this.props.navigationTab.length > 0) this.state.navigationTab = this.props.navigationTab;

        this.onNavigate = this.onNavigate.bind(this);
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

    // updateCharacterData(data) {
    //     console.log('UPDATING DATA', data)
    //     this.setState({
    //         characterData: data
    //     })
    // }

    render() {
        return (
            <div className='creationFlow fullPane'>
                <CreationNavbar navigationTab={this.state.navigationTab} onNavigate={this.onNavigate} />
                <CreationTab tab={this.state.navigationTab} characterData={this.props.characterData} creationData={this.props.creationData} updateCharacterData={this.props.updateCharacterData} />
            </div>
        )
    }
}