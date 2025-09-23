import * as React from 'react';
import CreationNavbar from './CreationNavBar.jsx';
import CreationTab from './CreationTab.jsx';
import { loadCharacter, saveCharacter } from '../lib/fileUtils.js';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            navigationTab: 'Details',
            characterData: {}
        }

        if (this.props.navigationTab.length > 0) this.state.navigationTab = this.props.navigationTab;

        this.onNavigate = this.onNavigate.bind(this);
        this.updateCreationData = this.updateCreationData.bind(this);
    }

    async onNavigate(tab) {
        await saveCharacter(this.props.characterData.id, this.props.characterData);

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

    updateCreationData(data) {
        this.setState({
            creationData: data
        })
    }

    render() {
        if (this.props.characterData.id === undefined) {
            return (<>No character selected</>)
        }

        return (
            <div className='creationFlow fullPane'>
                <CreationNavbar navigationTab={this.state.navigationTab} onNavigate={this.onNavigate} />
                <CreationTab tab={this.state.navigationTab} characterData={this.props.characterData} creationData={this.state.creationData} updateCharacterData={this.props.updateCharacterData} updateCreationData={this.updateCreationData} />
            </div>
        )
    }
}