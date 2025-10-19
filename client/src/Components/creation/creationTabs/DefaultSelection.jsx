import * as React from 'react';
import ClassList from '../../lib/listTypes/ClassList.jsx';
import { EVERYTHING } from '../../lib/indexData.js';
import ChrysalisInfoPane from '../../lib/ChrysalisInfoPane.jsx';
import { checkRequirements, checkSubset, checkSupports } from '../../lib/supportUtils.js';

const CLASSES = EVERYTHING;
let TYPE = "Horse";

let original = {}

export default class DefaultSelection extends React.Component {
    constructor(props, type) {
        super();

        TYPE = type;

        this.props = props

        original = {
            "type": TYPE,
            "name": TYPE,
            "data": []
        }

        this.state = {
            level: this.props.characterData.level,
        }

        const choicesProps = this.props.characterData.creationData.choices[TYPE];
        console.log(choicesProps);
        console.log(JSON.parse(JSON.stringify(choicesProps)));

        this.state = {
            level: this.props.characterData.level,
            choices: choicesProps.length === 0 ? [original] : [...this.onLoadPage(JSON.parse(JSON.stringify(choicesProps)))],
            selectedItemData: undefined,
            selectedFeatureID: null,
        }

        this.saveData();

        // console.log(this.state.choices);

        this.onFeatureSelected = this.onFeatureSelected.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);

        this.onFeatureDoubleSelected = this.onFeatureDoubleSelected.bind(this);
        // this.updateStuff = this.updateStuff.bind(this);
    }

    render() {
        return (
            <div className='tab'>
                <div className='main'>
                    {console.log(this.state.choices)}
                    {this.state.choices.map(
                        select => {
                            return <ClassList
                                onItemSelected={this.onFeatureSelected}
                                selectedItemID={this.state.selectedFeatureID}
                                onItemDoubleSelected={(id) => this.onFeatureDoubleSelected(id, select, select.number || 1)}
                                doubleSelectedItems={[...select.data]}
                                maxDoubleSelected={select.number || 1}
                                // presetFilters={{Supports: e}}
                                title={select.name + (select.optional ? " (Optional)" : "")}
                                data={this.getDataForSelect(select)}
                            />
                    })}
                </div>
                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
            </div>
        )
    }

    getFromId(id) {
        return EVERYTHING.find(e => e.id === id);
    }
    
    saveData() {
        // console.log({creationData: {...this.props.characterData.creationData, choices: {...this.props.characterData.creationData, [TYPE]: this.state.choices}}});
        const choiceIds = this.state.choices.flatMap(e => e.data);
        const grants = choiceIds.flatMap(id => this.getGrants(id));
        const stats = this.getStats(grants);
        console.log(choiceIds);

        const grantDict =  {...this.props.characterData.creationData.grants, [TYPE]: grants};
        let allGrants = Object.keys(grantDict).flatMap(key => grantDict[key]);

        const statDict =  {...this.props.characterData.creationData.stats, [TYPE]: stats};
        const allStats = Object.keys(statDict).flatMap(key => statDict[key]);

        console.log(grantDict);
        console.log(allGrants);
        
        console.log(statDict);
        console.log(allStats);

        allGrants = allGrants.map(id => {
            return {"id": id, "type": this.getFromId(id)?.type};
        });

        console.log(allGrants);

        this.props.updateCharacterData(
            {
                creationData: {...this.props.characterData.creationData,
                    choices: {...this.props.characterData.creationData.choices, [TYPE]: [...this.state.choices]},
                    grants: grantDict,
                    stats: statDict
                },
                grants: allGrants,
                stats: allStats
            }
        )
    }

    getDataForSelect(select) {
        // Some selects have the data defined internally and are of type "List"
        if (select.type === "List") {
            return select.item.map(e => {
                e.name = e.text;
                return e;
            });
        }
        console.log(select);
        let filtered = EVERYTHING.filter(e => e.type === select.type);
        console.log(filtered);
        if (select.supports !== undefined) {
            filtered = filtered.filter(e => {
                let allSupports = [e.id];
                // Here shall lay every edge case that is necessary to make this work
                e.supports !== undefined && allSupports.push(...e.supports);
                //possibly not covering a real edge case (still a possible edge case so i'll leave it)
                e.setters?.type !== undefined && allSupports.push(e.setters.type);

                // if (select.name === "Ability Score Increase (Level 4)") {
                //     console.log(select.supports);
                //     console.log(allSupports);
                // }

                return checkSupports(select.supports, allSupports);
                // return checkRequirments(select.supports.toString(), allSupports);
            })
        }
        console.log(filtered);
        
        return filtered
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

    onFeatureDoubleSelected(id, select, max) {
        if (!select.data.includes(id) && select.data.length < max) {
            select.data.push(id);
            
            // move
            let sels = this.getSelects(id);

            sels = sels.map(e => {
                e.from = id;
                return e;
            })

            this.state.choices.splice(this.state.choices.indexOf(select) + 1, 0, ...sels);

            this.setState({choices: [...this.state.choices]}, this.saveData);


        } else if (select.data.includes(id)) {
            select.data.splice(select.data.findIndex(e => e === id), 1);
            this.setState({choices: this.cull([...this.state.choices], [id])}, this.saveData);
        }

        // console.log(JSON.parse(JSON.stringify(this.state.choices)));
    }

    cull(selects, idList) {
        console.log(selects);
        console.log(idList);

        if (idList.length === 0) {
            return selects;
        }

        const newIdList = [];
        const newSelects = [];
        for (const select of selects) {
            if (idList.includes(select.from)) {
                newIdList.push(...select.data);
            } else {
                newSelects.push(select);
            }
        }
        return this.cull(newSelects, newIdList);
    }

    onLoadPage(selects) {
        const newSelects = [original];

        let index = 0;
        while (index < newSelects.length) {
            console.log(index);
            const newSelect = newSelects[index];
            const same = selects.find(e => this.compareSelectObject(newSelect, e));

            if (same !== undefined) {
                console.log(same, newSelect);
                newSelect.data = [...same.data];
                newSelects.push(...same.data.flatMap(e => {
                    let sels = this.getSelects(e);
                    sels = sels.map(sel => {sel.from = e; return sel});
                    return sels;
                }));
            }

            index++;
        }

        return newSelects;
    }

    // updateStuff() {
    //     const choices = selects.flatMap(select => select.data);

    //     const selects = [original, ...choices.flatMap(id => this.getSelects(id))];
        
    //     const checkChoices =  [...selects];

    //     let id = 0
    //     for (const select1 of selects) {
    //         const same = checkChoices.find(select2 => this.compareSelectObject(select1, select2));
    //         console.log(same);
    //         if (same !== undefined) {
    //             console.log(select1.name, select1.data, same.data);
    //             select1.data = same.data;
    //             checkChoices.splice(checkChoices.indexOf(select1), 1);
    //         }
    //         select1.id = id;
    //         id++;
    //     }

    //     this.setState({choices: selects, change: !this.state.change});
    // }

    compareSelectObject(obj1, obj2) {
        obj1 = {...obj1}; obj2 = {...obj2};
        delete obj1.data; delete obj2.data; delete obj1.id; delete obj2.id; delete obj1.from; delete obj2.from;
        // console.log(obj1, obj2);
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }


    // Transplanted from previous version - might be bad and in need of fixing
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

    getSelects(id) {
        let choiceList = [];
        let grants = this.getGrants(id);

        for (const grant of grants) {
            const select = CLASSES.find(e => e.id === grant)?.rules?.select
            if (select !== undefined) {
                select.forEach(
                    e => {
                        if (e.level === undefined || parseInt(e.level) <= this.state.level) {
                            e.data = [];
                            choiceList.push(e);
                        }
                    }
                )
            }
        }

        choiceList = choiceList.filter(e => e.type !== "Spell");

        return choiceList;
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
    
}