
export async function saveCharacter(id, data) {
    const dataString = JSON.stringify(data);

    // TODO: add error detection lol
    const dataPath = await window.electronAPI.getDataPath();
    await window.electronAPI.writeFile(`${dataPath}/characters/${id}.character.json`, dataString);
}

export async function createCharacter() {
    const id = crypto.randomUUID();

    await saveCharacter(id, {id: id});
    return id;
}

export async function loadCharacter(id) {
    // 1. Read file
    const dataPath = await window.electronAPI.getDataPath();
    const data = await window.electronAPI.readFile(`${dataPath}/characters/${id}.character.json`);

    // 2. Parse JSON
    const parsedData = JSON.parse(data);
    return parsedData;
}

export async function loadAllCharacters() {
    const characters = [];

    const fileList = await window.electronAPI.readdir(`${await window.electronAPI.getDataPath()}/characters`);
    for (const fileName of fileList) {
        if (fileName.endsWith(".character.json")) {
            // File is character file, laod it
            const character = await loadCharacter(fileName.split(".character.")[0]);
            characters.push(character);
        }
    }

    return characters;
}

// function readCharacters() {
//     const characterPath = path.join(getDataPath(), "characters");
//     const characters = [];
//     const fileList = fsOld.readdirSync(characterPath);
//     for (const fileName of fileList) {
//         const divided = fileName.split('.');
//         if (divided[divided.length - 1] === 'json') {
//             // File extension is json, read file
//             const data = fsOld.readFileSync(path.join(characterPath, fileName), { encoding: 'utf8' });
//             const parsed = JSON.parse(data);
//             console.log(parsed);
//             if (parsed.name) {
//                 characters.push(parsed);
//             }
//         }
//     }

//     console.log(characters);

//     return characters;
// }