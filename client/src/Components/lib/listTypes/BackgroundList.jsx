import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { BACKGROUNDS } from '../indexData.js';

export default class BackgroundList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            data: BACKGROUNDS
        }

    }

    render() {

        const propsToPass = {
            data: this.state.data,
            title: 'Backgrounds',
            columnNames: ["Name", "Source"],
            shownColumns: ["Name", "Source"],
            allowFilter: ["Source"],
            allowSearch: ["Name"],
            columnLocations: ["name", "source"],
            multiValueColumns: [],
            presetFilters: {
                // Source: "Player’s Handbook"
            },
            ...this.props
        }

        return (
            <GenericList {...propsToPass} />
        )
    }
}