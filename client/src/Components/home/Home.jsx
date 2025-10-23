import * as React from 'react';
import { createCharacter, deleteCharacter, exportCharacter, importCharacter, importContent, loadAllCharacters, loadCharacter } from '../lib/fileUtils.js';
import GenericInfoPane from '../lib/GenericInfoPane.jsx';
import { FaGithub } from 'react-icons/fa';
import { FiUpload, FiTrash2, FiPlus, FiRefreshCw } from 'react-icons/fi';

export default class Home extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            characters: [],
            currentInfoPaneData: undefined,
            contentFileList: []
        }

        this.onNewCharacterClick = this.onNewCharacterClick.bind(this);
        this.onCharacterClick = this.onCharacterClick.bind(this);
        this.onImportCharacterClick = this.onImportCharacterClick.bind(this);
        this.onExportCharacterClick = this.onExportCharacterClick.bind(this);
        this.onDeleteCharacterClick = this.onDeleteCharacterClick.bind(this);
        this.onDeleteCharacterConfirm = this.onDeleteCharacterConfirm.bind(this);
        this.onImportContentClick = this.onImportContentClick.bind(this);
        this.onRefreshContentClick = this.onRefreshContentClick.bind(this);

        this.contentFilePath = '';
    }

    async componentDidMount() {
        const characters = await loadAllCharacters();
        this.contentFilePath = `${await window.electronAPI.getDataPath()}/content_files/`.replaceAll("\\", "/");
        this.onRefreshContentClick();
        this.setState({ characters: characters });
    }

    async componentDidUpdate(prevProps) {
        if (this.props === prevProps) {
            return;
        }

        // Props have changed
        // Load characters
        const characters = await loadAllCharacters();
        this.setState({ characters: characters });
    }

    async onNewCharacterClick() {
        // Create character
        const id = await createCharacter();

        // Update current character data
        await window.appSettings.set("recentCharacterID", id);
        this.props.setCharacterData(await loadCharacter(id));
        this.props.navigateToPage("creation");
    }

    async onImportCharacterClick() {
        const character = await importCharacter();
        if (character) {
            await window.appSettings.set("recentCharacterID", character.id);
            this.props.setCharacterData(character);
        }
    }

    async onCharacterClick(id) {
        const characterData = await loadCharacter(id);
        await window.appSettings.set("recentCharacterID", id);
        this.props.setCharacterData(characterData);
    }

    async onExportCharacterClick(e, id) {
        e.stopPropagation();

        await exportCharacter(id);
    }

    onDeleteCharacterClick(e, id) {
        e.stopPropagation();
        const character = this.state.characters.find(char => char.id === id);
        this.props.openModal('confirm',
            'Delete character',
            `Are you sure? '${character.name}' will be deleted permanently.`,
            'Delete Character',
            'Cancel',
            () => this.onDeleteCharacterConfirm(id)
        );
    }

    async onDeleteCharacterConfirm(id) {
        console.log("todo: delete character");

        setTimeout(async () => { // Timeout avoids re-rendering clash
            await deleteCharacter(id);
            this.setState({
                characters: await loadAllCharacters()
            })
        }, 200)
    }

    async onImportContentClick() {
        const fileName = await importContent();
        console.log(fileName);
        this.onRefreshContentClick();
    }

    async onRefreshContentClick() {
        const fileList = await window.electronAPI.readdir(this.contentFilePath);
        this.setState({
            contentFileList: fileList
        })
    }

    render() {

        return (
            <div className="home fullPane">
                <div className="leftPanel">
                    <div className="titleWrapper">
                        <span className="title">Chrysalis</span>
                        <span className="subtitle">Character Creator</span>
                    </div>
                    <hr />
                    <div className="buttonList">
                        <button type='button' onClick={this.onNewCharacterClick}>New Character</button>
                        <button type="button" onClick={this.onImportCharacterClick}>Import Character</button>
                        <button type="button">Exit</button>
                    </div>
                    <div className="spacer"></div>
                    <div className="footer">
                        <div className="iconLinks">
                            <button type='button' title='View source' className="externalLink" onClick={() => window.electronAPI.openExternal("https://github.com/amil-ck/chrysalis")}>
                                <FaGithub title='Open on Github' />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mainPanel">
                    <div className="titleWrapper">
                        <span className="title">Your characters</span>
                    </div>
                    <div className="characterList">
                        {this.state.characters.map(char => {
                            return (
                                <div role={'button'} key={char.id} className={char.id === this.props.characterData.id ? "character current" : "character"} onClick={() => this.onCharacterClick(char.id)}>
                                    <span className="name">{char.name || "Unnamed character"}</span>
                                    <span className="id">{char.id}</span>

                                    <span className="actions">
                                        <button type="button" onClick={(e) => this.onExportCharacterClick(e, char.id)} className='square' title={'Export character'}><FiUpload size={18} /></button>
                                        <button type="button" onClick={(e) => this.onDeleteCharacterClick(e, char.id)} className='square' title='Delete character'><FiTrash2 size={18} /></button>
                                    </span>
                                </div>)
                        })}
                    </div>
                    <div className="titleWrapper files">
                        <span className="title">
                            Content files
                            
                            <div className="divider"></div>
                            <button type="button" onClick={this.onImportContentClick}><FiPlus size={18} /></button>
                            <button type="button" onClick={this.onRefreshContentClick}><FiRefreshCw size={18} /></button>

                        </span>
                        <span className="path subtitle">Path: {this.contentFilePath}</span>

                    </div>
                    <div className="fileList characterList">
                        {this.state.contentFileList.map(fileName => (
                            <div key={fileName} className='character'>
                                <span className="name">{fileName}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <GenericInfoPane data={this.state.currentInfoPaneData} />
            </div>
        )
    }
}