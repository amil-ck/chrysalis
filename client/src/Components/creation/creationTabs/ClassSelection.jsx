import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import FeatList from '../../lib/listTypes/FeatList.jsx';


export default class ClassSelection extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            selectedFeatureID: null,
            doubleSelectedFeatures: [],
            level: 3
        }

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);

    }
    
    onFeatureSelected(id) {
        
    }

    onFeatureDoubleSelected(id) {
        if (!this.state.doubleSelectedFeatures.includes(id)) {
            console.log('feat added: ' + id);
            this.setState({
                doubleSelectedFeatures: [...this.state.doubleSelectedFeatures, id]
            });
        } else {
            console.log('feat removed: ' + id)
            this.setState({
                doubleSelectedFeatures: this.state.doubleSelectedFeatures.filter((o) => o !== id)
            });
        }
    }


    render() {
        return (
            <>
                <div className='tab'>
                    <div className='lists'>
                        <ClassList 
                        onItemSelected={this.onFeatureSelected}
                        selectedItemID={this.state.selectedFeatureID}
                        onItemDoubleSelected={this.onFeatureDoubleSelected}
                        doubleSelectedItems={this.state.doubleSelectedFeatures} 
                        // shownColumns={["Name", "Supports"]}
                        />

                        <ClassList 
                        onItemSelected={this.onFeatureSelected}
                        selectedItemID={this.state.selectedFeatureID}
                        onItemDoubleSelected={this.onFeatureDoubleSelected}
                        doubleSelectedItems={this.state.doubleSelectedFeatures}
                        presetFilters = {{
                            Supports : "Metamagic"
                        }}
                        shownColumns={["Name", "Supports"]}/>
                    </div>
                </div>
            </>
        )
    }
}















