import * as React from 'react';
import { EVERYTHING } from '../../lib/indexData';
import {getGrants, getStats} from "../../lib/grantUtils";
import Switch from '../../lib/Switch.jsx';

const switchDict = {
    "Feats": "ID_INTERNAL_OPTION_ALLOW_FEATS",
    "Custom": "ID_WOTC_TCOE_OPTION_CUSTOMIZED_ASI"
}


export default class DetailsTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            name: this.props.characterData.name || '',
            backstory: this.props.characterData.details?.backstory || '',
            description: this.props.characterData.details?.description || '',
            pronouns: this.props.characterData.details?.pronouns || '',
            namePlaceholder: this.placeholderName(),
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
    }

    placeholderName() {
        const names = ["Rose Tyler", "Martha Jones", "Donna Noble", "Amy Pond", "Rory Williams", "Clara Oswald", "Bill Potts", "Bernie Sanders", "Walter Cronkite", "b’Ang’r’Ang"];
        return names[Math.floor(Math.random() * names.length)];
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleInputBlur(e) {
        this.props.updateCharacterData({
            name: this.state.name,
            details: {
                backstory: this.state.backstory,
                description: this.state.description,
                pronouns: this.state.pronouns
            }
        });
    }

    handleLevelChange(level) {
        let grants = EVERYTHING.filter(e => e.type === "Level" && e.name <= level).map(e => e.id);
        grants = grants.flatMap(e => getGrants(e, level));
        console.log(grants);

        // const stats = getStats(grants, level);

        const grantDict =  {...this.props.characterData.creationData.grants, level: grants};

        this.updateAllGrants(grantDict, level, this.props.updateCharacterData, {level: level});

        // let allGrants = Object.keys(grantDict).flatMap(key => grantDict[key]);

        // const statDict = this.props.characterData.creationData.stats;
        // const allStats = getStats(allGrants, level);
        // allStats.push(...Object.keys(statDict).flatMap(key => statDict[key]));

        // const statDict =  {...this.props.characterData.creationData.stats, level: stats};
        

        // console.log(grantDict);
        // console.log(allGrants);
        
        // console.log(statDict);
        // console.log(allStats);

        // allGrants = allGrants.map(id => {
        //     return {"id": id, "type": this.getFromId(id)?.type};
        // });

        // this.props.updateCharacterData(
        //     {
        //         creationData: {...this.props.characterData.creationData,
        //             grants: grantDict,
        //         },
        //         grants: allGrants,
        //         stats: allStats,
        //         level: level
        //     }
        // )
    }

    updateAllGrants(grantDict, level, updateCharacterDataFunction, extraData={}) {
        let allGrants = Object.keys(grantDict).flatMap(key => grantDict[key]);
        
        const allStats = getStats(allGrants, level);
        const statDict = this.props.characterData.creationData.stats;
        allStats.push(...Object.keys(statDict).flatMap(key => statDict[key]));

        allGrants = allGrants.map(id => {
            return {"id": id, "type": this.getFromId(id)?.type};
        });

        updateCharacterDataFunction(
            {
                creationData: {...this.props.characterData.creationData,
                    grants: grantDict,
                },
                grants: allGrants,
                stats: allStats,
                ...extraData
            }
        )
    }

    handleSwtiches(name) {
        const id = switchDict[name];

        const grants = this.props.characterData.creationData.grants.level;

        if (grants.includes(id)) {
            grants.splice(grants.indexOf(id), 1);
        } else {
            grants.push(id);
        }

        const grantDict =  {...this.props.characterData.creationData.grants, level: grants};

        this.updateAllGrants(grantDict, this.props.characterData.level, this.props.updateCharacterData);
    }

    isSwitchOn(name) {
        const id = switchDict[name];
        return this.props.characterData.creationData.grants.level.includes(id);
    }

    getFromId(id) {
        return EVERYTHING.find(e => e.id === id);
    }

    render() {

        return (
            <div className="tab">
                <div className="main">
                    <div className="inputList">
                        <div className="title">New Character</div>

                        <div className="inputWrapper">
                            <label htmlFor="name">Name</label>
                            <input type="text" name='name' placeholder={"e.g. " + this.state.namePlaceholder} value={this.state.name} onChange={this.handleChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="pronouns">Pronouns</label>
                            <input type="text" name="pronouns" placeholder={"e.g. they/she"} value={this.state.pronouns} onChange={this.handleChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="level">Level</label>
                            <div className="radioGroup">
                                {[ ...Array(20).keys() ].map(i => {
                                    return <button type='button' onClick={() => this.handleLevelChange(i+1)} className={this.props.characterData.level == i+1 ? "checked" : ""}>{i+1}</button>
                                })}
                            </div>
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" placeholder='Describe your character: appearance, personality, etc.' rows={5} value={this.state.description} onChange={this.handleChange} onBlur={this.handleInputBlur} ></textarea>
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="backstory">Backstory</label>
                            <textarea name="backstory" placeholder='What events made your character who they are?' rows={5} value={this.state.backstory} onChange={this.handleChange} onBlur={this.handleInputBlur} ></textarea>
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="Feats">Feats</label>
                            <Switch value={this.isSwitchOn("Feats")} onChange={() => this.handleSwtiches("Feats")}/>
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="Custom">Custom</label>
                            <Switch value={this.isSwitchOn("Custom")} onChange={() => this.handleSwtiches("Custom")}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}