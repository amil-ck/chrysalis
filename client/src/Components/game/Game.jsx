import * as React from 'react';

export default class Game extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {}
    }

    render() {
        if (this.props.characterData.id === undefined) {
            return (<>No character selected</>)
        }

        const stats = [{name: "STR", value: 16, modifier: 3}, {name: "DEX", value: 9, modifier: -1}, {name: "CON", value: 15, modifier: 2}, {name: "INT", value: 11, modifier: 0}, {name: "WIS", value: 13, modifier: +1}, {name: "CHA", value: 14, modifier: +2}];

        return (
            <div className="play fullPane">
                <div className="tab battle">
                    <div className="header">
                        <div className="details card">
                            <div className="body">
                                <span className="name">{this.props.characterData.name}</span>
                                <span className="details">Level {this.props.characterData.level || "unknown"} {this.props.characterData.class || "Class unknown"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="main">
                        <div className="stats col card">
                            <span className="title">Stats</span>
                            <div className="body">
                                {stats.map(stat => {
                                    return (
                                        <div className="stat">
                                            <span className="name">{stat.name}</span>
                                            <span className="modifier">{stat.modifier >= 0 ? `+${stat.modifier}` : stat.modifier}</span>
                                            <span className="value">{stat.value}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="skills col">
                            <div className="savingThrows card">
                                <span className="title">Saving throws</span>
                            </div>
                            <div className="skillsList card">
                                <span className="title">Skills</span>
                            </div>
                        </div>
                        <div className="misc col">
                            <div className="topRow"></div>
                            <div className="actions card"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}