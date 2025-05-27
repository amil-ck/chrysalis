export default function diceRoll(diceSides, modifier=0, advantage=false) {
    let roll1 = Math.ceil(Math.random() * diceSides);
    if (advantage) {
        let roll2 = Math.ceil(Math.random() * diceSides);
        if (roll2 > roll1) {
            roll1 = roll2;
        }
    }

    return roll1 + modifier;
}