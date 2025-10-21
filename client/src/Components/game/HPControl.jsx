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
        for (const i in this.props.hps) {
            this.state.changeValues[i] = 1;
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }


    componentDidUpdate(prevProps) {
        console.log("hp state", this.state)

        if (this.props.hps !== prevProps.hps) {
            const toUpdate = { changeValues: {} };
            for (const i in this.props.hps) {
                toUpdate.changeValues[i] = 1;
            }
            this.setState({
                ...toUpdate
            })
        }
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
                changeValues: { ...this.state.changeValues, [e.target.name]: e.target.value }
            })
        }
    }

    handleBlur(e) {
        if (this.state.changeValues[e.target.name] === '') {
            this.setState({
                changeValues: { ...this.state.changeValues, [e.target.name]: 1 }
            })
        }
    }

    render() {

        const hpArray = Object.keys(this.props.hps || {}).map(id => {
            if (this.props.hps[id] && this.props.hps[id].name !== undefined) return { ...this.props.hps[id], id: id }
        });

        console.log(hpArray)

        return (
            <div className='hps'>
                {hpArray.map(t => 
                    {if (t && t.id) return (
                        

                            <div key={t.id} className={t.id === "hp" ? "hp card base" : "hp card"}>
                                <div className="change">
                                    <button type="button" onClick={() => this.addHp(t.id)}><FiPlus /></button>
                                    <input type="text" name={t.id} value={this.state.changeValues[t.id]} onChange={this.handleChange} onBlur={this.handleBlur} />
                                    <button type="button" onClick={() => this.subtractHp(t.id)}><FiMinus /></button>
                                </div>
                                <div className="display miscStat">
                                    <div className="title">{t.name}</div>
                                    <div className="value">
                                        <span className="current">{t.value}</span>
                                        {t.max > -1 && <span className="max">/ {t.max}</span>}
                                    </div>
                                    {t.id !== "hp" &&

                                        <button type="button" onClick={() => this.props.removeTempHp(t.id)}>x</button>

                                    }
                                </div>
                            </div>

                    )}
                )}
            </div> 
        )
    }
}