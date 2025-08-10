import * as React from 'react';
import CreationFlow from './Components/creation/CreationFlow.jsx';
import Home from './Components/home/Home.jsx';
import Game from './Components/game/Game.jsx';
import Reference from './Components/game/Reference.jsx';
import { loadCharacter } from './Components/lib/fileUtils.js';

export default class Main extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            page: 'home',
            characterData: {},
            creationData: {},
            subTab: ''
        }

        this.updateCharacterData = this.updateCharacterData.bind(this);
    }

    handlePageNavigate(page) {
        // save data

        this.setState({
            page: page
        })
    }

    handleSubNavigate(tab) {
        // save data

        this.setState({
            subTab: tab
        })
    }

    updateCharacterData(data) {
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
                <div className="appNavbar">
                    <div className="navButtons">
                        <button className={this.state.page === 'home' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('home')}>Home</button>
                        <button className={this.state.page === 'creation' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('creation')}>Create</button>
                        <button className={this.state.page === 'game' ? 'current' : ''} type="button" onClick={() => this.handlePageNavigate('game')}>Play</button>
                        <button className={this.state.page === 'reference' ? 'current standalone' : 'standalone'} type="button" onClick={() => this.handlePageNavigate('reference')}>Reference</button>
                    </div>
                    <div className="characterDisplay">
                        <div className="info" onClick={() => this.setState({page: 'game'})}>
                            <span className="name">(Dead) Sophie</span>
                            <span className="details">Level 7 Barbarian</span>
                        </div>
                        <div className="characterImg"></div>
                    </div>
                </div>
                <Page navigationTab={this.state.subTab} updateCharacterData={this.updateCharacterData} characterData={this.state.characterData} creationData={this.state.creationData} />
            </div>
        )
    }
}