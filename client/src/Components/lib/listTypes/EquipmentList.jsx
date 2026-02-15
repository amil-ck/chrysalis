import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { ALL_EQUIPMENT } from '../indexData.js';

export default class EquipmentList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            data: ALL_EQUIPMENT
        }

    }

    render() {


        const propsToPass = {
            data: this.state.data,
            title: 'Equipment',
            columnNames: ["Name", "Type", "Source"],
            shownColumns: ["Name", "Type", "Source"],
            allowFilter: ["Type", "Source"],
            allowSearch: ["Name"],
            columnLocations: ["name", "setters/category", "source"],
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