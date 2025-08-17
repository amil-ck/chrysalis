import * as React from 'react';
import CreationFlow from './Components/creation/CreationFlow.jsx';
import Home from './Components/home/Home.jsx';
import Game from './Components/game/Game.jsx';
import Reference from './Components/game/Reference.jsx';
import { loadCharacter, saveCharacter } from './Components/lib/fileUtils.js';
import Modal from './Components/lib/Modal.jsx';

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
            }
        }

        this.updateCharacterData = this.updateCharacterData.bind(this);
        this.handlePageNavigate = this.handlePageNavigate.bind(this);
        this.setCharacterData = this.setCharacterData.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    async handlePageNavigate(page, subTab='') {
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
        const newData = {...this.state.characterData, ...data};
        this.setState({
            characterData: newData
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

    openModal(type='default', title='Modal', body=<p>This is a modal</p>, positiveText='Okay', negativeText='Cancel', onPositive=()=>{}, onNegative=()=>{}) {
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
            game: Game,
            reference: Reference
        }

        const Page = pages[this.state.page];

        return (
            <div id='root'>
                <Modal {...this.state.modalOptions} />
                <div className="appNavbar">
                    <div className="navButtons">
                        <button className={this.state.page === 'home' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('home')}>Home</button>
                        <button className={this.state.page === 'creation' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('creation')}>Create</button>
                        <button className={this.state.page === 'game' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('game')}>Play</button>
                        <button className={this.state.page === 'reference' ? 'current standalone' : 'standalone'} type="button" onClick={() => this.handlePageNavigate('reference')}>Reference</button>
                    </div>
                    <div className="characterDisplay">
                        {this.state.characterData.id !== undefined && 
                        
                        <div className="info">
                            <span className="name">{this.state.characterData.name || "Unnamed"}</span>
                            <span className="details">Level {this.state.characterData.level || "unknown"} {this.state.characterData.class || "Class unknown"}</span>
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
            </div>
        )
    }
}