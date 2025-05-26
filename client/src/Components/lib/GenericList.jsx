import * as React from 'react';

export default class GenericList extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

        this.state = {
            minimised: props.startMinimised || false,
            columnFilters: props.presetFilters || {},
            addingFilter: false,
            newFilterColumn: undefined,
            newFilterValue: undefined
        }

        // props: title, data, columnNames, columnLocations, shownColumns, onItemSelected, selectedItemID, startMinimised, allowFilter, presetFilters

        this.onItemSelected = props.onItemSelected;

        this.handleItemClick = this.handleItemClick.bind(this);
        this.toggleMinimised = this.toggleMinimised.bind(this);
        this.onAddFilterButtonClick = this.onAddFilterButtonClick.bind(this);
        this.onNewFilterColumnChange = this.onNewFilterColumnChange.bind(this);
        this.onNewFilterValueChange = this.onNewFilterValueChange.bind(this);
        this.onRemoveFilter = this.onRemoveFilter.bind(this);
    }

    handleItemClick(id) {
        this.onItemSelected(id);
    }

    toggleMinimised() {
        this.setState({
            minimised: !this.state.minimised
        });
    }

    onFilterChange(column, value) {
        console.log("Filter:", column, value);
        this.setState({
            columnFilters: {
                ...this.state.columnFilters,
                [column]: (value === "remove" ? undefined : value)
            }
        })
    }

    onAddFilterButtonClick() {
        this.setState({
            addingFilter: true
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

    render() {

        let dataToRender = this.props.data.map((value, index) => {
            const item = {
                id: value.id
            };
            for (const i in this.props.columnLocations) {
                item[this.props.columnNames[i]] = getWithPath(value, this.props.columnLocations[i]) || '';
            }
            return item;
        });

        // Create filter dropdowns
        const dropdowns = {};
        const possibleColumnValues = {};
        for (const colName of this.props.allowFilter) {

            // Collate all possible values of the current column
            let possibleValues = [];
            for (const item of dataToRender) {
                const value = item[colName];
                if (!possibleValues.includes(value)) {
                    possibleValues.push(value);
                }
            }
            possibleColumnValues[colName] = possibleValues;


            dropdowns[colName] = (
                <select value={this.state.columnFilters[colName]} onChange={(e) => this.onFilterChange(colName, e.target.value)}>
                    <option value={"remove"}>No filter selected</option>
                    {possibleValues.toSorted().map((value) => {
                        return <option key={value} value={value}>{value}</option>
                    })}
                </select>
            )

            console.log(colName, possibleValues, dropdowns[colName])
        }

        // Apply given filters
        for (const colName in this.state.columnFilters) {
            const filter = this.state.columnFilters[colName];

            if (filter) {
                dataToRender = dataToRender.filter((value) => {

                    return value[colName] == filter;
                });

            }
        }

        return (
            <div className="listWrapper">
                <div className='titleWrapper'>
                    <span className='title'>{this.props.title}</span>
                    <button type='button' className='minimiseBtn' onClick={this.toggleMinimised}>{this.state.minimised ? "+" : "-"}</button>
                </div>
                <div className='filters'>
                    Filters: 
                    {Object.entries(this.state.columnFilters).map(([key, value]) => {
                        if (value) {
                            return <span key={key} className='filterChip' onClick={(e) => this.onRemoveFilter(key)}><b>{key}</b>: {value}</span>
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
                            return <option key={value} value={value}>{value}</option>
                        })}
                    </select>
                    </>
                        
                    }

                    {!this.state.addingFilter && <button className='addFilterBtn' onClick={this.onAddFilterButtonClick}>+ Add</button>}
                </div>
                {!this.state.minimised &&
                    <table>
                        <thead>
                            <tr>
                                {this.props.shownColumns.map((name) => {
                                    return <th key={name}>{name}</th>
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
                                    <tr key={value.id} onClick={() => { this.handleItemClick(value.id) }} className={(value.id === this.props.selectedItemID ? 'selected' : '')}>
                                        {this.props.shownColumns.map((colName) => {
                                            return <td key={colName}>{value[colName]}</td>
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

function getWithPath(object, path) {
    const pathSplit = path.split('/');
    let value = object;
    for (const o of pathSplit) {
        if (value && value[o]) {
            value = value[o];
        } else {
            value = null;
        }
    }
    return value;
}