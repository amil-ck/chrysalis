import * as React from 'react';
import { FiPlus, FiMinus } from "react-icons/fi";

export default class HPControl extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            changeValue: '1',
            tempChangeValues: {}
        }

        this.handleChange = this.handleChange.bind(this);
    }


    componentDidUpdate(prevProps) {
        if (this.props.hp !== prevProps.hp) {
            // hp has changed
            this.setState({
                changeValue: '1'
            })
        }
    }

    addHp(name = 'hp') {
        this.props.updateHp(this.props.hp + Number(this.state.changeValue));
    }

    subtractHp(name = 'hp') {
        this.props.updateHp(this.props.hp - Number(this.state.changeValue))
    }

    handleChange(e) {
        if (e.target.value === "" || !isNaN(Number(e.target.value))) {
            // Valid value
            this.setState({
                changeValue: e.target.value
            })
        }
    }

    handleBlur() {
        if (this.state.changeValue === '') {
            this.setState({
                changeValue: '1'
            })
        }
    }

    render() {

        return (
            <>
                {this.props.temporaries?.map(t => (
                    <div className="hp card">
                        <div className="change">
                            <button type="button" onClick={() => this.addHp(t.name)}><FiPlus /></button>
                            <input type="text" name={t.name} value={this.state.changeValue} onChange={this.handleChange} onBlur={() => this.handleBlur()} />
                            <button type="button" onClick={() => this.subtractHp(t.name)}><FiMinus /></button>
                        </div>
                        <div className="display miscStat">
                            <div className="title">HP</div>
                            <div className="value">
                                <span className="current">{this.props.hp}</span>
                                <span className="max">/ {this.props.maxHp}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="hp card">
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
                </div>
            </>
        )
    }
}