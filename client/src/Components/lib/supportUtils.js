import jsep, * as Jsep from "jsep";

// jsep.removeIdentifierChar(":"); 

const daProblem = "!(ID_INTERNAL_GRANTS_REQTEMPFIX||ID_RACE_VARIANT_HUMAN_VARIANT||ID_INTERNAL_GRANTS_DRAGONMARK||ID_WOTC_WGTE_GRANTS_DARKMARKED||ID_UA_PS_GRANTS_HUMAN_VARIANT)" 

export function supportsCalc(text) {
    const symbols = ["!", "(", ")", "||", "&&"];

    textList = text;

    textList.split();
}

export function checkSubset(subsetArray, parentArray) {
    return subsetArray.every(e => parentArray.includes(e));
}

export function checkSupports(subsetArray, parentArray) {
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

export function checkRequirments(testString, grantArray) {
    // console.log(grantArray);
    // if (grantArray) {
    //     console.log(jsep(bool.toString()));
    //     console.log(grantArray);
    //     console.log(recurse(jsep(bool.toString()), grantArray));
    // }


    return recurse(jsep(testString.toString()), grantArray);
}

export function test() {
    let values = ["ID_WOTC_PHB_CLASS_WARLOCK", "ID_WOTC_PHB_MULTICLASS_WARLOCK"];

    let stuff = jsep(["horse", "world"].toString());
    console.log(stuff);
    console.log(recurse(stuff, values));
}

function recurse(obj, values) {
    if (obj.type === "Identifier") {
        return values.includes(obj.name);
    } else if (obj.type === "Literal") {
        return values.includes(obj.raw);
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
    }
}