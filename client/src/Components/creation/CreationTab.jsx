import * as React from 'react';
import TestCreationTab from './creationTabs/TestCreationTab.jsx';
import AbilityScores from './AbilityScores.jsx';
import ClassSelection from "../creation/creationTabs/ClassSelection.jsx"

import DetailsTab from './creationTabs/DetailsTab.jsx';
import RaceSelection from './creationTabs/RaceSelection.jsx';
import DescriptionTest from './creationTabs/DescriptionTest.jsx';
import BackgroundSelection from './creationTabs/BackgroundSelection.jsx';
import SpellCreation from './creationTabs/SpellCreation.jsx';
import LanguageSelection from './creationTabs/LanguageSelection.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.tabs = {
            "Spells": SpellCreation,
            "Ability Scores": AbilityScores,
            "Class":  ClassSelection,
            "Details": DetailsTab,
            "Race": RaceSelection,
            "Background": BackgroundSelection,
            "Equipment": DescriptionTest,
            "Languages": LanguageSelection
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