import * as React from 'react';
import GenericInfoPane from './GenericInfoPane.jsx';

export default class ChrysalisInfoPane extends React.Component {
    /**
     * 
     * @param {object} props 
     * @param {object} props.data
     * @param {function()} props.onClose
     */
    constructor(props) {
        super();

        // Props: data: obj

        this.props = props;

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
        // Props: data: {title: string, subtitle: string, attributes: {string: string}, description: god knows, source: string }

        if (this.props.data === undefined) {
            return <GenericInfoPane data={undefined} />
        }

        const dataToRender = {
            title: this.props.data.name,
            subtitle: this.props.data.type,
            attributes: {},
            description: this.props.data.description,
            footerAttributes: {Source: this.props.data.source},
            type: this.props.data.type
        }
        const type = this.props.data.type;
        const baseType = this.props.data.base?.type;
        if (type === 'Spell') {
            dataToRender.subtitle = this.props.data.setters.school;
            dataToRender.attributes = {
                Level: this.props.data.setters.level,
                Range: this.props.data.setters.range,
                "Casting time": this.props.data.setters.time,
                Duration: this.props.data.setters.duration,
                Components: this.stringFromComponents(this.props.data)
            };
            if (this.props.data.setters.hasMaterialComponent) {
                dataToRender.attributes.Components += ` (${this.props.data.setters.materialComponent})`
            }
            if (this.props.data.setters.isRitual) {
                dataToRender.subtitle += ' (Ritual)';
            }
            
        } else if (type === 'Feat') {
            // if (this.props.data.prerequisite) {
            //     dataToRender.attributes.Prerequisite = this.props.data.prerequisite;
            // }
        } else if (type === 'Language') {
            dataToRender.attributes = {
                Speakers: this.props.data.setters?.speakers,
                Script: this.props.data.setters?.script
            }
        } else if (type === 'Weapon' || baseType === 'Weapon') {
            dataToRender.attributes = {
                Damage: `${this.props.data.setters?.damage} ${this.props.data.setters?.versatile ? "(" + this.props.data.setters.versatile + ")" : ""}`,
                Cost: this.props.data.setters?.cost,
                Weight: this.props.data.setters?.weight
            }
        } else if (type === 'Armor' || baseType === 'Armor') {
            dataToRender.attributes = {
                "Armor Class": this.props.data.setters.armorClass
            }
        }

        if (this.props.data.base) {
            dataToRender.title = this.props.data.formattedName || this.props.data.name;
            dataToRender.subtitle = `${this.props.data.type} (${this.props.data.base.type})`;
        }

        return <GenericInfoPane {...this.props} data={dataToRender} />
    }
}