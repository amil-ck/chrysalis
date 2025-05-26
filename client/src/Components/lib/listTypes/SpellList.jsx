import * as React from 'react';
import spells from '../../../data/spells';
import GenericList from '../GenericList.jsx';

export default class SpellList extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        console.log(spells[0])

        this.state = {
            spellData: spells
        }

    }

    stringFromComponents(spell) {
        const v = spell.setters?.hasVerbalComponent;
        const s = spell.setters?.hasSomaticComponent;
        const m = spell.setters?.hasMaterialComponent;
        let str = " ";
        str += (v ? "V, " : "");
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
                newSpell.setters.level = "Cantrip";
            }
            return newSpell;
        });


        const propsToPass = {
            title: 'Spells',
            data: spellData,
            columnNames: ["Name", "Level", "School", "Components", "Source"],
            allowFilter: ["Level", "School", "Source"],
            presetFilters: {
                Level: "Cantrip"
            },
            columnLocations: ["name", "setters/level", "setters/school", "combinedComponents", "source"],
            ...this.props
        }

        return (
            <GenericList {...propsToPass} />
        )
    }
}