import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { LANGUAGES } from '../indexData.js';

export default class LanguageList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            languageData: LANGUAGES
        }

    }

    render() {

        const propsToPass = {
            data: this.state.languageData,
            title: 'Languages',
            columnNames: ["Name", "Source"],
            shownColumns: ["Name", "Source"],
            allowFilter: ["Source"],
            allowSearch: [],
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