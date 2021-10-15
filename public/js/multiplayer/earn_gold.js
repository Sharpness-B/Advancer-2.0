/* 

    Humans are very good at finding patterns! In fact, we are too god - we find patterns where there are none.

    This game challenges this idea. 

    Gold is simply paid out every 30 seconds. 

    While users are encouraged to figure out what acrobatics that makes your balance increase:)

    Can you find the pattern?

*/

function updateBalanceInGame(gold) {
    document.getElementById("balance").innerHTML = `${gold}§`
}

function fetch_add_gold() {
    if (document.getElementById("section_multiplayer_overlay").style.display == "none") {
        fetch("/add_gold", {method: 'POST'})
            .then(response => {
                if (response.ok) {
                    response.text()
                            .then(text => JSON.parse(text))
                            .then(balances => {                                
                                updateBalanceInGame(balances.gold);
                            });
                }

                else {
                    throw new Error('Request failed.');
                }
            })
            .catch(error => console.log(error));
    }
}

// load balance initially
(function fetch_and_update_ui() {
    fetch("/get_balances", {method: 'POST'})
        .then(response => {
            if (response.ok) {
                response.text()
                        .then(text => JSON.parse(text))
                        .then(balances => {
                            updateBalanceInGame(balances.gold);
                        });
            }

            else {
                throw new Error('Request failed.');
            }
        })
        .catch(error => console.log(error));
})()

// add gold every 30 seconds
setInterval(fetch_add_gold, 30000)