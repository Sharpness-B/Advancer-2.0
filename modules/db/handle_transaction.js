const { doc, setDoc } = require('firebase/firestore');

async function handle_transaction(firestore, upgrade, fp, balances) {
    const price = level => level*10;

    const level = balances[upgrade];

    if (level < 5 && balances.gold >= price(level)) {
        balances[upgrade] ++;
        balances.gold -= price(level);

        await setDoc(doc(firestore, "users", fp), balances);
    }

    return balances;
}

module.exports = handle_transaction; 