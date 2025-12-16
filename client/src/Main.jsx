import * as React from 'react';
import CreationFlow from './Components/creation/CreationFlow.jsx';
import Home from './Components/home/Home.jsx';
import Reference from './Components/game/Reference.jsx';
import { doesCharacterExist, loadCharacter, saveCharacter } from './Components/lib/fileUtils.js';
import Modal from './Components/lib/Modal.jsx';
import Play from './Components/game/Play.jsx';
import { CLASSES } from './Components/lib/indexData.js';

export default class Main extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            page: 'home',
            characterData: {},
            creationData: {},
            subTab: '',
            modalOptions: {
                show: false
            },
            version: '0.1.2-alpha'
        }

        this.updateCharacterData = this.updateCharacterData.bind(this);
        this.handlePageNavigate = this.handlePageNavigate.bind(this);
        this.setCharacterData = this.setCharacterData.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async componentDidMount() {
        // Remember recent character
        if (this.state.characterData.id === undefined) {
            // No character selected
            const recentCharID = await window.appSettings.get("recentCharacterID");
            if (recentCharID && await doesCharacterExist(recentCharID)) {
                this.setState({
                    characterData: (await loadCharacter(recentCharID))
                })
            }
        }
    }

    async handlePageNavigate(page, subTab = '') {
        // save data
        if (this.state.characterData.id !== undefined) {
            await saveCharacter(this.state.characterData.id, this.state.characterData);
        }

        if (subTab.length > 0) {
            this.setState({
                page: page,
                subTab: subTab
            })
        } else {
            this.setState({
                page: page
            })
        }
    }

    handleSubNavigate(tab) {
        // save data

        this.setState({
            subTab: tab
        })
    }

    updateCharacterData(data) {
        const newData = { ...this.state.characterData, ...data };

        this.setState({
            characterData: newData
        }, () => {
            saveCharacter(this.state.characterData.id, newData).then(() => console.log("Character saved"))
        })
    }

    setCharacterData(data) {
        this.setState({
            characterData: data
        })
    }

    async openCharacter(id) {
        const newCharacterData = await loadCharacter(id);
        this.setState({
            characterData: newCharacterData
        })
    }

    openModal(type = 'default', title = 'Modal', body = <p>This is a modal</p>, positiveText = 'Okay', negativeText = 'Cancel', onPositive = () => { }, onNegative = () => { }) {
        this.setState({
            modalOptions: {
                show: true,
                title,
                body,
                positiveText,
                negativeText,
                onPositive,
                onNegative,
                close: this.closeModal
            }
        })
    }

    closeModal() {
        this.setState({
            modalOptions: {
                show: false
            }
        })
    }

    render() {

        const pages = {
            creation: CreationFlow,
            home: Home,
            play: Play,
            reference: Reference
        }

        const Page = pages[this.state.page];

        const characterClassID = this.state.characterData.grants?.find(grant => grant.type === 'Class')?.id;
        const characterClass = characterClassID ? CLASSES.find(c => c.id === characterClassID)?.name : undefined;

        return (
            <div id='root'>
                <Modal {...this.state.modalOptions} />
                <div className="appNavbar">
                    <div className="navButtons">
                        <button className={this.state.page === 'home' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('home')}>Home</button>
                        <button className={this.state.page === 'creation' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('creation')}>Create</button>
                        <button className={this.state.page === 'play' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('play')}>Play</button>
                        <button className={this.state.page === 'reference' ? 'current standalone' : 'standalone'} type="button" onClick={() => this.handlePageNavigate('reference')}>Reference</button>
                    </div>
                    <div className="characterDisplay">
                        {this.state.characterData.id !== undefined &&

                            <div className="info" onClick={() => console.log(this.state.characterData)}>
                                <span className="name">{this.state.characterData.name || "Unnamed"}</span>
                                <span className="details">Level {this.state.characterData.level || "unknown"} {characterClass || "Class unknown"}</span>
                            </div>

                        }
                        {this.state.characterData.id === undefined &&

                            <div className="info">
                                <span className="name">No character selected</span>
                                <span className="details">Create or select from the home page</span>
                            </div>

                        }
                        <div className="characterImg"></div>
                    </div>
                </div>
                <Page navigationTab={this.state.subTab} updateCharacterData={this.updateCharacterData} setCharacterData={this.setCharacterData} characterData={this.state.characterData} creationData={this.state.creationData} openModal={this.openModal} navigateToPage={this.handlePageNavigate} />
                <div className="version">Version: {this.state.version}</div>
            </div>
        )
    }
}