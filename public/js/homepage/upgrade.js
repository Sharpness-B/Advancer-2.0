const upgrades = ['energy', 'missile', 'laser', 'speed', 'armor'];



function updateDotColors(balances) {
    upgrades.forEach(upgrade => {
        for (let l=2; l<=balances[upgrade]; l++) {
            const elementID = 'dot' + upgrade + l.toString();
            const element   = document.getElementById(elementID);
 
            element.classList.remove('dot');
            element.classList.add('dotFilled');
        }
    });
}

function updatePrices(balances) {
    const price = level => {
        if (level<5) return (level*10).toString() + '§';
        else         return 'maxed';      
    }

    upgrades.forEach(upgrade => {
        document.getElementById('button_' + upgrade).innerHTML = price(balances[upgrade])
    });
}

function updateBalance(gold) {
    document.getElementById('balance').innerHTML = gold.toString() + '§';
}



function fetch_and_update_ui(url) {
    fetch(url, {method: 'POST'})
        .then(response => {
            if (response.ok) {
                response.text()
                        .then(text => JSON.parse(text))
                        .then(balances => {
                            console.log(balances);
                            
                            updateDotColors(balances);
                            updatePrices(balances);
                            updateBalance(balances.gold);
                        });
            }

            else {
                throw new Error('Request failed.');
            }
        })
        .catch(error => console.log(error));
}



// load prices and levels initially
fetch_and_update_ui('/get_balances')

// handle purchase, then update ui
upgrades.forEach(upgrade => {
    document.getElementById('button_' + upgrade).onclick = function() {
        console.log(upgrade);

        fetch_and_update_ui(`/transaction/${upgrade}`)
    };
});