import * as React from 'react';

export default class AbilityScores extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            choice: "Standard Array",
            std_array: [8, 10, 12, 13, 14, 15],
            std_dict: {
                "strength": null,
                "dexterity": null,
                "constituion": null,
                "intelligence": null,
                "wisdom": null,
                "charisma": null
            },
            avail_array: [8, 10, 12, 13, 14, 15],
            
            
            points: 27,
            buyArray: {
                "strength": 8,
                "dexterity": 8,
                "constituion": 8,
                "intelligence": 8,
                "wisdom": 8,
                "charisma": 8
            }

        }

        this.stdDropdown = this.stdDropdown.bind(this);

    }

    render() {
        console.log(this.state.std_dict);

        return (
            // <GenericList data={this.state.spellData} columns={["name", "source"]} />
            <>
            <select onChange={e => this.setState({choice: e.target.value})} name='choice'>
                <option value={"Standard Array"}>Standard Array</option>
                <option value={"Roll / Manual Entry"}>Roll / Manual Entry</option>
                <option value={"Point Buy"}>Point Buy</option>
            </select>

            {(this.state.choice === "Standard Array") && this.standardArray()}
            {(this.state.choice === "Roll / Manual Entry") && this.manualEntry()}
            {(this.state.choice === "Point Buy") && this.pointBuy()}
            </>
        );
    }

    standardArray() {
        var dropdownArray = [];
        for (var stat in this.state.std_dict) {
            dropdownArray.push(this.stdDropdown(stat));
        }
        return dropdownArray;
    }

    stdDropdown(stat) {
        var avail_array2 = [...this.state.avail_array];
        if (!(this.state.std_dict[stat] === null)) avail_array2.push(this.state.std_dict[stat]);
        avail_array2.sort(function(a, b){return a-b});

        var options = avail_array2.map(
            e => <option value={e}>{e}</option>
        )

        return (
            <select value={this.state.std_dict[stat]} onChange={e => this.assign(stat, e.target.value)}>
                <option value={"-"}>-</option>
                {options}
            </select>
        )
    }

    assign(stat, value) {
        if (value === "-") {
            value = null
        }
        else {
            value = parseInt(value)
        }

        var new_std_dict = this.state.std_dict
        new_std_dict[stat] = value;
        this.setState({std_dict: new_std_dict})

        var new_arr = [...this.state.std_array];
        for (var key in this.state.std_dict) {
            if (!(new_arr.indexOf(this.state.std_dict[key]) === -1)) {
                new_arr.splice(new_arr.indexOf(this.state.std_dict[key]), 1);
            }
        }
        this.setState({avail_array: new_arr});

        console.log(new_arr);
    }

    manualEntry() {
        var manualArray = [];
        for (var stat in this.state.std_dict) {
            manualArray.push(
                <div>
                {stat} <input type='number' max={18}></input>
                </div>
            );
        }
        return manualArray;
    }

    pointBuy() {
        var pointArray = [<div>Points: {this.state.points}/27</div>];
        for (const stat in this.state.buyArray) {
            pointArray.push(
                <div>
                {stat} {this.state.buyArray[stat]}
                <button onClick={e => this.changePoint(stat, 1)}>up</button>
                <button onClick={e => this.changePoint(stat, -1)}>down</button>
                </div>
            );
        }
        
        return pointArray;
    }

    changePoint(stat, amount) {
        let new_dict = {...this.state.buyArray};
        let new_points = this.state.points;

        if ((new_dict[stat] >= 13 && amount > 0) || (new_dict[stat] >= 14 && amount< 0)) {
            new_points -= amount * 2;
        } else {
            new_points -= amount;
        }

        new_dict[stat] = new_dict[stat] + amount;

        if (new_dict[stat] >= 8 && new_dict[stat] <= 15 && new_points >= 0) {
            this.setState({buyArray: new_dict});
            this.setState({points: new_points});
        }
    }

}