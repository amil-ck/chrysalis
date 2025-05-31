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
            level: 20,
            listsNeeded: []
        }

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);

    }

    // filterData(supports) {
    //     return CLASSES.filter(e => e.rules.select.supports)
    // }

    filterData(array, type, value) {
        return array.filter(e => e[type] === value)
    }
    
    onFeatureSelected(id) {
        
    }

    onFeatureDoubleSelected(id) {
        if (!this.state.doubleSelectedFeatures.includes(id)) {
            console.log('feat added: ' + id);
            this.setState({
                doubleSelectedFeatures: [...this.state.doubleSelectedFeatures, id]
            });

            const idList = [];
            const grant = CLASSES.find(e => e.id === id).rules?.grant
            if (grant !== undefined) {
                grant.forEach(
                    e => {
                        if (e.level === undefined || parseInt(e.level) <= this.state.level) {
                            if (e.number === undefined) {
                                idList.push(e.id)
                            } else {
                                for (let i = 0; i < parseInt(e.number); i++) {
                                    idList.push(e.id)
                                }
                            }
                        }
                    }
                )
            }

            idList.push(id);
            console.log(idList);

            let newList = [];

            for (const eId of idList) {
                const select = CLASSES.find(e => e.id === eId)?.rules?.select
                if (select !== undefined) {
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
                }
            }

            newList = newList.filter(
                x => CLASSES.some(y => {
                    if (y.supports !== undefined) {
                        console.log(y.supports[0]);
                        return y.supports[0] === x;
                    }
                    return false;
                })
            )

            this.setState({listsNeeded: [...this.state.listsNeeded, ...newList]});


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
                        data={this.filterData(CLASSES, "type", "Class")}
                        />

                        {/* {console.log(this.state.listsNeeded)} */}
                        {this.state.listsNeeded.map(
                            e => <ClassList
                                    onItemSelected={this.onFeatureSelected}
                                    selectedItemID={this.state.selectedFeatureID}
                                    onItemDoubleSelected={this.onFeatureDoubleSelected}
                                    doubleSelectedItems={this.state.doubleSelectedFeatures}
                                    presetFilters={{Supports: e}}
                                    title={e}
                                />
                        )}




                    </div>
                </div>
            </>
        )
    }
}















