import * as React from 'react';
import GenericInfoPane from './GenericInfoPane.jsx';

export default class ChrysalisInfoPane extends React.Component {
    constructor(props) {
        super();

        // Props: type: string, data: obj

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
            source: this.props.data.source,
            type: this.props.data.type
        }
        const type = this.props.data.type;
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
            if (this.props.data.prerequisite) {
                dataToRender.attributes.Prerequisite = this.props.data.prerequisite;
            }
        } else if (type === 'Language') {
            dataToRender.attributes = {
                Speakers: this.props.data.setters.speakers,
                Script: this.props.data.setters.script
            }
        }

        return <GenericInfoPane {...this.props} data={dataToRender} />
    }
}