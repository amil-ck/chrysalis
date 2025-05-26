import * as React from 'react';
import GenericList from '../lib/GenericList.jsx';
import FeatList from '../lib/listTypes/FeatList.jsx';
import SpellList from '../lib/listTypes/SpellList.jsx';
import InfoPane from '../lib/InfoPane.jsx';

export default class CreationTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {
            navigationTab: props.navigationTab,
            selectedFeatID: null
        };

        this.onFeatSelected = this.onFeatSelected.bind(this);
    }

    onFeatSelected(id) {
        this.setState({
            selectedFeatID: id
        })
    }

    render() {

        let tabContents;

        if (this.state.navigationTab === "class") {
            tabContents = <GenericList />
        }

        const arr = [1, 2, 3];

        console.log(this.state.selectedFeatID);

        return (
            <div className='tab'>
                <div className='lists'>
                    <FeatList onItemSelected={this.onFeatSelected} selectedItemID={this.state.selectedFeatID} />
                    <SpellList onItemSelected={() => { }} selectedItemID={null} />
                </div>
                <InfoPane />
            </div>
        )
    }
}