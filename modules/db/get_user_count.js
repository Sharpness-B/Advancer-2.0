const { getDocs, collection } = require('firebase/firestore');

async function get_user_count(firestore) {
    const collectionRef = collection(firestore, "users");
    const querySnapshot = await getDocs(collectionRef);

    let count = 0;

    querySnapshot.forEach(() => {
        count ++;
    });

    return count;
}

module.exports = get_user_count;