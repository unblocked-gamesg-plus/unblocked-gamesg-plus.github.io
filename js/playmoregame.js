function open_fullscreen() {
	let game = document.getElementById("game-element");
	if (game.requestFullscreen) {
	  game.requestFullscreen();
	} else if (game.mozRequestFullScreen) { /* Firefox */
	  game.mozRequestFullScreen();
	} else if (game.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
	  game.webkitRequestFullscreen();
	} else if (game.msRequestFullscreen) { /* IE/Edge */
	  game.msRequestFullscreen();
	}
};
// Function to get URL parameters
function getUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  return {
      iframeUrl: params.get('iframe_url'),
      host: params.get('host')
  };
}
function storeIframeUrl(iframeUrl, expiryHours = 168) {
  if (!iframeUrl) {
      console.warn('No iframe URL provided to store');
      return false;
  }
  
  try {
      const storageData = {
          url: iframeUrl,
          timestamp: new Date().getTime(),
          expiry: new Date().getTime() + (expiryHours * 60 * 60 * 1000)
      };
      const currentUrl = window.location.href;
      const urlWithoutParams = currentUrl.split('?')[0];
      localStorage.setItem('tbg95_iframe_'+urlWithoutParams, JSON.stringify(storageData));
      console.log('Iframe URL stored successfully:', iframeUrl);
      return true;
  } catch (error) {
      console.error('Error storing iframe URL to localStorage:', error);
      return false;
  }
}

function getStoredIframeUrl(checkExpiry = true) {
  try {
      const currentUrl = window.location.href;
      const urlWithoutParams = currentUrl.split('?')[0];
      const storeItemName = 'tbg95_iframe_'+urlWithoutParams;
      const storedData = localStorage.getItem(storeItemName);
      
      if (!storedData) {
          return null;
      }
      
      const data = JSON.parse(storedData);
      
      // Check if URL has expired
      if (checkExpiry && data.expiry && new Date().getTime() > data.expiry) {
          console.log('Stored iframe URL has expired');
          localStorage.removeItem(storeItemName);
          return null;
      }
      return data.url;
  } catch (error) {
      console.error('Error retrieving iframe URL from localStorage:', error);
      return null;
  }
}

function playGame(){
    var tmp = document.querySelector('#game-arena').dataset.url;
    const params = getUrlParameters();
    if(params.iframeUrl){
        tmp = params.iframeUrl;
        storeIframeUrl(tmp);
    } else {
        // Try to get from localStorage if not in URL params
        const storedUrl = getStoredIframeUrl();
        if(storedUrl){
            tmp = storedUrl;
        }
    }
    document.querySelector('#game-arena').innerHTML = `<iframe id="game-element" allowfullscreen="" allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" name="gameFrame" scrolling="no" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads" src="${tmp}"></iframe>`;
}
function loadGA(){
    if(window.location.host == 'eggycaronline.io'){
        var  r = document.createElement("script");
    	r.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-RZ2JYMQPM2"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-RZ2JYMQPM2', {
                'cookie_flags': 'SameSite=None;Secure'
              });
        },document.head.appendChild(r);
    }
}
window.addEventListener('load', function() {
    loadGA();
});