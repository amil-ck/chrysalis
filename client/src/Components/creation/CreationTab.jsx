import * as React from 'react';
import TestCreationTab from './creationTabs/TestCreationTab.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.tabs = {
            Test: TestCreationTab
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