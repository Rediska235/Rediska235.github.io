document.getElementById('copy-btn').addEventListener('click', function() {
    var popupContainer = document.getElementById('popup-container');
    popupContainer.style.opacity = '1';
    popupContainer.style.visibility = 'visible';
    
    setTimeout(function() {
      popupContainer.style.opacity = '0';
      popupContainer.style.visibility = 'hidden';
    }, 800);
  });