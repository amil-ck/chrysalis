import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { RACES } from '../../lib/indexData.js';

export default class RaceSelection extends React.Component {
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
            choices: [],
            choiceDict: {}
        }

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);
        this.updateStuff = this.updateStuff.bind(this)

    }

    // filterData(supports) {
    //     return RACES.filter(e => e.rules.select.supports)
    // }

    access = (path, object) => {
        return path.split('.').reduce((o, i) => o?.[i], object)
    }

    filterData(array, type, value) {
        return array.filter(e => this.access(type, e) === value)
    }

    getFromId(id) {
        return RACES.find(e => e.id === id)
    }

    checkChoices(choices) {
        if (choices.length > 1) {
            console.log(choices);
            console.log(this.getChoices(choices[0]));
        }

        const newChoices = choices.filter(x => {
            const slice = choices.slice(0, choices.indexOf(x));
            return (slice.some(y => {
                const xElement = this.getFromId(x); 
                if (xElement?.supports !== undefined) {
                    return this.getChoices(y).includes(xElement.supports[0]);
                };
                return false;
            }) || this.getFromId(x).type === "Race");
        })

        const filteredChoice = choices.filter(x => !newChoices.includes(x));

        return {
            "choices": newChoices,
            "invalidList": filteredChoice
        }
    }

    updateStuff() {
        let choiceData = this.checkChoices([...this.state.choices]);
        let choices = choiceData.choices;

        for (const invalid of choiceData.invalidList) {
            const choiceArray = this.access(this.getFromId(invalid).supports[0], this.state.listsData);
            choiceArray.splice(0, choiceArray.length);
        }


        // let choices = [...this.state.choices];
        let newList = [];
        console.log(choices);
        for (const id of choices) {
            newList.push(...this.getChoices(id));
        }
        this.setState({listsNeeded: [...newList]});
        this.setState({choices: [...choices]});
    }

    getChoices(id) {
        let newList = [];
        const idList = [];
        const grant = RACES.find(e => e.id === id).rules?.grant
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
            const select = RACES.find(e => e.id === eId)?.rules?.select
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

        return newList;

    }

    
    onFeatureSelected(id) {
    
    }

    onFeatureDoubleSelected(id, array) {
        let actualArray = this.access(array, this.state)
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
            
            //technically this won't be a necessary check when i fix some other stuff
            if (this.state.choices.includes(id)) {
                this.state.choices.splice(this.state.choices.findIndex(e => e === id), 1);
                this.setState({
                    choices: this.state.choices
                })
            }

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
                        maxDoubleSelected={1}
                        // shownColumns={["Name", "Supports"]}
                        data={this.filterData(RACES, "type", "Race")}
                        // presetFilters={{Supports: "Primal Path"}}
                        />

                        {/* {console.log(this.state.listsNeeded)} */}
                        


                        {this.state.listsNeeded.filter(
                            x => RACES.some(y => {
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
                                    // presetFilters={{Supports: e}}
                                    title={e}
                                    data={this.filterData(RACES, "supports.0", e)}
                                />
                            })}
                    </div>
                </div>
            </>
        )
    }
}















