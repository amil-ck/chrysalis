
export async function saveCharacter(id, data) {
    const dataString = JSON.stringify(data);

    // TODO: add error detection lol
    const dataPath = await window.electronAPI.getDataPath();
    await window.electronAPI.writeFile(`${dataPath}/characters/${id}.character.json`, dataString);
}

export async function createCharacter() {
    const id = crypto.randomUUID();

    const creationData = {
        choices: {
            Class: [],
            Race: [],
            Background: []
        },
        listsData: {
            Class: [],
            Race: [],
            Background: []
        },
        grants: {
            Class: [],
            Race: [],
            Background: []
        },
        allGrants: []
    }

    await saveCharacter(id, { id: id, creationData: creationData });
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

export async function importCharacter() {
    // 1. Show file picker dialog
    const { filePaths, canceled } = await window.electronAPI.showOpenDialog({
        title: 'Import character',
        buttonLabel: 'Import',
        filters: [
            {
                name: 'JSON Character File',
                extensions: ['character.json']
            }
        ],
        properties: ['openFile']
    });

    if (canceled) return;

    // 2. Load data from given filepath
    try {
        const data = await window.electronAPI.readFile(filePaths[0]);
        const parsed = JSON.parse(data);

        // 3. Check for ID clashes with existing characters
        if (!parsed.id) parsed.id = crypto.randomUUID();

        const fileList = await window.electronAPI.readdir(`${await window.electronAPI.getDataPath()}/characters`);
        let clash = false;
        for (const fileName of fileList) {
            if (fileName.endsWith('.character.json') && fileName.split('.character.')[0] === parsed.id) {
                clash = true;
                break;
            }
        }
        if (clash) parsed.id = crypto.randomUUID();

        // 4. Save character to new file
        await saveCharacter(parsed.id, parsed);

        return parsed;

    } catch (e) {
        console.warn("Error in importing:", e);
        return;
    }


}