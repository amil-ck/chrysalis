import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { CLASSES } from '../indexData.js';

export default class ClassList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            classData: CLASSES
        }

    }

    render() {

        const propsToPass = {
            data: this.state.classData,
            title: 'Class Features',
            columnNames: ["Name", "Supports", "Rules", "Type"],
            shownColumns: ["Name", "Supports", "Rules"],
            allowFilter: [],
            allowSearch: [],
            columnLocations: ["name", "supports", "rules/select/supports", "type"],
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