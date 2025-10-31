import { fill, PDFDocument } from "pdf-lib";
import * as React from "react";
import { calculateStat } from "../../lib/statUtils";
import { getFromId } from "../../lib/grantUtils";

export default class CharacterSheet extends React.Component {
    constructor(props) {
        super();

        this.props = props;

        console.log(this.fillForm());
    }

    render() {

    }

    getCharacterData() {
        const cd = this.props.characterData;

        const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]

        let data = {
            "PlayerName": cd.name,
            "Race ": "",
            "Alignment": "",
            "AC": calculateStat("ac", cd),
            "Initiative": this.plusMinus(calculateStat("initiative", cd)),
            "Speed": calculateStat("speed", cd),
            "Features and Traits": this.getTraits(),
        }

        for (const stat of stats) {
            data = {...data, ...this.handleStats(stat)};
        }

        return data;
    }

    handleStats(stat) {
        const statDict = {
            "STR": "strength",
            "DEX": "dexterity",
            "CON": "constitution",
            "INT": "intelligence",
            "WIS": "wisdom",
            "CHA": "charisma",
        }

        const data = {
            [stat]: calculateStat(statDict[stat], this.props.characterData),
            [`${stat}mod`]: this.plusMinus(calculateStat(`${statDict[stat]}:modifier`, this.props.characterData)),
        }

        return data;
    }

    getTraits() {
        const features = this.props.characterData.grants.filter(e => e.type !== undefined && (e.type.includes("Feature") || ["Racial Trait", "Feat"].includes(e.type)));

        let featureList = features.map(e => {
            const feature = getFromId(e.id);
            const description = feature?.sheet?.description;
            
            if (description !== undefined) {
                return `${feature.name} - ${description}\n\n\n`;
            } else {
                console.log(e.id);
                return null;
            }
        }).filter(
            e => e !== null
        ).map(
            e => this.replaceStats(e)
        );

        const featureString = featureList.join("");

        return featureString;
    }

    replaceStats(description) {
        let parsedDescription = `${description}`;

        const statNames = description.split("{{").map(str => {
            if (str.includes("}}")) {
                return str.split("}}")[0]; // get substring between brackets
            }
        }).filter(i => !!i); // not null or undefined

        console.log(statNames);

        for (const statName of statNames) {
            const value = calculateStat(statName, this.props.characterData);
            parsedDescription = parsedDescription.replace(`{{${statName}}}`, value);
        }

        return parsedDescription;
    }


    plusMinus(number) {
        if (number >= 0) {
            return "+" + number.toString();
        } else {
            return number.toString();
        }
    }


    async fillForm() {
        // let formPdfBytes = await fetch(url).then(res => res.arrayBuffer());

        const dataPath = await window.electronAPI.getDataPath();
        let data = await window.electronAPI.readFileBytes(`${dataPath}/pdf/characterSheet.pdf`);

        console.log(data);

        const pdfDoc = await PDFDocument.load(data);
        const form = pdfDoc.getForm();

        console.log(form.getFields().map(e => e.getName()));

        const dataToFill = this.getCharacterData();
        console.log(dataToFill);
        for (const [key, value] of Object.entries(dataToFill)) {
            const nameField = form.getFieldMaybe(key);
            if (nameField !== undefined) {
                nameField.setText(value.toString());
            } else {
                console.log(key)
            }
        }

        const pdfBytes = await pdfDoc.save();

        await window.electronAPI.writeFile("C:\\Users\\amilc\\Downloads\\arandomthing.pdf", pdfBytes);
    }

}