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

      // inserting the topsites dynamically
      for (let site of sites) {
        let a = document.createElement('a');
        a.className = 'top-site-container';
        a.href = site.url;
        let box = document.createElement('div');
        box.style.backgroundImage = site.favicon;
        box.style.backgroundImage = `url(${site.favicon})`;
        box.className = 'top-site';
        let span = document.createElement('span');

        span.innerText = site.title.split(':')[0].split('-')[0];
        a.appendChild(box);
        a.append(span);
        div.appendChild(a);
      }
    });
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

  function setPopup(text, confirmFunc, denyFunc) {
    document.getElementById('btn-deny').onclick = denyFunc;
    document.getElementById('btn-confirm').onclick = confirmFunc;
    document.getElementsByClassName('popup-content')[0].innerHTML = text;
  }

  setup();
  brushCheck();

  // connecting buttons to functions;
  document
    .getElementById('settings')
    .addEventListener('click', setSideBarWidth.bind(null, '400px'));
  document
    .getElementById('closebtn')
    .addEventListener('click', setSideBarWidth.bind(null, '0px'));

  document.getElementById('popup-close').addEventListener('click', popupClose);
};

function tryLocalStorageBool(key) {
  return localStorage.getItem(key) === 'true';
}
