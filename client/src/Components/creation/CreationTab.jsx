import * as React from 'react';
import TestCreationTab from './creationTabs/TestCreationTab.jsx';
import AbilityScores from './AbilityScores.jsx';
import ClassSelection from "../creation/creationTabs/ClassSelection.jsx"

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.tabs = {
            test: TestCreationTab,
            abilityScores: AbilityScores
        }
    }


    render() {
        // const Tab = this.tabs[this.props.tab];
        // return <Tab {...this.props} />

        return <ClassSelection />
    }
}