import spells from '../../data/spells';
import feats from '../../data/feats';
import classes from '../../data/classes';
import backgrounds from '../../data/backgrounds.json';
import languages from '../../data/languages.json';
import races from '../../data/races.json';
import everything from "../../data/everything.json"

const SPELLS = everything.filter(i => i.type === 'Spell');
const FEATS = everything.filter(i => i.type === 'Feat');
const CLASSES = everything.filter(i => i.type === 'Class');
const ARCHETYPES = everything.filter(i => i.type === 'Archetype');
const RACES = everything.filter(i => i.type === 'Race');
const LANGUAGES = everything.filter(i => i.type === 'Language');
const BACKGROUNDS = everything.filter(i => i.type === 'Background');
const CLASS_FEATURES = everything.filter(i => i.type === 'Class Feature');
const ARCHETYPE_FEATURES = everything.filter(i => i.type === 'Archetype Feature');

const EVERYTHING = everything;

export { SPELLS, FEATS, CLASSES, ARCHETYPES, RACES, BACKGROUNDS, LANGUAGES, EVERYTHING, CLASS_FEATURES, ARCHETYPE_FEATURES };
