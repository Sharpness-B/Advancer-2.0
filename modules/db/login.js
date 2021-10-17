const { doc, getDoc, setDoc } = require('firebase/firestore');

async function login(firestore, fp_hash, fp_json_str) {
    const docRef = doc(firestore, "users", fp_hash);
    const docSnap = await getDoc(docRef);

    // if user already exists
    if (docSnap.exists()) {
        return docSnap.data();
    } 

    // if new user
    else {
        let balances = {
            gold: 30,
    
            armor: 1,
            speed: 1,
            laser: 1,
            missile: 1,
            energy: 1,

            fingerprint: fp_json_str
        }

        await setDoc(doc(firestore, "users", fp_hash), balances); // .then(() => {return balances;});

        return balances;
    }
}

module.exports = login;