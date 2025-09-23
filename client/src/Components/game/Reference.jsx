import * as React from 'react';
import Chip from '../lib/Chip.jsx';
import ClassList from '../lib/listTypes/ClassList.jsx';
import GenericList from '../lib/GenericList.jsx';
import FeatList from '../lib/listTypes/FeatList.jsx';
import { ARCHETYPE_FEATURES, ARCHETYPES, BACKGROUNDS, CLASS_FEATURES, CLASSES, EVERYTHING, FEATS, LANGUAGES, RACES, SPELLS } from '../lib/indexData.js';
import SpellList from '../lib/listTypes/SpellList.jsx';
import ChrysalisInfoPane from '../lib/ChrysalisInfoPane.jsx';
import RaceList from '../lib/listTypes/RaceList.jsx';
import LanguageList from '../lib/listTypes/LanguageList.jsx';
import FloatingSearchResults from '../lib/FloatingSearchResults.jsx';
import BackgroundList from '../lib/listTypes/BackgroundList.jsx';
import FeaturesList from '../lib/listTypes/FeaturesList.jsx';

export default class Reference extends React.Component {
    constructor(props) {
        super();
        this.props = props;

        this.state = {
            characterData: {},
            currentCategory: 'Spells',
            searchValue: '',
            searchCategory: 'Search all',
            searchResults: [],
            showSearchResults: true,
            selectedItemData: undefined,
            selectedItemID: ''
        }

        this.globalSearchRef = React.createRef();

        this.categoryData = {
            "Races": RACES,
            "Classes": CLASSES,
            "Archetypes": ARCHETYPES,
            "Class Features": CLASS_FEATURES,
            "Archetype Features": ARCHETYPE_FEATURES,
            "Feats": FEATS,
            "Spells": SPELLS,
            "Backgrounds": BACKGROUNDS,
            "Languages": LANGUAGES,
        }

        // Collate all data for searching
        this.allData = EVERYTHING;

        this.onItemSelected = this.onItemSelected.bind(this);
        this.onInfoPaneClose = this.onInfoPaneClose.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchResultClick = this.onSearchResultClick.bind(this);
        this.onSearchBlur = this.onSearchBlur.bind(this);
    }

    componentDidMount() {
        this.globalSearchRef.current.focus();
    }

    onItemSelected(id) {
        const itemData = this.categoryData[this.state.currentCategory].find(i => i.id === id);
        this.setState({
            selectedItemData: itemData,
            selectedItemID: id
        });
    }

    onInfoPaneClose() {
        this.setState({
            selectedItemData: undefined,
            selectedItemID: ''
        })
    }

    onSearchChange(e) {
        const value = e.target.value;

        if (value.length === 0) {
            return this.setState({
                searchValue: value,
                searchResults: [],
                showSearchResults: false
            });
        }

        // SEARCH EVERYTHING?!
        const filtered = this.allData.filter(i => {
            return i && i.name && i.name.toLowerCase().includes(value.toLowerCase().trim());
        })

        const results = [];
        const ids = []; // to prevent duplicates
        for (const o of filtered) {
            if (!ids.includes(o.id)) {
                results.push({
                    title: o.name,
                    id: o.id,
                    subtitle: o.type
                });
                ids.push(o.id);
            }
        }
        
        this.setState({
            searchValue: value,
            searchResults: results,
            showSearchResults: true
        });
    }

    onSearchResultClick(e, id) {
        e.preventDefault();
        console.log('runs')
        const itemData = EVERYTHING.find(i => i.id === id);
        this.setState({
            selectedItemData: itemData,
            selectedItemID: id,
            showSearchResults: false
        });
    }

    onSearchBlur(e) {
        if (e.relatedTarget && e.relatedTarget.classList.contains("result")) {

        } else {
            this.setState({
                showSearchResults: false
            })
        }
    }

    render() {
        const categories = ['Races', 'Classes', 'Archetypes', 'Class Features', 'Archetype Features', 'Backgrounds', 'Feats', 'Languages'];

        const lists = {
            "Classes": (props) => <ClassList data={CLASSES} {...props} />,
            "Archetypes": (props) => <ClassList data={ARCHETYPES} {...props} />,
            "Class Features": (props) => <FeaturesList data={CLASS_FEATURES} {...props} />,
            "Archetype Features": (props) => <FeaturesList data={ARCHETYPE_FEATURES} {...props} />,
            "Feats": FeatList,
            "Spells": SpellList,
            "Races": RaceList,
            "Languages": LanguageList,
            "Backgrounds": BackgroundList
        }

        let CurrentList = lists[this.state.currentCategory];
        const listProps = {
            title: '',
            allowSearch: ["Name"],
            onItemSelected: this.onItemSelected,
            onItemDoubleSelected: () => { },
            selectedItemID: this.state.selectedItemID
        };
        if (!CurrentList) {
            CurrentList = GenericList;
            listProps.data = this.categoryData[this.state.currentCategory]
            listProps.allowFilter = [];
        }

        return (
            <div className="tab reference">
                <div className="main">
                    <div className="searchRow">
                        
                        <div className="searchWrapper">
                            {/* {this.state.searchCategory !== undefined && <Chip className="filterChip" text={this.state.searchCategory} />} */}

                            <label htmlFor="search">Search everything</label>
                            <input type='search' name='search' placeholder='e.g. Druid, Spare the Dying...' ref={this.globalSearchRef} value={this.state.searchValue} onChange={this.onSearchChange} onFocus={() => this.setState({showSearchResults: true})} onBlur={this.onSearchBlur} />

                            <FloatingSearchResults showResults={this.state.showSearchResults} results={this.state.searchResults} onResultClick={this.onSearchResultClick} />
                        
                        </div>
                        <span className="or">Or, browse by category:</span>
                    </div>
                    <div className="categoryRow">
                        <button className={this.state.currentCategory === 'Spells' ? 'current' : ''} type="button" onClick={() => this.setState({ currentCategory: 'Spells' })}>Spells</button>
                        <button className={this.state.currentCategory === 'Equipment' ? 'current' : ''} type="button" onClick={() => this.setState({ currentCategory: 'Equipment' })}>Equipment</button>
                        <select className={['Spells', 'Equipment'].includes(this.state.currentCategory) ? '' : 'current'} value={this.state.currentCategory} onChange={(e) => this.setState({ currentCategory: e.target.value !== 'none' ? e.target.value : 'Spells' })}>
                            <option value={'none'}>More categories</option>
                            {categories.map((e) => {
                                return <option value={e}>{e}</option>
                            })}
                        </select>
                    </div>
                    {/* <div className="compatibleRow">
                        Only show options compatible with [character]?
                    </div> */}
                    <div className="listWrapper">
                        <CurrentList {...listProps} />
                    </div>
                </div>
                <ChrysalisInfoPane data={this.state.selectedItemData} onClose={this.onInfoPaneClose} />
            </div>
        )
    }
}