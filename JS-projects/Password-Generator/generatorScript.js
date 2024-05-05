const inputField = document.getElementById("pass");

const range = document.getElementById("range");
const counter = document.getElementById("counter");
const upperBox = document.getElementById("upper");
const numberBox = document.getElementById("numbers");
const symbolsBox = document.getElementById("symbols");

const lower = "qwertyuiopasdfghjklzxcvbnm";
const upper = lower.toUpperCase();
const numbers = "0123456789";
const symbols = "!@#$%^&*()_-=+/";

generate();

function counterUpdate(){
  counter.innerHTML = range.value;
}

function generate() {
  var password = "";
  var str = lower;

  if(upperBox && upperBox.checked){
    str += upper;
  }
  if(numberBox && numberBox.checked){
    str += numbers;
  }
  if(symbolsBox && symbolsBox.checked){
    str += symbols;
  }

  for(var i = 0; i < range.value; i++){
    password += generateChar(str);
  }

  inputField.value = password;
}

function generateChar(str) {
  var index = getRandom(0, str.length);
  return str[index];
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function copy(){
  inputField.select();
  document.execCommand("copy");

  var popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(function(){
    popup.classList.remove("show");
  }, 2000);
}