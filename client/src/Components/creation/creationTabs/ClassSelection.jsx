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
            grants: [],
            listsNeeded: [],
            listsData: {},
            choices: []
        }

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);
        this.updateStuff = this.updateStuff.bind(this)

    }

    // filterData(supports) {
    //     return CLASSES.filter(e => e.rules.select.supports)
    // }

    filterData(array, type, value) {
        return array.filter(e => e[type] === value)
    }

    access = (path, object) => {
        return path.split('.').reduce((o, i) => o[i], object)
    }

    updateStuff() {
        let newList = [];
        for (const id of this.state.choices) {
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

            for (const eId of idList) {
                const select = CLASSES.find(e => e.id === eId)?.rules?.select
                if (select !== undefined) {
                    select.forEach(
                        e => {
                            //the e.supports !== undefined is for ranger's favoured enemy which gives you language (deal with this properly later)
                            if (e.supports !== undefined && (e.level === undefined || parseInt(e.level) <= this.state.level)) {
                                if (e.number === undefined) {
                                    console.log(e);
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
        }
        this.setState({listsNeeded: [...newList]});
    }


    
    onFeatureSelected(id) {
    
    }

    onFeatureDoubleSelected(id, array) {
        let actualArray = this.access(array, this.state)
        console.log(actualArray)
        // if (this.state[array] === undefined) {
        //     this.setState({
        //         [array]: []
        //     }, () => {this.onFeatureDoubleSelected(id, array)});
        //     return;
        // }


        if (!actualArray.includes(id)) {
            console.log('feat added: ' + id);
            this.state.choices.push(id)
            actualArray.push(id)
            
            this.updateStuff()

            // console.log(newList)
            // this.setState({listsNeeded: [...this.state.listsNeeded, ...newList]});


        } else {
            console.log('feat removed: ' + id)

            actualArray.splice(actualArray.findIndex(e => e === id), 1);

            this.state.choices.splice(this.state.choices.findIndex(e => e === id), 1);
            this.setState({
                choices: this.state.choices
            })

            this.updateStuff();

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
                        onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "doubleSelectedFeatures")}
                        doubleSelectedItems={this.state.doubleSelectedFeatures}
                        // shownColumns={["Name", "Supports"]}
                        data={this.filterData(CLASSES, "type", "Class")}
                        // presetFilters={{Supports: "Primal Path"}}
                        />

                        {/* {console.log(this.state.listsNeeded)} */}
                        


                        {this.state.listsNeeded.filter(
                            x => CLASSES.some(y => {
                                if (y.supports !== undefined) {
                                    return y.supports[0] === x;
                                }
                                return false;
                                })
                            ).map(
                            e => {
                                if (this.state.listsData[e] === undefined) {
                                    this.state.listsData[e] = [];
                                    this.setState({
                                        listsData: {...this.state.listsData}
                                    })
                                }

                                return <ClassList
                                    onItemSelected={this.onFeatureSelected}
                                    selectedItemID={this.state.selectedFeatureID}
                                    onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "listsData." + e)}
                                    doubleSelectedItems={this.state.listsData[e]}
                                    presetFilters={{Supports: e}}
                                    title={e}
                                />
                            })}




                    </div>
                </div>
            </>
        )
    }
}















