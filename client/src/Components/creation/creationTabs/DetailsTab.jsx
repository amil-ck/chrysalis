import * as React from 'react';

export default class DetailsTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            name: this.props.characterData.details?.name || '',
            backstory: this.props.characterData.details?.backstory || '',
            description: this.props.characterData.details?.description || '',
            namePlaceholder: this.placeholderName()
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
    }

    placeholderName() {
        const names = ["Rose Tyler", "Martha Jones", "Donna Noble", "Amy Pond", "Rory Williams", "Clara Oswald", "Bill Potts"];
        return names[Math.floor(Math.random() * names.length)];
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleInputBlur(e) {
        const updatedData = this.props.characterData;
        updatedData.details = {
            name: this.state.name,
            backstory: this.state.backstory,
            description: this.state.description
        }

        this.props.updateCharacterData(updatedData);
    }

    render() {

        return (
            <div className="tab">
                <div className="inputWrapper">
                    <label htmlFor="name">Character name</label>
                    <input type="text" name='name' placeholder={"e.g. " + this.state.namePlaceholder} value={this.state.name} onChange={this.handleChange} onBlur={this.handleInputBlur} />
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
        )
    }
}