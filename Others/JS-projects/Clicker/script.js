document.getElementById('btn1').addEventListener("click", oneBucks)

var money = 0;

var elMoney = document.getElementById("money");

function updateMoneyText()
{
    elMoney.innerHTML = money + "$";
}

function oneBucks() {
    money++;
    updateMoneyText();
}

function fiveBucks() {
    money += 5;
    updateMoneyText();
}

function buy(el, cost, text, func) {
    if(money >= cost){
        money -= cost;
        updateMoneyText();
        
        el.innerHTML = text;
        el.classList.add('btn-active');
        el.onclick = func;
    }
}

function buyWorker(cost) {
    if(money >= cost){
        money -= cost;
        updateMoneyText();
        
        setInterval(function () {
            money++;
            updateMoneyText();
        }, 1000);
    }
}