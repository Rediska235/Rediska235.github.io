const inputField = document.getElementById("inputPassword");

const range = document.getElementById("range");
const counter = document.getElementById("counter");
const upperBox = document.getElementById("upper");
const numberBox = document.getElementById("numbers");
const symbolsBox = document.getElementById("symbols");

const lower = "qwertyuiopasdfghjklzxcvbnm";
const upper = lower.toUpperCase();
const numbers = "0123456789";
const symbols = "!@#$%^&*()_-=+/";

var allowedSymbols = lower;
var prevLengthValue = 0;

updateAllowedSymbols();
generate();

function updateAllowedSymbols() {
  var str = lower;

  if (upperBox && upperBox.checked) {
    str += upper;
  }
  if (numberBox && numberBox.checked) {
    str += numbers;
  }
  if (symbolsBox && symbolsBox.checked) {
    str += symbols;
  }

  allowedSymbols = str;
}

function generate() {
  var password = "";
  for (var i = 0; i < range.value; i++) {
    password += generateChar();
  }

  inputField.value = password;
}

function generateChar() {
  var index = getRandom(0, allowedSymbols.length);
  return allowedSymbols[index];
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

document.addEventListener('DOMContentLoaded', function () {
  inputField.addEventListener('click', function () {
    inputField.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    var popupContainer = document.getElementById('popup-container');
    popupContainer.style.opacity = '1';
    popupContainer.style.visibility = 'visible';

    setTimeout(function () {
      popupContainer.style.opacity = '0';
      popupContainer.style.visibility = 'hidden';
    }, 800);
  });

  range.addEventListener('input', function () {

    if(range.value < prevLengthValue) {
      inputField.value = inputField.value.substring(0, range.value);
    }

    if(range.value > prevLengthValue) {
      for(var i = prevLengthValue; i < range.value; i++) {
        inputField.value = inputField.value + generateChar();
      }
    }

    counter.innerHTML = range.value;
    prevLengthValue = range.value;
  });
});
