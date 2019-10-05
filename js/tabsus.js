window.onload = function() {
  const time = new Date();

  let body = document.getElementsByTagName('body')[0];

  let morningBrush = false;
  let eveningBrush = false;

  function setup() {
    body.style.backgroundColor = localStorage.backgroundColor;
    setTitle();
    setupTopSites();
  }

  function setupTopSites() {
    browser.topSites.get({ limit: 10, includeFavicon: true }).then(sites => {
      var div = document.getElementById('sites-container');

      if (!sites.length) {
        div.innerText = 'No sites returned from the topSites API.';
        return;
      }

      // inserting the topsites dynamicly
      for (let site of sites) {
        console.log(site);
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

  function timeChecks() {
    let hour = time.getHours();

    if (!morningBrush && hour >= 6 && hour <= 12) {
      console.log('Good morning, have you brushed your teeth?');
    }
    if (!eveningBrush && hour >= 22) {
      console.log("It's almost bedtime, have you brushed your teeth?");
    }
  }

  setup();
  timeChecks();

  document
    .getElementById('settings')
    .addEventListener('click', setSideBarWidth.bind(null, '400px'));
  document
    .getElementById('closebtn')
    .addEventListener('click', setSideBarWidth.bind(null, '0px'));

  function watchColorPicker(event) {
    document.querySelectorAll('p').forEach(function(p) {
      p.style.color = event.target.value;
    });
  }
};
