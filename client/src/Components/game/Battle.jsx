import * as React from 'react';
import DOMPurify from 'dompurify';
import { calculateStat } from '../lib/statUtils';
import { CLASSES, EVERYTHING } from '../lib/indexData';

export default class Battle extends React.Component {
    constructor(props) {
        super();
        this.props = props;

    }

    componentDidMount() {
        const toUpdate = {};
        if (this.props.characterData.hp === undefined) {
            toUpdate.hp = calculateStat("hp", this.props.characterData);
            this.props.updateCharacterData(toUpdate);
        }
        
    }

    insertStats(description = '') {
        //const statNames = [];

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

    render() {
        if (this.props.characterData.id === undefined) {
            return (<>No character selected</>)
        }

        // const stats = [{ name: "STR", value: 16, modifier: 3 }, { name: "DEX", value: 9, modifier: -1 }, { name: "CON", value: 15, modifier: 2 }, { name: "INT", value: 11, modifier: 0 }, { name: "WIS", value: 13, modifier: +1 }, { name: "CHA", value: 14, modifier: +2 }];

        const abilityScores = [];
        const savingThrows = [];
        const abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
        const abbreviations = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

        for (const i in abilities) {
            const ability = abilities[i].toLowerCase();
            const score = calculateStat(ability, this.props.characterData);
            const modifier = calculateStat(`${ability}:modifier`, this.props.characterData);
            abilityScores.push({
                name: abbreviations[i],
                score, modifier
            })

            savingThrows.push({
                name: abilities[i],
                value: modifier + calculateStat(`${ability}:proficiency`, this.props.characterData)
            })
        }

        const ac = calculateStat("ac", this.props.characterData);

        const characterClassID = this.props.characterData.grants?.find(grant => grant.type === 'Class')?.id;
        const characterClass = characterClassID ? CLASSES.find(c => c.id === characterClassID)?.name : undefined;

        // Feats and features
        const featsFeatureIDs = this.props.characterData.grants?.filter(grant => grant.type === 'Feat' || grant.type.includes('Feature')).map(g => g.id);
        const featsFeatures = EVERYTHING.filter(item => featsFeatureIDs?.includes(item.id) && !(item.sheet?.display == false));
        console.log(featsFeatureIDs, featsFeatures)
        const processedFeats = featsFeatures.map(feat => {
            const sanitisedDescription = DOMPurify.sanitize(feat.sheet?.description || feat.description, { USE_PROFILES: { html: true } });
            const descriptionWithStats = this.insertStats(sanitisedDescription);
            
            return {
                id: feat.id,
                name: feat.sheet?.alt || feat.name,
                description: descriptionWithStats,
                action: feat.sheet?.action,
                usage: feat.sheet?.usage
            }
        })

        // Internal stats that I assume we should have
        const proficiencyBonus = calculateStat("proficiency", this.props.characterData);
        const initiative = calculateStat("initiative", this.props.characterData);
        const speed = calculateStat("speed", this.props.characterData);
        const maxHp = calculateStat("hp", this.props.characterData);

        return (
           
                <div className="tab battle">
                    <div className="header">
                        <div className="details card">
                            <div className="body">
                                <span className="name">{this.props.characterData.name}</span>
                                <span className="details">Level {this.props.characterData.level || "unknown"} {characterClass || "Class unknown"}</span>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="right">
                            <div className="ac card miscStat">
                                <div className="title">AC</div>
                                <div className="value">{ac}</div>
                            </div>
                        </div>
                    </div>
                    <div className="main">
                        <div className="col">
                            <div className="stats card">
                                <span className="title">Stats</span>
                                <div className="body">
                                    {abilityScores.map(stat => {
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
                                    {savingThrows.map(stat => {
                                        return (
                                            <div key={stat.name}>
                                                <span className="name">{stat.name}</span>
                                                <span className="value">{this.plusify(stat.value)}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="skills col">
                            
                            <div className="skillsList card list">
                                <span className="title">Skills</span>
                            </div>
                        </div>
                        <div className="misc col">
                            <div className="topRow">
                                <div className="initiative card miscStat">
                                    <div className="title">Initiative</div>
                                    <div className="value">{this.plusify(initiative)}</div>
                                </div>
                                <div className="speed card miscStat">
                                    <div className="title">Speed</div>
                                    <div className="value">{speed}</div>
                                </div>
                                <div className="proficiency card miscStat">
                                    <div className="title">Proficiency</div>
                                    <div className="value">{this.plusify(proficiencyBonus)}</div>
                                    <div className="title">Bonus</div>
                                </div>
                            </div>
                            <div className="actions card"></div>
                        </div>
                        <div className="feats col card">
                            <span className="title">Feats & Features</span>
                            <div className="body">
                                {processedFeats.map(feat => {
                                    return (
                                        <div className='feat' key={feat.id}>
                                            <span className="name">{feat.name}</span>{feat.action != undefined && <span className="action">{feat.action.toUpperCase()}{feat.usage && `: ${feat.usage.toUpperCase()}`}</span>}
                                            <div className="description" dangerouslySetInnerHTML={{ __html: feat.description }}></div>
                                       </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
        ) 
    }
}