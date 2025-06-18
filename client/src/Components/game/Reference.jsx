import * as React from 'react';
import Chip from '../lib/Chip.jsx';
import ClassList from '../lib/listTypes/ClassList.jsx';
import GenericList from '../lib/GenericList.jsx';
import FeatList from '../lib/listTypes/FeatList.jsx';
import { BACKGROUNDS, CLASSES, FEATS, LANGUAGES, RACES, SPELLS } from '../lib/indexData.js';
import SpellList from '../lib/listTypes/SpellList.jsx';

export default class Reference extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            characterData: {},
            currentCategory: 'Spells',
            searchValue: '',
            searchCategory: undefined
        }
    }

    render() {
        const categories = ['Races', 'Classes', 'Subclasses', 'Class Features', 'Archetypes', 'Archetype Features'];

        const lists = {
            "Classes": ClassList,
            "Feats": FeatList,
            "Spells": SpellList
        }

        const data = {
            "Races": RACES,
            "Backgrounds": BACKGROUNDS,
            "Languages": LANGUAGES,
        }

        let CurrentList = lists[this.state.currentCategory];
        let listData;
        if (!CurrentList) {
            CurrentList = GenericList;
            listData = data[CurrentList]
        }


        return (
            <div className="tab reference">
                <div className="main">
                    <div className="searchRow">
                        <label htmlFor="search">Search</label>
                        <div className="searchWrapper">
                            {this.state.searchCategory !== undefined && <Chip className="filterChip" text={this.state.searchCategory} />}

                            <input type='search' name='search' value={this.state.searchValue} onChange={(e) => this.setState({searchValue: e.target.value})} />
                        </div>
                    </div>
                    <div className="categoryRow">
                        <button className={this.state.currentCategory === 'Spells' ? 'current' : ''} type="button" onClick={() => this.setState({currentCategory: 'Spells'})}>Spells</button>
                        <button className={this.state.currentCategory === 'Equipment' ? 'current' : ''} type="button" onClick={() => this.setState({currentCategory: 'Equipment'})}>Equipment</button>
                        <select value={this.state.currentCategory} onChange={(e) => this.setState({currentCategory: e.target.value})}>
                            <option value={undefined}>Other</option>
                        </select>
                    </div>
                    <div className="compatibleRow"></div>
                    <div className="listWrapper">
                        <CurrentList title={''} allowSearch={[]}  onItemSelected={() => {}} />
                    </div>
                </div>
            </div>
        )
    }
}