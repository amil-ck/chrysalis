import * as supportUtils from './supportUtils.js';

export function calculateStat(statName, characterData) {
    if (!characterData.stats) return 0;

    // Check reserved first

    const names = statName.split(":");

    // TEMPORARY
    if (statName === 'proficiency') return 2;
    
    // Check for halving
    const halfIdx = names.indexOf("half");
    if (halfIdx !== -1) {
        if (names[halfIdx + 1] && names[halfIdx + 1] === "up") {
            // round up
            return Math.ceil(calculateStat(statName.replace(":half:up", ""), characterData) / 2);
        } else {
            // round down
            return Math.floor(calculateStat(statName.replace(":half", ""), characterData) / 2);
        }
    }

    // Check level
    if (statName === "level") return Number(characterData.level);
    if (names[0] === "level") {
        // TODO: deal with multiclassing
        return Number(characterData.level);
    }

    // Check speed (apply innate speed)
    if (names[0] === "speed") {
        return calculateGenericStat(statName, characterData, [`innate ${statName}`, `${statName}:misc`, `innate ${statName}:misc`]);
    }

    // Check ac
    if (statName === "ac") {
        // Get base
        // a) if wearing armor, use as base
        let base = calculateGenericStat("ac:armored:armor", characterData) + calculateGenericStat("ac:armored:enhancement", characterData) + calculateGenericStat("ac:armored:misc", characterData);

        // b) else, get ac:calculation
        if (base === 0) {
            base = calculateGenericStat("ac:calculation", characterData);

            if (base === 0) {
                base = 10 + calculateStat("dexterity:modifier", characterData);
            }
        }

        // Get additionals (misc, shield)
        const ac = base + calculateGenericStat("ac:misc", characterData) + calculateGenericStat("ac:shield", characterData);
        return ac;
    }

    // Check abilities
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    if (abilities.includes(names[0])) {
        const ability = names[0];
        const score = calculateGenericStat(ability, characterData, [`${ability}:score:set`]);

        if (statName === ability) return score;

        if (names.length > 1) {
            if (names[1] === "modifier") {
                return Math.floor((score - 10) / 2);
            } else if (names[1] === "score") {
                return score;
            } else if (names[1] === "max") {
                return 20 + calculateGenericStat(statName, characterData);
            }
        }
    }

    // Check skills
    // const skills = ["acrobatics", "animal handling", "arcana", "athletics", "deception", "history", "insight", "intimidation", "investigation", "medicine", "nature", "perception", "performance", "persuasion", "religion", "sleight of hand", "stealth", "survival"];
    // if (skills.includes(names[0])) {
    //     const skill = names[0];

    // }

    // Then, if not reserved:
    return calculateGenericStat(statName, characterData);
}

function calculateGenericStat(statName, characterData, altNames=[]) {
    

    const matchingStats = characterData.stats.filter(i => [...altNames, statName, `${statName}:misc`].includes(i.name));
    console.log(statName, matchingStats)
    let finalValue = 0;
    const bonuses = {};

    for (const stat of matchingStats) {
        // check level
        if (stat.level && Number(stat.level) > characterData.level) {
            // Character level too low
            continue;
        }

        // check requirements
        if (stat.requirements && !checkRequirements(stat.requirements, characterData)) {
            // Requirements not met
            continue;
        }

        // check equipped
        if (stat.equipped && !checkEquipped(stat.equipped, characterData)) {
            continue;
        }

        // Calculate value
        let value = 0;
        if (Number.isNaN(Number(stat.value))) {
            // value is not a number (i.e. it is a reference to another stat)
            value = calculateStat(stat.value, characterData);
        } else {
            value = Number(stat.value);
        }

        // Check bonus
        if (stat.bonus) {
            
            const prevBonus = bonuses[stat.bonus];
            if (!prevBonus || prevBonus < value) bonuses[stat.bonus] = value; // if higher than previous bonus value, overwrite

            continue;
        }

        finalValue += value;
    }

    // Add bonuses
    console.log(bonuses);
    for (const i in bonuses) {
        finalValue += bonuses[i];
    }

    return finalValue;
}

function checkRequirements(reqs, characterData) {
    return supportUtils.checkRequirments(reqs, characterData.grants.map(g => g.id));

    //return checkRequirements(reqs, characterData.grants.map(g => g.id)); 
}

function checkEquipped(equipped, characterData) {
    // TODO: CHECK EQUIPMENT??
    return true;
}