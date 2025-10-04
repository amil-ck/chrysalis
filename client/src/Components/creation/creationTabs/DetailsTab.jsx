import * as React from 'react';
import { EVERYTHING } from '../../lib/indexData';

export default class DetailsTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            name: this.props.characterData.name || '',
            backstory: this.props.characterData.details?.backstory || '',
            description: this.props.characterData.details?.description || '',
            pronouns: this.props.characterData.details?.pronouns || '',
            namePlaceholder: this.placeholderName()
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
        grants = grants.flatMap(e => this.getGrants(e, level));
        console.log(grants);

        const stats = this.getStats(grants, level);

        const grantDict =  {...this.props.characterData.creationData.grants, level: grants};
        let allGrants = Object.keys(grantDict).flatMap(key => grantDict[key]);

        const statDict =  {...this.props.characterData.creationData.stats, level: stats};
        const allStats = Object.keys(statDict).flatMap(key => statDict[key]);

        console.log(grantDict);
        console.log(allGrants);
        
        console.log(statDict);
        console.log(allStats);

        allGrants = allGrants.map(id => {
            return {"id": id, "type": this.getFromId(id)?.type};
        });

        this.props.updateCharacterData(
            {
                creationData: {...this.props.characterData.creationData,
                    grants: grantDict,
                    stats: statDict
                },
                grants: allGrants,
                stats: allStats,
                level: level
            }
        )
    }

    getFromId(id) {
        return EVERYTHING.find(e => e.id === id);
    }

    getGrants(id, level) {
        let idList = [id];
        const grant = EVERYTHING.find(e => e.id === id)?.rules?.grant;
        if (grant !== undefined) {
            grant.forEach(
                e => {
                    console.log(e);
                    if ((e.level === undefined || parseInt(e.level) <= level)) {
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

    getStats(grantList, level) {
        let statList = [];

        for (const id of grantList) {
            let stats = EVERYTHING.find(e => e.id === id)?.rules?.stat;
            if (stats !== undefined) {
                if (!Array.isArray(stats)) {
                    stats = [stats];
                }
                stats = stats.filter(stat => stat.level === undefined || stat.level <= level);
                statList.push(...stats);
            }
        }
        
        return statList;
    }

    render() {

        return (
            <div className="tab">
                <div className="main">
                    <div className="inputList">
                        <div className="inputWrapper">
                            <label htmlFor="name">Character name</label>
                            <input type="text" name='name' placeholder={"e.g. " + this.state.namePlaceholder} value={this.state.name} onChange={this.handleChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="pronouns">Character pronouns</label>
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
                    </div>
                </div>
            </div>
        )
    }
}