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

generate();

function counterUpdate() {
  counter.innerHTML = range.value;
}

function generate() {
  var password = "";
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

  for (var i = 0; i < range.value; i++) {
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



document.addEventListener('DOMContentLoaded', function () {
  inputField.addEventListener('click', function () {
    inputField.select();

    try {
      var successful = document.execCommand('copy');
      var message = successful ? 'Text copied!' : 'Unable to copy text.';
      console.log(message);
    } catch (err) {
      console.log('Unable to copy text.');
    }
    window.getSelection().removeAllRanges();

    var popupContainer = document.getElementById('popup-container');
    popupContainer.style.opacity = '1';
    popupContainer.style.visibility = 'visible';

    setTimeout(function () {
      popupContainer.style.opacity = '0';
      popupContainer.style.visibility = 'hidden';
    }, 800);
  });
});
