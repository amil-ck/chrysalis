
export async function saveCharacter(id, data) {
    const dataString = JSON.stringify(data);

    // TODO: add error detection lol
    const dataPath = await window.electronAPI.getDataPath();
    await window.electronAPI.writeFile(`${dataPath}/characters/${id}.json`, dataString);
}

export async function createCharacter() {
    const id = crypto.randomUUID();

    await saveCharacter(id, {});
    return id;
}

export async function loadCharacter(id) {
    // 1. Read file
    const dataPath = await window.electronAPI.getDataPath();
    const data = await window.electronAPI.readFile(`${dataPath}/characters/${id}.json`);

    // 2. Parse JSON
    const parsedData = JSON.parse(data);
    return parsedData;
}
