import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { EVERYTHING } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';
import { checkSubset, checkSupports } from './supportUtils.js';

const CLASSES = EVERYTHING;

let TYPE = "Horse";

export default class DefaultSelection extends React.Component {
    constructor(props, type) {
        super();

        TYPE = type;

        this.props = props;

        this.state = {
            selectedFeatureID: null,
            doubleSelectedFeatures: [],
            selectedItemData: undefined,
            level: 5,
            listsNeeded: [],
            listsData: this.props.characterData.creationData.listsData[TYPE],
            choices: this.props.characterData.creationData.choices[TYPE],
            grants: [],
            stats: []
        }

        console.log(this.props.characterData.creationData.choices);

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);
        this.updateStuff = this.updateStuff.bind(this);
        this.onFeatureSelected = this.onFeatureSelected.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);

        //probably shouldn't have something on a timer like this
        setTimeout(this.updateStuff, 1);
        // this.updateStuff();
    }

    // This might not be necessary, it might not even work with the way that i've done it but this code might be useful if i refactor it
    // for the not-yet-encountered edge-case where I get e.g metamagic from 2 different sources, my code will break if that occurs.
    choiceToChoiceCount(choices) {
        const choiceCounts = []
        const doneAlready = []
        for (const id of choices) {
            if (!doneAlready.includes(id)) {
                choiceCounts.push({"name": id, "count": 1})
            } else {
                choiceCounts.find(e => e.name === id).count += 1
            }
            
            doneAlready.push(id)
        }

        return choiceCounts;
    }

    access(path, object) {
        return path.split('.').reduce((o, i) => o?.[i], object)
    }

    filterData(array, type, value) {
        return array.filter(e => this.access(type, e) === value)
    }

    filterDataIncludes(array, type, value) {
        return array.filter(e => this.access(type, e) !== undefined && this.access(type, e).includes(value))
    }

    filterDataMultiple(array, type, value) {
        return array.filter(e => this.access(type, e) !== undefined && checkSupports(value, this.access(type, e)))
    }

    getFromId(id) {
        return CLASSES.find(e => e.id === id)
    }

    // This code is so insanely dense, the purpose of it is to check the list of choices and then cull any choice that isn't granted by a previous choice in the list.
    // Essentially, e.g "metamagic" (recieved from being a sorceror) is a choice but if "sorceror" is removed as a choice, this function will be unable to find any previous choice that grants the user
    // a "metamagic" choice so it will be removed from the list of choices as well
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
                    console.log([x, y, this.getChoices(y)]);
                    return this.getChoices(y).some(yElement => checkSupports(yElement.supports, xElement.supports));
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


    // Too much stuff happens in this one function, probably bad coding
    updateStuff() {
        let choiceData = this.checkChoices([...this.state.choices]);
        let choices = choiceData.choices;

        for (const invalid of choiceData.invalidList) {
            console.log(this.getFromId(invalid));
            for (const support of this.getFromId(invalid).supports) {
                const choiceArray = this.access(support, this.state.listsData);
                if (choiceArray !== undefined) {
                    choiceArray.splice(0, choiceArray.length);
                }
            }
        }

        let newList = [];
        let grantList = [];
        console.log(choices);
        for (const id of choices) {
            newList.push(...this.getChoices(id));
            grantList.push(...this.getGrants(id));
        }

        // newList = this.choiceToChoiceCount(newList);
        console.log(newList);

        let statList = this.getStats(grantList);

        this.setState({listsNeeded: [...newList], choices: [...choices], grants: [...grantList], stats: [...statList]});

        const languages = newList.filter(e => (e.type === "Language"));

        const creationData = {...this.props.characterData.creationData};
        creationData.choices[TYPE] = choices;
        creationData.listsData[TYPE] = this.state.listsData;
        creationData.languages[TYPE] = languages;

        const exportGrantList = [];
        for (const x of grantList) {
            console.log(x);
            exportGrantList.push({"id": x, "type": this.getFromId(x)?.type})
        }

        creationData.grants[TYPE] = exportGrantList;
        creationData.stats[TYPE] = statList;

        // console.log(creationData.grants);
        let allGrants = [];
        for (const x of Object.values(creationData.grants)) {
            allGrants = [...allGrants, ...x]
        }
        console.log(allGrants);

        let allStats = [];
        for (const x of Object.values(creationData.stats)) {
            allStats = [...allStats, ...x]
        }

        this.props.updateCharacterData({"creationData": creationData, "grants": allGrants, "stats": allStats});
    }

    // This one gets weird and recursive for sure, crazy stuff
    getGrants(id) {
        let idList = [id];
        const grant = CLASSES.find(e => e.id === id)?.rules?.grant;
        if (grant !== undefined) {
            grant.forEach(
                e => {
                    console.log(e);
                    if ((e.level === undefined || parseInt(e.level) <= this.state.level)) {
                        if (e.number === undefined) {
                            idList = idList.concat(this.getGrants(e.id));
                        } else {    
                            for (let i = 0; i < parseInt(e.number); i++) {
                                idList = idList.concat(this.getGrants(e.id));
                            }
                        }
                    }
                }
            )
        }

        return idList;
    }

    getChoices(id) {
        let newList = [];

        let idList = this.getGrants(id);

        for (const eId of idList) {
            const select = CLASSES.find(e => e.id === eId)?.rules?.select
            if (select !== undefined) {
                select.forEach(
                    e => {
                        //the e.supports !== undefined is for ranger's favoured enemy which gives you language (deal with this properly later)
                        if (e.supports !== undefined && (e.level === undefined || parseInt(e.level) <= this.state.level)) {
                            newList.push(e);
                        }
                    }
                )
            }
        }

        return newList;
    }

    // This one is simple as there is no recalling behaviour, it just looks through every grant recieved by the character and collates any stats values
    getStats(grantList) {
        let statList = [];

        for (const id of grantList) {
            const stats = CLASSES.find(e => e.id === id)?.rules?.stat;
            if (stats !== undefined) {
                if (Array.isArray(stats)) {
                    statList.push(...stats);
                } else {
                    statList.push(stats);
                }
            }
        }
        
        return statList;
    }

    // Single click highlights the clicked item and opens the info pane for that item
    onFeatureSelected(id) {
        this.setState({
            selectedFeatureID: id,
            selectedItemData: CLASSES.find(value => value.id === id)
        })
    }

    // Closes info pane and deselects single-clicked item
    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined,
            selectedFeatureID: null
        })
    }

    onFeatureDoubleSelected(id, array, max) {
        let actualArray = this.access(array, this.state)

        // perhaps a block of code could go here that sets the actualArray to [] if undefined instead of it being in render

        if (!actualArray.includes(id) && actualArray.length < max) {
            console.log('feat added: ' + id);
            this.state.choices.push(id);
            actualArray.push(id);
            
            this.updateStuff();

        } else if (actualArray.includes(id)) {
            console.log('feat removed: ' + id)

            actualArray.splice(actualArray.findIndex(e => e === id), 1);
            
            //technically this won't be a necessary check when i fix some other stuff
            //this removes the value from state.choices
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
                        <button onClick={() => {console.log(this.state.choices); console.log(this.state.grants); console.log(this.state.stats)}}>export n stuff</button>
                        <ClassList 
                        onItemSelected={this.onFeatureSelected}
                        selectedItemID={this.state.selectedFeatureID}
                        onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "listsData."+TYPE, 1)}
                        doubleSelectedItems={this.state.listsData[TYPE]}
                        maxDoubleSelected={1}
                        // shownColumns={["Name", "Supports"]}
                        data={this.filterData(CLASSES, "type", TYPE)}
                        title={TYPE}
                        // presetFilters={{Supports: "Primal Path"}}
                        />

                        {console.log(this.state.listsNeeded)}

                        {this.state.listsNeeded.filter(
                            x => CLASSES.some(y => {
                                if (y.supports !== undefined) {
                                    // console.log(x);
                                    return checkSupports(x.supports, y.supports)
                                }
                                return false;
                                })
                            ).filter(
                                e => e.type !== "Language"
                            ).map(
                            e => {
                                if (this.state.listsData[e.name] === undefined) {
                                    this.state.listsData[e.name] = [];
                                    this.setState({
                                        listsData: {...this.state.listsData}
                                    })
                                }

                                return <ClassList
                                    onItemSelected={this.onFeatureSelected}
                                    selectedItemID={this.state.selectedFeatureID}
                                    onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, "listsData." + e.name, e.number || 1)}
                                    doubleSelectedItems={this.state.listsData[e.name]}
                                    maxDoubleSelected={e.number || 1}
                                    // presetFilters={{Supports: e}}
                                    title={e.name}
                                    data={this.filterDataMultiple(CLASSES, "supports", e.supports)}
                                />
                            })}
                    </div>
                    <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
                </div>
            </>
        )
    }
}















