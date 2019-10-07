window.onload = function() {
  const time = new Date();

  let body = document.getElementsByTagName('body')[0];

  let morningBrush = tryLocalStorageBool('morningBrush');
  let eveningBrush = tryLocalStorageBool('eveningBrush');

  // setting up the style depending on user settings.
  function setup() {
    body.style.backgroundColor = localStorage.backgroundColor;
    setTitle();
    setupTopSites();
  }

  // Loads in top 10 sites.
  function setupTopSites() {
    browser.topSites.get({ limit: 10, includeFavicon: true }).then(sites => {
      var div = document.getElementById('sites-container');

      if (!sites.length) {
        div.innerText = 'No sites returned from the topSites API.';
        return;
      }

      document.querySelector('#sites-container').innerHTML = sites
        .map(el => topSite(el))
        .join('');
    });
  }

  function topSite(data) {
    return `<a href="${data.url}" class="top-site-container">
				<div class="top-site" style="background-image: url(${data.favicon})"></div>
				<span>${data.title}</span>
			</a>`;
  }

  function setSideBarWidth(width) {
    document.getElementById('sidebar').style.width = width;
  }

  function setTitle() {
    browser.tabs.query({}).then(tabs => {
      document.getElementById(
        'title'
      ).innerText = `You have ${tabs.length} tabs open`;
    });
  }

  function brushCheck() {
    let hour = time.getHours();
    if (!morningBrush && hour >= 6 && hour <= 12) {
      document.getElementsByClassName('popup')[0].classList.add('is-visible');
      setPopup(
        'Good morning, have you brushed your teeth?',
        function() {
          localStorage.setItem('morningBrush', 'true');
          localStorage.setItem('eveningBrush', 'false');
          morningBrush = true;
          popupClose();
        },
        function() {
          localStorage.setItem('morningBrush', 'false');
          morningBrush = false;
          popupClose();
        }
      );
      eveningBrush = false;
      morningBrush = true;
    }
    if (!eveningBrush && (hour >= 22 || (hour >= 0 && hour <= 3))) {
      document.getElementsByClassName('popup')[0].classList.add('is-visible');
      setPopup(
        "It's almost bedtime, have you brushed your teeth?",
        function() {
          localStorage.setItem('eveningBrush', 'true');
          localStorage.setItem('morningBrush', 'false');
          eveningBrush = true;
          popupClose();
        },
        function() {
          localStorage.setItem('eveningBrush', 'false');
          eveningBrush = false;
          popupClose();
        }
      );
    }
  }

  function popupClose() {
    document.getElementsByClassName('popup')[0].classList.remove('is-visible');
  }

  function setPopup(displayText, confirmFunc, denyFunc) {
    document.getElementById('btn-deny').onclick = denyFunc;
    document.getElementById('btn-confirm').onclick = confirmFunc;
    document.getElementsByClassName('popup-content')[0].innerHTML = displayText;
  }

  setup();
  brushCheck();

  // connecting buttons to functions;
  document
    .getElementById('settings')
    .addEventListener('click', evt => setSideBarWidth('400px'));
  document
    .getElementById('closebtn')
    .addEventListener('click', evt => setSideBarWidth('0px'));
  document
    .getElementById('popup-close')
    .addEventListener('click', evt => popupClose());
};

function tryLocalStorageBool(key) {
  return localStorage.getItem(key) === 'true';
}
