const { doc, setDoc } = require('firebase/firestore');

async function add_gold(firestore, amount, fp, balances) {
    balances.gold += amount;

    await setDoc(doc(firestore, "users", fp), balances);
    
    return balances;
}

module.exports = add_gold; 