function logEventGame(id, type){
    analytics.logEvent(id, {
        type: type
    }); 

  }
function loadMainGame(){
    $('#preload').remove();
    $('.game-iframe-container').html('<iframe class="game-iframe" id="game-area" src="https://ubg77.github.io/edit/motoroadrash3d/" width="400" height="800" scrolling="none" frameborder="0" allowfullscreen=""></iframe>');
    logEventGame("road-rash-3d", "play");
    
}
function loadGame(slug){
    fetch("game/all.json",{
        headers: {
            'Content-Type': 'application/json',
            },
    }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=0; j<listGame.length; j++) {
            if (listGame[j].slug == slug) {
                var tmp_url = '';
                if(listGame[j].domain == 1){
                    tmp_url = 'https://webglmath.github.io/'+slug+"/";
                } else if(listGame[j].domain == 2){
                    tmp_url = 'https://ubg77.github.io/edit/'+slug+"/";
                }  else if(listGame[j].domain == 3){
                    tmp_url = 'https://ubg77.github.io/game131022/'+slug+"/";
                    
                }  else if(listGame[j].domain == 4){
                    tmp_url = 'https://ubg77.github.io/fix/'+slug+"/";
                    if(slug.indexOf("fnaf2") != -1){
                        tmp_url = 'https://ubg77.github.io/fix/'+slug;
                    }
                }
                document.getElementById("gameframe").setAttribute("src",tmp_url);
                // $('#gameframe').src = tmp_url;
                //$("html, body").animate({ scrollTop: 0 }, "slow");
                break;
            }
        }
    });
}
var search = window.location.search;
if(search){
    // loadGame(search.replace('?class=',''));
    //addAdsClass();
}
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
// Function to get URL parameters
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        iframeUrl: params.get('iframe_url'),
        host: params.get('host')
    };
}

// Function to validate parameters
function validateParameters(params) {
    if (!params.iframeUrl || !params.host) {
        return false;
    }
    
    try {
        new URL(params.iframeUrl); // Validate URL format
        return true;
    } catch (e) {
        console.error('Invalid iframe_url parameter');
        return false;
    }
}

function initializeIframe() {
    try {
        const params = getUrlParameters();
        if (validateParameters(params)) {
            const iframe = document.querySelector('#game-arena');
            if (iframe) {
                iframe.dataset.url = params.iframeUrl;
                console.log('Game URL set successfully');
            }
        }
    } catch (e) {
        console.error('Error initializing game:', e);
    }
}

document.addEventListener('DOMContentLoaded', initializeIframe);

var listGame;
fetch("game/all.json",{
headers: {
    'Content-Type': 'application/json',
    },
}).then(response => response.json())
.then(data => {
    listGame = data;
});
function searchGame(){
    var x = document.getElementById("searchInput").value;
    console.log(x);
    let html = "";
    document.getElementById('listgame').innerHTML = '';
    for (var j=0; j<listGame.length; j++) {
        if (listGame[j].title.toUpperCase().indexOf(x.toUpperCase()) >= 0) {
            var item = listGame[j];
            var img = item.slug;
            if(item.img){
                img = item.img;
            }
            const htmlItem = `<div class="g-card">
                    <div class="pic">
                    <figure class="ratio ratio-1">
                        <a rel="noindex nofollow" title="${item.title}" onclick="showGame('${item.slug}')">
                        <img src="https://tbg95.co/${item.slug}/logo.png" class="small-thumb" alt="${item.title}">
                        </a>
                    </figure>
                    </div>
                    <div class="g-info">
                    <h3 class="grid-title ellipsis">
                        <a title="${item.title}" rel="noindex nofollow">${item.title}</a>
                    </h3>
        
                    <a class="bt-play" rel="noindex nofollow" title="${item.title}">
                        <img src="/images/play.svg" alt="Play game">
                    </a>
                    </div>
                </div>`;
            const e = document.createElement('div');
            e.className  = "column is-2-widescreen is-3-desktop is-4-tablet is-6-mobile show";
            e.innerHTML = htmlItem;  
            document.getElementById('listgame').appendChild(e);
        }
    }
    
}

function loadGA(){
    var  r = document.createElement("script");
	r.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-RZ2JYMQPM2"), r.setAttribute("type", "text/javascript"), r.setAttribute("crossOrigin", "anonymous"),  r.onload = function (){
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-RZ2JYMQPM2', {
            'cookie_flags': 'SameSite=None;Secure'
          });
        /*var ads = document.createElement('script');
        ads.setAttribute("src", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7889675448259925"), ads.setAttribute("type", "text/javascript"), ads.setAttribute("crossOrigin", "anonymous"), ads.onload = function(){
            (adsbygoogle = window.adsbygoogle || []).push({});
            (adsbygoogle = window.adsbygoogle || []).push({});
        },document.head.appendChild(ads);
        */
    },document.head.appendChild(r);
}
window.addEventListener('load', function() {
    loadGA();
});

function playUnityGame(gameUrl) {
    // Hide the splash screen
    document.querySelector('.talpa-splash-container').style.display = 'none';
    
    // Show loading indicator
    document.querySelector('.talpa-loader').style.display = 'block';
    
    // Create Unity game container
    const gameContainer = document.querySelector('#game-arena');
    gameContainer.innerHTML = `
        <iframe 
            id="game-element" 
            allowfullscreen="" 
            allow="autoplay; fullscreen; camera; focus-without-user-activation *; monetization; gamepad; keyboard-map *; xr-spatial-tracking; clipboard-write" 
            name="gameFrame" 
            scrolling="no" 
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads" 
            src="${gameUrl}"
            style="width: 100%; height: 100%; border: none;"
        ></iframe>
    `;
    
    // Hide loading indicator once iframe is loaded
    const iframe = document.getElementById('game-element');
    iframe.onload = function() {
        document.querySelector('.talpa-loader').style.display = 'none';
    };
}