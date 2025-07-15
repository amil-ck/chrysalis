import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { CLASSES } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';

const TYPE = "Race";

export default class ClassSelection extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            selectedFeatureID: null,
            doubleSelectedFeatures: [],
            selectedItemData: undefined,
            level: 20,
            listsNeeded: [],
            listsData: this.props.creationData.listsData,
            choices: this.props.creationData.choices[TYPE],
            grants: []
        }

        console.log(this.props.creationData.choices);

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);
        this.updateStuff = this.updateStuff.bind(this);
        this.onFeatureSelected = this.onFeatureSelected.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);

        //probably shouldn't have something on a timer like this
        setTimeout(this.updateStuff, 1);
    }

    // filterData(supports) {
    //     return CLASSES.filter(e => e.rules.select.supports)
    // }

    access = (path, object) => {
        return path.split('.').reduce((o, i) => o?.[i], object)
    }

    filterData(array, type, value) {
        return array.filter(e => this.access(type, e) === value)
    }

    getFromId(id) {
        return CLASSES.find(e => e.id === id)
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
            }) || this.getFromId(x).type === TYPE);
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
        let grantList = [];
        console.log(choices);
        for (const id of choices) {
            newList.push(...this.getChoices(id));
            grantList.push(...this.getGrants(id));
        }

        this.setState({listsNeeded: [...newList]});
        this.setState({choices: [...choices]});
        this.setState({grants: [...grantList]});

        const creationData = {...this.props.creationData}
        creationData.choices[TYPE] = choices;
        creationData.listsData = this.state.listsData;
        this.props.updateCreationData(creationData);    
    }

    getGrants(id) {
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

        return idList;
    }

    getChoices(id) {
        let newList = [];

        let idList = this.getGrants(id);
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

        return newList;

    }

    
    onFeatureSelected(id) {
        this.setState({
            selectedFeatID: id,
            selectedItemData: CLASSES.find(value => value.id === id)
        })
    }

    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined,
            selectedFeatureID: null
        })
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
                        <button onClick={() => {console.log(this.state.choices); console.log(this.state.grants)}}>export n stuff</button>
                        <ClassList 
                        onItemSelected={this.onFeatureSelected}
                        selectedItemID={this.state.selectedFeatureID}
                        onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "listsData."+TYPE)}
                        doubleSelectedItems={this.state.listsData[TYPE]}
                        maxDoubleSelected={1}
                        // shownColumns={["Name", "Supports"]}
                        data={this.filterData(CLASSES, "type", TYPE)}
                        title={TYPE}
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
                                    // presetFilters={{Supports: e}}
                                    title={e}
                                    data={this.filterData(CLASSES, "supports.0", e)}
                                />
                            })}
                    </div>
                    <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
                </div>
            </>
        )
    }
}















