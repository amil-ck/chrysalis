import * as React from 'react';
import feats from '../../../data/feats';
import GenericList from '../GenericList.jsx';

export default class FeatList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            featData: feats
        }

    }

    render() {

        const propsToPass = {
            data: this.state.featData,
            title: 'Feats',
            columnNames: ["Name", "Prerequisite", "Source"],
            allowFilter: ["Source"],
            columnLocations: ["name", "prerequisite", "source"],
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