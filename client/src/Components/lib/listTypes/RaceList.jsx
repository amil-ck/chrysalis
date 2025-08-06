import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { RACES } from '../indexData.js';

export default class RaceList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

    }

    render() {

        const propsToPass = {
            data: RACES,
            title: 'Races',
            columnNames: ["Name", "Source"],
            shownColumns: ["Name", "Source"],
            allowFilter: ["Source"],
            allowSearch: ["Name"],
            columnLocations: ["name", "source"],
            multiValueColumns: [],
            presetFilters: {
                
            },
            ...this.props
        }

        return (
            <GenericList {...propsToPass} />
        )
    }
}