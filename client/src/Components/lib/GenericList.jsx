import * as React from 'react';
import Chip from './Chip.jsx';

export default class GenericList extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            minimised: props.startMinimised || false,
            columnFilters: props.presetFilters || {},
            addingFilter: false,
            newFilterColumn: undefined,
            newFilterValue: undefined,
            sortBy: {
                column: undefined,
                direction: undefined
            },
            showSearch: false,
            searchValue: '',
            oldDoubleSelected: []
        }

        // PROPS: 
        // title (string), data (obj[]), columnNames (string[]), columnLocations (string[]), shownColumns (string[]), 
        // onItemSelected (function(string id)), onItemDoubleSelected (function(string id)), 
        // selectedItemID (string), doubleSelectedItems (string[]), startMinimised (bool), 
        // allowFilter (string[]), presetFilters (obj), multiValueColumns (string[]), doubleSelectOnSingleClick (bool)
        // maxDoubleSelected: number

        this.handleItemClick = this.handleItemClick.bind(this);
        this.toggleMinimised = this.toggleMinimised.bind(this);
        this.onAddFilterButtonClick = this.onAddFilterButtonClick.bind(this);
        this.onCancelFilterButtonClick = this.onCancelFilterButtonClick.bind(this);
        this.onNewFilterColumnChange = this.onNewFilterColumnChange.bind(this);
        this.onNewFilterValueChange = this.onNewFilterValueChange.bind(this);
        this.onRemoveFilter = this.onRemoveFilter.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.toggleSearch = this.toggleSearch.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    // When a list item has been clicked
    handleItemClick(e, id) {
        e.preventDefault();
        e.stopPropagation();
        if (e.detail > 1 || this.props.doubleSelectOnSingleClick) {
            // Double click, or parent has set that items should be double-selected on a single click
            this.props.onItemDoubleSelected(id);
        } else {
            // Single click
            this.props.onItemSelected(id);
        }
    }

    // When the maximise/minimise button has been clicked
    toggleMinimised() {
        this.setState({
            minimised: !this.state.minimised
        });
    }

    // When a column filter dropdown has changed
    onFilterChange(column, value) {
        this.setState({
            columnFilters: {
                ...this.state.columnFilters,
                [column]: (value === "remove" ? undefined : value)
            }
        })
    }

    // When a user has clicked to add a custom filter
    onAddFilterButtonClick() {
        this.setState({
            addingFilter: true
        })
    }

    onCancelFilterButtonClick() {
        this.setState({
            addingFilter: false
        })
    }

    onNewFilterColumnChange(value) {
        this.setState({
            newFilterColumn: value
        });
    }

    onNewFilterValueChange(value) {
        const column = this.state.newFilterColumn;

        this.setState({
            columnFilters: {
                ...this.state.columnFilters,
                [column]: value
            },
            newFilterColumn: undefined,
            newFilterValue: undefined,
            addingFilter: false
        });
    }

    onRemoveFilter(column) {
        this.setState({
            columnFilters: {
                ...this.state.columnFilters,
                [column]: undefined
            }
        })
    }

    // When a column header is clicked
    onSortChange(column) {
        // Sort toggle order: ascending -> descending -> none
        if (this.state.sortBy.column === column) {

            if (this.state.sortBy.direction === 'asc') {
                // Currently sorting by the column in ascending order, switch to ascending
                this.setState({
                    sortBy: {
                        column: column,
                        direction: 'desc'
                    }
                })
            } else {
                // Currently sorting by the column in descending order, remove sort entirely
                this.setState({
                    sortBy: {
                        column: undefined,
                        direction: undefined
                    }
                })
            }

        } else {
            // Currently not sorting by anything, or sorting by a different column, add ascending sort
            this.setState({
                sortBy: {
                    column: column,
                    direction: 'asc'
                }
            });
        }
    }

    // When search button clicked, hide or show the search bar
    toggleSearch() {
        if (this.state.showSearch) {
            this.setState({
                showSearch: false,
                searchValue: ''
            })
        } else {
            this.setState({
                showSearch: true
            })
        }
    }

    onSearchChange(e) {
        this.setState({
            searchValue: e.target.value
        })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('update')
        if (prevProps !== this.props) {
            // Props have changed

            if (this.props.doubleSelectedItems !== this.state.oldDoubleSelected) {
                // Selected items have changed

                if (this.props.maxDoubleSelected > 0) {
                    // There is a maximum number of selected items allowed

                    if (this.props.doubleSelectedItems.length >= this.props.maxDoubleSelected) {
                        // The number of selected items meets (or exceeds) the maximum allowed
                        this.setState({
                            minimised: true,
                            oldDoubleSelected: this.props.doubleSelectedItems
                        })
                    } else {
                        // The number of selected items is below the maximum
                        this.setState({
                            minimised: false,
                            oldDoubleSelected: this.props.doubleSelectedItems
                        })
                    }
                }
            }
        }
    }

    render() {

        let dataToRender = this.props.data.map((value) => {
            const item = {
                id: value.id
            };

            // Translate paths (e.g. 'setters/level' into top-level attributes)
            for (const i in this.props.columnLocations) {
                const accessed = getWithPath(value, this.props.columnLocations[i]);
                if (accessed !== undefined) {
                    item[this.props.columnNames[i]] = getWithPath(value, this.props.columnLocations[i]) || '';
                }
            }
            return item;
        });

        // Create filter dropdowns
        const dropdowns = {};
        const possibleColumnValues = {};
        for (const colName of this.props.allowFilter) {

            // Collate all possible values of the current column
            let possibleValues = [];

            if (this.props.multiValueColumns.includes(colName)) {
                // Column's fields contain multiple values (e.g. 'supports')
                // each value needs to be added to the possible values

                for (const item of dataToRender) {
                    const values = item[colName];
                    for (const value of values) {
                        if (!possibleValues.includes(value)) {
                            possibleValues.push(value)
                        }
                    }
                }

            } else {
                for (const item of dataToRender) {
                    const value = item[colName];
                    if (!possibleValues.includes(value)) {
                        possibleValues.push(value);
                    }
                }
            }

            possibleColumnValues[colName] = possibleValues.sort();


            dropdowns[colName] = (
                <select value={this.state.columnFilters[colName]} onChange={(e) => this.onFilterChange(colName, e.target.value)}>
                    <option value={"remove"}>No filter selected</option>
                    {possibleValues.toSorted().map((value) => {
                        return <option key={value} value={value}>{value.toString()}</option>
                    })}
                </select>
            )

        }

        // Apply given filters
        for (const colName in this.state.columnFilters) {
            const filter = this.state.columnFilters[colName];

            if (filter !== undefined) {

                if (this.props.multiValueColumns.includes(colName)) {
                    // Column's fields contain multiple values:
                    // if any of them match the filter, the item should be shown

                    dataToRender = dataToRender.filter((value) => {
                        return value[colName].includes(filter);
                    });

                } else {
                    dataToRender = dataToRender.filter((value) => {
                        return value[colName] == filter;
                    });
                }

            }
        }

        // Apply sorting
        // (worst sorting function i've ever written please make this nicer to look at)
        if (this.state.sortBy.column) {
            if (this.state.sortBy.direction === 'desc') {
                dataToRender.sort((a, b) => {
                    if (a[this.state.sortBy.column] > b[this.state.sortBy.column]) {
                        return -1;
                    } else if (a[this.state.sortBy.column] === b[this.state.sortBy.column]) {
                        return 0;
                    } else {
                        return 1
                    }
                })
            } else {
                dataToRender.sort((a, b) => {
                    if (a[this.state.sortBy.column] > b[this.state.sortBy.column]) {
                        return 1;
                    } else if (a[this.state.sortBy.column] === b[this.state.sortBy.column]) {
                        return 0;
                    } else {
                        return -1;
                    }
                })
            }
        }

        // Apply search filters
        if (this.state.searchValue !== '') {
            dataToRender = dataToRender.filter((value) => {

                // Check for each column to search
                let show = false;
                outer: for (const colName of this.props.allowSearch) {
                    if (this.props.multiValueColumns.includes(colName)) {
                        // Column's cells contain multiple values
                        for (const o of value[colName]) {
                            if (o.toLowerCase().includes(this.state.searchValue)) {
                                show = true;
                                break outer;
                            }
                        }
                    } else {
                        if (value[colName].toLowerCase().includes(this.state.searchValue)) {
                            show = true;
                            break outer;
                        }
                    }
                }

                return show;

            })
        }

        return (
            <div className="listWrapper">
                <div className='titleWrapper'>
                    <span className='title'>{this.props.title}</span>
                    <button type='button' className='searchBtn' onClick={this.toggleSearch}>Search</button>
                    <button type='button' className='minimiseBtn' onClick={this.toggleMinimised}>{this.state.minimised ? "+" : "-"}</button>
                </div>
                {this.state.showSearch &&
                    <div className='search'>
                        <input type='text' placeholder='Search...' value={this.state.searchValue} onChange={this.onSearchChange} />
                    </div>
                }


                <span className='selectedItems'>
                    Selected {this.props.maxDoubleSelected > 0 && <>({this.props.doubleSelectedItems.length}/{this.props.maxDoubleSelected})</>}:
                    {this.props.doubleSelectedItems.map((value) => {
                        return <Chip onClick={e => this.props.onItemDoubleSelected(value)} className="selectedChip" key={value} text={this.props.data.find(i => i.id === value)[this.props.columnLocations[this.props.columnNames.indexOf('Name')]]} />
                    })}
                    {this.props.maxDoubleSelected > 0 && this.props.maxDoubleSelected > this.props.doubleSelectedItems.length &&
                        [...Array(this.props.maxDoubleSelected - this.props.doubleSelectedItems.length)].map(() => {
                            return <Chip text={"Empty slot"} className={"disabled"} />
                        })
                    }
                </span>

                {!this.state.minimised &&

                    <div className='filters'>
                        Filters:
                        {Object.entries(this.state.columnFilters).map(([key, value]) => {
                            if (value) {
                                return <Chip key={key} className='filterChip' onClick={(e) => this.onRemoveFilter(key)} text={<><b>{key}</b>: {value}</>} />
                            }
                        })}

                        {this.state.addingFilter &&
                            <>
                                <select value={this.state.newFilterColumn} onChange={(e) => this.onNewFilterColumnChange(e.target.value)}>
                                    <option value={"remove"}>Select column</option>
                                    {this.props.allowFilter.map((value) => {
                                        if (!this.state.columnFilters[value]) {
                                            return <option key={value} value={value}>{value}</option>
                                        }
                                    })}
                                </select>

                                <select value={this.state.newFilterValue} onChange={(e) => this.onNewFilterValueChange(e.target.value)}>
                                    <option value={"remove"}>Select value</option>
                                    {possibleColumnValues[this.state.newFilterColumn]?.map((value) => {
                                        return <option key={value} value={value}>{value.toString()}</option>
                                    })}
                                </select>

                                <button onClick={this.onCancelFilterButtonClick} className='cancelFilterBtn'>
                                    x
                                </button>
                            </>

                        }

                        {!this.state.addingFilter && <button className='addFilterBtn' onClick={this.onAddFilterButtonClick}>+ Add</button>}
                    </div>
                }
                {!this.state.minimised &&
                    <table>
                        <thead>
                            <tr>
                                {this.props.shownColumns.map((name) => {
                                    return <th key={name} onClick={(e) => this.onSortChange(name)} >{name}  {this.state.sortBy.column === name && (this.state.sortBy.direction === 'asc' ? "^" : "v")}</th>
                                })}
                            </tr>
                            <tr className='filterRow'>
                                {this.props.shownColumns.map((name) => {
                                    if (this.props.allowFilter.includes(name)) {
                                        return <th key={name}>{dropdowns[name]}</th>
                                    } else {
                                        return <th key={name}></th>
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {dataToRender.map((value) => {
                                return (
                                    <tr key={value.id} onClick={(e) => { this.handleItemClick(e, value.id) }} className={(value.id === this.props.selectedItemID ? 'selected ' : ' ') + (this.props.doubleSelectedItems.includes(value.id) ? 'doubleSelected' : '')}>
                                        {this.props.shownColumns.map((colName) => {
                                            return <td key={colName}>{value[colName]?.toString()}</td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                }
            </div>
        )
    }
}

// Takes a string path e.g. setters/level and returns the value at that point in the given object,
// {
//   setters: { level: value }
// }
function getWithPath(object, path) {
    const pathSplit = path.split('/');
    let value = object;
    for (const o of pathSplit) {
        if (value && value[o] !== undefined) {
            value = value[o];
        } else {
            value = undefined;
        }
    }
    return value;
}