import * as React from 'react';
import CreationNavbar from './CreationNavBar.jsx';
import CreationTab from './CreationTab.jsx';

export default class CreationFlow extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            navigationTab: 'Test',
            characterData: {},
            creationData: {
                choices: {
                    Class: [],
                    Race: [],
                    Background: []
                },
                listsData: {
                    Class: [],
                    Race: [],
                    Background: []
                },
                grants: {
                    Class: [],
                    Race: [],
                    Background: []
                },
                allGrants: []
            }
        }

        this.onNavigate = this.onNavigate.bind(this);
        this.updateCreationData = this.updateCreationData.bind(this);
    }

    onNavigate(tab) {
        this.setState({
            navigationTab: tab
        });
    }

    updateCharacterData(data) {
        this.setState({
            characterData: data
        })
    }

    updateCreationData(data) {
        this.setState({
            creationData: data
        })
    }

    render() {
        return (
            <div className='creationFlow fullPane'>
                <CreationNavbar navigationTab={this.state.navigationTab} onNavigate={this.onNavigate} />
                <CreationTab tab={this.state.navigationTab} characterData={this.state.characterData} creationData={this.state.creationData} updateCreationData={this.updateCreationData}/>
            </div>
        )
    }
}