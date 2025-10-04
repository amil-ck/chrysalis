import * as React from 'react';
import CreationNavbar from './CreationNavbar.jsx';
import CreationTab from './CreationTab.jsx';
import { loadCharacter, saveCharacter } from '../lib/fileUtils.js';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            navigationTab: 'Details'
        }

        if (this.props.navigationTab.length > 0) this.state.navigationTab = this.props.navigationTab;

        this.onNavigate = this.onNavigate.bind(this);
    }

    async componentDidMount() {

        // Remember recent tab if character is not new
        if (this.props.characterData.name !== undefined) {
            const recentTab = await window.appSettings.get("recentCreationTab");
            if (recentTab && recentTab !== this.state.navigationTab) {
                this.setState({
                    navigationTab: recentTab
                })
            }
        }
    }

    async onNavigate(tab) {
        await saveCharacter(this.props.characterData.id, this.props.characterData);

        await window.appSettings.set("recentCreationTab", tab);

        this.setState({
            navigationTab: tab
        });
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