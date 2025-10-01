import * as React from "react";

export default class Inventory extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            tempInventoryString: this.props.characterData.tempInventoryString || ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    handleChange(e) {
        this.setState({
            tempInventoryString: e.target.value
        })
    }

    handleInputBlur() {
        this.props.updateCharacterData({
            tempInventoryString: this.state.tempInventoryString
        })
    }

    render() {

        return (
            <div className="tab inventory">
                <div className="main">
                    <div className="inputList">
                        <div className="inputWrapper">
                            <label htmlFor="inventory">Inventory (temporary)</label>
                            <textarea name="inventory" placeholder='que tienes muchacha' rows={15} cols={75} value={this.state.tempInventoryString} onChange={this.handleChange} onBlur={this.handleInputBlur} ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}