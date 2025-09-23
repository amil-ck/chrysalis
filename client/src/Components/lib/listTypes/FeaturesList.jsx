import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { CLASS_FEATURES, ARCHETYPE_FEATURES } from '../indexData.js';

export default class FeaturesList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            data: [...CLASS_FEATURES, ...ARCHETYPE_FEATURES]
        }

    }

    render() {

        const propsToPass = {
            data: this.state.data,
            title: 'Features',
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