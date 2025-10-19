import everything from "../../data/everything.json"
import internal from "../../data/internal.json"
import chrysalisInternal from "../../data/chrysalisInternal.json"
import monsters from "../../data/monsters.json"

const SPELLS = everything.filter(i => i.type === 'Spell');
const FEATS = everything.filter(i => i.type === 'Feat');
const CLASSES = everything.filter(i => i.type === 'Class');
const ARCHETYPES = everything.filter(i => i.type === 'Archetype');
const RACES = everything.filter(i => i.type === 'Race');
const LANGUAGES = everything.filter(i => i.type === 'Language');
const BACKGROUNDS = everything.filter(i => i.type === 'Background');
const CLASS_FEATURES = everything.filter(i => i.type === 'Class Feature');
const ARCHETYPE_FEATURES = everything.filter(i => i.type === 'Archetype Feature');

const EVERYTHING = everything.concat(internal).concat(chrysalisInternal);

const MONSTERS = monsters;

export { SPELLS, FEATS, CLASSES, ARCHETYPES, RACES, BACKGROUNDS, LANGUAGES, EVERYTHING, CLASS_FEATURES, ARCHETYPE_FEATURES, MONSTERS };
