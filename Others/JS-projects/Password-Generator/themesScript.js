const root = document.querySelector(':root');
var isChanged = false;

function changeTheme() {
    changeColors();
    isChanged = !isChanged;
}

function changeColors() {

    if(isChanged){
        // default theme
        root.style.setProperty('--backgroundColor', '#629098');
        root.style.setProperty('--mainColor', '#4c3457');
        root.style.setProperty('--textColor', '#ffe7cd');
        root.style.setProperty('--btnColor', '#e4a39f');
        root.style.setProperty('--btnHoverColor', '#ebb7b4');
        root.style.setProperty('--btnTextColor', 'black');
    }
    else{
        // second theme
        root.style.setProperty('--backgroundColor', '#4a2480');
        root.style.setProperty('--mainColor', '#051f39');
        root.style.setProperty('--textColor', '#ff8e80');
        root.style.setProperty('--btnColor', '#c53a9d');
        root.style.setProperty('--btnHoverColor', '#ca87b7');
        root.style.setProperty('--btnTextColor', 'black');
    }
}