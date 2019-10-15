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
  browser.topSites.get({ limit: 15, includeFavicon: true }).then(sites => {
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
  console.log(data.url);

  return `<a href="${data.url}" class="top-site-card">
			<div class="top-site" style="background-image: url(${
        data.favicon != null ? data.favicon : '../icons/unknown.png'
      })"></div>
			<span>${data.title ? data.title : data.url}</span>
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
  document.querySelector('.popup').classList.remove('is-visible');
}

/**
 * Displays a popup and sets the text and what happens when confirm
 * and deny buttons are pressed;
 * @param {String} displayText
 * @param {Function} confirmBtn
 * @param {Function} denyBtn
 */
function setPopup(displayText, confirmBtn, denyBtn) {
  document.querySelector('.popup').classList.add('is-visible');
  document.querySelector('.popup-content').innerHTML = displayText;
  document.getElementById('btn-confirm').onclick = confirmBtn;
  document.getElementById('btn-deny').onclick = denyBtn;
}

function isMorning() {
  const date = new Date();
  return date.getHours() >= 1 && date.getHours() <= 12;
}

function isEvening() {
  const date = new Date();
  return date.getHours() >= 20;
}

/**
 * Checks if user should go and brush their teeth and sends popup for verification.
 */
function brushCheck() {
  let brush = getBrushState();

  if (!brush.morningIsDone && isMorning()) {
    setPopup(
      'Good morning, have you brushed your teeth?',
      () => {
        setBrushState(true, false);
        popupClose();
      },
      () => {
        setBrushState(false, false);
        popupClose();
      }
    );
  }

  if (!brush.eveningIsDone && isEvening()) {
    setPopup(
      "It's almost bedtime, have you brushed your teeth?",
      () => {
        setBrushState(false, true);
        popupClose();
      },
      () => {
        setBrushState(false, false);
        popupClose();
      }
    );
  }
}

/**
 * Sets brushState to localstorage and returns the new brush state
 * @param {boolean} morningIsDone
 * @param {boolean} eveningIsDone
 * @returns {object} newBrushState
 */
function setBrushState(morningIsDone, eveningIsDone) {
  let newBrushState = {
    date: new Date(),
    morningIsDone: morningIsDone,
    eveningIsDone: eveningIsDone
  };

  localStorage.setItem('brushState', JSON.stringify(newBrushState));

  return newBrushState;
}

function getBrushState() {
  let brush = localStorage.getItem('brushState');

  try {
    brush = JSON.parse(brush);
    if (isNewBrushDay(brush.date)) {
      brush = setBrushState(false, false);
    }
    return brush;
  } catch (error) {
    return setBrushState(false, false);
  }
}

function isNewBrushDay(brushDate) {
  return new Date(brushDate).getDay() !== new Date().getDay();
}
