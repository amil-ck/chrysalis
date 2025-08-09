import * as React from 'react';
import TestCreationTab from './creationTabs/TestCreationTab.jsx';
import AbilityScores from './AbilityScores.jsx';
import ClassSelection from "../creation/creationTabs/ClassSelection.jsx"
import DetailsTab from './creationTabs/DetailsTab.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.tabs = {
            Test: TestCreationTab,
            "Ability Scores": AbilityScores,
            "Class":  ClassSelection,
            "Details": DetailsTab
        }
    }


    render() {
        const Tab = this.tabs[this.props.tab];

        if (Tab) {
            return <Tab {...this.props} />
        } else {
            return <div>Tab does not exist</div>
        }
    }
}