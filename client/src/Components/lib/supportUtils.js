import jsep, * as Jsep from "jsep";
import { SPELLS } from "./indexData";

jsep.addIdentifierChar(" ");
jsep.addIdentifierChar(":");

const daProblem = "" 

export function supportsCalc(text) {
    const symbols = ["!", "(", ")", "||", "&&"];

    textList = text;

    textList.split();
}

export function checkSubset(subsetArray, parentArray) {
    return subsetArray.every(e => parentArray.includes(e));
}

export function checkSupports(subsetArray, parentArray) {
    subsetArray = subsetArray.flatMap(e => e.split(","));
    parentArray = parentArray.flatMap(e => e.split(","));

    return subsetArray.every(e => checkOr(e, parentArray));
}

export function checkOr(supports, parentArray) {
    supports = supports.split("||");
    supports = supports.flatMap(item => item.split("|"));
    // return supports.some(e => parentArray.includes(e));
    return supports.some(e => checkNot(e, parentArray));
}

function checkNot(support, parentArray) {
    if (support[0] === "!") {
        return (!parentArray.includes(support.substring(1)));
    } else {
        return (parentArray.includes(support));
    }
}

export function checkRequirementsGrants(bool, characterData) {
    console.log(jsep(bool.toString()));


    const grantArray = characterData.grants.map(e => e.id);
    return recurse(jsep(bool.toString()), grantArray);
}


export function checkRequirements(bool, grantArray) {
    bool = bool.replace(/\d/g, "n$&");
    // console.log(bool)
    
    grantArray = grantArray.map(grant => grant.replace(/\d/g, "n$&"));

    return recurse(jsep(bool.toString()), grantArray);
}

export function test() {
    let values = ["ID_WOTC_PHB_CLASS_WARLOCK", "ID_WOTC_PHB_MULTICLASS_WARLOCK"];

    let stuff = jsep(["[horse type feat, the end of all]", "world horset"].toString());
    console.log(stuff);
    console.log(recurse(stuff, values));
}

function recurse(obj, values) {
    if (obj.type === "Identifier") {
        if (obj.name.includes(":")) {
            console.log(obj.name);
        }
        return values.includes(obj.name);
    } else if (obj.type === "Literal") {
        return values.includes(obj.raw);
    } else if (obj.type === "MemberExpression") {
        return values.includes(obj.property.value)
    } else if (obj.operator === "!") {
        return !recurse(obj.argument, values);
    } else if (obj.operator === "||" || obj.operator === "|") {
        return recurse(obj.left, values) || recurse(obj.right, values);
    } else if (obj.operator === "&&") {
        return recurse(obj.left, values) && recurse(obj.right, values);
    } else if (obj.type === "Compound") {
        return obj.body.every(e => recurse(e, values));
    } else if (obj.type === "SequenceExpression") {
        return obj.expressions.every(e => recurse(e, values));
    } else if (obj.type === "ArrayExpression") {
        return obj.elements.every(e => recurse(e, values));
    } else {
        console.log(obj.type);
    }
}

export function filterSpells(supportList) {
    let filteredSpells = SPELLS.filter(e => checkRequirements(supportList, getSpellSupports(e)));
    return filteredSpells;
}

function range(start, end, step=1) {
    start = Number(start);
    end = Number(end);
    step = Number(step);

    const arr = [];
    for (let i = start; i < end; i += step) {
        arr.push(i.toString());
    }
    return arr;
}

function getSpellSupports(spell) {
    const supports = [...spell.supports || [], spell.setters.school, spell.id];

    if (spell.setters.level == 0 || spell.setters.level == " Cantrip") {
        supports.push("0", "Cantrip");
    } else {
        // For every spell that isn't a cantrip, it adds the level of the spell and every number up to 20 (normal dnd spells max out at level 12)
        // Making it accessible by spell grants of higher levels
        supports.push(...range(spell.setters.level, 20));
    }

    return supports;
}