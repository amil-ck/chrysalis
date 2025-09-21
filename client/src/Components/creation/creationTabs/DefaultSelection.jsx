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

    // filterData(supports) {
    //     return CLASSES.filter(e => e.rules.select.supports)
    // }

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

    access = (path, object) => {
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
                    // return this.getChoices(y).some(support => xElement.supports.includes(support));

                    // return this.getChoices(y).includes(xElement.supports[0]);
                    // [3, 4].includes([4, 5])
                    // [3,4].some(x => {return [4,5].includes(x)})
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
            console.log(this.getFromId(invalid));
            for (const support of this.getFromId(invalid).supports) {
                const choiceArray = this.access(support, this.state.listsData);
                if (choiceArray !== undefined) {
                    choiceArray.splice(0, choiceArray.length);
                }
            }
        }


        // let choices = [...this.state.choices];
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

    getGrants(id) {
        let idList = [id];
        const grant = CLASSES.find(e => e.id === id)?.rules?.grant;
        if (grant !== undefined) {
            grant.forEach(
                e => {
                    console.log(e);
                    // if (e.level === undefined || parseInt(e.level) <= this.state.level) {
                    if ((e.level === undefined || parseInt(e.level) <= this.state.level)) {
                        if (e.number === undefined) {
                            // idList.push(e.id)
                            idList = idList.concat(this.getGrants(e.id));
                        } else {    
                            for (let i = 0; i < parseInt(e.number); i++) {
                                // idList.push(e.id)
                                idList = idList.concat(this.getGrants(e.id));
                            }
                        }
                    }
                }
            )
        }

        // 13
        
        // idList.push(id);
        // const newList = [];
        // while (set(idList) === set(newList)) {

        // }

        return idList;
    }

    setAllGrants() {
        
    }

    getChoices(id) {
        let newList = [];

        let idList = this.getGrants(id);

        for (const eId of idList) {
            const select = CLASSES.find(e => e.id === eId)?.rules?.select
            if (select !== undefined) {
                select.forEach(
                    e => {
                        // console.log(e);
                        //the e.supports !== undefined is for ranger's favoured enemy which gives you language (deal with this properly later)
                        if (e.supports !== undefined && (e.level === undefined || parseInt(e.level) <= this.state.level)) {
                            // if (e.number === undefined) {
                            //     console.log(e);
                            //     newList.push(e.supports)
                            // } else {
                            //     for (let i = 0; i < parseInt(e.number); i++) {
                            //         newList.push(e.supports)
                            //     }
                            // }
                            newList.push(e);
                        }
                    }
                )
            }
        }

        return newList;
    }

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

    
    onFeatureSelected(id) {
        this.setState({
            selectedFeatureID: id,
            selectedItemData: CLASSES.find(value => value.id === id)
        })
    }

    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined,
            selectedFeatureID: null
        })
    }

    onFeatureDoubleSelected(id, array, max) {
        let actualArray = this.access(array, this.state)
        // if (this.state[array] === undefined) {
        //     this.setState({
        //         [array]: []
        //     }, () => {this.onFeatureDoubleSelected(id, array)});
        //     return;
        // }

        // console
        if (!actualArray.includes(id) && actualArray.length < max) {
            console.log('feat added: ' + id);
            this.state.choices.push(id)
            actualArray.push(id)
            
            this.updateStuff()

            // console.log(newList)
            // this.setState({listsNeeded: [...this.state.listsNeeded, ...newList]});


        } else if (actualArray.includes(id)) {
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















