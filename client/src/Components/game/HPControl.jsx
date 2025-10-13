import * as React from 'react';
import { FiPlus, FiMinus } from "react-icons/fi";

export default class HPControl extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        // props: hps: a dict of different hp values, e.g. {temp: {name: str, value, number, max, number}}

        this.state = {
            changeValues: {}
        }

        // TODO: make changevalues initialise to 1 for each hp

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }


    componentDidUpdate(prevProps) {
        console.log("hp state", this.state)
        // if (this.props.hp !== prevProps.hp) {
        //     // hp has changed
        //     this.setState({
        //         changeValue: '1'
        //     })
        // }

        // TODO: convert commented code into new system
    }

    addHp(id = 'hp') {
        console.log(id, this.state.changeValues[id]);
        let toAdd = Number(this.state.changeValues[id]);
        if (isNaN(toAdd)) toAdd = 0;
        this.props.updateHp(id, this.props.hps[id].value + toAdd);
    }

    subtractHp(id = 'hp') {
        let toSub = Number(this.state.changeValues[id]);
        if (isNaN(toSub)) toSub = 0;
        this.props.updateHp(id, this.props.hps[id].value - toSub)
    }

    handleChange(e) {
        console.log(e.target.name, e.target.value)
        if (e.target.value === "" || !isNaN(Number(e.target.value))) {
            // Valid value
            this.setState({
                changeValues: {...this.state.changeValues, [e.target.name]: e.target.value}
            })
        }
    }

    handleBlur(e) {
        if (this.state.changeValues[e.target.name] === '') {
            this.setState({
                changeValues: {...this.state.changeValues, [e.target.name]: 1}
            })
        }
    }

    render() {

        const hpArray = Object.keys(this.props.hps || {}).map(id => {return {...this.props.hps[id], id: id}});

        return (
            <>
                {hpArray.map(t => (
                    <div className={t.id === "hp" ? "hp card base" : "hp card"}>
                        <div className="change">
                            <button type="button" onClick={() => this.addHp(t.id)}><FiPlus /></button>
                            <input type="text" name={t.id} value={this.state.changeValues[t.id] === undefined ? 1 : this.state.changeValues[t.id]} onChange={this.handleChange} onBlur={this.handleBlur} />
                            <button type="button" onClick={() => this.subtractHp(t.id)}><FiMinus /></button>
                        </div>
                        <div className="display miscStat">
                            <div className="title">{t.name}</div>
                            <div className="value">
                                <span className="current">{t.value}</span>
                                <span className="max">/ {t.max}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {/* <div className="hp card">
                    <div className="change">
                        <button type="button" onClick={() => this.addHp()}><FiPlus /></button>
                        <input type="text" name="hp" value={this.state.changeValue} onChange={this.handleChange} onBlur={() => this.handleBlur()} />
                        <button type="button" onClick={() => this.subtractHp()}><FiMinus /></button>
                    </div>
                    <div className="display miscStat">
                        <div className="title">HP</div>
                        <div className="value">
                            <span className="current">{this.props.hp}</span>
                            <span className="max">/ {this.props.maxHp}</span>
                        </div>
                    </div>
                </div> */}
            </>
        )
    }
}