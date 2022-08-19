var timerText = document.getElementById('timerText');
var date = new Date();

updateTimer();
setInterval(updateTimer, 1000);

function updateTimer() {
    date = new Date();
    var zero = "";

    if(date.getSeconds() < 10)
        zero = 0;

    timerText.innerHTML = date.getHours() + ":" + date.getMinutes() + ":" + zero + date.getSeconds();
}