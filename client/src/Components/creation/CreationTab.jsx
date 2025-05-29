import * as React from 'react';
import TestCreationTab from './creationTabs/TestCreationTab.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        
        this.tabs = {
            test: TestCreationTab
        }
    }


    render() {
        const Tab = this.tabs[this.props.tab];
        return <Tab {...this.props} />
    }
}