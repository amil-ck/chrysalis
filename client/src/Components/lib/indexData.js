//import everything from "../../data/everything.json"
//import internal from "../../data/internal.json"
//import chrysalisInternal from "../../data/chrysalisInternal.json"

const chryDataPath = await window.electronAPI.getDataPath();
const dataFiles = await window.electronAPI.readdir(`${chryDataPath}/content_files`);
let everything = [];
for (const fileName of dataFiles) {
    if (!fileName.endsWith(".json")) continue;

    try {
        const data = JSON.parse(await window.electronAPI.readFile(`${chryDataPath}/content_files/${fileName}`));
        if (data.length && data.length > 0) {
            everything = everything.concat(data);
        }

    } catch (e) {
        console.error("Error reading file: " + fileName + "\n" + e);
    }
}

const SPELLS = everything.filter(i => i.type === 'Spell');
const FEATS = everything.filter(i => i.type === 'Feat');
const CLASSES = everything.filter(i => i.type === 'Class');
const ARCHETYPES = everything.filter(i => i.type === 'Archetype');
const RACES = everything.filter(i => i.type === 'Race');
const LANGUAGES = everything.filter(i => i.type === 'Language');
const BACKGROUNDS = everything.filter(i => i.type === 'Background');
const CLASS_FEATURES = everything.filter(i => i.type === 'Class Feature');
const ARCHETYPE_FEATURES = everything.filter(i => i.type === 'Archetype Feature');

//const EVERYTHING = everything.concat(internal).concat(chrysalisInternal);
const EVERYTHING = everything;

const MONSTERS = monsters;

export { SPELLS, FEATS, CLASSES, ARCHETYPES, RACES, BACKGROUNDS, LANGUAGES, EVERYTHING, CLASS_FEATURES, ARCHETYPE_FEATURES, MONSTERS };
