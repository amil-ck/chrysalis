import * as React from 'react';
import DOMPurify from 'dompurify';
import { calculateStat } from '../lib/statUtils.js';
import { ARCHETYPES, CLASSES, EVERYTHING, RACES } from '../lib/indexData';
import HPControl from './HPControl.jsx';
import Slots from '../lib/Slots.jsx';
import Action from './Action.jsx';
import Modal from '../lib/BetterModal.jsx';
import { FiPlus } from 'react-icons/fi';

export default class Battle extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            miscTab: 'Actions',
            notes: this.props.characterData.notes || { general: '', conditions: '' },
            showModal: false,
            modalText: {
                name: '',
                value: '0',
                max: ''
            },
            onModalPositive: () => {
                if (this.state.modalText.name.length > 0) {
                    this.addTempHp(
                        this.state.modalText.name.toLowerCase(), 
                        this.state.modalText.name,
                        Number(this.state.modalText.value) || 0,
                        Number(this.state.modalText.max) || -1
                    )
                }
            }
        }

        if (this.props.characterData.id === undefined) {
            return;
        }

        // Do all the calculations and processing

        // Ability scores & saving throws
        this.abilityScores = [];
        this.savingThrows = [];
        const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
        const abbreviations = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

        for (const i in abilities) {
            const ability = abilities[i].toLowerCase();
            const score = calculateStat(ability, this.props.characterData);
            const modifier = calculateStat(`${ability}:modifier`, this.props.characterData);
            this.abilityScores.push({
                name: abbreviations[i],
                score, modifier
            })

            const saveProf = calculateStat(`${ability}:save:proficiency`, this.props.characterData);

            this.savingThrows.push({
                name: abilities[i],
                value: modifier + saveProf,
                proficient: saveProf !== 0
            })
        }

        this.ac = calculateStat("ac", this.props.characterData);

        const characterClassID = this.props.characterData.grants?.find(grant => grant.type === 'Class')?.id;
        const characterClassData = characterClassID ? CLASSES.find(c => c.id === characterClassID) : undefined;
        this.characterClass = characterClassData?.name || undefined;
        const subclassID = this.props.characterData.grants?.find(grant => grant.type === 'Archetype')?.id;
        this.subclass = subclassID ? ARCHETYPES.find(a => a.id === subclassID)?.name : undefined;
        const raceID = this.props.characterData.grants?.find(g => g.type === 'Race')?.id;
        const raceData = raceID ? RACES.find(r => r.id === raceID) : undefined;
        this.characterRace = raceData?.name || undefined;

        // Feats and features
        const featsFeatureIDs = this.props.characterData.grants?.filter(grant => grant.type === 'Feat' || grant.type?.includes('Feature') || grant.type === 'Racial Trait')?.map(g => g.id);
        const featsFeatures = EVERYTHING.filter(item => featsFeatureIDs?.includes(item.id) && !(item.sheet?.display == false));
        console.log(featsFeatureIDs, featsFeatures)
        this.processedFeats = featsFeatures.map(feat => {
            const sanitisedDescription = DOMPurify.sanitize(feat.sheet?.description || feat.description, { USE_PROFILES: { html: true } });
            const descriptionWithStats = this.insertStats(sanitisedDescription);
            const maxUsage = feat.sheet?.usage?.split("/")[0];
            const resetOn = feat.sheet?.usage?.split("/")[1];
            return {
                id: feat.id,
                name: feat.sheet?.alt || feat.name,
                description: descriptionWithStats,
                action: feat.sheet?.action,
                usageStr: feat.sheet?.usage,
                maxUsage,
                resetOn
            }
        })

        // Internal stats that I assume we should have
        this.proficiencyBonus = calculateStat("proficiency", this.props.characterData);
        this.initiative = calculateStat("initiative", this.props.characterData);
        this.speed = calculateStat("speed", this.props.characterData);
        this.maxHp = calculateStat("hp", this.props.characterData);

        this.hitDice = "";
        const hdType = characterClassData?.setters?.hd;
        console.log(hdType);
        if (hdType) {
            this.hitDice = `${this.props.characterData.level}${hdType}`;
        }

        // Skills
        const skills = [
            { name: "Acrobatics", stat: "dexterity" },
            { name: "Animal Handling", stat: "wisdom" },
            { name: "Arcana", stat: "intelligence" },
            { name: "Athletics", stat: "strength" },
            { name: "Deception", stat: "charisma" },
            { name: "History", stat: "intelligence" },
            { name: "Insight", stat: "wisdom" },
            { name: "Intimidation", stat: "charisma" },
            { name: "Investigation", stat: "intelligence" },
            { name: "Medicine", stat: "wisdom" },
            { name: "Nature", stat: "intelligence" },
            { name: "Perception", stat: "wisdom" },
            { name: "Performance", stat: "charisma" },
            { name: "Persuasion", stat: "charisma" },
            { name: "Religion", stat: "intelligence" },
            { name: "Sleight of Hand", stat: "dexterity" },
            { name: "Stealth", stat: "dexterity" },
            { name: "Survival", stat: "wisdom" },
        ];
        this.processedSkills = skills.map(skill => {
            const profBonus = calculateStat(`${skill.name.toLowerCase()}:proficiency`, this.props.characterData)
            return {
                name: skill.name,
                modifier: profBonus + calculateStat(`${skill.stat}:modifier`, this.props.characterData),
                proficient: profBonus !== 0
            }
        })

        this.processedActions = [...this.processedFeats.filter(f => f.action !== undefined), ...(this.props.characterData.inventory || []).filter(i => i.action === true || i.action?.length > 0)];

        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.updateHp = this.updateHp.bind(this);
        this.onModalInputChange = this.onModalInputChange.bind(this);
    }

    async componentDidMount() {
        const toUpdate = {};
        const maxHp = await calculateStat("hp", this.props.characterData);
        if (this.props.characterData.hps === undefined) {
            let newHp = maxHp;
            if (typeof this.props.characterData.hp === 'number') newHp = this.props.characterData.hp; 

            toUpdate.hps = {
                hp: {
                    name: 'HP',
                    value: newHp,
                    max: maxHp
                }
            };
            console.log("bing bong", toUpdate)
        } else if (maxHp !== this.props.characterData.hps.hp.maxHp) {
            toUpdate.hps = structuredClone(this.props.characterData.hps);
            toUpdate.hps.hp.max = maxHp;
        }

        if (this.props.characterData.actionUsage === undefined) {
            toUpdate.actionUsage = {};
        }

        if (Object.keys(toUpdate).length > 0) {
            return this.props.updateCharacterData(toUpdate);
        }
    }

    insertStats(description = '') {

        let parsedDescription = `${description}`;

        const statNames = description.split("{{").map(str => {
            if (str.includes("}}")) {
                return str.split("}}")[0]; // get substring between brackets
            }
        }).filter(i => !!i); // not null or undefined

        console.log(statNames);

        for (const statName of statNames) {
            const value = calculateStat(statName, this.props.characterData);
            parsedDescription = parsedDescription.replace(`{{${statName}}}`, value);
        }

        return parsedDescription;
    }

    plusify(value) {
        return Number(value) >= 0 ? `+${value}` : `${value}`;
    }

    handleNotesChange(e) {
        this.setState({
            notes: { ...this.state.notes, [e.target.name]: e.target.value }
        })
    }

    handleInputBlur(e) {
        this.props.updateCharacterData({
            notes: this.state.notes
        });
    }

    handleActionUse(id, value) {
        this.props.updateCharacterData({
            actionUsage: {...this.props.characterData.actionUsage, [id]: value}
        })
    }

    updateHp(id, newValue) {
        console.log("hp update", id, newValue);
        const newObj = {
            ...this.props.characterData.hps[id],
            value: newValue
        }
        this.props.updateCharacterData({
            hps: {...this.props.characterData.hps, [id]: newObj}
        })
    }
    
    addTempHp(id, name, value, max=-1) {
        this.props.updateCharacterData({
            hps: {...this.props.characterData.hps, [id]: {
                name, value, max
            }}
        })
    }

    removeTempHp(id) {
        this.props.updateCharacterData({
            hps: {...this.props.characterData.hps, [id]: undefined}
        })
    }

    onAddTempHpClicked() {
        this.setState({
            showModal: true
        })
    }

    onModalInputChange(e) {
        this.setState({
            modalText: {...this.state.modalText, [e.target.name]: e.target.value}
        })
    }

    render() {
        if (this.props.characterData.id === undefined) {
            return (<>No character selected</>)
        }

        this.miscTabs = ['Actions', 'Backstory', 'Features', 'Notes'];
        this.miscTabBodies = {
            Actions: (
                <div className="actionList card list">
                    <div className="body">
                        {this.processedActions.map(a => (
                            <Action key={a.name} data={a} useValue={this.props.characterData.actionUsage?.[a.id] || 0} startCollapsed={true} onChange={v => this.handleActionUse(a.id, v)} />
                        ))}
                    </div>
                </div>
            ),
            Backstory: <></>,
            Notes: (
                <div className="inputList">
                    <div className="inputWrapper">
                        <label htmlFor="general">General Notes</label>
                        <textarea name="general" rows={5} value={this.state.notes.general} onChange={this.handleNotesChange} onBlur={this.handleInputBlur}></textarea>
                    </div>
                    <div className="inputWrapper">
                        <label htmlFor="conditions">Conditions</label>
                        <textarea name="conditions" rows={5} value={this.state.notes.conditions} onChange={this.handleNotesChange} onBlur={this.handleInputBlur}></textarea>
                    </div>
                </div>
            ),
            "Features": (
                this.processedFeats.map(feat => {
                    return (
                        <div className='feat' key={feat.id}>
                            <span className="name">{feat.name}</span>{feat.action != undefined && <span className="action">{feat.action.toUpperCase()}{feat.usage && `: ${feat.usage.toUpperCase()}`}</span>}
                            <div className="description" dangerouslySetInnerHTML={{ __html: feat.description }}></div>
                        </div>
                    )
                })
            )
        }

        return (

            <div className="tab battle">
                <div className="header">
                    <div className="details card">
                        <div className="body">
                            <span className="name">{this.props.characterData.name || "Unnamed"}</span>
                            <span className="details">Level {this.props.characterData.level || "unknown"} {this.characterRace || ""} {this.characterClass || "Class unknown"} {this.subclass ? `(${this.subclass})` : ""}</span>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="right">
                        <div className="hd card miscStat">
                            <div className="title">Hit dice</div>
                            <div className="value">{this.hitDice}</div>
                        </div>
                        <button type="button" className='addTemp' onClick={() => this.onAddTempHpClicked()}>
                            <span className="text">Temp</span>
                            <span className="icon"><FiPlus size={24} /></span>
                            <span className="text">HP</span>
                        </button>
                        
                        {/* <HPControl hp={this.props.characterData.hps?.hp?.value} maxHp={this.props.characterData.hps?.hp?.max} updateHp={(newHp) => this.updateHp("hp", newHp)} /> */}
                        <HPControl hps={this.props.characterData.hps} updateHp={this.updateHp} removeTempHp={(id) => this.removeTempHp(id)} />
                    </div>
                </div>
                <div className="main">
                    <div className="col">
                        <div className="stats card">
                            <span className="title">Stats</span>
                            <div className="body">
                                {this.abilityScores.map(stat => {
                                    return (
                                        <div className="stat" key={stat.name}>
                                            <span className="name">{stat.name}</span>
                                            <span className="modifier">{this.plusify(stat.modifier)}</span>
                                            <span className="value">{stat.score}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="savingThrows card list">
                            <span className="title">Saving throws</span>
                            <div className="body">
                                {this.savingThrows.map(stat => {
                                    return (
                                        <div key={stat.name}>
                                            <span className="name">{stat.name}</span>
                                            <span className={stat.proficient ? "accent value" : "value"}>{this.plusify(stat.value)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="skills col card list">
                        <span className="title">Skills</span>
                        <div className="body">
                            {this.processedSkills.map(skill => {
                                return (
                                    <div key={skill.name}>
                                        <span className="name">{skill.name}</span>
                                        <span className={skill.proficient ? "accent value" : "value"}>{this.plusify(skill.modifier)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="misc col">
                        <div className="topRow">
                            <div className="ac card miscStat">
                                <div className="title">AC</div>
                                <div className="value">{this.ac}</div>
                            </div>
                            <div className="initiative card miscStat">
                                <div className="title">Initiative</div>
                                <div className="value">{this.plusify(this.initiative)}</div>
                            </div>
                            <div className="speed card miscStat">
                                <div className="title">Speed</div>
                                <div className="value">{this.speed}</div>
                            </div>
                            <div className="proficiency card miscStat">
                                <div className="title">Proficiency</div>
                                <div className="value">{this.plusify(this.proficiencyBonus)}</div>
                                <div className="title">Bonus</div>
                            </div>
                        </div>
                        <div className="miscTabs card tabbed">
                            <div className="navbar radioGroup">
                                {this.miscTabs.map(tab => {
                                    return <button type="button" key={tab} className={this.state.miscTab === tab ? 'checked' : ''} onClick={() => this.setState({ miscTab: tab })}>{tab}</button>
                                })}
                            </div>
                            <div className={"body " + this.state.miscTab}>
                                {this.miscTabBodies[this.state.miscTab]}
                            </div>
                        </div>
                    </div>
                    {/* <div className="feats col card">
                        <span className="title">Feats & Features</span>
                        <div className="body">
                            {this.processedFeats.map(feat => {
                                return (
                                    <div className='feat' key={feat.id}>
                                        <span className="name">{feat.name}</span>{feat.action != undefined && <span className="action">{feat.action.toUpperCase()}{feat.usage && `: ${feat.usage.toUpperCase()}`}</span>}
                                        <div className="description" dangerouslySetInnerHTML={{ __html: feat.description }}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div> */}
                </div>
                <Modal show={this.state.showModal} title="Add Temporary HP" positiveText="Add" negativeText="Cancel" onPositive={this.state.onModalPositive} onClose={() => {this.setState({showModal: false, modalText: {name:'',value:'0',max:''}})}}>
                    <div className="inputList">
                        <div className="inputWrapper">
                            <label htmlFor="name">Name</label>
                            <input type='text' name='name' placeholder='Temporary, Wild Shape...' value={this.state.modalText.name} onChange={this.onModalInputChange} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="value">Value</label>
                            <input type="number" name="value" placeholder='Current value' value={this.state.modalText.value} onChange={this.onModalInputChange} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="max">Maximum</label>
                            <input type="number" name="max" placeholder='Leave blank for no maximum' value={this.state.modalText.max} onChange={this.onModalInputChange} />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}