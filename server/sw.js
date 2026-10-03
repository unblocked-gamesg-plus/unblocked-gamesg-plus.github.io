(function() {
	//#region src/sw/index.ts
	/**
	* GameServiceWorker — Backend Proxy Pattern
	*
	* Flow:
	*   iframe src="/resource/{slug}"
	*   → SW intercepts /resource/{slug}
	*   → fetch BACKEND_URL/{slug}/index.html với X-Game-Token
	*   → inject XHR/fetch interceptor vào HTML response
	*   → game HTML trả về browser, sub-assets cũng qua backend
	*
	*   /resource/{slug}/path/to/file
	*   → SW intercepts → fetch BACKEND_URL/{slug}/path/to/file
	*   → cached trong CACHE_GAMES
	*
	* Không cần upload static. Backend host tất cả game files.
	*/
	var GameServiceWorker = class {
		cfg;
		constructor(config) {
			this.cfg = config;
			self.addEventListener("install", this.onInstall.bind(this));
			self.addEventListener("activate", this.onActivate.bind(this));
			self.addEventListener("fetch", this.onFetch.bind(this));
		}
		onInstall(event) {
			event.waitUntil(caches.open(this.cfg.cacheNames.site).then((c) => c.addAll(this.cfg.precacheAssets)).then(() => self.skipWaiting()));
		}
		onActivate(event) {
			const keep = Object.values(this.cfg.cacheNames);
			event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
		}
		onFetch(event) {
			if (event.request.method !== "GET") return;
			const url = new URL(event.request.url);
			if (!url.pathname.startsWith("/resource/") && (url.search.includes("?import") || url.search.includes("v=") || url.pathname.startsWith("/src/") || url.pathname.startsWith("/@") || url.pathname.startsWith("/node_modules/") || url.pathname.endsWith(".ts") || url.pathname.endsWith(".tsx") || url.pathname.endsWith(".jsx") || url.pathname.endsWith(".vue"))) return;
			if (url.origin === self.location.origin && url.pathname.startsWith("/resource/")) {
				const after = url.pathname.slice(10);
				const slashIdx = after.indexOf("/");
				const slug = slashIdx === -1 ? after : after.slice(0, slashIdx);
				const subPath = slashIdx === -1 ? null : after.slice(slashIdx);
				if (slug) {
					event.respondWith(this.proxyToBackend(slug, subPath, url.search, event.request));
					return;
				}
			}
			if (url.origin === self.location.origin && event.request.referrer) try {
				const match = new URL(event.request.referrer).pathname.match(/^\/resource\/([^/]+)/);
				if (match) {
					const slug = match[1];
					event.respondWith(this.proxyToBackend(slug, url.pathname, url.search, event.request));
					return;
				}
			} catch (e) {}
			if (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) {
				event.respondWith(this.cacheFirst(event.request, this.cfg.cacheNames.site));
				return;
			}
			const isHtmlRoute = url.pathname === "/" || url.pathname.startsWith("/g/") || [
				"/about",
				"/contact",
				"/privacy"
			].some((p) => url.pathname.startsWith(p));
			if (url.origin === self.location.origin && isHtmlRoute) {
				event.respondWith(this.networkFirstTTL(event.request, this.cfg.cacheNames.pages, this.cfg.ttl.pages));
				return;
			}
			if (url.hostname === "wsrv.nl") {
				event.respondWith(this.staleWhileRevalidate(event.request, this.cfg.cacheNames.images));
				return;
			}
		}
		/**
		* Proxy /resource/{slug}[/subPath] → BACKEND_URL/{slug}[/subPath]
		* Caches response. HTML responses get XHR/fetch interceptor injected.
		*/
		async proxyToBackend(slug, subPath, search, req) {
			const path = subPath ?? "/index.html";
			const targetUrl = `${this.cfg.proxy.backendUrl}/${slug}${path}${search}`;
			console.log(`🌐 [SW-Proxy] Fetching: ${targetUrl}`);
			try {
				const res = await fetch(targetUrl, {
					method: req.method,
					headers: { "X-Game-Token": this.cfg.proxy.token },
					mode: "cors",
					credentials: "omit"
				});
				let finalRes = res;
				if (res.status === 200) {
					const contentType = res.headers.get("content-type") ?? "";
					if (contentType.includes("text/plain") || contentType.includes("text/html")) {
						const trimmed = (await res.clone().text()).trim();
						if (trimmed === "404 Not Found" || trimmed === "File Not Found" || trimmed.includes("<title>404 Not Found</title>") || trimmed.includes("<h1>Not Found</h1>")) {
							console.warn(`⚠️ [SW] Detected fake 200 OK (actually 404) for: ${targetUrl}`);
							finalRes = new Response("404 Not Found", {
								status: 404,
								statusText: "Not Found",
								headers: { "Content-Type": "text/plain" }
							});
						}
					}
				}
				if (!finalRes.ok) {
					console.warn(`⚠️ [SW] Backend ${finalRes.status} for: ${targetUrl}`);
					return finalRes;
				}
				if ((res.headers.get("content-type") ?? "").includes("text/html")) {
					let html = await res.text();
					html = this.injectInterceptor(html, slug);
					const headers = new Headers();
					headers.set("Content-Type", "text/html; charset=utf-8");
					headers.set("sw-cached-at", String(Date.now()));
					return new Response(html, {
						headers,
						status: 200
					});
				}
				const h = new Headers(res.headers);
				h.set("sw-cached-at", String(Date.now()));
				return new Response(res.body, {
					headers: h,
					status: res.status
				});
			} catch (err) {
				console.error(`❌ [SW] Backend proxy failed for /${slug}${subPath ?? ""}:`, err);
				return new Response("Error connecting to Game Server.", { status: 502 });
			}
		}
		/**
		* Inject <base> tag and XHR + fetch interceptor into game HTML.
		*
		* Purpose:
		*   1. <base href="/resource/{slug}/"> forces the browser to resolve relative paths
		*      like "html5game/splash.png" to "/resource/{slug}/html5game/splash.png" instead of "/html5game/splash.png".
		*   2. XHR/fetch rewrite function intercepts AJAX requests and appends auth headers.
		*/
		injectInterceptor(html, slug) {
			const { backendUrl: B, token: T } = this.cfg.proxy;
			const baseHref = `/resource/${slug}/`;
			const interceptorCode = `(function(){
  var B=${JSON.stringify(B)},T=${JSON.stringify(T)},SL=${JSON.stringify(slug)};
  var BASE='/resource/'+SL+'/';

  function rewrite(u){
    if(!u||typeof u!=='string')return null;
    if(u.startsWith('/resource/'+SL))return null;
    if(u.startsWith(B))return null;
    if(u.startsWith('http')){
      try{
        var urlObj = new URL(u);
        if(urlObj.origin === self.location.origin) {
          if(!urlObj.pathname.startsWith('/resource/')) {
            return '/resource/'+SL+urlObj.pathname;
          }
          return null;
        }
        return '/resource/'+SL+urlObj.pathname;
      }catch(e){return null;}
    }
    if(u.startsWith('/')){
      return '/resource/'+SL+u;
    }
    return BASE+u;
  }

  // Patch XHR
  var oX=XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open=function(m,u,a){
    var r=rewrite(u+'');
    if(r){
      // Synchronous XHR on main thread cannot be intercepted by Service Worker!
      // In this case, rewrite directly to absolute backend URL.
      if(a===false){
        // Slice "/resource/{slug}" (10 + slug.length) to get only the remaining relative path
        var relativePart = r.slice(10 + SL.length);
        r = B + (B.endsWith('/') ? '' : '/') + SL + relativePart;
      }
      arguments[1]=r;
      var oS=this.send;
      this.send=function(b){
        try{this.setRequestHeader('X-Game-Token',T);}catch(e){}
        return oS.call(this,b);
      };
    }
    return oX.apply(this,arguments);
  };

  // Patch fetch
  var oF=self.fetch;
  self.fetch=function(u,o){
    var us=typeof u==='string'?u:(u&&u.url)||'';
    var r=rewrite(us);
    if(r){
      o=Object.assign({},o||{});
      o.headers=Object.assign({},o.headers instanceof Headers
        ?Object.fromEntries(o.headers.entries())
        :(o.headers||{}),
        {'X-Game-Token':T}
      );
      u=typeof u==='string'?r:new Request(r,o);
    }
    return oF.call(this,u,o);
  };

  // Patch Blob for Web Workers (only on Main Thread, NOT inside Workers)
  /*if (typeof document !== 'undefined') {
    if (!self.Blob.orgBlob) {
      self.Blob.orgBlob = Blob;
    }
    self.Blob = function(parts, opts) {
      if (opts && (opts.type === 'application/javascript' || opts.type === 'text/javascript')) {
        var workerPatch = '(function(){' +
          'var B=' + JSON.stringify(B) + ',T=' + JSON.stringify(T) + ',SL=' + JSON.stringify(SL) + ';' +
          'var BASE="/resource/"+SL+"/";' +
          rewrite.toString() + ';' +
          'var oX=XMLHttpRequest.prototype.open;' +
          'XMLHttpRequest.prototype.open=function(m,u,a){' +
          '  var r=rewrite(u+"");' +
          '  if(r){' +
          '    if(a===false){' +
          '      var rel=r.slice(10+SL.length);' +
          '      r=B+(B.endsWith("/")?"":"/")+SL+rel;' +
          '    }' +
          '    arguments[1]=r;' +
          '    var oS=this.send;' +
          '    this.send=function(b){' +
          '      try{this.setRequestHeader("X-Game-Token",T);}catch(e){}' +
          '      return oS.call(this,b);' +
          '    };' +
          '  }' +
          '  return oX.apply(this,arguments);' +
          '};' +
          'var oF=self.fetch;' +
          'self.fetch=function(u,o){' +
          '  var us=typeof u==="string"?u:(u&&u.url)||"";' +
          '  var r=rewrite(us);' +
          '  if(r){' +
          '    o=Object.assign({},o||{});' +
          '    o.headers=Object.assign({},o.headers instanceof Headers?Object.fromEntries(o.headers.entries()):(o.headers||{}),{"X-Game-Token":T});' +
          '    u=typeof u==="string"?r:new Request(r,o);' +
          '  }' +
          '  return oF.call(this,u,o);' +
          '};' +
          '})();';
        parts = [workerPatch].concat(Array.from(parts));
      }
      return new self.Blob.orgBlob(parts, opts);
    };
    self.Blob.orgBlob = self.Blob.orgBlob || Blob;
  }*/
})()`;
			const cleanedHtml = html.replace(/<base\s[^>]*>/gi, "");
			const patch = `<base href="${baseHref}"><script>${interceptorCode}<\/script>`;
			if (cleanedHtml.includes("<head>")) return cleanedHtml.replace("<head>", `<head>${patch}`);
			return patch + cleanedHtml;
		}
		async cacheFirst(req, cacheName) {
			const cache = await caches.open(cacheName);
			const hit = await cache.match(req);
			if (hit) return hit;
			const fresh = await fetch(req);
			if (fresh.ok) cache.put(req, fresh.clone());
			return fresh;
		}
		async networkFirstTTL(req, cacheName, ttlMs) {
			const cache = await caches.open(cacheName);
			const hit = await cache.match(req);
			if (hit) {
				if (Date.now() - Number(hit.headers.get("sw-cached-at") ?? 0) < ttlMs) return hit;
			}
			try {
				const fresh = await fetch(req);
				if (fresh.ok) {
					const h = new Headers(fresh.headers);
					h.set("sw-cached-at", String(Date.now()));
					cache.put(req, new Response(await fresh.clone().text(), {
						headers: h,
						status: fresh.status
					}));
				}
				return fresh;
			} catch {
				return hit ?? new Response("Offline", { status: 503 });
			}
		}
		async staleWhileRevalidate(req, cacheName) {
			const cache = await caches.open(cacheName);
			const hit = await cache.match(req);
			const refresh = fetch(req).then((fresh) => {
				if (fresh.ok) cache.put(req, fresh.clone());
				return fresh;
			}).catch(() => null);
			return hit ?? refresh;
		}
	};
	new GameServiceWorker({
		"version": "dev-mrbwpb91",
		"cacheNames": {
			"site": "site-dev",
			"images": "img-dev",
			"pages": "pages-dev",
			"games": "games-dev"
		},
		"precacheAssets": ["/"],
		"proxy": {
			"backendUrl": "https://backendgame.eggycaronline.io",
			"token": "GAMES_SECRET_2024"
		},
		"ttl": {
			"pages": 36e5,
			"games": 6048e5
		}
	});
	//#endregion
})();

//# sourceMappingURL=sw.js.map