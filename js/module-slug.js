let domainOf = url => {
    try { return new URL(url).hostname; }
    catch { return '(invalid)';        }
    };
    var inFrame = function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
    var isDifferentDomain = function () {
        try {
            return window.top.location.hostname !== window.location.hostname;
        } catch (e) {
            return true;
        }
    }
    async function loadGameLists() {
        try {
            var time = new Date().getTime();
            // Load detailList from JSON file
            var detailResponse = await fetch('https://webglmath.github.io/data-slug/detail.json?t='+time);
            var detailList = await detailResponse.json();
            
            // Load moreGameList from JSON file
            var moreGameResponse = await fetch('https://webglmath.github.io/data-slug/more-game.json?t='+time);
            var moreGameList = await moreGameResponse.json();
            
            var whitelistResponse = await fetch('https://webglmath.github.io/data-slug/whitelist.json?t='+time);
            var whitelist = await whitelistResponse.json();
            return { detailList, moreGameList,whitelist };
        } catch (error) {
            console.error('Error loading game lists:', error);
            // Return empty arrays as fallback
            return { detailList: [], moreGameList: [], whitelist: [] };
        }
    }
    async function loadGameBkList(){
        try {
            var time = new Date().getTime();
            var detailResponse = await fetch('https://webglmath.github.io/data-slug/detail_bk.json?t='+time);
            var detailListBk = await detailResponse.json();
            
            // Load moreGameList from JSON file
            var moreGameResponse = await fetch('https://webglmath.github.io/data-slug/more-game_bk.json?t='+time);
            var moreGameListBk = await moreGameResponse.json();
            return { detailListBk, moreGameListBk };
        } catch (error) {
            console.error('Error loading game lists:', error);
            // Return empty arrays as fallback
            return { detailList: [], moreGameList: [] };
        }
    }
    function getSpecialWhitelistValue(slugFirst, whitelist) {
        try {
            if (!whitelist || !whitelist.special || typeof whitelist.special !== 'object') {
                return null;
            }
            
            // Direct key match
            if (whitelist.special.hasOwnProperty(slugFirst)) {
                return whitelist.special[slugFirst];
            }
            
            // Case-insensitive match
            const specialKeys = Object.keys(whitelist.special);
            for (let key of specialKeys) {
                if (key.toLowerCase() === slugFirst.toLowerCase()) {
                    return whitelist.special[key];
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error getting special whitelist value:', error);
            return null;
        }
    }
    function getRepaceValue(slugFirst, whitelist) {
        try {
            if (!whitelist || !whitelist.replaceSlugs || typeof whitelist.replaceSlugs !== 'object') {
                return null;
            }
            
            // Direct key match
            if (whitelist.replaceSlugs.hasOwnProperty(slugFirst)) {
                return whitelist.replaceSlugs[slugFirst];
            }
            
            // Case-insensitive match
            const specialKeys = Object.keys(whitelist.replaceSlugs);
            for (let key of specialKeys) {
                if (key.toLowerCase() === slugFirst.toLowerCase()) {
                    return whitelist.replaceSlugs[key];
                }
            }
            
            return null;
        } catch (error) {
            
            return null;
        }
    }
    function createParams(iframeUrl, host){
        var params = new URLSearchParams({
            iframe_url: iframeUrl,
            host: host
        });
        return params.toString();
    }
    function createButton(newUrl){
        var button = document.createElement('button');
        button.innerHTML = 'Play Now';
        button.onclick = function() {
            window.open(newUrl, '_blank');
        };
        button.style.position = 'fixed';
        button.style.bottom = '0px';
        // button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#000';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.5)';
        button.style.transition = 'all 0.3s ease';
        button.style.textTransform = 'uppercase';
        button.style.letterSpacing = '1px';
        button.style.textAlign = 'center';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.gap = '10px';
        button.style.width = '100%';
        button.style.height = '100%';
        button.style.margin = '0 auto';
        button.style.padding = '0px';
        document.body.appendChild(button);
    }
    async function rdSite(){
        var iframeUrl  = location.href;
        var parentHost = domainOf(document.referrer || '(no-referrer)');
        var iframeUrl  = location.href;
        if(parentHost == "eggycaronline.io"){
            return;
        }
    
        let urlObj = new URL(iframeUrl);
        let slugFirst = urlObj.pathname.split('/').filter(Boolean).pop() || '';
        slugFirst = slugFirst.replace('.html', '');
        // console.log('Slug:', slugFirst, iframeUrl);
        let { detailList, moreGameList, whitelist } = await loadGameLists();
        // console.log(whitelist);
        if(whitelist.slugs.includes(slugFirst) == true){
            return;
        }
        if(whitelist.domains.includes(parentHost) == true){
            return;
        }
        if(slugFirst){
            if(whitelist.slugs.includes(slugFirst) == true){
                return;
            }
        }
        if(slugFirst == "eggy-car"){
            var baseUrl = `https://eggycaronline.io/play.html`;
            var params = createParams(iframeUrl, parentHost);            
            var newUrl = `${baseUrl}?${params.toString()}`;
            if (inFrame() & isDifferentDomain()) {
                try {
                    window.top.location.href = newUrl;
                } catch (e) {
                    createButton(newUrl);
                }
            }
        }
        // Check special whitelist
        var specialWhitelist = getSpecialWhitelistValue(slugFirst, whitelist);
        if(specialWhitelist != null){
            if(specialWhitelist.includes(parentHost) == true){
                return;
            }
        }
        var replaceSlug = getRepaceValue(slugFirst, whitelist);
        if(replaceSlug != null){
            slugFirst = replaceSlug;
        }
        var { detailListBk, moreGameListBk } = await loadGameBkList();
        if(detailListBk.includes(slugFirst) == true){
            var baseUrl = `https://eggycaronline.io/detail/${slugFirst}.html`;
            var params = createParams(iframeUrl, parentHost);
            var newUrl = `${baseUrl}?${params.toString()}`;
            createButton(newUrl);
        }
        if(moreGameListBk.includes(slugFirst) == true){
            var baseUrl = `https://eggycaronline.io/more-game/${slugFirst}.html`;
            var params = createParams(iframeUrl, parentHost);
            var newUrl = `${baseUrl}?${params.toString()}`;
            createButton(newUrl);
        }
        /*if(parentHost.includes(".github.io") == true){
            var { detailListBk, moreGameListBk } = await loadGameBkList();
            if(detailListBk.includes(slugFirst) == true){
                var baseUrl = `https://eggycaronline.io/detail/${slugFirst}.html`;
                var params = createParams(iframeUrl, parentHost);
                var newUrl = `${baseUrl}?${params.toString()}`;
                createButton(newUrl);
            }
            if(moreGameListBk.includes(slugFirst) == true){
                var baseUrl = `https://eggycaronline.io/more-game/${slugFirst}.html`;
                var params = createParams(iframeUrl, parentHost);
                var newUrl = `${baseUrl}?${params.toString()}`;
                createButton(newUrl);
            }
        }
        if(detailList.includes(slugFirst) == true){
            var baseUrl = `https://eggycaronline.io/detail/${slugFirst}.html`;
            var params = createParams(iframeUrl, parentHost);
            var newUrl = `${baseUrl}?${params.toString()}`;
            createButton(newUrl);
        }
        if(moreGameList.includes(slugFirst) == true){
            var baseUrl = `https://eggycaronline.io/more-game/${slugFirst}.html`;
            var params = createParams(iframeUrl, parentHost);
            var newUrl = `${baseUrl}?${params.toString()}`;
            createButton(newUrl);
        }*/
    }
    // rdSite();
    window.rdSite = rdSite;