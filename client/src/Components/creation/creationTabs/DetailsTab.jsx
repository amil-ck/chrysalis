import * as React from 'react';

export default class DetailsTab extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            name: this.props.characterData.name || '',
            backstory: this.props.characterData.details?.backstory || '',
            description: this.props.characterData.details?.description || '',
            pronouns: this.props.characterData.details?.pronouns || '',
            namePlaceholder: this.placeholderName()
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleInputBlur = this.handleInputBlur.bind(this);
        this.handleLevelChange = this.handleLevelChange.bind(this);
    }

    placeholderName() {
        const names = ["Rose Tyler", "Martha Jones", "Donna Noble", "Amy Pond", "Rory Williams", "Clara Oswald", "Bill Potts", "Bernie Sanders", "Walter Cronkite", "b’Ang’r’Ang"];
        return names[Math.floor(Math.random() * names.length)];
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleInputBlur(e) {
        this.props.updateCharacterData({
            name: this.state.name,
            details: {
                backstory: this.state.backstory,
                description: this.state.description,
                pronouns: this.state.pronouns
            }
        });
    }

    handleLevelChange(level) {
        this.props.updateCharacterData({
            level: level
        });
    }

    render() {

        return (
            <div className="tab">
                <div className="main">
                    <div className="inputList">
                        <div className="inputWrapper">
                            <label htmlFor="name">Character name</label>
                            <input type="text" name='name' placeholder={"e.g. " + this.state.namePlaceholder} value={this.state.name} onChange={this.handleChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="pronouns">Character pronouns</label>
                            <input type="text" name="pronouns" placeholder={"e.g. they/she"} value={this.state.pronouns} onChange={this.handleChange} onBlur={this.handleInputBlur} />
                        </div>
                        <div className="inputWrapper">
                            <label htmlFor="level">Level</label>
                            <div className="radioGroup">
                                {[ ...Array(20).keys() ].map(i => {
                                    return <button type='button' onClick={() => this.handleLevelChange(i+1)} className={this.props.characterData.level == i+1 ? "checked" : ""}>{i+1}</button>
                                })}
                            </div>
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
                </div>
            </div>
        )
    }
}