import { EVERYTHING } from "./indexData";

export function getGrants(id, level) {
    let idList = [id];
    const grant = EVERYTHING.find(e => e.id === id)?.rules?.grant;
    if (grant !== undefined) {
        grant.forEach(
            e => {
                console.log(e);
                if ((e.level === undefined || parseInt(e.level) <= level)) {
                    if (e.number === undefined) {
                        idList = idList.concat(getGrants(e.id));
                    } else {    
                        for (let i = 0; i < parseInt(e.number); i++) {
                            idList = idList.concat(getGrants(e.id));
                        }
                    }
                }
            }
        )
    }

    return idList;
}

export function getStats(grantList, level) {
    let statList = [];

    for (const id of grantList) {
        let stats = EVERYTHING.find(e => e.id === id)?.rules?.stat;
        if (stats !== undefined) {
            if (!Array.isArray(stats)) {
                stats = [stats];
            }
            stats = stats.filter(stat => stat.level === undefined || stat.level <= level);
            statList.push(...stats);
        }
    }
    
    return statList;
}

export function updateAllGrants(grantDict, level, props, extraData={}, extraCreationData={}) {
    let allGrants = Object.keys(grantDict).flatMap(key => grantDict[key]);
    
    const allStats = getStats(allGrants, level);
    const statDict = props.characterData.creationData.stats;
    allStats.push(...Object.keys(statDict).flatMap(key => statDict[key]));

    allGrants = allGrants.map(id => {
        return {"id": id, "type": getFromId(id)?.type};
    });

    props.updateCharacterData(
        {
            creationData: {...props.characterData.creationData,
                grants: grantDict,
                ...extraCreationData,
            },
            grants: allGrants,
            stats: allStats,
            ...extraData,
        }
    )
}

export function getFromId(id) {
    return EVERYTHING.find(e => e.id === id);
}