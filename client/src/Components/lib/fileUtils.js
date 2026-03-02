/**
 * Saves the given character data to the corresponding local file
 * @param {string} id The character's ID
 * @param {object} data The characterData object to save 
 */
export async function saveCharacter(id, data) {
    const dataString = JSON.stringify(data);

    // TODO: add error detection lol
    const dataPath = await window.electronAPI.getDataPath();
    await window.electronAPI.writeFile(`${dataPath}/characters/${id}.character.json`, dataString);
}

/**
 * Creates and initialises a new character file
 * @returns {string} The id of the newly created character
 */
export async function createCharacter() {
    const id = crypto.randomUUID();

    const creationData = {
        choices: {
            Class: [],
            Race: [],
            Background: []
        },
        grants: {
            Class: [],
            Race: [],
            Background: []
        },
        stats: {
            Class: [],
            Race: [],
            Background: [],
            Abilities: []
        },
        languages: {
            Class: [],
            Race: [],
            Background: []
        }
    }

    await saveCharacter(id, { id: id, level: 1, creationData: creationData });
    return id;
}

/**
 * Loads a character from local files
 * @param {string} id The character's ID
 * @returns {object} The characterData object
 */
export async function loadCharacter(id) {
    const dataPath = await window.electronAPI.getDataPath();

    // Check that character exists
    if (!doesCharacterExist(id)) return undefined;

    // Read file
    const data = await window.electronAPI.readFile(`${dataPath}/characters/${id}.character.json`);

    // Parse JSON
    const parsedData = JSON.parse(data);
    return parsedData;
}

/**
 * Loads the data for all locally-stored characters
 * @returns {object[]} An array of characterData objects
 */
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

/**
 * Checks whether a character with a given ID exists
 * @param {string} id The ID of the character to search for
 * @returns {boolean} Whether the character exists
 */
export async function doesCharacterExist(id) {
    const fileList = await window.electronAPI.readdir(`${await window.electronAPI.getDataPath()}/characters`);
    return fileList.includes(`${id}.character.json`);
}

/**
 * Allows the user to pick an external character file to import into Chrysalis, and loads its data 
 * @returns {object | null} If successful, the characterData object, else null
 */
export async function importCharacter() {
    // 1. Show file picker dialog
    const { filePaths, canceled } = await window.electronAPI.showOpenDialog({
        title: 'Import Character',
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

/**
 * Allows the user to pick an external content file to import, and loads its data
 * @returns {string | null} The imported filename if successful, else null
 */
export async function importContent() {
    // 1. Show file picker dialog
    const { filePaths, canceled } = await window.electronAPI.showOpenDialog({
        title: 'Import Content Files',
        buttonLabel: 'Import',
        filters: [
            {
                name: 'JSON file',
                extensions: ['json']
            }
        ],
        properties: ['openFile']
    });

    if (canceled) return;


    // 2. Load data from given filepath
    try {
        const data = await window.electronAPI.readFile(filePaths[0]);
        const parsed = JSON.parse(data);

        const pathElements = filePaths[0].replaceAll("\\", "/").split("/");
        let fileName = pathElements[pathElements.length - 1];

        if (parsed.length && parsed.length > 0 && parsed[0].id !== undefined) {
            const fileList = await window.electronAPI.readdir(`${await window.electronAPI.getDataPath()}/content_files`);
            
            let nameExists = fileList.includes(fileName);
            while (nameExists) {
                fileName += " Copy";
                nameExists = fileList.includes(fileName);
            }


            await window.electronAPI.writeFile(`${await window.electronAPI.getDataPath()}/content_files/${fileName}`, data);

            return fileName;
        }

    } catch (e) {
        console.warn("Error in importing:", e);
        return;
    }
}


/**
 * Copies the specified character file to a user-picked external path
 * @param {string} id The ID of the character to export
 * @returns {boolean} Whether the export was successful
 */
export async function exportCharacter(id) {
    try {
        // 1. Get character data
        const data = await window.electronAPI.readFile(`${await window.electronAPI.getDataPath()}/characters/${id}.character.json`);
        const parsed = JSON.parse(data);

        // 2. Show file picker dialog
        const { filePath, canceled } = await window.electronAPI.showSaveDialog({
            title: 'Export Character',
            defaultPath: parsed.name ? `${parsed.name}.character.json` : 'unnamed.character.json',
            buttonLabel: 'Export',
            filters: [
                {
                    name: 'JSON Character File',
                    extensions: ['character.json']
                }
            ],
        });

        if (canceled) return;

        // 3. Write file to given path
        await window.electronAPI.writeFile(filePath, data);
        return true;

    } catch (e) {
        console.warn("Error in exporting:", e);
        return false;
    }

}

/**
 * Deletes a given character
 * @param {string} id The ID of the character to delete
 * @returns {boolean} Whether the deletion was successful
 */
export async function deleteCharacter(id) {
    try {
        await window.electronAPI.deleteFile(`${await window.electronAPI.getDataPath()}/characters/${id}.character.json`);
        return true;
    } catch (e) {
        console.warn("Error in deleting file:", e);
        return false;
    }
}