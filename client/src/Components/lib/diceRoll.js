export default function diceRoll(diceSides=20, noDice=1, modifier=0, advantage="none") {
    let rolls = []

    for (let i = 0; i < noDice; i++) {
        rolls.push(Math.ceil(Math.random() * diceSides));
    }

    rolls.push(Math.ceil(Math.random() * diceSides));
    //sorted rolls
    let s_rolls = [...rolls];

    if (advantage === "advantage") {
        s_rolls.sort((a, b) => (b - a));
        let removed = s_rolls.pop();
        s_rolls = [...rolls];
        s_rolls.splice(s_rolls.lastIndexOf(removed), 1);
    } else if (advantage === "disadvantage") {
        s_rolls.sort((a, b) => (a - b));
        let removed = s_rolls.pop();
        s_rolls = [...rolls];
        s_rolls.splice(s_rolls.lastIndexOf(removed), 1);
    } else {
        //removing the extra dice only used for (dis)advantaged rolls from history
        rolls.pop();
        s_rolls.pop();
    }

    let total = 0;
    s_rolls.forEach(e => total += e);

    return {
        "value": total,
        "rolls": rolls,
        "validRolls": s_rolls
    };
}