window.onload = start;

function start() {
  init();
  brushCheck();
}

/**
 * Initializing the page.
 */
function init() {
  initTitle();
  initTopSites();
  initButtons();
}

/**
 * Sets eventlisteners to all the buttons.
 */
function initButtons() {
  document
    .getElementById('settings')
    .addEventListener('click', evt => setSideBarWidth('400px'));
  document
    .getElementById('closebtn')
    .addEventListener('click', evt => setSideBarWidth('0px'));
  document
    .getElementById('popup-close')
    .addEventListener('click', evt => popupClose());
}

/**
 * Initializes the title with the number of tabs you have open.
 */
function initTitle() {
  browser.tabs.query({}).then(tabs => {
    document.getElementById(
      'title'
    ).innerText = `You have ${tabs.length} tabs open`;
  });
}

/**
 * Initializes the sites container with top sites.
 */
function initTopSites() {
  browser.topSites.get({ limit: 10, includeFavicon: true }).then(sites => {
    var sitesContainer = document.querySelector('#sites-container');

    if (!sites.length) {
      sitesContainer.innerText = 'No sites returned from the topSites API.';
      return;
    }

    sitesContainer.innerHTML = sites.map(el => topSite(el)).join('');
  });
}

/**
 * Returns a template of top site.
 * @param {object} data
 */
function topSite(data) {
  return `<a href="${data.url}" class="top-site-container">
			<div class="top-site" style="background-image: url(${data.favicon})"></div>
			<span>${data.title}</span>
		</a>`;
}

/**
 * Sets the width of the Sidebar;
 * @param {string} width
 */
function setSideBarWidth(width) {
  document.getElementById('sidebar').style.width = width;
}

function tryLocalStorageBool(key) {
  return localStorage.getItem(key) === 'true';
}

function popupClose() {
  document.getElementsByClassName('popup')[0].classList.remove('is-visible');
}

function setPopup(displayText, confirmFunc, denyFunc) {
  document.getElementById('btn-deny').onclick = denyFunc;
  document.getElementById('btn-confirm').onclick = confirmFunc;
  document.getElementsByClassName('popup-content')[0].innerHTML = displayText;
}

function brushCheck() {
  const time = new Date();
  let morningBrush = tryLocalStorageBool('morningBrush');
  let eveningBrush = tryLocalStorageBool('eveningBrush');

  let hour = time.getHours();
  if (!morningBrush && hour >= 6 && hour <= 12) {
    document.getElementsByClassName('popup')[0].classList.add('is-visible');
    setPopup(
      'Good morning, have you brushed your teeth?',
      () => {
        localStorage.setItem('morningBrush', 'true');
        localStorage.setItem('eveningBrush', 'false');
        morningBrush = true;
        popupClose();
      },
      () => {
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
      () => {
        localStorage.setItem('eveningBrush', 'true');
        localStorage.setItem('morningBrush', 'false');
        eveningBrush = true;
        popupClose();
      },
      () => {
        localStorage.setItem('eveningBrush', 'false');
        eveningBrush = false;
        popupClose();
      }
    );
  }
}
