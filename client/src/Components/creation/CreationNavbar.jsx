import * as React from 'react';

export default class CreationNavbar extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        // Props: onNavigate: function(tab: string), navigationTab: string

        this.state = {};
    }

    render() {
        const tabs = ["Class", "Race", "Background", "Ability Scores", "Languages", "Equipment", "Feats", "Test"];

        return (
            <div className='creationNavbar'>
                {tabs.map((tab) => {
                    return <button key={tab} onClick={e => this.props.onNavigate(tab)} className={(tab === this.props.navigationTab ? "current" : "")}>{tab}</button>
                })}
            </div>
        )
    }
}