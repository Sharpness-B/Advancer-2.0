const { doc, getDoc, setDoc } = require('firebase/firestore');

async function login(firestore, fp_hash, fp_json_str) {
    const docRef = doc(firestore, "users", fp_hash);
    const docSnap = await getDoc(docRef);

    let balances;

    // if user already exists
    if (docSnap.exists()) {
        balances = docSnap.data();
    } 

    // if new user
    else {
        balances = {
            gold: 30,
    
            armor: 1,
            speed: 1,
            laser: 1,
            missile: 1,
            energy: 1,

            login_datetimes: [],
            previous_login_datetime: null,
            number_of_visits: null,

            fingerprint: fp_json_str
        }
    }

    // add login date
    if (!balances.login_datetimes) {
        balances.login_datetimes = []
    }

    now = new Date()

    balances.previous_login_datetime = now
    balances.login_datetimes.push( now )

    balances.number_of_visits = balances.login_datetimes.length
    

    await setDoc(doc(firestore, "users", fp_hash), balances); // .then(() => {return balances;});

    return balances;
}

module.exports = login;