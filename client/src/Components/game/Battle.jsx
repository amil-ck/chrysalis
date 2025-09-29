import * as React from 'react';
import { calculateStat } from '../lib/statUtils';
import { CLASSES } from '../lib/indexData';

export default class Battle extends React.Component {
    constructor(props) {
        super();
        this.props = props;

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


        return (
           
                <div className="tab battle">
                    <div className="header">
                        <div className="details card">
                            <div className="body">
                                <span className="name">{this.props.characterData.name}</span>
                                <span className="details">Level {this.props.characterData.level || "unknown"} {characterClass || "Class unknown"}</span>
                            </div>
                        </div>
                        <div className="right">
                            <div className="ac card">
                                <span className="title">AC</span>
                                <div className="body">{ac}</div>
                            </div>
                        </div>
                    </div>
                    <div className="main">
                        <div className="stats col card">
                            <span className="title">Stats</span>
                            <div className="body">
                                {abilityScores.map(stat => {
                                    return (
                                        <div className="stat">
                                            <span className="name">{stat.name}</span>
                                            <span className="modifier">{stat.modifier >= 0 ? `+${stat.modifier}` : stat.modifier}</span>
                                            <span className="value">{stat.score}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="skills col">
                            <div className="savingThrows card list">
                                <span className="title">Saving throws</span>
                                <div className="body">
                                    {savingThrows.map(stat => {
                                        return (
                                            <div>
                                                <span className="name">{stat.name}</span>
                                                <span className="value">{stat.value >= 0 ? `+${stat.value}` : stat.value}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="skillsList card list">
                                <span className="title">Skills</span>
                            </div>
                        </div>
                        <div className="misc col">
                            <div className="topRow"></div>
                            <div className="actions card"></div>
                        </div>
                    </div>
                </div>

        )
    }
}