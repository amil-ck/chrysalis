import * as React from 'react';
import CreationFlow from './Components/creation/CreationFlow.jsx';
import Home from './Components/home/Home.jsx';
import Game from './Components/game/Game.jsx';
import Reference from './Components/game/Reference.jsx';

export default class Main extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            page: 'creation'
        }
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
                        <button className={this.state.page === 'home' ? 'current' : ''} type="button" onClick={() => this.setState({page: 'home'})}>Home</button>
                        <button className={this.state.page === 'creation' ? 'current' : ''} type="button" onClick={() => this.setState({page: 'creation'})}>Create</button>
                        <button className={this.state.page === 'game' ? 'current' : ''} type="button" onClick={() => this.setState({page: 'game'})}>Play</button>
                        <button className={this.state.page === 'reference' ? 'current' : ''} type="button" onClick={() => this.setState({page: 'reference'})}>Reference</button>
                    </div>
                    <div className="characterDisplay">
                        <div className="info" onClick={() => this.setState({page: 'game'})}>
                            <span className="name">(Dead) Sophie</span>
                            <span className="details">Level 7 Barbarian</span>
                        </div>
                        <div className="characterImg"></div>
                    </div>
                </div>
                <Page />
            </div>
        )
    }
}