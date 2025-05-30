import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { CLASSES, SPELLS } from '../../lib/indexData.js';

export default class ClassSelection extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            selectedFeatureID: null,
            doubleSelectedFeatures: [],
            level: 3,
            listsNeeded: []
        }

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);

    }

    filterData(supports) {
        return CLASSES.filter(e => e.rules.select.supports)
    }
    
    onFeatureSelected(id) {
        
    }

    onFeatureDoubleSelected(id) {
        if (!this.state.doubleSelectedFeatures.includes(id)) {
            console.log('feat added: ' + id);
            this.setState({
                doubleSelectedFeatures: [...this.state.doubleSelectedFeatures, id]
            });
            
            const select = CLASSES.find(e => e.id === id).rules.select
            if (select !== undefined) {
                const newList = [];
                select.forEach(
                    e => {
                        if (e.level === undefined || parseInt(e.level) <= this.state.level) {
                            if (e.number === undefined) {
                                newList.push(e.supports[0])
                            } else {
                                for (let i = 0; i < parseInt(e.number); i++) {
                                    newList.push(e.supports[0])
                                }
                            }
                        }
                    }
                )

                this.setState({listsNeeded: [...this.state.listsNeeded, ...newList]});
                // console.log(this.state.listsNeeded);
            }

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
                    <div className='main'>
                        <ClassList 
                        onItemSelected={this.onFeatureSelected}
                        selectedItemID={this.state.selectedFeatureID}
                        onItemDoubleSelected={this.onFeatureDoubleSelected}
                        doubleSelectedItems={this.state.doubleSelectedFeatures} 
                        // shownColumns={["Name", "Supports"]}
                        // presetFilters={{Supports: "Metamagic"}}
                        />

                        {/* {console.log(this.state.listsNeeded)} */}
                        {this.state.listsNeeded.map(
                            e => <ClassList
                                    onItemSelected={this.onFeatureSelected}
                                    selectedItemID={this.state.selectedFeatureID}
                                    onItemDoubleSelected={this.onFeatureDoubleSelected}
                                    doubleSelectedItems={this.state.doubleSelectedFeatures}
                                    presetFilters={{Supports: e}} 
                                />
                        )}




                    </div>
                </div>
            </>
        )
    }
}















