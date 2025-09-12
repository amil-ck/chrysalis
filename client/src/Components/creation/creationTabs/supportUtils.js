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
    return supports.some(e => parentArray.includes(e));
}