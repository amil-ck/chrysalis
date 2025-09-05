import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { FEATS } from '../indexData.js';

export default class FeatList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            featData: FEATS.filter(i => i.type === "Feat")
        }

    }

    render() {

        const propsToPass = {
            data: this.state.featData,
            title: 'Feats',
            columnNames: ["Name", "Prerequisite", "Source"],
            shownColumns: ["Name", "Prerequisite", "Source"],
            allowFilter: ["Source"],
            allowSearch: ["Name"],
            columnLocations: ["name", "prerequisite", "source"],
            multiValueColumns: [],
            presetFilters: {
                Source: "Player’s Handbook"
            },
            ...this.props
        }

        return (
            <GenericList {...propsToPass} />
        )
    }
}