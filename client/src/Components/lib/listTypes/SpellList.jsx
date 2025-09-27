import * as React from 'react';
import GenericList from '../GenericList.jsx';
import { SPELLS } from '../indexData.js';

export default class SpellList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        this.state = {
            spellData: props.data || SPELLS
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({spellData: this.props.data || SPELLS});
        }
    }

    stringFromComponents(spell) {
        const v = spell.setters?.hasVerbalComponent;
        const s = spell.setters?.hasSomaticComponent;
        const m = spell.setters?.hasMaterialComponent;
        let str = " ";
        str += (v ? "V," : "");
        str += (s ? " S," : "");
        str += (m ? " M," : "");
        
        return str.substring(0, str.length - 1).trim();
    }

    render() {

        // Convert components to string
        const spellData = this.state.spellData.map((spell) => {
            const newSpell = {...spell};
            newSpell.combinedComponents = this.stringFromComponents(spell);
            if (newSpell.setters?.level === "0") {
                newSpell.setters.level = " Cantrip";
            }
            // Convert concentration values to string
            newSpell.concentration = spell.setters.isConcentration ? "true" : "false";
            return newSpell;
        });


        const propsToPass = {
            title: 'Spells',
            columnNames: ["Name", "Level", "School", "Components", "Source", "Supports", "Concentration?"],
            shownColumns: ["Name", "Level", "School", "Components", "Source"],
            allowFilter: ["Level", "School", "Source", "Supports", "Concentration?"],
            allowSearch: ["Name"],
            presetFilters: {
                
            },
            columnLocations: ["name", "setters/level", "setters/school", "combinedComponents", "source", "supports", "concentration"],
            multiValueColumns: ["Supports"],
            ...this.props,
            data: spellData,
        }

        return (
            <GenericList {...propsToPass} />
        )
    }
}