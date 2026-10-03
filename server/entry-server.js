import { renderToString } from "react-dom/server";
import * as React from "react";
import React3, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { parse, serialize } from "cookie";
import { splitCookiesString } from "set-cookie-parser";
import * as ReactDOM from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/react-router/dist/development/chunk-4ZMWKKQ3.mjs
/**
* react-router v7.18.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function normalizeProtocolRelativeUrl(url, protocol) {
	return protocol + url.replace(/\\/g, "/");
}
function isLocation(obj) {
	return typeof obj === "object" && obj != null && "pathname" in obj && "search" in obj && "hash" in obj && "state" in obj && "key" in obj;
}
function createMemoryHistory(options = {}) {
	let { initialEntries = ["/"], initialIndex, v5Compat = false } = options;
	let entries;
	entries = initialEntries.map((entry, index2) => createMemoryLocation(entry, typeof entry === "string" ? null : entry.state, index2 === 0 ? "default" : void 0, typeof entry === "string" ? void 0 : entry.mask));
	let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
	let action = "POP";
	let listener = null;
	function clampIndex(n) {
		return Math.min(Math.max(n, 0), entries.length - 1);
	}
	function getCurrentLocation() {
		return entries[index];
	}
	function createMemoryLocation(to, state = null, key, mask) {
		let location = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key, mask);
		warning(location.pathname.charAt(0) === "/", `relative pathnames are not supported in memory history: ${JSON.stringify(to)}`);
		return location;
	}
	function createHref2(to) {
		return typeof to === "string" ? to : createPath(to);
	}
	return {
		get index() {
			return index;
		},
		get action() {
			return action;
		},
		get location() {
			return getCurrentLocation();
		},
		createHref: createHref2,
		createURL(to) {
			return new URL(createHref2(to), "http://localhost");
		},
		encodeLocation(to) {
			let path = typeof to === "string" ? parsePath(to) : to;
			return {
				pathname: path.pathname || "",
				search: path.search || "",
				hash: path.hash || ""
			};
		},
		push(to, state) {
			action = "PUSH";
			let nextLocation = isLocation(to) ? to : createMemoryLocation(to, state);
			index += 1;
			entries.splice(index, entries.length, nextLocation);
			if (v5Compat && listener) listener({
				action,
				location: nextLocation,
				delta: 1
			});
		},
		replace(to, state) {
			action = "REPLACE";
			let nextLocation = isLocation(to) ? to : createMemoryLocation(to, state);
			entries[index] = nextLocation;
			if (v5Compat && listener) listener({
				action,
				location: nextLocation,
				delta: 0
			});
		},
		go(delta) {
			action = "POP";
			let nextIndex = clampIndex(index + delta);
			let nextLocation = entries[nextIndex];
			index = nextIndex;
			if (listener) listener({
				action,
				location: nextLocation,
				delta
			});
		},
		listen(fn) {
			listener = fn;
			return () => {
				listener = null;
			};
		}
	};
}
function createBrowserHistory(options = {}) {
	function createBrowserLocation(window2, globalHistory) {
		let maskedLocation = globalHistory.state?.masked;
		let { pathname, search, hash } = maskedLocation || window2.location;
		return createLocation("", {
			pathname,
			search,
			hash
		}, globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default", maskedLocation ? {
			pathname: window2.location.pathname,
			search: window2.location.search,
			hash: window2.location.hash
		} : void 0);
	}
	function createBrowserHref(window2, to) {
		return typeof to === "string" ? to : createPath(to);
	}
	return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function createHashHistory(options = {}) {
	function createHashLocation(window2, globalHistory) {
		let { pathname = "/", search = "", hash = "" } = parsePath(window2.location.hash.substring(1));
		if (!pathname.startsWith("/") && !pathname.startsWith(".")) pathname = "/" + pathname;
		return createLocation("", {
			pathname,
			search,
			hash
		}, globalHistory.state && globalHistory.state.usr || null, globalHistory.state && globalHistory.state.key || "default");
	}
	function createHashHref(window2, to) {
		let base = window2.document.querySelector("base");
		let href = "";
		if (base && base.getAttribute("href")) {
			let url = window2.location.href;
			let hashIndex = url.indexOf("#");
			href = hashIndex === -1 ? url : url.slice(0, hashIndex);
		}
		return href + "#" + (typeof to === "string" ? to : createPath(to));
	}
	function validateHashLocation(location, to) {
		warning(location.pathname.charAt(0) === "/", `relative pathnames are not supported in hash history.push(${JSON.stringify(to)})`);
	}
	return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant$1(value, message) {
	if (value === false || value === null || typeof value === "undefined") throw new Error(message);
}
function warning(cond, message) {
	if (!cond) {
		if (typeof console !== "undefined") console.warn(message);
		try {
			throw new Error(message);
		} catch (e) {}
	}
}
function createKey$1() {
	return Math.random().toString(36).substring(2, 10);
}
function getHistoryState(location, index) {
	return {
		usr: location.state,
		key: location.key,
		idx: index,
		masked: location.mask ? {
			pathname: location.pathname,
			search: location.search,
			hash: location.hash
		} : void 0
	};
}
function createLocation(current, to, state = null, key, mask) {
	return {
		pathname: typeof current === "string" ? current : current.pathname,
		search: "",
		hash: "",
		...typeof to === "string" ? parsePath(to) : to,
		state,
		key: to && to.key || key || createKey$1(),
		mask
	};
}
function createPath({ pathname = "/", search = "", hash = "" }) {
	if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
	if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
	return pathname;
}
function parsePath(path) {
	let parsedPath = {};
	if (path) {
		let hashIndex = path.indexOf("#");
		if (hashIndex >= 0) {
			parsedPath.hash = path.substring(hashIndex);
			path = path.substring(0, hashIndex);
		}
		let searchIndex = path.indexOf("?");
		if (searchIndex >= 0) {
			parsedPath.search = path.substring(searchIndex);
			path = path.substring(0, searchIndex);
		}
		if (path) parsedPath.pathname = path;
	}
	return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref2, validateLocation, options = {}) {
	let { window: window2 = document.defaultView, v5Compat = false } = options;
	let globalHistory = window2.history;
	let action = "POP";
	let listener = null;
	let index = getIndex();
	if (index == null) {
		index = 0;
		globalHistory.replaceState({
			...globalHistory.state,
			idx: index
		}, "");
	}
	function getIndex() {
		return (globalHistory.state || { idx: null }).idx;
	}
	function handlePop() {
		action = "POP";
		let nextIndex = getIndex();
		let delta = nextIndex == null ? null : nextIndex - index;
		index = nextIndex;
		if (listener) listener({
			action,
			location: history.location,
			delta
		});
	}
	function push(to, state) {
		action = "PUSH";
		let location = isLocation(to) ? to : createLocation(history.location, to, state);
		if (validateLocation) validateLocation(location, to);
		index = getIndex() + 1;
		let historyState = getHistoryState(location, index);
		let url = history.createHref(location.mask || location);
		try {
			globalHistory.pushState(historyState, "", url);
		} catch (error) {
			if (error instanceof DOMException && error.name === "DataCloneError") throw error;
			window2.location.assign(url);
		}
		if (v5Compat && listener) listener({
			action,
			location: history.location,
			delta: 1
		});
	}
	function replace2(to, state) {
		action = "REPLACE";
		let location = isLocation(to) ? to : createLocation(history.location, to, state);
		if (validateLocation) validateLocation(location, to);
		index = getIndex();
		let historyState = getHistoryState(location, index);
		let url = history.createHref(location.mask || location);
		globalHistory.replaceState(historyState, "", url);
		if (v5Compat && listener) listener({
			action,
			location: history.location,
			delta: 0
		});
	}
	function createURL(to) {
		return createBrowserURLImpl(window2, to);
	}
	let history = {
		get action() {
			return action;
		},
		get location() {
			return getLocation(window2, globalHistory);
		},
		listen(fn) {
			if (listener) throw new Error("A history only accepts one active listener");
			window2.addEventListener(PopStateEventType, handlePop);
			listener = fn;
			return () => {
				window2.removeEventListener(PopStateEventType, handlePop);
				listener = null;
			};
		},
		createHref(to) {
			return createHref2(window2, to);
		},
		createURL,
		encodeLocation(to) {
			let url = createURL(to);
			return {
				pathname: url.pathname,
				search: url.search,
				hash: url.hash
			};
		},
		push,
		replace: replace2,
		go(n) {
			return globalHistory.go(n);
		}
	};
	return history;
}
function createBrowserURLImpl(windowImpl, to, isAbsolute = false) {
	let base = "http://localhost";
	if (windowImpl) base = windowImpl.location.origin !== "null" ? windowImpl.location.origin : windowImpl.location.href;
	invariant$1(base, "No window.location.(origin|href) available to create URL");
	let href = typeof to === "string" ? to : createPath(to);
	href = href.replace(/ $/, "%20");
	if (!isAbsolute && PROTOCOL_RELATIVE_URL_REGEX.test(href)) href = base + href;
	return new URL(href, base);
}
function createContext$1(defaultValue) {
	return { defaultValue };
}
function isUnsupportedLazyRouteObjectKey(key) {
	return unsupportedLazyRouteObjectKeys.has(key);
}
function isUnsupportedLazyRouteFunctionKey(key) {
	return unsupportedLazyRouteFunctionKeys.has(key);
}
function isIndexRoute(route) {
	return route.index === true;
}
function convertRoutesToDataRoutes(routes, mapRouteProperties2, parentPath = [], manifest = {}, allowInPlaceMutations = false) {
	return routes.map((route, index) => {
		let treePath = [...parentPath, String(index)];
		let id = typeof route.id === "string" ? route.id : treePath.join("-");
		invariant$1(route.index !== true || !route.children, `Cannot specify children on an index route`);
		invariant$1(allowInPlaceMutations || !manifest[id], `Found a route id collision on id "${id}".  Route id's must be globally unique within Data Router usages`);
		if (isIndexRoute(route)) {
			let indexRoute = {
				...route,
				id
			};
			manifest[id] = mergeRouteUpdates(indexRoute, mapRouteProperties2(indexRoute));
			return indexRoute;
		} else {
			let pathOrLayoutRoute = {
				...route,
				id,
				children: void 0
			};
			manifest[id] = mergeRouteUpdates(pathOrLayoutRoute, mapRouteProperties2(pathOrLayoutRoute));
			if (route.children) pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties2, treePath, manifest, allowInPlaceMutations);
			return pathOrLayoutRoute;
		}
	});
}
function mergeRouteUpdates(route, updates) {
	return Object.assign(route, {
		...updates,
		...typeof updates.lazy === "object" && updates.lazy != null ? { lazy: {
			...route.lazy,
			...updates.lazy
		} } : {}
	});
}
function matchRoutes(routes, locationArg, basename = "/") {
	return matchRoutesImpl(routes, locationArg, basename, false);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial, precomputedBranches) {
	let pathname = stripBasename((typeof locationArg === "string" ? parsePath(locationArg) : locationArg).pathname || "/", basename);
	if (pathname == null) return null;
	let branches = precomputedBranches ?? flattenAndRankRoutes(routes);
	let matches = null;
	let decoded = decodePath(pathname);
	for (let i = 0; matches == null && i < branches.length; ++i) matches = matchRouteBranch(branches[i], decoded, allowPartial);
	return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
	let { route, pathname, params } = match;
	return {
		id: route.id,
		pathname,
		params,
		data: loaderData[route.id],
		loaderData: loaderData[route.id],
		handle: route.handle
	};
}
function flattenAndRankRoutes(routes) {
	let branches = flattenRoutes(routes);
	rankRouteBranches(branches);
	return branches;
}
function flattenRoutes(routes, branches = [], parentsMeta = [], parentPath = "", _hasParentOptionalSegments = false) {
	let flattenRoute = (route, index, hasParentOptionalSegments = _hasParentOptionalSegments, relativePath) => {
		let meta = {
			relativePath: relativePath === void 0 ? route.path || "" : relativePath,
			caseSensitive: route.caseSensitive === true,
			childrenIndex: index,
			route
		};
		if (meta.relativePath.startsWith("/")) {
			if (!meta.relativePath.startsWith(parentPath) && hasParentOptionalSegments) return;
			invariant$1(meta.relativePath.startsWith(parentPath), `Absolute route path "${meta.relativePath}" nested under path "${parentPath}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`);
			meta.relativePath = meta.relativePath.slice(parentPath.length);
		}
		let path = joinPaths([parentPath, meta.relativePath]);
		let routesMeta = parentsMeta.concat(meta);
		if (route.children && route.children.length > 0) {
			invariant$1(route.index !== true, `Index routes must not have child routes. Please remove all child routes from route path "${path}".`);
			flattenRoutes(route.children, branches, routesMeta, path, hasParentOptionalSegments);
		}
		if (route.path == null && !route.index) return;
		branches.push({
			path,
			score: computeScore(path, route.index),
			routesMeta: routesMeta.map((meta2, i) => {
				let [matcher, params] = compilePath(meta2.relativePath, meta2.caseSensitive, i === routesMeta.length - 1);
				return {
					...meta2,
					matcher,
					compiledParams: params
				};
			})
		});
	};
	routes.forEach((route, index) => {
		if (route.path === "" || !route.path?.includes("?")) flattenRoute(route, index);
		else for (let exploded of explodeOptionalSegments(route.path)) flattenRoute(route, index, true, exploded);
	});
	return branches;
}
function explodeOptionalSegments(path) {
	let segments = path.split("/");
	if (segments.length === 0) return [];
	let [first, ...rest] = segments;
	let isOptional = first.endsWith("?");
	let required = first.replace(/\?$/, "");
	if (rest.length === 0) return isOptional ? [required, ""] : [required];
	let restExploded = explodeOptionalSegments(rest.join("/"));
	let result = [];
	result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
	if (isOptional) result.push(...restExploded);
	return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
	branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
function computeScore(path, index) {
	let segments = path.split("/");
	let initialScore = segments.length;
	if (segments.some(isSplat)) initialScore += splatPenalty;
	if (index) initialScore += indexRouteValue;
	return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
	return a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]) ? a[a.length - 1] - b[b.length - 1] : 0;
}
function matchRouteBranch(branch, pathname, allowPartial = false) {
	let { routesMeta } = branch;
	let matchedParams = {};
	let matchedPathname = "/";
	let matches = [];
	for (let i = 0; i < routesMeta.length; ++i) {
		let meta = routesMeta[i];
		let end = i === routesMeta.length - 1;
		let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
		let pattern = {
			path: meta.relativePath,
			caseSensitive: meta.caseSensitive,
			end
		};
		let match = meta.matcher && meta.compiledParams ? matchPathImpl(pattern, remainingPathname, meta.matcher, meta.compiledParams) : matchPath(pattern, remainingPathname);
		let route = meta.route;
		if (!match && end && allowPartial && !routesMeta[routesMeta.length - 1].route.index) match = matchPath({
			path: meta.relativePath,
			caseSensitive: meta.caseSensitive,
			end: false
		}, remainingPathname);
		if (!match) return null;
		Object.assign(matchedParams, match.params);
		matches.push({
			params: matchedParams,
			pathname: joinPaths([matchedPathname, match.pathname]),
			pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
			route
		});
		if (match.pathnameBase !== "/") matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
	}
	return matches;
}
function generatePath(originalPath, params = {}) {
	let path = originalPath;
	if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
		warning(false, `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`);
		path = path.replace(/\*$/, "/*");
	}
	const prefix = path.startsWith("/") ? "/" : "";
	const stringify2 = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
	return prefix + path.split(/\/+/).map((segment, index, array) => {
		if (index === array.length - 1 && segment === "*") return stringify2(params["*"]);
		const keyMatch = segment.match(/^:([\w-]+)(\??)(.*)/);
		if (keyMatch) {
			const [, key, optional, suffix] = keyMatch;
			let param = params[key];
			invariant$1(optional === "?" || param != null, `Missing ":${key}" param`);
			return encodeURIComponent(stringify2(param)) + suffix;
		}
		return segment.replace(/\?$/g, "");
	}).filter((segment) => !!segment).join("/");
}
function matchPath(pattern, pathname) {
	if (typeof pattern === "string") pattern = {
		path: pattern,
		caseSensitive: false,
		end: true
	};
	let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
	return matchPathImpl(pattern, pathname, matcher, compiledParams);
}
function matchPathImpl(pattern, pathname, matcher, compiledParams) {
	let match = pathname.match(matcher);
	if (!match) return null;
	let matchedPathname = match[0];
	let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
	let captureGroups = match.slice(1);
	return {
		params: compiledParams.reduce((memo2, { paramName, isOptional }, index) => {
			if (paramName === "*") {
				let splatValue = captureGroups[index] || "";
				pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
			}
			const value = captureGroups[index];
			if (isOptional && !value) memo2[paramName] = void 0;
			else memo2[paramName] = (value || "").replace(/%2F/g, "/");
			return memo2;
		}, {}),
		pathname: matchedPathname,
		pathnameBase,
		pattern
	};
}
function compilePath(path, caseSensitive = false, end = true) {
	warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), `Route path "${path}" will be treated as if it were "${path.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${path.replace(/\*$/, "/*")}".`);
	let params = [];
	let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (match, paramName, isOptional, index, str) => {
		params.push({
			paramName,
			isOptional: isOptional != null
		});
		if (isOptional) {
			let nextChar = str.charAt(index + match.length);
			if (nextChar && nextChar !== "/") return "/([^\\/]*)";
			return "(?:/([^\\/]*))?";
		}
		return "/([^\\/]+)";
	}).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
	if (path.endsWith("*")) {
		params.push({ paramName: "*" });
		regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
	} else if (end) regexpSource += "\\/*$";
	else if (path !== "" && path !== "/") regexpSource += "(?:(?=\\/|$))";
	return [new RegExp(regexpSource, caseSensitive ? void 0 : "i"), params];
}
function decodePath(value) {
	try {
		return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
	} catch (error) {
		warning(false, `The URL path "${value}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${error}).`);
		return value;
	}
}
function stripBasename(pathname, basename) {
	if (basename === "/") return pathname;
	if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) return null;
	let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
	let nextChar = pathname.charAt(startIndex);
	if (nextChar && nextChar !== "/") return null;
	return pathname.slice(startIndex) || "/";
}
function prependBasename({ basename, pathname }) {
	return pathname === "/" ? basename : joinPaths([basename, pathname]);
}
function resolvePath(to, fromPathname = "/") {
	let { pathname: toPathname, search = "", hash = "" } = typeof to === "string" ? parsePath(to) : to;
	let pathname;
	if (toPathname) {
		toPathname = removeDoubleSlashes(toPathname);
		if (toPathname.startsWith("/")) pathname = resolvePathname(toPathname.substring(1), "/");
		else pathname = resolvePathname(toPathname, fromPathname);
	} else pathname = fromPathname;
	return {
		pathname,
		search: normalizeSearch(search),
		hash: normalizeHash(hash)
	};
}
function resolvePathname(relativePath, fromPathname) {
	let segments = removeTrailingSlash(fromPathname).split("/");
	relativePath.split("/").forEach((segment) => {
		if (segment === "..") {
			if (segments.length > 1) segments.pop();
		} else if (segment !== ".") segments.push(segment);
	});
	return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
	return `Cannot include a '${char}' character in a manually specified \`to.${field}\` field [${JSON.stringify(path)}].  Please separate it out to the \`to.${dest}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function getPathContributingMatches(matches) {
	return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches) {
	let pathMatches = getPathContributingMatches(matches);
	return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative = false) {
	let to;
	if (typeof toArg === "string") to = parsePath(toArg);
	else {
		to = { ...toArg };
		invariant$1(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
		invariant$1(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
		invariant$1(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
	}
	let isEmptyPath = toArg === "" || to.pathname === "";
	let toPathname = isEmptyPath ? "/" : to.pathname;
	let from;
	if (toPathname == null) from = locationPathname;
	else {
		let routePathnameIndex = routePathnames.length - 1;
		if (!isPathRelative && toPathname.startsWith("..")) {
			let toSegments = toPathname.split("/");
			while (toSegments[0] === "..") {
				toSegments.shift();
				routePathnameIndex -= 1;
			}
			to.pathname = toSegments.join("/");
		}
		from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
	}
	let path = resolvePath(to, from);
	let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
	let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
	if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) path.pathname += "/";
	return path;
}
function data(data2, init) {
	return new DataWithResponseInit(data2, typeof init === "number" ? { status: init } : init);
}
function isRouteErrorResponse(error) {
	return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function getRoutePattern(matches) {
	return joinPaths(matches.map((m) => m.route.path).filter(Boolean)) || "/";
}
function parseToInfo(_to, basename) {
	let to = _to;
	if (typeof to !== "string" || !ABSOLUTE_URL_REGEX.test(to)) return {
		absoluteURL: void 0,
		isExternal: false,
		to
	};
	let absoluteURL = to;
	let isExternal = false;
	if (isBrowser) try {
		let currentUrl = new URL(window.location.href);
		let targetUrl = PROTOCOL_RELATIVE_URL_REGEX.test(to) ? new URL(normalizeProtocolRelativeUrl(to, currentUrl.protocol)) : new URL(to);
		let path = stripBasename(targetUrl.pathname, basename);
		if (targetUrl.origin === currentUrl.origin && path != null) to = path + targetUrl.search + targetUrl.hash;
		else isExternal = true;
	} catch (e) {
		warning(false, `<Link to="${to}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`);
	}
	return {
		absoluteURL,
		isExternal,
		to
	};
}
function getRouteInstrumentationUpdates(fns, route) {
	let aggregated = {
		lazy: [],
		"lazy.loader": [],
		"lazy.action": [],
		"lazy.middleware": [],
		middleware: [],
		loader: [],
		action: []
	};
	fns.forEach((fn) => fn({
		id: route.id,
		index: route.index,
		path: route.path,
		instrument(i) {
			let keys = Object.keys(aggregated);
			for (let key of keys) if (i[key]) aggregated[key].push(i[key]);
		}
	}));
	let updates = {};
	if (typeof route.lazy === "function" && aggregated.lazy.length > 0) {
		let instrumented = wrapImpl(aggregated.lazy, route.lazy, () => void 0);
		if (instrumented) updates.lazy = instrumented;
	}
	if (typeof route.lazy === "object") {
		let lazyObject = route.lazy;
		[
			"middleware",
			"loader",
			"action"
		].forEach((key) => {
			let lazyFn = lazyObject[key];
			let instrumentations = aggregated[`lazy.${key}`];
			if (typeof lazyFn === "function" && instrumentations.length > 0) {
				let instrumented = wrapImpl(instrumentations, lazyFn, () => void 0);
				if (instrumented) updates.lazy = Object.assign(updates.lazy || {}, { [key]: instrumented });
			}
		});
	}
	["loader", "action"].forEach((key) => {
		let handler = route[key];
		if (typeof handler === "function" && aggregated[key].length > 0) {
			let original = handler[UninstrumentedSymbol] ?? handler;
			let instrumented = wrapImpl(aggregated[key], original, (...args) => getHandlerInfo(args[0]));
			if (instrumented) {
				if (key === "loader" && original.hydrate === true) instrumented.hydrate = true;
				instrumented[UninstrumentedSymbol] = original;
				updates[key] = instrumented;
			}
		}
	});
	if (route.middleware && route.middleware.length > 0 && aggregated.middleware.length > 0) updates.middleware = route.middleware.map((middleware) => {
		let original = middleware[UninstrumentedSymbol] ?? middleware;
		let instrumented = wrapImpl(aggregated.middleware, original, (...args) => getHandlerInfo(args[0]));
		if (instrumented) {
			instrumented[UninstrumentedSymbol] = original;
			return instrumented;
		}
		return middleware;
	});
	return updates;
}
function instrumentClientSideRouter(router, fns) {
	let aggregated = {
		navigate: [],
		fetch: []
	};
	fns.forEach((fn) => fn({ instrument(i) {
		let keys = Object.keys(i);
		for (let key of keys) if (i[key]) aggregated[key].push(i[key]);
	} }));
	if (aggregated.navigate.length > 0) {
		let navigate = router.navigate[UninstrumentedSymbol] ?? router.navigate;
		let instrumentedNavigate = wrapImpl(aggregated.navigate, navigate, (...args) => {
			let [to, opts] = args;
			return {
				to: typeof to === "number" || typeof to === "string" ? to : to ? createPath(to) : ".",
				...getRouterInfo(router, opts ?? {})
			};
		});
		if (instrumentedNavigate) {
			instrumentedNavigate[UninstrumentedSymbol] = navigate;
			router.navigate = instrumentedNavigate;
		}
	}
	if (aggregated.fetch.length > 0) {
		let fetch2 = router.fetch[UninstrumentedSymbol] ?? router.fetch;
		let instrumentedFetch = wrapImpl(aggregated.fetch, fetch2, (...args) => {
			let [key, , href, opts] = args;
			return {
				href: href ?? ".",
				fetcherKey: key,
				...getRouterInfo(router, opts ?? {})
			};
		});
		if (instrumentedFetch) {
			instrumentedFetch[UninstrumentedSymbol] = fetch2;
			router.fetch = instrumentedFetch;
		}
	}
	return router;
}
function instrumentHandler(handler, fns) {
	let aggregated = { request: [] };
	fns.forEach((fn) => fn({ instrument(i) {
		let keys = Object.keys(i);
		for (let key of keys) if (i[key]) aggregated[key].push(i[key]);
	} }));
	let instrumentedHandler = handler;
	if (aggregated.request.length > 0) instrumentedHandler = wrapImpl(aggregated.request, handler, (...args) => {
		let [request, context] = args;
		return {
			request: getReadonlyRequest(request),
			context: context != null ? getReadonlyContext(context) : context
		};
	});
	return instrumentedHandler;
}
function wrapImpl(impls, handler, getInfo) {
	if (impls.length === 0) return null;
	return async (...args) => {
		let result = await recurseRight(impls, getInfo(...args), () => handler(...args), impls.length - 1);
		if (result.type === "error") throw result.value;
		return result.value;
	};
}
async function recurseRight(impls, info, handler, index) {
	let impl = impls[index];
	let result;
	if (!impl) try {
		result = {
			type: "success",
			value: await handler()
		};
	} catch (e) {
		result = {
			type: "error",
			value: e
		};
	}
	else {
		let handlerPromise = void 0;
		let callHandler = async () => {
			if (handlerPromise) console.error("You cannot call instrumented handlers more than once");
			else handlerPromise = recurseRight(impls, info, handler, index - 1);
			result = await handlerPromise;
			invariant$1(result, "Expected a result");
			if (result.type === "error" && result.value instanceof Error) return {
				status: "error",
				error: result.value
			};
			return {
				status: "success",
				error: void 0
			};
		};
		try {
			await impl(callHandler, info);
		} catch (e) {
			console.error("An instrumentation function threw an error:", e);
		}
		if (!handlerPromise) await callHandler();
		await handlerPromise;
	}
	if (result) return result;
	return {
		type: "error",
		value: /* @__PURE__ */ new Error("No result assigned in instrumentation chain.")
	};
}
function getHandlerInfo(args) {
	let { request, context, params, pattern } = args;
	return {
		request: getReadonlyRequest(request),
		params: { ...params },
		pattern,
		context: getReadonlyContext(context)
	};
}
function getRouterInfo(router, opts) {
	return {
		currentUrl: createPath(router.state.location),
		..."formMethod" in opts ? { formMethod: opts.formMethod } : {},
		..."formEncType" in opts ? { formEncType: opts.formEncType } : {},
		..."formData" in opts ? { formData: opts.formData } : {},
		..."body" in opts ? { body: opts.body } : {}
	};
}
function getReadonlyRequest(request) {
	return {
		method: request.method,
		url: request.url,
		headers: { get: (...args) => request.headers.get(...args) }
	};
}
function getReadonlyContext(context) {
	if (isPlainObject(context)) {
		let frozen = { ...context };
		Object.freeze(frozen);
		return frozen;
	} else return { get: (ctx) => context.get(ctx) };
}
function isPlainObject(thing) {
	if (thing === null || typeof thing !== "object") return false;
	const proto = Object.getPrototypeOf(thing);
	return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames;
}
function createRouter(init) {
	const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : void 0;
	const isBrowser3 = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
	invariant$1(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
	let hydrationRouteProperties2 = init.hydrationRouteProperties || [];
	let _mapRouteProperties = init.mapRouteProperties || defaultMapRouteProperties;
	let mapRouteProperties2 = _mapRouteProperties;
	if (init.instrumentations) {
		let instrumentations = init.instrumentations;
		mapRouteProperties2 = (route) => {
			return {
				..._mapRouteProperties(route),
				...getRouteInstrumentationUpdates(instrumentations.map((i) => i.route).filter(Boolean), route)
			};
		};
	}
	let manifest = {};
	let dataRoutes = new DataRoutes(convertRoutesToDataRoutes(init.routes, mapRouteProperties2, void 0, manifest));
	let basename = init.basename || "/";
	if (!basename.startsWith("/")) basename = `/${basename}`;
	let dataStrategyImpl = init.dataStrategy || defaultDataStrategyWithMiddleware;
	let future = { ...init.future };
	let unlistenHistory = null;
	let subscribers = /* @__PURE__ */ new Set();
	let bufferedInitialStateUpdate = null;
	let savedScrollPositions2 = null;
	let getScrollRestorationKey2 = null;
	let getScrollPosition = null;
	let initialScrollRestored = init.hydrationData != null;
	let initialMatches = matchRoutesImpl(dataRoutes.activeRoutes, init.history.location, basename, false, dataRoutes.branches);
	let initialMatchesIsFOW = false;
	let initialErrors = null;
	let initialized;
	let renderFallback;
	if (initialMatches == null && !init.patchRoutesOnNavigation) {
		let error = getInternalRouterError(404, { pathname: init.history.location.pathname });
		let { matches, route } = getShortCircuitMatches(dataRoutes.activeRoutes);
		initialized = true;
		renderFallback = !initialized;
		initialMatches = matches;
		initialErrors = { [route.id]: error };
	} else {
		if (initialMatches && !init.hydrationData) {
			if (checkFogOfWar(initialMatches, dataRoutes.activeRoutes, init.history.location.pathname).active) initialMatches = null;
		}
		if (!initialMatches) {
			initialized = false;
			renderFallback = !initialized;
			initialMatches = [];
			let fogOfWar = checkFogOfWar(null, dataRoutes.activeRoutes, init.history.location.pathname);
			if (fogOfWar.active && fogOfWar.matches) {
				initialMatchesIsFOW = true;
				initialMatches = fogOfWar.matches;
			}
		} else if (initialMatches.some((m) => m.route.lazy)) {
			initialized = false;
			renderFallback = !initialized;
		} else if (!initialMatches.some((m) => routeHasLoaderOrMiddleware(m.route))) {
			initialized = true;
			renderFallback = !initialized;
		} else {
			let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
			let errors = init.hydrationData ? init.hydrationData.errors : null;
			let relevantMatches = initialMatches;
			if (errors) {
				let idx = initialMatches.findIndex((m) => errors[m.route.id] !== void 0);
				relevantMatches = relevantMatches.slice(0, idx + 1);
			}
			renderFallback = false;
			initialized = true;
			relevantMatches.forEach((m) => {
				let status = getRouteHydrationStatus(m.route, loaderData, errors);
				renderFallback = renderFallback || status.renderFallback;
				initialized = initialized && !status.shouldLoad;
			});
		}
	}
	let router;
	let state = {
		historyAction: init.history.action,
		location: init.history.location,
		matches: initialMatches,
		initialized,
		renderFallback,
		navigation: IDLE_NAVIGATION,
		restoreScrollPosition: init.hydrationData != null ? false : null,
		preventScrollReset: false,
		revalidation: "idle",
		loaderData: init.hydrationData && init.hydrationData.loaderData || {},
		actionData: init.hydrationData && init.hydrationData.actionData || null,
		errors: init.hydrationData && init.hydrationData.errors || initialErrors,
		fetchers: /* @__PURE__ */ new Map(),
		blockers: /* @__PURE__ */ new Map()
	};
	let pendingAction = "POP";
	let pendingPopstateNavigationDfd = null;
	let pendingPreventScrollReset = false;
	let pendingNavigationController;
	let pendingViewTransitionEnabled = false;
	let appliedViewTransitions = /* @__PURE__ */ new Map();
	let removePageHideEventListener = null;
	let isUninterruptedRevalidation = false;
	let isRevalidationRequired = false;
	let cancelledFetcherLoads = /* @__PURE__ */ new Set();
	let fetchControllers = /* @__PURE__ */ new Map();
	let incrementingLoadId = 0;
	let pendingNavigationLoadId = -1;
	let fetchReloadIds = /* @__PURE__ */ new Map();
	let fetchRedirectIds = /* @__PURE__ */ new Set();
	let fetchLoadMatches = /* @__PURE__ */ new Map();
	let activeFetchers = /* @__PURE__ */ new Map();
	let fetchersQueuedForDeletion = /* @__PURE__ */ new Set();
	let blockerFunctions = /* @__PURE__ */ new Map();
	let unblockBlockerHistoryUpdate = void 0;
	let pendingRevalidationDfd = null;
	function initialize() {
		unlistenHistory = init.history.listen(({ action: historyAction, location, delta }) => {
			if (unblockBlockerHistoryUpdate) {
				unblockBlockerHistoryUpdate();
				unblockBlockerHistoryUpdate = void 0;
				return;
			}
			warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
			let blockerKey = shouldBlockNavigation({
				currentLocation: state.location,
				nextLocation: location,
				historyAction
			});
			if (blockerKey && delta != null) {
				let nextHistoryUpdatePromise = new Promise((resolve) => {
					unblockBlockerHistoryUpdate = resolve;
				});
				init.history.go(delta * -1);
				updateBlocker(blockerKey, {
					state: "blocked",
					location,
					proceed() {
						updateBlocker(blockerKey, {
							state: "proceeding",
							proceed: void 0,
							reset: void 0,
							location
						});
						nextHistoryUpdatePromise.then(() => init.history.go(delta));
					},
					reset() {
						let blockers = new Map(state.blockers);
						blockers.set(blockerKey, IDLE_BLOCKER);
						updateState({ blockers });
					}
				});
				pendingPopstateNavigationDfd?.resolve();
				pendingPopstateNavigationDfd = null;
				return;
			}
			return startNavigation(historyAction, location);
		});
		if (isBrowser3) {
			restoreAppliedTransitions(routerWindow, appliedViewTransitions);
			let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
			routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
			removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
		}
		if (!state.initialized) startNavigation("POP", state.location, { initialHydration: true });
		return router;
	}
	function dispose() {
		if (unlistenHistory) unlistenHistory();
		if (removePageHideEventListener) removePageHideEventListener();
		subscribers.clear();
		pendingNavigationController && pendingNavigationController.abort();
		state.fetchers.forEach((_, key) => deleteFetcher(state.fetchers, key));
		state.blockers.forEach((_, key) => deleteBlocker(key));
	}
	function subscribe(fn) {
		subscribers.add(fn);
		if (bufferedInitialStateUpdate) {
			let { newErrors } = bufferedInitialStateUpdate;
			bufferedInitialStateUpdate = null;
			fn(state, {
				deletedFetchers: [],
				newErrors,
				viewTransitionOpts: void 0,
				flushSync: false
			});
		}
		return () => subscribers.delete(fn);
	}
	function updateState(newState, opts = {}) {
		if (newState.matches) newState.matches = newState.matches.map((m) => {
			let route = manifest[m.route.id];
			let matchRoute = m.route;
			if (matchRoute.element !== route.element || matchRoute.errorElement !== route.errorElement || matchRoute.hydrateFallbackElement !== route.hydrateFallbackElement) return {
				...m,
				route
			};
			return m;
		});
		state = {
			...state,
			...newState
		};
		let unmountedFetchers = [];
		let mountedFetchers = [];
		state.fetchers.forEach((fetcher, key) => {
			if (fetcher.state === "idle") if (fetchersQueuedForDeletion.has(key)) unmountedFetchers.push(key);
			else mountedFetchers.push(key);
		});
		fetchersQueuedForDeletion.forEach((key) => {
			if (!state.fetchers.has(key) && !fetchControllers.has(key)) unmountedFetchers.push(key);
		});
		if (subscribers.size === 0) bufferedInitialStateUpdate = { newErrors: newState.errors ?? null };
		[...subscribers].forEach((subscriber) => subscriber(state, {
			deletedFetchers: unmountedFetchers,
			newErrors: newState.errors ?? null,
			viewTransitionOpts: opts.viewTransitionOpts,
			flushSync: opts.flushSync === true
		}));
		unmountedFetchers.forEach((key) => deleteFetcher(state.fetchers, key));
		mountedFetchers.forEach((key) => state.fetchers.delete(key));
	}
	function completeNavigation(location, newState, { flushSync } = {}) {
		let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && location.state?._isRedirect !== true;
		let actionData;
		if (newState.actionData) if (Object.keys(newState.actionData).length > 0) actionData = newState.actionData;
		else actionData = null;
		else if (isActionReload) actionData = state.actionData;
		else actionData = null;
		let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
		let blockers = state.blockers;
		if (blockers.size > 0) {
			blockers = new Map(blockers);
			blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
		}
		let restoreScrollPosition = isUninterruptedRevalidation ? false : getSavedScrollPosition(location, newState.matches || state.matches);
		let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && location.state?._isRedirect !== true;
		dataRoutes.commitHmrRoutes();
		if (isUninterruptedRevalidation) {} else if (pendingAction === "POP") {} else if (pendingAction === "PUSH") init.history.push(location, location.state);
		else if (pendingAction === "REPLACE") init.history.replace(location, location.state);
		let viewTransitionOpts;
		if (pendingAction === "POP") {
			let priorPaths = appliedViewTransitions.get(state.location.pathname);
			if (priorPaths && priorPaths.has(location.pathname)) viewTransitionOpts = {
				currentLocation: state.location,
				nextLocation: location
			};
			else if (appliedViewTransitions.has(location.pathname)) viewTransitionOpts = {
				currentLocation: location,
				nextLocation: state.location
			};
		} else if (pendingViewTransitionEnabled) {
			let toPaths = appliedViewTransitions.get(state.location.pathname);
			if (toPaths) toPaths.add(location.pathname);
			else {
				toPaths = /* @__PURE__ */ new Set([location.pathname]);
				appliedViewTransitions.set(state.location.pathname, toPaths);
			}
			viewTransitionOpts = {
				currentLocation: state.location,
				nextLocation: location
			};
		}
		updateState({
			...newState,
			actionData,
			loaderData,
			historyAction: pendingAction,
			location,
			initialized: true,
			renderFallback: false,
			navigation: IDLE_NAVIGATION,
			revalidation: "idle",
			restoreScrollPosition,
			preventScrollReset,
			blockers
		}, {
			viewTransitionOpts,
			flushSync: flushSync === true
		});
		pendingAction = "POP";
		pendingPreventScrollReset = false;
		pendingViewTransitionEnabled = false;
		isUninterruptedRevalidation = false;
		isRevalidationRequired = false;
		pendingPopstateNavigationDfd?.resolve();
		pendingPopstateNavigationDfd = null;
		pendingRevalidationDfd?.resolve();
		pendingRevalidationDfd = null;
	}
	async function navigate(to, opts) {
		pendingPopstateNavigationDfd?.resolve();
		pendingPopstateNavigationDfd = null;
		if (typeof to === "number") {
			if (!pendingPopstateNavigationDfd) pendingPopstateNavigationDfd = createDeferred();
			let promise = pendingPopstateNavigationDfd.promise;
			init.history.go(to);
			return promise;
		}
		let { path, submission, error } = normalizeNavigateOptions(false, normalizeTo(state.location, state.matches, basename, to, opts?.fromRouteId, opts?.relative), opts);
		let maskPath;
		if (opts?.mask) maskPath = {
			pathname: "",
			search: "",
			hash: "",
			...typeof opts.mask === "string" ? parsePath(opts.mask) : {
				...state.location.mask,
				...opts.mask
			}
		};
		let currentLocation = state.location;
		let nextLocation = createLocation(currentLocation, path, opts && opts.state, void 0, maskPath);
		nextLocation = {
			...nextLocation,
			...init.history.encodeLocation(nextLocation)
		};
		let userReplace = opts && opts.replace != null ? opts.replace : void 0;
		let historyAction = "PUSH";
		if (userReplace === true) historyAction = "REPLACE";
		else if (userReplace === false) {} else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) historyAction = "REPLACE";
		let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
		let flushSync = (opts && opts.flushSync) === true;
		let blockerKey = shouldBlockNavigation({
			currentLocation,
			nextLocation,
			historyAction
		});
		if (blockerKey) {
			updateBlocker(blockerKey, {
				state: "blocked",
				location: nextLocation,
				proceed() {
					updateBlocker(blockerKey, {
						state: "proceeding",
						proceed: void 0,
						reset: void 0,
						location: nextLocation
					});
					navigate(to, opts);
				},
				reset() {
					let blockers = new Map(state.blockers);
					blockers.set(blockerKey, IDLE_BLOCKER);
					updateState({ blockers });
				}
			});
			return;
		}
		await startNavigation(historyAction, nextLocation, {
			submission,
			pendingError: error,
			preventScrollReset,
			replace: opts && opts.replace,
			enableViewTransition: opts && opts.viewTransition,
			flushSync,
			callSiteDefaultShouldRevalidate: opts && opts.defaultShouldRevalidate
		});
	}
	function revalidate() {
		if (!pendingRevalidationDfd) pendingRevalidationDfd = createDeferred();
		interruptActiveLoads();
		updateState({ revalidation: "loading" });
		let promise = pendingRevalidationDfd.promise;
		if (state.navigation.state === "submitting") return promise;
		if (state.navigation.state === "idle") {
			startNavigation(state.historyAction, state.location, { startUninterruptedRevalidation: true });
			return promise;
		}
		startNavigation(pendingAction || state.historyAction, state.navigation.location, {
			overrideNavigation: state.navigation,
			enableViewTransition: pendingViewTransitionEnabled === true
		});
		return promise;
	}
	async function startNavigation(historyAction, location, opts) {
		pendingNavigationController && pendingNavigationController.abort();
		pendingNavigationController = null;
		pendingAction = historyAction;
		isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
		saveScrollPosition(state.location, state.matches);
		pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
		pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
		let routesToUse = dataRoutes.activeRoutes;
		let matches = opts?.initialHydration && state.matches && state.matches.length > 0 && !initialMatchesIsFOW ? state.matches : matchRoutesImpl(routesToUse, location, basename, false, dataRoutes.branches);
		let flushSync = (opts && opts.flushSync) === true;
		if (matches && state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
			completeNavigation(location, { matches }, { flushSync });
			return;
		}
		let fogOfWar = checkFogOfWar(matches, routesToUse, location.pathname);
		if (fogOfWar.active && fogOfWar.matches) matches = fogOfWar.matches;
		if (!matches) {
			let { error, notFoundMatches, route } = handleNavigational404(location.pathname);
			completeNavigation(location, {
				matches: notFoundMatches,
				loaderData: {},
				errors: { [route.id]: error }
			}, { flushSync });
			return;
		}
		let loadingNavigation = opts && opts.overrideNavigation ? {
			...opts.overrideNavigation,
			matches,
			historyAction
		} : void 0;
		pendingNavigationController = new AbortController();
		let request = createClientSideRequest(init.history, location, pendingNavigationController.signal, opts && opts.submission);
		let scopedContext = init.getContext ? await init.getContext() : new RouterContextProvider();
		let pendingActionResult;
		if (opts && opts.pendingError) pendingActionResult = [findNearestBoundary(matches).route.id, {
			type: "error",
			error: opts.pendingError
		}];
		else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
			let actionResult = await handleAction(request, location, opts.submission, matches, historyAction, scopedContext, fogOfWar.active, opts && opts.initialHydration === true, {
				replace: opts.replace,
				flushSync
			});
			if (actionResult.shortCircuited) return;
			if (actionResult.pendingActionResult) {
				let [routeId, result] = actionResult.pendingActionResult;
				if (isErrorResult(result) && isRouteErrorResponse(result.error) && result.error.status === 404) {
					pendingNavigationController = null;
					completeNavigation(location, {
						matches: actionResult.matches,
						loaderData: {},
						errors: { [routeId]: result.error }
					});
					return;
				}
			}
			matches = actionResult.matches || matches;
			pendingActionResult = actionResult.pendingActionResult;
			loadingNavigation = getLoadingNavigation(location, matches, historyAction, opts.submission);
			flushSync = false;
			fogOfWar.active = false;
			request = createClientSideRequest(init.history, request.url, request.signal);
		}
		let { shortCircuited, matches: updatedMatches, loaderData, errors, workingFetchers } = await handleLoaders(request, location, matches, historyAction, scopedContext, fogOfWar.active, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult, opts && opts.callSiteDefaultShouldRevalidate);
		if (shortCircuited) return;
		pendingNavigationController = null;
		completeNavigation(location, {
			matches: updatedMatches || matches,
			...getActionDataForCommit(pendingActionResult),
			loaderData,
			errors,
			...workingFetchers ? { fetchers: workingFetchers } : {}
		});
	}
	async function handleAction(request, location, submission, matches, historyAction, scopedContext, isFogOfWar, initialHydration, opts = {}) {
		interruptActiveLoads();
		updateState({ navigation: getSubmittingNavigation(location, matches, historyAction, submission) }, { flushSync: opts.flushSync === true });
		if (isFogOfWar) {
			let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
			if (discoverResult.type === "aborted") return { shortCircuited: true };
			else if (discoverResult.type === "error") {
				if (discoverResult.partialMatches.length === 0) {
					let { matches: matches2, route } = getShortCircuitMatches(dataRoutes.activeRoutes);
					return {
						matches: matches2,
						pendingActionResult: [route.id, {
							type: "error",
							error: discoverResult.error
						}]
					};
				}
				let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
				return {
					matches: discoverResult.partialMatches,
					pendingActionResult: [boundaryId, {
						type: "error",
						error: discoverResult.error
					}]
				};
			} else if (!discoverResult.matches) {
				let { notFoundMatches, error, route } = handleNavigational404(location.pathname);
				return {
					matches: notFoundMatches,
					pendingActionResult: [route.id, {
						type: "error",
						error
					}]
				};
			} else matches = discoverResult.matches;
		}
		let result;
		let actionMatch = getTargetMatch(matches, location);
		if (!actionMatch.route.action && !actionMatch.route.lazy) result = {
			type: "error",
			error: getInternalRouterError(405, {
				method: request.method,
				pathname: location.pathname,
				routeId: actionMatch.route.id
			})
		};
		else {
			let results = await callDataStrategy(request, location, getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, location, matches, actionMatch, initialHydration ? [] : hydrationRouteProperties2, scopedContext), scopedContext, null);
			result = results[actionMatch.route.id];
			if (!result) {
				for (let match of matches) if (results[match.route.id]) {
					result = results[match.route.id];
					break;
				}
			}
			if (request.signal.aborted) return { shortCircuited: true };
		}
		if (isRedirectResult(result)) {
			let replace2;
			if (opts && opts.replace != null) replace2 = opts.replace;
			else replace2 = normalizeRedirectLocation$1(result.response.headers.get("Location"), new URL(request.url), basename, init.history) === state.location.pathname + state.location.search;
			await startRedirectNavigation(request, result, true, {
				submission,
				replace: replace2
			});
			return { shortCircuited: true };
		}
		if (isErrorResult(result)) {
			let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
			if ((opts && opts.replace) !== true) pendingAction = "PUSH";
			return {
				matches,
				pendingActionResult: [
					boundaryMatch.route.id,
					result,
					actionMatch.route.id
				]
			};
		}
		return {
			matches,
			pendingActionResult: [actionMatch.route.id, result]
		};
	}
	async function handleLoaders(request, location, matches, historyAction, scopedContext, isFogOfWar, overrideNavigation, submission, fetcherSubmission, replace2, initialHydration, flushSync, pendingActionResult, callSiteDefaultShouldRevalidate) {
		let loadingNavigation = overrideNavigation || getLoadingNavigation(location, matches, historyAction, submission);
		let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
		let shouldUpdateNavigationState = !isUninterruptedRevalidation && !initialHydration;
		if (isFogOfWar) {
			if (shouldUpdateNavigationState) {
				let actionData = getUpdatedActionData(pendingActionResult);
				updateState({
					navigation: loadingNavigation,
					...actionData !== void 0 ? { actionData } : {}
				}, { flushSync });
			}
			let discoverResult = await discoverRoutes(matches, location.pathname, request.signal);
			if (discoverResult.type === "aborted") return { shortCircuited: true };
			else if (discoverResult.type === "error") {
				if (discoverResult.partialMatches.length === 0) {
					let { matches: matches2, route } = getShortCircuitMatches(dataRoutes.activeRoutes);
					return {
						matches: matches2,
						loaderData: {},
						errors: { [route.id]: discoverResult.error }
					};
				}
				let boundaryId = findNearestBoundary(discoverResult.partialMatches).route.id;
				return {
					matches: discoverResult.partialMatches,
					loaderData: {},
					errors: { [boundaryId]: discoverResult.error }
				};
			} else if (!discoverResult.matches) {
				let { error, notFoundMatches, route } = handleNavigational404(location.pathname);
				return {
					matches: notFoundMatches,
					loaderData: {},
					errors: { [route.id]: error }
				};
			} else matches = discoverResult.matches;
		}
		let routesToUse = dataRoutes.activeRoutes;
		let { dsMatches, revalidatingFetchers } = getMatchesToLoad(request, scopedContext, mapRouteProperties2, manifest, init.history, state, matches, activeSubmission, location, initialHydration ? [] : hydrationRouteProperties2, initialHydration === true, isRevalidationRequired, cancelledFetcherLoads, fetchersQueuedForDeletion, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, init.patchRoutesOnNavigation != null, dataRoutes.branches, pendingActionResult, callSiteDefaultShouldRevalidate);
		pendingNavigationLoadId = ++incrementingLoadId;
		if (!init.dataStrategy && !dsMatches.some((m) => m.shouldLoad) && !dsMatches.some((m) => m.route.middleware && m.route.middleware.length > 0) && revalidatingFetchers.length === 0) {
			let workingFetchers2 = new Map(state.fetchers);
			let didUpdateFetcherRedirects2 = markFetchRedirectsDone(workingFetchers2);
			completeNavigation(location, {
				matches,
				loaderData: {},
				errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? { [pendingActionResult[0]]: pendingActionResult[1].error } : null,
				...getActionDataForCommit(pendingActionResult),
				...didUpdateFetcherRedirects2 ? { fetchers: workingFetchers2 } : {}
			}, { flushSync });
			return { shortCircuited: true };
		}
		if (shouldUpdateNavigationState) {
			let updates = {};
			if (!isFogOfWar) {
				updates.navigation = loadingNavigation;
				let actionData = getUpdatedActionData(pendingActionResult);
				if (actionData !== void 0) updates.actionData = actionData;
			}
			if (revalidatingFetchers.length > 0) updates.fetchers = getUpdatedRevalidatingFetchers(revalidatingFetchers);
			updateState(updates, { flushSync });
		}
		revalidatingFetchers.forEach((rf) => {
			abortFetcher(rf.key);
			if (rf.controller) fetchControllers.set(rf.key, rf.controller);
		});
		let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f) => abortFetcher(f.key));
		if (pendingNavigationController) pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
		let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(dsMatches, revalidatingFetchers, request, location, scopedContext);
		if (request.signal.aborted) return { shortCircuited: true };
		if (pendingNavigationController) pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
		revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
		let redirect2 = findRedirect(loaderResults);
		if (redirect2) {
			await startRedirectNavigation(request, redirect2.result, true, { replace: replace2 });
			return { shortCircuited: true };
		}
		redirect2 = findRedirect(fetcherResults);
		if (redirect2) {
			fetchRedirectIds.add(redirect2.key);
			await startRedirectNavigation(request, redirect2.result, true, { replace: replace2 });
			return { shortCircuited: true };
		}
		let workingFetchers = new Map(state.fetchers);
		let { loaderData, errors } = processLoaderData(state, matches, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, workingFetchers);
		if (initialHydration && state.errors) errors = {
			...state.errors,
			...errors
		};
		let didUpdateFetcherRedirects = markFetchRedirectsDone(workingFetchers);
		let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId, workingFetchers);
		let shouldUpdateFetchers = didUpdateFetcherRedirects || didAbortFetchLoads || revalidatingFetchers.length > 0;
		return {
			matches,
			loaderData,
			errors,
			...shouldUpdateFetchers ? { workingFetchers } : {}
		};
	}
	function getUpdatedActionData(pendingActionResult) {
		if (pendingActionResult && !isErrorResult(pendingActionResult[1])) return { [pendingActionResult[0]]: pendingActionResult[1].data };
		else if (state.actionData) if (Object.keys(state.actionData).length === 0) return null;
		else return state.actionData;
	}
	function getUpdatedRevalidatingFetchers(revalidatingFetchers) {
		let workingFetchers = new Map(state.fetchers);
		revalidatingFetchers.forEach((rf) => {
			let fetcher = workingFetchers.get(rf.key);
			let revalidatingFetcher = getLoadingFetcher(void 0, fetcher ? fetcher.data : void 0);
			workingFetchers.set(rf.key, revalidatingFetcher);
		});
		return workingFetchers;
	}
	async function fetch2(key, routeId, href, opts) {
		abortFetcher(key);
		let flushSync = (opts && opts.flushSync) === true;
		let routesToUse = dataRoutes.activeRoutes;
		let normalizedPath = normalizeTo(state.location, state.matches, basename, href, routeId, opts?.relative);
		let matches = matchRoutesImpl(routesToUse, normalizedPath, basename, false, dataRoutes.branches);
		let fogOfWar = checkFogOfWar(matches, routesToUse, normalizedPath);
		if (fogOfWar.active && fogOfWar.matches) matches = fogOfWar.matches;
		if (!matches) {
			setFetcherError(key, routeId, getInternalRouterError(404, { pathname: normalizedPath }), { flushSync });
			return;
		}
		let { path, submission, error } = normalizeNavigateOptions(true, normalizedPath, opts);
		if (error) {
			setFetcherError(key, routeId, error, { flushSync });
			return;
		}
		let scopedContext = init.getContext ? await init.getContext() : new RouterContextProvider();
		let preventScrollReset = (opts && opts.preventScrollReset) === true;
		if (submission && isMutationMethod(submission.formMethod)) {
			await handleFetcherAction(key, routeId, path, matches, scopedContext, fogOfWar.active, flushSync, preventScrollReset, submission, opts && opts.defaultShouldRevalidate);
			return;
		}
		fetchLoadMatches.set(key, {
			routeId,
			path
		});
		await handleFetcherLoader(key, routeId, path, matches, scopedContext, fogOfWar.active, flushSync, preventScrollReset, submission);
	}
	async function handleFetcherAction(key, routeId, path, requestMatches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission, callSiteDefaultShouldRevalidate) {
		interruptActiveLoads();
		fetchLoadMatches.delete(key);
		updateFetcherState(key, getSubmittingFetcher(submission, state.fetchers.get(key)), { flushSync });
		let abortController = new AbortController();
		let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
		if (isFogOfWar) {
			let discoverResult = await discoverRoutes(requestMatches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
			if (discoverResult.type === "aborted") return;
			else if (discoverResult.type === "error") {
				setFetcherError(key, routeId, discoverResult.error, { flushSync });
				return;
			} else if (!discoverResult.matches) {
				setFetcherError(key, routeId, getInternalRouterError(404, { pathname: path }), { flushSync });
				return;
			} else requestMatches = discoverResult.matches;
		}
		let match = getTargetMatch(requestMatches, path);
		if (!match.route.action && !match.route.lazy) {
			setFetcherError(key, routeId, getInternalRouterError(405, {
				method: submission.formMethod,
				pathname: path,
				routeId
			}), { flushSync });
			return;
		}
		fetchControllers.set(key, abortController);
		let originatingLoadId = incrementingLoadId;
		let fetchMatches = getTargetedDataStrategyMatches(mapRouteProperties2, manifest, fetchRequest, path, requestMatches, match, hydrationRouteProperties2, scopedContext);
		let actionResults = await callDataStrategy(fetchRequest, path, fetchMatches, scopedContext, key);
		let actionResult = actionResults[match.route.id];
		if (!actionResult) {
			for (let match2 of fetchMatches) if (actionResults[match2.route.id]) {
				actionResult = actionResults[match2.route.id];
				break;
			}
		}
		if (fetchRequest.signal.aborted) {
			if (fetchControllers.get(key) === abortController) fetchControllers.delete(key);
			return;
		}
		if (fetchersQueuedForDeletion.has(key)) {
			if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
				updateFetcherState(key, getDoneFetcher(void 0));
				return;
			}
		} else {
			if (isRedirectResult(actionResult)) {
				fetchControllers.delete(key);
				if (pendingNavigationLoadId > originatingLoadId) {
					updateFetcherState(key, getDoneFetcher(void 0));
					return;
				} else {
					fetchRedirectIds.add(key);
					updateFetcherState(key, getLoadingFetcher(submission));
					return startRedirectNavigation(fetchRequest, actionResult, false, {
						fetcherSubmission: submission,
						preventScrollReset
					});
				}
			}
			if (isErrorResult(actionResult)) {
				setFetcherError(key, routeId, actionResult.error);
				return;
			}
		}
		let nextLocation = state.navigation.location || state.location;
		let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
		let routesToUse = dataRoutes.activeRoutes;
		let matches = state.navigation.state !== "idle" ? matchRoutesImpl(routesToUse, state.navigation.location, basename, false, dataRoutes.branches) : state.matches;
		invariant$1(matches, "Didn't find any matches after fetcher action");
		let loadId = ++incrementingLoadId;
		fetchReloadIds.set(key, loadId);
		let { dsMatches, revalidatingFetchers } = getMatchesToLoad(revalidationRequest, scopedContext, mapRouteProperties2, manifest, init.history, state, matches, submission, nextLocation, hydrationRouteProperties2, false, isRevalidationRequired, cancelledFetcherLoads, fetchersQueuedForDeletion, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, init.patchRoutesOnNavigation != null, dataRoutes.branches, [match.route.id, actionResult], callSiteDefaultShouldRevalidate);
		let loadFetcher = getLoadingFetcher(submission, actionResult.data);
		let workingFetchers = new Map(state.fetchers);
		workingFetchers.set(key, loadFetcher);
		revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
			let staleKey = rf.key;
			let existingFetcher2 = workingFetchers.get(staleKey);
			let revalidatingFetcher = getLoadingFetcher(void 0, existingFetcher2 ? existingFetcher2.data : void 0);
			workingFetchers.set(staleKey, revalidatingFetcher);
			abortFetcher(staleKey);
			if (rf.controller) fetchControllers.set(staleKey, rf.controller);
		});
		updateState({ fetchers: workingFetchers });
		let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
		abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
		let { loaderResults, fetcherResults } = await callLoadersAndMaybeResolveData(dsMatches, revalidatingFetchers, revalidationRequest, nextLocation, scopedContext);
		if (abortController.signal.aborted) return;
		abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
		fetchReloadIds.delete(key);
		fetchControllers.delete(key);
		revalidatingFetchers.forEach((r) => fetchControllers.delete(r.key));
		let fetcherIsMounted = state.fetchers.has(key);
		let getRedirectStateWithDoneFetcher = (s) => {
			if (!fetcherIsMounted) return s;
			let workingFetchers2 = new Map(s.fetchers);
			workingFetchers2.set(key, getDoneFetcher(actionResult.data));
			return {
				...s,
				fetchers: workingFetchers2
			};
		};
		let redirect2 = findRedirect(loaderResults);
		if (redirect2) {
			state = getRedirectStateWithDoneFetcher(state);
			return startRedirectNavigation(revalidationRequest, redirect2.result, false, { preventScrollReset });
		}
		redirect2 = findRedirect(fetcherResults);
		if (redirect2) {
			fetchRedirectIds.add(redirect2.key);
			state = getRedirectStateWithDoneFetcher(state);
			return startRedirectNavigation(revalidationRequest, redirect2.result, false, { preventScrollReset });
		}
		let finalFetchers = new Map(state.fetchers);
		if (fetcherIsMounted) finalFetchers.set(key, getDoneFetcher(actionResult.data));
		let { loaderData, errors } = processLoaderData(state, matches, loaderResults, void 0, revalidatingFetchers, fetcherResults, finalFetchers);
		abortStaleFetchLoads(loadId, finalFetchers);
		if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
			invariant$1(pendingAction, "Expected pending action");
			pendingNavigationController && pendingNavigationController.abort();
			completeNavigation(state.navigation.location, {
				matches,
				loaderData,
				errors,
				fetchers: finalFetchers
			});
		} else {
			updateState({
				errors,
				loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
				fetchers: finalFetchers
			});
			isRevalidationRequired = false;
		}
	}
	async function handleFetcherLoader(key, routeId, path, matches, scopedContext, isFogOfWar, flushSync, preventScrollReset, submission) {
		let existingFetcher = state.fetchers.get(key);
		updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : void 0), { flushSync });
		let abortController = new AbortController();
		let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
		if (isFogOfWar) {
			let discoverResult = await discoverRoutes(matches, new URL(fetchRequest.url).pathname, fetchRequest.signal, key);
			if (discoverResult.type === "aborted") return;
			else if (discoverResult.type === "error") {
				setFetcherError(key, routeId, discoverResult.error, { flushSync });
				return;
			} else if (!discoverResult.matches) {
				setFetcherError(key, routeId, getInternalRouterError(404, { pathname: path }), { flushSync });
				return;
			} else matches = discoverResult.matches;
		}
		let match = getTargetMatch(matches, path);
		fetchControllers.set(key, abortController);
		let originatingLoadId = incrementingLoadId;
		let results = await callDataStrategy(fetchRequest, path, getTargetedDataStrategyMatches(mapRouteProperties2, manifest, fetchRequest, path, matches, match, hydrationRouteProperties2, scopedContext), scopedContext, key);
		let result = results[match.route.id];
		if (!result) {
			for (let match2 of matches) if (results[match2.route.id]) {
				result = results[match2.route.id];
				break;
			}
		}
		if (fetchControllers.get(key) === abortController) fetchControllers.delete(key);
		if (fetchRequest.signal.aborted) return;
		if (fetchersQueuedForDeletion.has(key)) {
			updateFetcherState(key, getDoneFetcher(void 0));
			return;
		}
		if (isRedirectResult(result)) if (pendingNavigationLoadId > originatingLoadId) {
			updateFetcherState(key, getDoneFetcher(void 0));
			return;
		} else {
			fetchRedirectIds.add(key);
			await startRedirectNavigation(fetchRequest, result, false, { preventScrollReset });
			return;
		}
		if (isErrorResult(result)) {
			setFetcherError(key, routeId, result.error);
			return;
		}
		updateFetcherState(key, getDoneFetcher(result.data));
	}
	async function startRedirectNavigation(request, redirect2, isNavigation, { submission, fetcherSubmission, preventScrollReset, replace: replace2 } = {}) {
		if (!isNavigation) {
			pendingPopstateNavigationDfd?.resolve();
			pendingPopstateNavigationDfd = null;
		}
		if (redirect2.response.headers.has("X-Remix-Revalidate")) isRevalidationRequired = true;
		let location = redirect2.response.headers.get("Location");
		invariant$1(location, "Expected a Location header on the redirect Response");
		location = normalizeRedirectLocation$1(location, new URL(request.url), basename, init.history);
		let redirectLocation = createLocation(state.location, location, { _isRedirect: true });
		if (isBrowser3) {
			let isDocumentReload = false;
			if (redirect2.response.headers.has("X-Remix-Reload-Document")) isDocumentReload = true;
			else if (isAbsoluteUrl(location)) {
				const url = createBrowserURLImpl(routerWindow, location, true);
				isDocumentReload = url.origin !== routerWindow.location.origin || stripBasename(url.pathname, basename) == null;
			}
			if (isDocumentReload) {
				if (replace2) routerWindow.location.replace(location);
				else routerWindow.location.assign(location);
				return;
			}
		}
		pendingNavigationController = null;
		let redirectNavigationType = replace2 === true || redirect2.response.headers.has("X-Remix-Replace") ? "REPLACE" : "PUSH";
		let { formMethod, formAction, formEncType } = state.navigation;
		if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) submission = getSubmissionFromNavigation(state.navigation);
		let activeSubmission = submission || fetcherSubmission;
		if (redirectPreserveMethodStatusCodes.has(redirect2.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) await startNavigation(redirectNavigationType, redirectLocation, {
			submission: {
				...activeSubmission,
				formAction: location
			},
			preventScrollReset: preventScrollReset || pendingPreventScrollReset,
			enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
		});
		else await startNavigation(redirectNavigationType, redirectLocation, {
			overrideNavigation: getLoadingNavigation(redirectLocation, [], redirectNavigationType, submission),
			fetcherSubmission,
			preventScrollReset: preventScrollReset || pendingPreventScrollReset,
			enableViewTransition: isNavigation ? pendingViewTransitionEnabled : void 0
		});
	}
	async function callDataStrategy(request, path, matches, scopedContext, fetcherKey) {
		let results;
		let dataResults = {};
		try {
			results = await callDataStrategyImpl(dataStrategyImpl, request, path, matches, fetcherKey, scopedContext, false);
		} catch (e) {
			matches.filter((m) => m.shouldLoad).forEach((m) => {
				dataResults[m.route.id] = {
					type: "error",
					error: e
				};
			});
			return dataResults;
		}
		if (request.signal.aborted) return dataResults;
		if (!isMutationMethod(request.method)) for (let match of matches) {
			if (results[match.route.id]?.type === "error") break;
			if (!results.hasOwnProperty(match.route.id) && !state.loaderData.hasOwnProperty(match.route.id) && (!state.errors || !state.errors.hasOwnProperty(match.route.id)) && match.shouldCallHandler()) results[match.route.id] = {
				type: "error",
				result: /* @__PURE__ */ new Error(`No result returned from dataStrategy for route ${match.route.id}`)
			};
		}
		for (let [routeId, result] of Object.entries(results)) if (isRedirectDataStrategyResult(result)) {
			let response = result.result;
			dataResults[routeId] = {
				type: "redirect",
				response: normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename)
			};
		} else dataResults[routeId] = await convertDataStrategyResultToDataResult(result);
		return dataResults;
	}
	async function callLoadersAndMaybeResolveData(matches, fetchersToLoad, request, location, scopedContext) {
		let loaderResultsPromise = callDataStrategy(request, location, matches, scopedContext, null);
		let fetcherResultsPromise = Promise.all(fetchersToLoad.map(async (f) => {
			if (f.matches && f.match && f.request && f.controller) {
				let result = (await callDataStrategy(f.request, f.path, f.matches, scopedContext, f.key))[f.match.route.id];
				return { [f.key]: result };
			} else return Promise.resolve({ [f.key]: {
				type: "error",
				error: getInternalRouterError(404, { pathname: f.path })
			} });
		}));
		return {
			loaderResults: await loaderResultsPromise,
			fetcherResults: (await fetcherResultsPromise).reduce((acc, r) => Object.assign(acc, r), {})
		};
	}
	function interruptActiveLoads() {
		isRevalidationRequired = true;
		fetchLoadMatches.forEach((_, key) => {
			if (fetchControllers.has(key)) cancelledFetcherLoads.add(key);
			abortFetcher(key);
		});
	}
	function updateFetcherState(key, fetcher, opts = {}) {
		let workingFetchers = new Map(state.fetchers);
		workingFetchers.set(key, fetcher);
		updateState({ fetchers: workingFetchers }, { flushSync: (opts && opts.flushSync) === true });
	}
	function setFetcherError(key, routeId, error, opts = {}) {
		let boundaryMatch = findNearestBoundary(state.matches, routeId);
		let workingFetchers = new Map(state.fetchers);
		deleteFetcher(workingFetchers, key);
		updateState({
			errors: { [boundaryMatch.route.id]: error },
			fetchers: workingFetchers
		}, { flushSync: (opts && opts.flushSync) === true });
	}
	function getFetcher(key) {
		activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
		if (fetchersQueuedForDeletion.has(key)) fetchersQueuedForDeletion.delete(key);
		return state.fetchers.get(key) || IDLE_FETCHER;
	}
	function resetFetcher(key, opts) {
		abortFetcher(key, opts?.reason);
		updateFetcherState(key, getDoneFetcher(null));
	}
	function deleteFetcher(fetchers, key) {
		let fetcher = state.fetchers.get(key);
		if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) abortFetcher(key);
		fetchLoadMatches.delete(key);
		fetchReloadIds.delete(key);
		fetchRedirectIds.delete(key);
		fetchersQueuedForDeletion.delete(key);
		cancelledFetcherLoads.delete(key);
		fetchers.delete(key);
	}
	function queueFetcherForDeletion(key) {
		let count = (activeFetchers.get(key) || 0) - 1;
		if (count <= 0) {
			activeFetchers.delete(key);
			fetchersQueuedForDeletion.add(key);
		} else activeFetchers.set(key, count);
		updateState({ fetchers: new Map(state.fetchers) });
	}
	function abortFetcher(key, reason) {
		let controller = fetchControllers.get(key);
		if (controller) {
			controller.abort(reason);
			fetchControllers.delete(key);
		}
	}
	function markFetchersDone(keys, fetchers) {
		for (let key of keys) {
			let fetcher = fetchers.get(key);
			invariant$1(fetcher, `Expected fetcher: ${key}`);
			let doneFetcher = getDoneFetcher(fetcher.data);
			fetchers.set(key, doneFetcher);
		}
	}
	function markFetchRedirectsDone(fetchers) {
		let doneKeys = [];
		let didUpdateFetchers = false;
		for (let key of fetchRedirectIds) {
			let fetcher = fetchers.get(key);
			invariant$1(fetcher, `Expected fetcher: ${key}`);
			if (fetcher.state === "loading") {
				fetchRedirectIds.delete(key);
				doneKeys.push(key);
				didUpdateFetchers = true;
			}
		}
		markFetchersDone(doneKeys, fetchers);
		return didUpdateFetchers;
	}
	function abortStaleFetchLoads(landedId, fetchers) {
		let yeetedKeys = [];
		for (let [key, id] of fetchReloadIds) if (id < landedId) {
			let fetcher = fetchers.get(key);
			invariant$1(fetcher, `Expected fetcher: ${key}`);
			if (fetcher.state === "loading") {
				abortFetcher(key);
				fetchReloadIds.delete(key);
				yeetedKeys.push(key);
			}
		}
		markFetchersDone(yeetedKeys, fetchers);
		return yeetedKeys.length > 0;
	}
	function getBlocker(key, fn) {
		let blocker = state.blockers.get(key) || IDLE_BLOCKER;
		if (blockerFunctions.get(key) !== fn) blockerFunctions.set(key, fn);
		return blocker;
	}
	function deleteBlocker(key) {
		state.blockers.delete(key);
		blockerFunctions.delete(key);
	}
	function updateBlocker(key, newBlocker) {
		let blocker = state.blockers.get(key) || IDLE_BLOCKER;
		invariant$1(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", `Invalid blocker state transition: ${blocker.state} -> ${newBlocker.state}`);
		let blockers = new Map(state.blockers);
		blockers.set(key, newBlocker);
		updateState({ blockers });
	}
	function shouldBlockNavigation({ currentLocation, nextLocation, historyAction }) {
		if (blockerFunctions.size === 0) return;
		if (blockerFunctions.size > 1) warning(false, "A router only supports one blocker at a time");
		let entries = Array.from(blockerFunctions.entries());
		let [blockerKey, blockerFunction] = entries[entries.length - 1];
		let blocker = state.blockers.get(blockerKey);
		if (blocker && blocker.state === "proceeding") return;
		if (blockerFunction({
			currentLocation,
			nextLocation,
			historyAction
		})) return blockerKey;
	}
	function handleNavigational404(pathname) {
		let error = getInternalRouterError(404, { pathname });
		let routesToUse = dataRoutes.activeRoutes;
		let { matches, route } = getShortCircuitMatches(routesToUse);
		return {
			notFoundMatches: matches,
			route,
			error
		};
	}
	function enableScrollRestoration(positions, getPosition, getKey) {
		savedScrollPositions2 = positions;
		getScrollPosition = getPosition;
		getScrollRestorationKey2 = getKey || null;
		if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
			initialScrollRestored = true;
			let y = getSavedScrollPosition(state.location, state.matches);
			if (y != null) updateState({ restoreScrollPosition: y });
		}
		return () => {
			savedScrollPositions2 = null;
			getScrollPosition = null;
			getScrollRestorationKey2 = null;
		};
	}
	function getScrollKey(location, matches) {
		if (getScrollRestorationKey2) return getScrollRestorationKey2(location, matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData))) || location.key;
		return location.key;
	}
	function saveScrollPosition(location, matches) {
		if (savedScrollPositions2 && getScrollPosition) {
			let key = getScrollKey(location, matches);
			savedScrollPositions2[key] = getScrollPosition();
		}
	}
	function getSavedScrollPosition(location, matches) {
		if (savedScrollPositions2) {
			let key = getScrollKey(location, matches);
			let y = savedScrollPositions2[key];
			if (typeof y === "number") return y;
		}
		return null;
	}
	function checkFogOfWar(matches, routesToUse, pathname) {
		if (init.patchRoutesOnNavigation) {
			let activeBranches = dataRoutes.branches;
			if (!matches) return {
				active: true,
				matches: matchRoutesImpl(routesToUse, pathname, basename, true, activeBranches) || []
			};
			else if (Object.keys(matches[0].params).length > 0) return {
				active: true,
				matches: matchRoutesImpl(routesToUse, pathname, basename, true, activeBranches)
			};
		}
		return {
			active: false,
			matches: null
		};
	}
	async function discoverRoutes(matches, pathname, signal, fetcherKey) {
		if (!init.patchRoutesOnNavigation) return {
			type: "success",
			matches
		};
		let partialMatches = matches;
		while (true) {
			let localManifest = manifest;
			try {
				await init.patchRoutesOnNavigation({
					signal,
					path: pathname,
					matches: partialMatches,
					fetcherKey,
					patch: (routeId, children) => {
						if (signal.aborted) return;
						patchRoutesImpl(routeId, children, dataRoutes, localManifest, mapRouteProperties2, false);
					}
				});
			} catch (e) {
				return {
					type: "error",
					error: e,
					partialMatches
				};
			}
			if (signal.aborted) return { type: "aborted" };
			let activeBranches = dataRoutes.branches;
			let newMatches = matchRoutesImpl(dataRoutes.activeRoutes, pathname, basename, false, activeBranches);
			let newPartialMatches = null;
			if (newMatches) if (Object.keys(newMatches[0].params).length === 0) return {
				type: "success",
				matches: newMatches
			};
			else {
				newPartialMatches = matchRoutesImpl(dataRoutes.activeRoutes, pathname, basename, true, activeBranches);
				if (!(newPartialMatches && partialMatches.length < newPartialMatches.length && compareMatches(partialMatches, newPartialMatches.slice(0, partialMatches.length)))) return {
					type: "success",
					matches: newMatches
				};
			}
			if (!newPartialMatches) newPartialMatches = matchRoutesImpl(dataRoutes.activeRoutes, pathname, basename, true, activeBranches);
			if (!newPartialMatches || compareMatches(partialMatches, newPartialMatches)) return {
				type: "success",
				matches: null
			};
			partialMatches = newPartialMatches;
		}
	}
	function compareMatches(a, b) {
		return a.length === b.length && a.every((m, i) => m.route.id === b[i].route.id);
	}
	function _internalSetRoutes(newRoutes) {
		manifest = {};
		dataRoutes.setHmrRoutes(convertRoutesToDataRoutes(newRoutes, mapRouteProperties2, void 0, manifest));
	}
	function patchRoutes(routeId, children, unstable_allowElementMutations = false) {
		patchRoutesImpl(routeId, children, dataRoutes, manifest, mapRouteProperties2, unstable_allowElementMutations);
		if (!dataRoutes.hasHMRRoutes) updateState({});
	}
	router = {
		get basename() {
			return basename;
		},
		get future() {
			return future;
		},
		get state() {
			return state;
		},
		get routes() {
			return dataRoutes.stableRoutes;
		},
		get branches() {
			return dataRoutes.branches;
		},
		get manifest() {
			return manifest;
		},
		get window() {
			return routerWindow;
		},
		initialize,
		subscribe,
		enableScrollRestoration,
		navigate,
		fetch: fetch2,
		revalidate,
		createHref: (to) => init.history.createHref(to),
		encodeLocation: (to) => init.history.encodeLocation(to),
		getFetcher,
		resetFetcher,
		deleteFetcher: queueFetcherForDeletion,
		dispose,
		getBlocker,
		deleteBlocker,
		patchRoutes,
		_internalFetchControllers: fetchControllers,
		_internalSetRoutes,
		_internalSetStateDoNotUseOrYouWillBreakYourApp(newState) {
			updateState(newState);
		}
	};
	if (init.instrumentations) router = instrumentClientSideRouter(router, init.instrumentations.map((i) => i.router).filter(Boolean));
	return router;
}
function createStaticHandler(routes, opts) {
	invariant$1(routes.length > 0, "You must provide a non-empty routes array to createStaticHandler");
	let manifest = {};
	let basename = (opts ? opts.basename : null) || "/";
	let _mapRouteProperties = opts?.mapRouteProperties || defaultMapRouteProperties;
	let mapRouteProperties2 = _mapRouteProperties;
	({ ...opts?.future });
	if (opts?.instrumentations) {
		let instrumentations = opts.instrumentations;
		mapRouteProperties2 = (route) => {
			return {
				..._mapRouteProperties(route),
				...getRouteInstrumentationUpdates(instrumentations.map((i) => i.route).filter(Boolean), route)
			};
		};
	}
	let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties2, void 0, manifest);
	let routeBranches = flattenAndRankRoutes(dataRoutes);
	async function query(request, { requestContext, filterMatchesToLoad, skipLoaderErrorBubbling, skipRevalidation, dataStrategy, generateMiddlewareResponse, normalizePath } = {}) {
		let normalizePathImpl = normalizePath || defaultNormalizePath;
		let method = request.method;
		let location = createLocation("", normalizePathImpl(request), null, "default");
		let matches = matchRoutesImpl(dataRoutes, location, basename, false, routeBranches);
		requestContext = requestContext != null ? requestContext : new RouterContextProvider();
		if (!isValidMethod(method) && method !== "HEAD") {
			let error = getInternalRouterError(405, { method });
			let { matches: methodNotAllowedMatches, route } = getShortCircuitMatches(dataRoutes);
			let staticContext = {
				basename,
				location,
				matches: methodNotAllowedMatches,
				loaderData: {},
				actionData: null,
				errors: { [route.id]: error },
				statusCode: error.status,
				loaderHeaders: {},
				actionHeaders: {}
			};
			return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
		} else if (!matches) {
			let error = getInternalRouterError(404, { pathname: location.pathname });
			let { matches: notFoundMatches, route } = getShortCircuitMatches(dataRoutes);
			let staticContext = {
				basename,
				location,
				matches: notFoundMatches,
				loaderData: {},
				actionData: null,
				errors: { [route.id]: error },
				statusCode: error.status,
				loaderHeaders: {},
				actionHeaders: {}
			};
			return generateMiddlewareResponse ? generateMiddlewareResponse(() => Promise.resolve(staticContext)) : staticContext;
		}
		if (generateMiddlewareResponse) {
			invariant$1(requestContext instanceof RouterContextProvider, "When using middleware in `staticHandler.query()`, any provided `requestContext` must be an instance of `RouterContextProvider`");
			try {
				await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2);
				let renderedStaticContext;
				let response = await runServerMiddlewarePipeline({
					request,
					url: createDataFunctionUrl(request, location),
					pattern: getRoutePattern(matches),
					matches,
					params: matches[0].params,
					context: requestContext
				}, async () => {
					return await generateMiddlewareResponse(async (revalidationRequest, opts2 = {}) => {
						let result2 = await queryImpl(revalidationRequest, location, matches, requestContext, dataStrategy || null, skipLoaderErrorBubbling === true, null, "filterMatchesToLoad" in opts2 ? opts2.filterMatchesToLoad ?? null : filterMatchesToLoad ?? null, skipRevalidation === true);
						if (isResponse(result2)) return result2;
						renderedStaticContext = {
							location,
							basename,
							...result2
						};
						return renderedStaticContext;
					});
				}, async (error, routeId) => {
					if (isRedirectResponse(error)) return error;
					if (isResponse(error)) try {
						error = new ErrorResponseImpl(error.status, error.statusText, await parseResponseBody(error));
					} catch (e) {
						error = e;
					}
					if (isDataWithResponseInit(error)) error = dataWithResponseInitToErrorResponse(error);
					if (renderedStaticContext) {
						if (routeId in renderedStaticContext.loaderData) renderedStaticContext.loaderData[routeId] = void 0;
						let staticContext = getStaticContextFromError(dataRoutes, renderedStaticContext, error, skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, routeId).route.id);
						return generateMiddlewareResponse(() => Promise.resolve(staticContext));
					} else {
						let staticContext = {
							matches,
							location,
							basename,
							loaderData: {},
							actionData: null,
							errors: { [skipLoaderErrorBubbling ? routeId : findNearestBoundary(matches, matches.find((m) => m.route.id === routeId || m.route.loader)?.route.id || routeId).route.id]: error },
							statusCode: isRouteErrorResponse(error) ? error.status : 500,
							actionHeaders: {},
							loaderHeaders: {}
						};
						return generateMiddlewareResponse(() => Promise.resolve(staticContext));
					}
				});
				invariant$1(isResponse(response), "Expected a response in query()");
				return response;
			} catch (e) {
				if (isResponse(e)) return e;
				throw e;
			}
		}
		let result = await queryImpl(request, location, matches, requestContext, dataStrategy || null, skipLoaderErrorBubbling === true, null, filterMatchesToLoad || null, skipRevalidation === true);
		if (isResponse(result)) return result;
		return {
			location,
			basename,
			...result
		};
	}
	async function queryRoute(request, { routeId, requestContext, dataStrategy, generateMiddlewareResponse, normalizePath } = {}) {
		let normalizePathImpl = normalizePath || defaultNormalizePath;
		let method = request.method;
		let location = createLocation("", normalizePathImpl(request), null, "default");
		let matches = matchRoutesImpl(dataRoutes, location, basename, false, routeBranches);
		requestContext = requestContext != null ? requestContext : new RouterContextProvider();
		if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") throw getInternalRouterError(405, { method });
		else if (!matches) throw getInternalRouterError(404, { pathname: location.pathname });
		let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location);
		if (routeId && !match) throw getInternalRouterError(403, {
			pathname: location.pathname,
			routeId
		});
		else if (!match) throw getInternalRouterError(404, { pathname: location.pathname });
		if (generateMiddlewareResponse) {
			invariant$1(requestContext instanceof RouterContextProvider, "When using middleware in `staticHandler.queryRoute()`, any provided `requestContext` must be an instance of `RouterContextProvider`");
			await loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2);
			return await runServerMiddlewarePipeline({
				request,
				url: createDataFunctionUrl(request, location),
				pattern: getRoutePattern(matches),
				matches,
				params: matches[0].params,
				context: requestContext
			}, async () => {
				return await generateMiddlewareResponse(async (innerRequest) => {
					let processed = handleQueryResult(await queryImpl(innerRequest, location, matches, requestContext, dataStrategy || null, false, match, null, false));
					return isResponse(processed) ? processed : typeof processed === "string" ? new Response(processed) : Response.json(processed);
				});
			}, (error) => {
				if (isDataWithResponseInit(error)) return Promise.resolve(dataWithResponseInitToResponse(error));
				if (isResponse(error)) return Promise.resolve(error);
				throw error;
			});
		}
		return handleQueryResult(await queryImpl(request, location, matches, requestContext, dataStrategy || null, false, match, null, false));
		function handleQueryResult(result2) {
			if (isResponse(result2)) return result2;
			let error = result2.errors ? Object.values(result2.errors)[0] : void 0;
			if (error !== void 0) throw error;
			if (result2.actionData) return Object.values(result2.actionData)[0];
			if (result2.loaderData) return Object.values(result2.loaderData)[0];
		}
	}
	async function queryImpl(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, skipRevalidation) {
		invariant$1(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
		try {
			if (isMutationMethod(request.method)) return await submit(request, location, matches, routeMatch || getTargetMatch(matches, location), requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch != null, filterMatchesToLoad, skipRevalidation);
			let result = await loadRouteData(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad);
			return isResponse(result) ? result : {
				...result,
				actionData: null,
				actionHeaders: {}
			};
		} catch (e) {
			if (isDataStrategyResult(e) && isResponse(e.result)) {
				if (e.type === "error") throw e.result;
				return e.result;
			}
			if (isRedirectResponse(e)) return e;
			throw e;
		}
	}
	async function submit(request, location, matches, actionMatch, requestContext, dataStrategy, skipLoaderErrorBubbling, isRouteRequest, filterMatchesToLoad, skipRevalidation) {
		let result;
		if (!actionMatch.route.action && !actionMatch.route.lazy) {
			let error = getInternalRouterError(405, {
				method: request.method,
				pathname: new URL(request.url).pathname,
				routeId: actionMatch.route.id
			});
			if (isRouteRequest) throw error;
			result = {
				type: "error",
				error
			};
		} else {
			result = (await callDataStrategy(request, location, getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, location, matches, actionMatch, [], requestContext), isRouteRequest, requestContext, dataStrategy))[actionMatch.route.id];
			if (request.signal.aborted) throwStaticHandlerAbortedError(request, isRouteRequest);
		}
		if (isRedirectResult(result)) throw new Response(null, {
			status: result.response.status,
			headers: { Location: result.response.headers.get("Location") }
		});
		if (isRouteRequest) {
			if (isErrorResult(result)) throw result.error;
			return {
				matches: [actionMatch],
				loaderData: {},
				actionData: { [actionMatch.route.id]: result.data },
				errors: null,
				statusCode: 200,
				loaderHeaders: {},
				actionHeaders: {}
			};
		}
		if (skipRevalidation) if (isErrorResult(result)) {
			let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
			return {
				statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
				actionData: null,
				actionHeaders: { ...result.headers ? { [actionMatch.route.id]: result.headers } : {} },
				matches,
				loaderData: {},
				errors: { [boundaryMatch.route.id]: result.error },
				loaderHeaders: {}
			};
		} else return {
			actionData: { [actionMatch.route.id]: result.data },
			actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {},
			matches,
			loaderData: {},
			errors: null,
			statusCode: result.statusCode || 200,
			loaderHeaders: {}
		};
		let loaderRequest = new Request(request.url, {
			headers: request.headers,
			redirect: request.redirect,
			signal: request.signal
		});
		if (isErrorResult(result)) return {
			...await loadRouteData(loaderRequest, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null, filterMatchesToLoad, [(skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id)).route.id, result]),
			statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
			actionData: null,
			actionHeaders: { ...result.headers ? { [actionMatch.route.id]: result.headers } : {} }
		};
		return {
			...await loadRouteData(loaderRequest, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, null, filterMatchesToLoad),
			actionData: { [actionMatch.route.id]: result.data },
			...result.statusCode ? { statusCode: result.statusCode } : {},
			actionHeaders: result.headers ? { [actionMatch.route.id]: result.headers } : {}
		};
	}
	async function loadRouteData(request, location, matches, requestContext, dataStrategy, skipLoaderErrorBubbling, routeMatch, filterMatchesToLoad, pendingActionResult) {
		let isRouteRequest = routeMatch != null;
		if (isRouteRequest && !routeMatch?.route.loader && !routeMatch?.route.lazy) throw getInternalRouterError(400, {
			method: request.method,
			pathname: new URL(request.url).pathname,
			routeId: routeMatch?.route.id
		});
		let dsMatches;
		if (routeMatch) dsMatches = getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, location, matches, routeMatch, [], requestContext);
		else {
			let maxIdx = pendingActionResult && isErrorResult(pendingActionResult[1]) ? matches.findIndex((m) => m.route.id === pendingActionResult[0]) - 1 : void 0;
			let pattern = getRoutePattern(matches);
			dsMatches = matches.map((match, index) => {
				if (maxIdx != null && index > maxIdx) return getDataStrategyMatch(mapRouteProperties2, manifest, request, location, pattern, match, [], requestContext, false);
				return getDataStrategyMatch(mapRouteProperties2, manifest, request, location, pattern, match, [], requestContext, (match.route.loader || match.route.lazy) != null && (!filterMatchesToLoad || filterMatchesToLoad(match)));
			});
		}
		if (!dataStrategy && !dsMatches.some((m) => m.shouldLoad)) return {
			matches,
			loaderData: {},
			errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? { [pendingActionResult[0]]: pendingActionResult[1].error } : null,
			statusCode: 200,
			loaderHeaders: {}
		};
		let results = await callDataStrategy(request, location, dsMatches, isRouteRequest, requestContext, dataStrategy);
		if (request.signal.aborted) throwStaticHandlerAbortedError(request, isRouteRequest);
		return {
			...processRouteLoaderData(matches, results, pendingActionResult, true, skipLoaderErrorBubbling),
			matches
		};
	}
	async function callDataStrategy(request, location, matches, isRouteRequest, requestContext, dataStrategy) {
		let results = await callDataStrategyImpl(dataStrategy || defaultDataStrategy, request, location, matches, null, requestContext, true);
		let dataResults = {};
		await Promise.all(matches.map(async (match) => {
			if (!(match.route.id in results)) return;
			let result = results[match.route.id];
			if (isRedirectDataStrategyResult(result)) {
				let response = result.result;
				throw normalizeRelativeRoutingRedirectResponse(response, request, match.route.id, matches, basename);
			}
			if (isRouteRequest) {
				if (isResponse(result.result)) throw result;
				else if (isDataWithResponseInit(result.result)) throw dataWithResponseInitToResponse(result.result);
			}
			dataResults[match.route.id] = await convertDataStrategyResultToDataResult(result);
		}));
		return dataResults;
	}
	return {
		dataRoutes,
		_internalRouteBranches: routeBranches,
		query,
		queryRoute
	};
}
function getStaticContextFromError(routes, handlerContext, error, boundaryId) {
	let errorBoundaryId = boundaryId || handlerContext._deepestRenderedBoundaryId || routes[0].id;
	return {
		...handlerContext,
		statusCode: isRouteErrorResponse(error) ? error.status : 500,
		errors: { [errorBoundaryId]: error }
	};
}
function throwStaticHandlerAbortedError(request, isRouteRequest) {
	if (request.signal.reason !== void 0) throw request.signal.reason;
	throw new Error(`${isRouteRequest ? "queryRoute" : "query"}() call aborted without an \`AbortSignal.reason\`: ${request.method} ${request.url}`);
}
function isSubmissionNavigation(opts) {
	return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
}
function defaultNormalizePath(request) {
	let url = new URL(request.url);
	return {
		pathname: url.pathname,
		search: url.search,
		hash: url.hash
	};
}
function normalizeTo(location, matches, basename, to, fromRouteId, relative) {
	let contextualMatches;
	let activeRouteMatch;
	if (fromRouteId) {
		contextualMatches = [];
		for (let match of matches) {
			contextualMatches.push(match);
			if (match.route.id === fromRouteId) {
				activeRouteMatch = match;
				break;
			}
		}
	} else {
		contextualMatches = matches;
		activeRouteMatch = matches[matches.length - 1];
	}
	let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches), stripBasename(location.pathname, basename) || location.pathname, relative === "path");
	if (to == null) {
		path.search = location.search;
		path.hash = location.hash;
	}
	if ((to == null || to === "" || to === ".") && activeRouteMatch) {
		let nakedIndex = hasNakedIndexQuery(path.search);
		if (activeRouteMatch.route.index && !nakedIndex) path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
		else if (!activeRouteMatch.route.index && nakedIndex) {
			let params = new URLSearchParams(path.search);
			let indexValues = params.getAll("index");
			params.delete("index");
			indexValues.filter((v) => v).forEach((v) => params.append("index", v));
			let qs = params.toString();
			path.search = qs ? `?${qs}` : "";
		}
	}
	if (basename !== "/") path.pathname = prependBasename({
		basename,
		pathname: path.pathname
	});
	return createPath(path);
}
function normalizeNavigateOptions(isFetcher, path, opts) {
	if (!opts || !isSubmissionNavigation(opts)) return { path };
	if (opts.formMethod && !isValidMethod(opts.formMethod)) return {
		path,
		error: getInternalRouterError(405, { method: opts.formMethod })
	};
	let getInvalidBodyError = () => ({
		path,
		error: getInternalRouterError(400, { type: "invalid-body" })
	});
	let formMethod = (opts.formMethod || "get").toUpperCase();
	let formAction = stripHashFromPath(path);
	if (opts.body !== void 0) {
		if (opts.formEncType === "text/plain") {
			if (!isMutationMethod(formMethod)) return getInvalidBodyError();
			let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? Array.from(opts.body.entries()).reduce((acc, [name, value]) => `${acc}${name}=${value}
`, "") : String(opts.body);
			return {
				path,
				submission: {
					formMethod,
					formAction,
					formEncType: opts.formEncType,
					formData: void 0,
					json: void 0,
					text
				}
			};
		} else if (opts.formEncType === "application/json") {
			if (!isMutationMethod(formMethod)) return getInvalidBodyError();
			try {
				let json = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
				return {
					path,
					submission: {
						formMethod,
						formAction,
						formEncType: opts.formEncType,
						formData: void 0,
						json,
						text: void 0
					}
				};
			} catch (e) {
				return getInvalidBodyError();
			}
		}
	}
	invariant$1(typeof FormData === "function", "FormData is not available in this environment");
	let searchParams;
	let formData;
	if (opts.formData) {
		searchParams = convertFormDataToSearchParams(opts.formData);
		formData = opts.formData;
	} else if (opts.body instanceof FormData) {
		searchParams = convertFormDataToSearchParams(opts.body);
		formData = opts.body;
	} else if (opts.body instanceof URLSearchParams) {
		searchParams = opts.body;
		formData = convertSearchParamsToFormData(searchParams);
	} else if (opts.body == null) {
		searchParams = new URLSearchParams();
		formData = new FormData();
	} else try {
		searchParams = new URLSearchParams(opts.body);
		formData = convertSearchParamsToFormData(searchParams);
	} catch (e) {
		return getInvalidBodyError();
	}
	let submission = {
		formMethod,
		formAction,
		formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
		formData,
		json: void 0,
		text: void 0
	};
	if (isMutationMethod(submission.formMethod)) return {
		path,
		submission
	};
	let parsedPath = parsePath(path);
	if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) searchParams.append("index", "");
	parsedPath.search = `?${searchParams}`;
	return {
		path: createPath(parsedPath),
		submission
	};
}
function getMatchesToLoad(request, scopedContext, mapRouteProperties2, manifest, history, state, matches, submission, location, lazyRoutePropertiesToSkip, initialHydration, isRevalidationRequired, cancelledFetcherLoads, fetchersQueuedForDeletion, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, hasPatchRoutesOnNavigation, branches, pendingActionResult, callSiteDefaultShouldRevalidate) {
	let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : void 0;
	let currentUrl = history.createURL(state.location);
	let nextUrl = history.createURL(location);
	let maxIdx;
	if (initialHydration && state.errors) {
		let boundaryId = Object.keys(state.errors)[0];
		maxIdx = matches.findIndex((m) => m.route.id === boundaryId);
	} else if (pendingActionResult && isErrorResult(pendingActionResult[1])) {
		let boundaryId = pendingActionResult[0];
		maxIdx = matches.findIndex((m) => m.route.id === boundaryId) - 1;
	}
	let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : void 0;
	let shouldSkipRevalidation = actionStatus && actionStatus >= 400;
	let baseShouldRevalidateArgs = {
		currentUrl,
		currentParams: state.matches[0]?.params || {},
		nextUrl,
		nextParams: matches[0].params,
		...submission,
		actionResult,
		actionStatus
	};
	let pattern = getRoutePattern(matches);
	let dsMatches = matches.map((match, index) => {
		let { route } = match;
		let forceShouldLoad = null;
		if (maxIdx != null && index > maxIdx) forceShouldLoad = false;
		else if (route.lazy) forceShouldLoad = true;
		else if (!routeHasLoaderOrMiddleware(route)) forceShouldLoad = false;
		else if (initialHydration) {
			let { shouldLoad: shouldLoad2 } = getRouteHydrationStatus(route, state.loaderData, state.errors);
			forceShouldLoad = shouldLoad2;
		} else if (isNewLoader(state.loaderData, state.matches[index], match)) forceShouldLoad = true;
		if (forceShouldLoad !== null) return getDataStrategyMatch(mapRouteProperties2, manifest, request, location, pattern, match, lazyRoutePropertiesToSkip, scopedContext, forceShouldLoad);
		let defaultShouldRevalidate = false;
		if (typeof callSiteDefaultShouldRevalidate === "boolean") defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
		else if (shouldSkipRevalidation) defaultShouldRevalidate = false;
		else if (isRevalidationRequired) defaultShouldRevalidate = true;
		else if (currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search) defaultShouldRevalidate = true;
		else if (currentUrl.search !== nextUrl.search) defaultShouldRevalidate = true;
		else if (isNewRouteInstance(state.matches[index], match)) defaultShouldRevalidate = true;
		let shouldRevalidateArgs = {
			...baseShouldRevalidateArgs,
			defaultShouldRevalidate
		};
		return getDataStrategyMatch(mapRouteProperties2, manifest, request, location, pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateLoader(match, shouldRevalidateArgs), shouldRevalidateArgs, callSiteDefaultShouldRevalidate);
	});
	let revalidatingFetchers = [];
	fetchLoadMatches.forEach((f, key) => {
		if (initialHydration || !matches.some((m) => m.route.id === f.routeId) || fetchersQueuedForDeletion.has(key)) return;
		let fetcher = state.fetchers.get(key);
		let isMidInitialLoad = fetcher && fetcher.state !== "idle" && fetcher.data === void 0;
		let fetcherMatches = matchRoutesImpl(routesToUse, f.path, basename ?? "/", false, branches);
		if (!fetcherMatches) {
			if (hasPatchRoutesOnNavigation && isMidInitialLoad) return;
			revalidatingFetchers.push({
				key,
				routeId: f.routeId,
				path: f.path,
				matches: null,
				match: null,
				request: null,
				controller: null
			});
			return;
		}
		if (fetchRedirectIds.has(key)) return;
		let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
		let fetchController = new AbortController();
		let fetchRequest = createClientSideRequest(history, f.path, fetchController.signal);
		let fetcherDsMatches = null;
		if (cancelledFetcherLoads.has(key)) {
			cancelledFetcherLoads.delete(key);
			fetcherDsMatches = getTargetedDataStrategyMatches(mapRouteProperties2, manifest, fetchRequest, f.path, fetcherMatches, fetcherMatch, lazyRoutePropertiesToSkip, scopedContext);
		} else if (isMidInitialLoad) {
			if (isRevalidationRequired) fetcherDsMatches = getTargetedDataStrategyMatches(mapRouteProperties2, manifest, fetchRequest, f.path, fetcherMatches, fetcherMatch, lazyRoutePropertiesToSkip, scopedContext);
		} else {
			let defaultShouldRevalidate;
			if (typeof callSiteDefaultShouldRevalidate === "boolean") defaultShouldRevalidate = callSiteDefaultShouldRevalidate;
			else if (shouldSkipRevalidation) defaultShouldRevalidate = false;
			else defaultShouldRevalidate = isRevalidationRequired;
			let shouldRevalidateArgs = {
				...baseShouldRevalidateArgs,
				defaultShouldRevalidate
			};
			if (shouldRevalidateLoader(fetcherMatch, shouldRevalidateArgs)) fetcherDsMatches = getTargetedDataStrategyMatches(mapRouteProperties2, manifest, fetchRequest, f.path, fetcherMatches, fetcherMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs);
		}
		if (fetcherDsMatches) revalidatingFetchers.push({
			key,
			routeId: f.routeId,
			path: f.path,
			matches: fetcherDsMatches,
			match: fetcherMatch,
			request: fetchRequest,
			controller: fetchController
		});
	});
	return {
		dsMatches,
		revalidatingFetchers
	};
}
function routeHasLoaderOrMiddleware(route) {
	return route.loader != null || route.middleware != null && route.middleware.length > 0;
}
function getRouteHydrationStatus(route, loaderData, errors) {
	if (route.lazy) return {
		shouldLoad: true,
		renderFallback: true
	};
	if (!routeHasLoaderOrMiddleware(route)) return {
		shouldLoad: false,
		renderFallback: false
	};
	let hasData = loaderData != null && route.id in loaderData;
	let hasError = errors != null && errors[route.id] !== void 0;
	if (!hasData && hasError) return {
		shouldLoad: false,
		renderFallback: false
	};
	if (typeof route.loader === "function" && route.loader.hydrate === true) return {
		shouldLoad: true,
		renderFallback: !hasData
	};
	let shouldLoad = !hasData && !hasError;
	return {
		shouldLoad,
		renderFallback: shouldLoad
	};
}
function isNewLoader(currentLoaderData, currentMatch, match) {
	let isNew = !currentMatch || match.route.id !== currentMatch.route.id;
	let isMissingData = !currentLoaderData.hasOwnProperty(match.route.id);
	return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
	let currentPath = currentMatch.route.path;
	return currentMatch.pathname !== match.pathname || currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"];
}
function shouldRevalidateLoader(loaderMatch, arg) {
	if (loaderMatch.route.shouldRevalidate) {
		let routeChoice = loaderMatch.route.shouldRevalidate(arg);
		if (typeof routeChoice === "boolean") return routeChoice;
	}
	return arg.defaultShouldRevalidate;
}
function patchRoutesImpl(routeId, children, dataRoutes, manifest, mapRouteProperties2, allowElementMutations) {
	let childrenToPatch;
	if (routeId) {
		let route = manifest[routeId];
		invariant$1(route, `No route found to patch children into: routeId = ${routeId}`);
		if (!route.children) route.children = [];
		childrenToPatch = route.children;
	} else childrenToPatch = dataRoutes.activeRoutes;
	let uniqueChildren = [];
	let existingChildren = [];
	children.forEach((newRoute) => {
		let existingRoute = childrenToPatch.find((existingRoute2) => isSameRoute(newRoute, existingRoute2));
		if (existingRoute) existingChildren.push({
			existingRoute,
			newRoute
		});
		else uniqueChildren.push(newRoute);
	});
	if (uniqueChildren.length > 0) {
		let newRoutes = convertRoutesToDataRoutes(uniqueChildren, mapRouteProperties2, [
			routeId || "_",
			"patch",
			String(childrenToPatch?.length || "0")
		], manifest);
		childrenToPatch.push(...newRoutes);
	}
	if (allowElementMutations && existingChildren.length > 0) for (let i = 0; i < existingChildren.length; i++) {
		let { existingRoute, newRoute } = existingChildren[i];
		let existingRouteTyped = existingRoute;
		let [newRouteTyped] = convertRoutesToDataRoutes([newRoute], mapRouteProperties2, [], {}, true);
		Object.assign(existingRouteTyped, {
			element: newRouteTyped.element ? newRouteTyped.element : existingRouteTyped.element,
			errorElement: newRouteTyped.errorElement ? newRouteTyped.errorElement : existingRouteTyped.errorElement,
			hydrateFallbackElement: newRouteTyped.hydrateFallbackElement ? newRouteTyped.hydrateFallbackElement : existingRouteTyped.hydrateFallbackElement
		});
	}
	if (!dataRoutes.hasHMRRoutes) dataRoutes.setRoutes([...dataRoutes.activeRoutes]);
}
function isSameRoute(newRoute, existingRoute) {
	if ("id" in newRoute && "id" in existingRoute && newRoute.id === existingRoute.id) return true;
	if (!(newRoute.index === existingRoute.index && newRoute.path === existingRoute.path && newRoute.caseSensitive === existingRoute.caseSensitive)) return false;
	if ((!newRoute.children || newRoute.children.length === 0) && (!existingRoute.children || existingRoute.children.length === 0)) return true;
	return newRoute.children?.every((aChild, i) => existingRoute.children?.some((bChild) => isSameRoute(aChild, bChild))) ?? false;
}
function loadLazyRoute(route, type, manifest, mapRouteProperties2, lazyRoutePropertiesToSkip) {
	let routeToUpdate = manifest[route.id];
	invariant$1(routeToUpdate, "No route found in manifest");
	if (!route.lazy) return {
		lazyRoutePromise: void 0,
		lazyHandlerPromise: void 0
	};
	if (typeof route.lazy === "function") {
		let cachedPromise = lazyRouteFunctionCache.get(routeToUpdate);
		if (cachedPromise) return {
			lazyRoutePromise: cachedPromise,
			lazyHandlerPromise: cachedPromise
		};
		let lazyRoutePromise2 = (async () => {
			invariant$1(typeof route.lazy === "function", "No lazy route function found");
			let lazyRoute = await route.lazy();
			let routeUpdates = {};
			for (let lazyRouteProperty in lazyRoute) {
				let lazyValue = lazyRoute[lazyRouteProperty];
				if (lazyValue === void 0) continue;
				let isUnsupported = isUnsupportedLazyRouteFunctionKey(lazyRouteProperty);
				let isStaticallyDefined = routeToUpdate[lazyRouteProperty] !== void 0 && lazyRouteProperty !== "hasErrorBoundary";
				if (isUnsupported) warning(!isUnsupported, "Route property " + lazyRouteProperty + " is not a supported property to be returned from a lazy route function. This property will be ignored.");
				else if (isStaticallyDefined) warning(!isStaticallyDefined, `Route "${routeToUpdate.id}" has a static property "${lazyRouteProperty}" defined but its lazy function is also returning a value for this property. The lazy route property "${lazyRouteProperty}" will be ignored.`);
				else routeUpdates[lazyRouteProperty] = lazyValue;
			}
			Object.assign(routeToUpdate, routeUpdates);
			Object.assign(routeToUpdate, {
				...mapRouteProperties2(routeToUpdate),
				lazy: void 0
			});
		})();
		lazyRouteFunctionCache.set(routeToUpdate, lazyRoutePromise2);
		lazyRoutePromise2.catch(() => {});
		return {
			lazyRoutePromise: lazyRoutePromise2,
			lazyHandlerPromise: lazyRoutePromise2
		};
	}
	let lazyKeys = Object.keys(route.lazy);
	let lazyPropertyPromises = [];
	let lazyHandlerPromise = void 0;
	for (let key of lazyKeys) {
		if (lazyRoutePropertiesToSkip && lazyRoutePropertiesToSkip.includes(key)) continue;
		let promise = loadLazyRouteProperty({
			key,
			route,
			manifest,
			mapRouteProperties: mapRouteProperties2
		});
		if (promise) {
			lazyPropertyPromises.push(promise);
			if (key === type) lazyHandlerPromise = promise;
		}
	}
	let lazyRoutePromise = lazyPropertyPromises.length > 0 ? Promise.all(lazyPropertyPromises).then(() => {}) : void 0;
	lazyRoutePromise?.catch(() => {});
	lazyHandlerPromise?.catch(() => {});
	return {
		lazyRoutePromise,
		lazyHandlerPromise
	};
}
function isNonNullable(value) {
	return value !== void 0;
}
function loadLazyMiddlewareForMatches(matches, manifest, mapRouteProperties2) {
	let promises = matches.map(({ route }) => {
		if (typeof route.lazy !== "object" || !route.lazy.middleware) return;
		return loadLazyRouteProperty({
			key: "middleware",
			route,
			manifest,
			mapRouteProperties: mapRouteProperties2
		});
	}).filter(isNonNullable);
	return promises.length > 0 ? Promise.all(promises) : void 0;
}
async function defaultDataStrategy(args) {
	let matchesToLoad = args.matches.filter((m) => m.shouldLoad);
	let keyedResults = {};
	(await Promise.all(matchesToLoad.map((m) => m.resolve()))).forEach((result, i) => {
		keyedResults[matchesToLoad[i].route.id] = result;
	});
	return keyedResults;
}
async function defaultDataStrategyWithMiddleware(args) {
	if (!args.matches.some((m) => m.route.middleware)) return defaultDataStrategy(args);
	return runClientMiddlewarePipeline(args, () => defaultDataStrategy(args));
}
function runServerMiddlewarePipeline(args, handler, errorHandler) {
	return runMiddlewarePipeline(args, handler, processResult, isResponse, errorHandler);
	function processResult(result) {
		return isDataWithResponseInit(result) ? dataWithResponseInitToResponse(result) : result;
	}
}
function runClientMiddlewarePipeline(args, handler) {
	return runMiddlewarePipeline(args, handler, (r) => {
		if (isRedirectResponse(r)) throw r;
		return r;
	}, isDataStrategyResults, errorHandler);
	function errorHandler(error, routeId, nextResult) {
		if (nextResult) return Promise.resolve(Object.assign(nextResult.value, { [routeId]: {
			type: "error",
			result: error
		} }));
		else {
			let { matches } = args;
			let boundaryRouteId = findNearestBoundary(matches, matches[Math.min(Math.max(matches.findIndex((m) => m.route.id === routeId), 0), Math.max(matches.findIndex((m) => m.shouldCallHandler()), 0))].route.id).route.id;
			return Promise.resolve({ [boundaryRouteId]: {
				type: "error",
				result: error
			} });
		}
	}
}
async function runMiddlewarePipeline(args, handler, processResult, isResult, errorHandler) {
	let { matches, ...dataFnArgs } = args;
	return await callRouteMiddleware(dataFnArgs, matches.flatMap((m) => m.route.middleware ? m.route.middleware.map((fn) => [m.route.id, fn]) : []), handler, processResult, isResult, errorHandler);
}
async function callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx = 0) {
	let { request } = args;
	if (request.signal.aborted) throw request.signal.reason ?? /* @__PURE__ */ new Error(`Request aborted: ${request.method} ${request.url}`);
	let tuple = middlewares[idx];
	if (!tuple) return await handler();
	let [routeId, middleware] = tuple;
	let nextResult;
	let next = async () => {
		if (nextResult) throw new Error("You may only call `next()` once per middleware");
		try {
			nextResult = { value: await callRouteMiddleware(args, middlewares, handler, processResult, isResult, errorHandler, idx + 1) };
			return nextResult.value;
		} catch (error) {
			nextResult = { value: await errorHandler(error, routeId, nextResult) };
			return nextResult.value;
		}
	};
	try {
		let value = await middleware(args, next);
		let result = value != null ? processResult(value) : void 0;
		if (isResult(result)) return result;
		else if (nextResult) return result ?? nextResult.value;
		else {
			nextResult = { value: await next() };
			return nextResult.value;
		}
	} catch (error) {
		return await errorHandler(error, routeId, nextResult);
	}
}
function getDataStrategyMatchLazyPromises(mapRouteProperties2, manifest, request, match, lazyRoutePropertiesToSkip) {
	let lazyMiddlewarePromise = loadLazyRouteProperty({
		key: "middleware",
		route: match.route,
		manifest,
		mapRouteProperties: mapRouteProperties2
	});
	let lazyRoutePromises = loadLazyRoute(match.route, isMutationMethod(request.method) ? "action" : "loader", manifest, mapRouteProperties2, lazyRoutePropertiesToSkip);
	return {
		middleware: lazyMiddlewarePromise,
		route: lazyRoutePromises.lazyRoutePromise,
		handler: lazyRoutePromises.lazyHandlerPromise
	};
}
function getDataStrategyMatch(mapRouteProperties2, manifest, request, path, pattern, match, lazyRoutePropertiesToSkip, scopedContext, shouldLoad, shouldRevalidateArgs = null, callSiteDefaultShouldRevalidate) {
	let isUsingNewApi = false;
	let _lazyPromises = getDataStrategyMatchLazyPromises(mapRouteProperties2, manifest, request, match, lazyRoutePropertiesToSkip);
	return {
		...match,
		_lazyPromises,
		shouldLoad,
		shouldRevalidateArgs,
		shouldCallHandler(defaultShouldRevalidate) {
			isUsingNewApi = true;
			if (!shouldRevalidateArgs) return shouldLoad;
			if (typeof callSiteDefaultShouldRevalidate === "boolean") return shouldRevalidateLoader(match, {
				...shouldRevalidateArgs,
				defaultShouldRevalidate: callSiteDefaultShouldRevalidate
			});
			if (typeof defaultShouldRevalidate === "boolean") return shouldRevalidateLoader(match, {
				...shouldRevalidateArgs,
				defaultShouldRevalidate
			});
			return shouldRevalidateLoader(match, shouldRevalidateArgs);
		},
		resolve(handlerOverride) {
			let { lazy, loader, middleware } = match.route;
			let callHandler = isUsingNewApi || shouldLoad || handlerOverride && !isMutationMethod(request.method) && (lazy || loader);
			let isMiddlewareOnlyRoute = middleware && middleware.length > 0 && !loader && !lazy;
			if (callHandler && (isMutationMethod(request.method) || !isMiddlewareOnlyRoute)) return callLoaderOrAction({
				request,
				path,
				pattern,
				match,
				lazyHandlerPromise: _lazyPromises?.handler,
				lazyRoutePromise: _lazyPromises?.route,
				handlerOverride,
				scopedContext
			});
			return Promise.resolve({
				type: "data",
				result: void 0
			});
		}
	};
}
function getTargetedDataStrategyMatches(mapRouteProperties2, manifest, request, path, matches, targetMatch, lazyRoutePropertiesToSkip, scopedContext, shouldRevalidateArgs = null) {
	return matches.map((match) => {
		if (match.route.id !== targetMatch.route.id) return {
			...match,
			shouldLoad: false,
			shouldRevalidateArgs,
			shouldCallHandler: () => false,
			_lazyPromises: getDataStrategyMatchLazyPromises(mapRouteProperties2, manifest, request, match, lazyRoutePropertiesToSkip),
			resolve: () => Promise.resolve({
				type: "data",
				result: void 0
			})
		};
		return getDataStrategyMatch(mapRouteProperties2, manifest, request, path, getRoutePattern(matches), match, lazyRoutePropertiesToSkip, scopedContext, true, shouldRevalidateArgs);
	});
}
async function callDataStrategyImpl(dataStrategyImpl, request, path, matches, fetcherKey, scopedContext, isStaticHandler) {
	if (matches.some((m) => m._lazyPromises?.middleware)) await Promise.all(matches.map((m) => m._lazyPromises?.middleware));
	let dataStrategyArgs = {
		request,
		url: createDataFunctionUrl(request, path),
		pattern: getRoutePattern(matches),
		params: matches[0].params,
		context: scopedContext,
		matches
	};
	let runClientMiddleware = isStaticHandler ? () => {
		throw new Error("You cannot call `runClientMiddleware()` from a static handler `dataStrategy`. Middleware is run outside of `dataStrategy` during SSR in order to bubble up the Response.  You can enable middleware via the `respond` API in `query`/`queryRoute`");
	} : (cb) => {
		let typedDataStrategyArgs = dataStrategyArgs;
		return runClientMiddlewarePipeline(typedDataStrategyArgs, () => {
			return cb({
				...typedDataStrategyArgs,
				fetcherKey,
				runClientMiddleware: () => {
					throw new Error("Cannot call `runClientMiddleware()` from within an `runClientMiddleware` handler");
				}
			});
		});
	};
	let results = await dataStrategyImpl({
		...dataStrategyArgs,
		fetcherKey,
		runClientMiddleware
	});
	try {
		await Promise.all(matches.flatMap((m) => [m._lazyPromises?.handler, m._lazyPromises?.route]));
	} catch (e) {}
	return results;
}
async function callLoaderOrAction({ request, path, pattern, match, lazyHandlerPromise, lazyRoutePromise, handlerOverride, scopedContext }) {
	let result;
	let onReject;
	let isAction = isMutationMethod(request.method);
	let type = isAction ? "action" : "loader";
	let runHandler = (handler) => {
		let reject;
		let abortPromise = new Promise((_, r) => reject = r);
		onReject = () => reject();
		request.signal.addEventListener("abort", onReject);
		let actualHandler = (ctx) => {
			if (typeof handler !== "function") return Promise.reject(/* @__PURE__ */ new Error(`You cannot call the handler for a route which defines a boolean "${type}" [routeId: ${match.route.id}]`));
			return handler({
				request,
				url: createDataFunctionUrl(request, path),
				pattern,
				params: match.params,
				context: scopedContext
			}, ...ctx !== void 0 ? [ctx] : []);
		};
		let handlerPromise = (async () => {
			try {
				return {
					type: "data",
					result: await (handlerOverride ? handlerOverride((ctx) => actualHandler(ctx)) : actualHandler())
				};
			} catch (e) {
				return {
					type: "error",
					result: e
				};
			}
		})();
		return Promise.race([handlerPromise, abortPromise]);
	};
	try {
		let handler = isAction ? match.route.action : match.route.loader;
		if (lazyHandlerPromise || lazyRoutePromise) if (handler) {
			let handlerError;
			let [value] = await Promise.all([
				runHandler(handler).catch((e) => {
					handlerError = e;
				}),
				lazyHandlerPromise,
				lazyRoutePromise
			]);
			if (handlerError !== void 0) throw handlerError;
			result = value;
		} else {
			await lazyHandlerPromise;
			let handler2 = isAction ? match.route.action : match.route.loader;
			if (handler2) [result] = await Promise.all([runHandler(handler2), lazyRoutePromise]);
			else if (type === "action") {
				let url = new URL(request.url);
				let pathname = url.pathname + url.search;
				throw getInternalRouterError(405, {
					method: request.method,
					pathname,
					routeId: match.route.id
				});
			} else return {
				type: "data",
				result: void 0
			};
		}
		else if (!handler) {
			let url = new URL(request.url);
			throw getInternalRouterError(404, { pathname: url.pathname + url.search });
		} else result = await runHandler(handler);
	} catch (e) {
		return {
			type: "error",
			result: e
		};
	} finally {
		if (onReject) request.signal.removeEventListener("abort", onReject);
	}
	return result;
}
async function parseResponseBody(response) {
	let contentType = response.headers.get("Content-Type");
	if (contentType && /\bapplication\/json\b/.test(contentType)) return response.body == null ? null : response.json();
	return response.text();
}
async function convertDataStrategyResultToDataResult(dataStrategyResult) {
	let { result, type } = dataStrategyResult;
	if (isResponse(result)) {
		let data2;
		try {
			data2 = await parseResponseBody(result);
		} catch (e) {
			return {
				type: "error",
				error: e
			};
		}
		if (type === "error") return {
			type: "error",
			error: new ErrorResponseImpl(result.status, result.statusText, data2),
			statusCode: result.status,
			headers: result.headers
		};
		return {
			type: "data",
			data: data2,
			statusCode: result.status,
			headers: result.headers
		};
	}
	if (type === "error") {
		if (isDataWithResponseInit(result)) {
			if (result.data instanceof Error) return {
				type: "error",
				error: result.data,
				statusCode: result.init?.status,
				headers: result.init?.headers ? new Headers(result.init.headers) : void 0
			};
			return {
				type: "error",
				error: dataWithResponseInitToErrorResponse(result),
				statusCode: isRouteErrorResponse(result) ? result.status : void 0,
				headers: result.init?.headers ? new Headers(result.init.headers) : void 0
			};
		}
		return {
			type: "error",
			error: result,
			statusCode: isRouteErrorResponse(result) ? result.status : void 0
		};
	}
	if (isDataWithResponseInit(result)) return {
		type: "data",
		data: result.data,
		statusCode: result.init?.status,
		headers: result.init?.headers ? new Headers(result.init.headers) : void 0
	};
	return {
		type: "data",
		data: result
	};
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename) {
	let location = response.headers.get("Location");
	invariant$1(location, "Redirects returned/thrown from loaders/actions must have a Location header");
	if (!isAbsoluteUrl(location)) {
		let trimmedMatches = matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1);
		location = normalizeTo(new URL(request.url), trimmedMatches, basename, location);
		response.headers.set("Location", location);
	}
	return response;
}
function hasInvalidProtocol(location) {
	try {
		return invalidProtocols.includes(new URL(location).protocol);
	} catch {
		return false;
	}
}
function normalizeRedirectLocation$1(location, currentUrl, basename, historyInstance) {
	if (isAbsoluteUrl(location)) {
		let normalizedLocation = location;
		let url = PROTOCOL_RELATIVE_URL_REGEX.test(normalizedLocation) ? new URL(normalizeProtocolRelativeUrl(normalizedLocation, currentUrl.protocol)) : new URL(normalizedLocation);
		if (hasInvalidProtocol(url.toString())) throw new Error("Invalid redirect location");
		let isSameBasename = stripBasename(url.pathname, basename) != null;
		if (url.origin === currentUrl.origin && isSameBasename) return removeDoubleSlashes(url.pathname) + url.search + url.hash;
	}
	try {
		if (hasInvalidProtocol(historyInstance.createURL(location).toString())) throw new Error("Invalid redirect location");
	} catch (e) {}
	return location;
}
function createClientSideRequest(history, location, signal, submission) {
	let url = history.createURL(stripHashFromPath(location)).toString();
	let init = { signal };
	if (submission && isMutationMethod(submission.formMethod)) {
		let { formMethod, formEncType } = submission;
		init.method = formMethod.toUpperCase();
		if (formEncType === "application/json") {
			init.headers = new Headers({ "Content-Type": formEncType });
			init.body = JSON.stringify(submission.json);
		} else if (formEncType === "text/plain") init.body = submission.text;
		else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) init.body = convertFormDataToSearchParams(submission.formData);
		else init.body = submission.formData;
	}
	return new Request(url, init);
}
function createDataFunctionUrl(request, path) {
	let url = new URL(request.url);
	let parsed = typeof path === "string" ? parsePath(path) : path;
	url.pathname = parsed.pathname || "/";
	if (parsed.search) {
		let searchParams = new URLSearchParams(parsed.search);
		let indexValues = searchParams.getAll("index");
		searchParams.delete("index");
		for (let value of indexValues.filter(Boolean)) searchParams.append("index", value);
		url.search = searchParams.size ? `?${searchParams.toString()}` : "";
	} else url.search = "";
	url.hash = parsed.hash || "";
	return url;
}
function convertFormDataToSearchParams(formData) {
	let searchParams = new URLSearchParams();
	for (let [key, value] of formData.entries()) searchParams.append(key, typeof value === "string" ? value : value.name);
	return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
	let formData = new FormData();
	for (let [key, value] of searchParams.entries()) formData.append(key, value);
	return formData;
}
function processRouteLoaderData(matches, results, pendingActionResult, isStaticHandler = false, skipLoaderErrorBubbling = false) {
	let loaderData = {};
	let errors = null;
	let statusCode;
	let foundError = false;
	let loaderHeaders = {};
	let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
	matches.forEach((match) => {
		if (!(match.route.id in results)) return;
		let id = match.route.id;
		let result = results[id];
		invariant$1(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
		if (isErrorResult(result)) {
			let error = result.error;
			if (pendingError !== void 0) {
				error = pendingError;
				pendingError = void 0;
			}
			errors = errors || {};
			if (skipLoaderErrorBubbling) errors[id] = error;
			else {
				let boundaryMatch = findNearestBoundary(matches, id);
				if (errors[boundaryMatch.route.id] == null) errors[boundaryMatch.route.id] = error;
			}
			if (!isStaticHandler) loaderData[id] = ResetLoaderDataSymbol;
			if (!foundError) {
				foundError = true;
				statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
			}
			if (result.headers) loaderHeaders[id] = result.headers;
		} else {
			loaderData[id] = result.data;
			if (result.statusCode && result.statusCode !== 200 && !foundError) statusCode = result.statusCode;
			if (result.headers) loaderHeaders[id] = result.headers;
		}
	});
	if (pendingError !== void 0 && pendingActionResult) {
		errors = { [pendingActionResult[0]]: pendingError };
		if (pendingActionResult[2]) loaderData[pendingActionResult[2]] = void 0;
	}
	return {
		loaderData,
		errors,
		statusCode: statusCode || 200,
		loaderHeaders
	};
}
function processLoaderData(state, matches, results, pendingActionResult, revalidatingFetchers, fetcherResults, workingFetchers) {
	let { loaderData, errors } = processRouteLoaderData(matches, results, pendingActionResult);
	revalidatingFetchers.filter((f) => !f.matches || f.matches.some((m) => m.shouldLoad)).forEach((rf) => {
		let { key, match, controller } = rf;
		if (controller && controller.signal.aborted) return;
		let result = fetcherResults[key];
		invariant$1(result, "Did not find corresponding fetcher result");
		if (isErrorResult(result)) {
			let boundaryMatch = findNearestBoundary(state.matches, match?.route.id);
			if (!(errors && errors[boundaryMatch.route.id])) errors = {
				...errors,
				[boundaryMatch.route.id]: result.error
			};
			workingFetchers.delete(key);
		} else if (isRedirectResult(result)) invariant$1(false, "Unhandled fetcher revalidation redirect");
		else {
			let doneFetcher = getDoneFetcher(result.data);
			workingFetchers.set(key, doneFetcher);
		}
	});
	return {
		loaderData,
		errors
	};
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
	let mergedLoaderData = Object.entries(newLoaderData).filter(([, v]) => v !== ResetLoaderDataSymbol).reduce((merged, [k, v]) => {
		merged[k] = v;
		return merged;
	}, {});
	for (let match of matches) {
		let id = match.route.id;
		if (!newLoaderData.hasOwnProperty(id) && loaderData.hasOwnProperty(id) && match.route.loader) mergedLoaderData[id] = loaderData[id];
		if (errors && errors.hasOwnProperty(id)) break;
	}
	return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
	if (!pendingActionResult) return {};
	return isErrorResult(pendingActionResult[1]) ? { actionData: {} } : { actionData: { [pendingActionResult[0]]: pendingActionResult[1].data } };
}
function findNearestBoundary(matches, routeId) {
	return (routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches]).reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes) {
	let route = routes.length === 1 ? routes[0] : routes.find((r) => r.index || !r.path || r.path === "/") || { id: `__shim-error-route__` };
	return {
		matches: [{
			params: {},
			pathname: "",
			pathnameBase: "",
			route
		}],
		route
	};
}
function getInternalRouterError(status, { pathname, routeId, method, type, message } = {}) {
	let statusText = "Unknown Server Error";
	let errorMessage = "Unknown @remix-run/router error";
	if (status === 400) {
		statusText = "Bad Request";
		if (method && pathname && routeId) errorMessage = `You made a ${method} request to "${pathname}" but did not provide a \`loader\` for route "${routeId}", so there is no way to handle the request.`;
		else if (type === "invalid-body") errorMessage = "Unable to encode submission body";
	} else if (status === 403) {
		statusText = "Forbidden";
		errorMessage = `Route "${routeId}" does not match URL "${pathname}"`;
	} else if (status === 404) {
		statusText = "Not Found";
		errorMessage = `No route matches URL "${pathname}"`;
	} else if (status === 405) {
		statusText = "Method Not Allowed";
		if (method && pathname && routeId) errorMessage = `You made a ${method.toUpperCase()} request to "${pathname}" but did not provide an \`action\` for route "${routeId}", so there is no way to handle the request.`;
		else if (method) errorMessage = `Invalid request method "${method.toUpperCase()}"`;
	}
	return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
function findRedirect(results) {
	let entries = Object.entries(results);
	for (let i = entries.length - 1; i >= 0; i--) {
		let [key, result] = entries[i];
		if (isRedirectResult(result)) return {
			key,
			result
		};
	}
}
function stripHashFromPath(path) {
	return createPath({
		...typeof path === "string" ? parsePath(path) : path,
		hash: ""
	});
}
function isHashChangeOnly(a, b) {
	if (a.pathname !== b.pathname || a.search !== b.search) return false;
	if (a.hash === "") return b.hash !== "";
	else if (a.hash === b.hash) return true;
	else if (b.hash !== "") return true;
	return false;
}
function dataWithResponseInitToResponse(data2) {
	return Response.json(data2.data, data2.init ?? void 0);
}
function dataWithResponseInitToErrorResponse(data2) {
	return new ErrorResponseImpl(data2.init?.status ?? 500, data2.init?.statusText ?? "Internal Server Error", data2.data);
}
function isDataStrategyResults(result) {
	return result != null && typeof result === "object" && Object.entries(result).every(([key, value]) => typeof key === "string" && isDataStrategyResult(value));
}
function isDataStrategyResult(result) {
	return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === "data" || result.type === "error");
}
function isRedirectDataStrategyResult(result) {
	return isResponse(result.result) && redirectStatusCodes.has(result.result.status);
}
function isErrorResult(result) {
	return result.type === "error";
}
function isRedirectResult(result) {
	return (result && result.type) === "redirect";
}
function isDataWithResponseInit(value) {
	return typeof value === "object" && value != null && "type" in value && "data" in value && "init" in value && value.type === "DataWithResponseInit";
}
function isResponse(value) {
	return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectStatusCode(statusCode) {
	return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(result) {
	return isResponse(result) && isRedirectStatusCode(result.status) && result.headers.has("Location");
}
function isValidMethod(method) {
	return validRequestMethods.has(method.toUpperCase());
}
function isMutationMethod(method) {
	return validMutationMethods.has(method.toUpperCase());
}
function hasNakedIndexQuery(search) {
	return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location) {
	let search = typeof location === "string" ? parsePath(location).search : location.search;
	if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) return matches[matches.length - 1];
	let pathMatches = getPathContributingMatches(matches);
	return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
	let { formMethod, formAction, formEncType, text, formData, json } = navigation;
	if (!formMethod || !formAction || !formEncType) return;
	if (text != null) return {
		formMethod,
		formAction,
		formEncType,
		formData: void 0,
		json: void 0,
		text
	};
	else if (formData != null) return {
		formMethod,
		formAction,
		formEncType,
		formData,
		json: void 0,
		text: void 0
	};
	else if (json !== void 0) return {
		formMethod,
		formAction,
		formEncType,
		formData: void 0,
		json,
		text: void 0
	};
}
function getLoadingNavigation(location, matches, historyAction, submission) {
	if (submission) return {
		state: "loading",
		location,
		matches,
		historyAction,
		formMethod: submission.formMethod,
		formAction: submission.formAction,
		formEncType: submission.formEncType,
		formData: submission.formData,
		json: submission.json,
		text: submission.text
	};
	else return {
		state: "loading",
		location,
		matches,
		historyAction,
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0
	};
}
function getSubmittingNavigation(location, matches, historyAction, submission) {
	return {
		state: "submitting",
		location,
		matches,
		historyAction,
		formMethod: submission.formMethod,
		formAction: submission.formAction,
		formEncType: submission.formEncType,
		formData: submission.formData,
		json: submission.json,
		text: submission.text
	};
}
function getLoadingFetcher(submission, data2) {
	if (submission) return {
		state: "loading",
		formMethod: submission.formMethod,
		formAction: submission.formAction,
		formEncType: submission.formEncType,
		formData: submission.formData,
		json: submission.json,
		text: submission.text,
		data: data2
	};
	else return {
		state: "loading",
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0,
		data: data2
	};
}
function getSubmittingFetcher(submission, existingFetcher) {
	return {
		state: "submitting",
		formMethod: submission.formMethod,
		formAction: submission.formAction,
		formEncType: submission.formEncType,
		formData: submission.formData,
		json: submission.json,
		text: submission.text,
		data: existingFetcher ? existingFetcher.data : void 0
	};
}
function getDoneFetcher(data2) {
	return {
		state: "idle",
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0,
		data: data2
	};
}
function restoreAppliedTransitions(_window, transitions) {
	try {
		let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
		if (sessionPositions) {
			let json = JSON.parse(sessionPositions);
			for (let [k, v] of Object.entries(json || {})) if (v && Array.isArray(v)) transitions.set(k, new Set(v || []));
		}
	} catch (e) {}
}
function persistAppliedTransitions(_window, transitions) {
	if (transitions.size > 0) {
		let json = {};
		for (let [k, v] of transitions) json[k] = [...v];
		try {
			_window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json));
		} catch (error) {
			warning(false, `Failed to save applied view transitions in sessionStorage (${error}).`);
		}
	}
}
function createDeferred() {
	let resolve;
	let reject;
	let promise = new Promise((res, rej) => {
		resolve = async (val) => {
			res(val);
			try {
				await promise;
			} catch (e) {}
		};
		reject = async (error) => {
			rej(error);
			try {
				await promise;
			} catch (e) {}
		};
	});
	return {
		promise,
		resolve,
		reject
	};
}
function useIsRSCRouterContext() {
	return React.useContext(RSCRouterContext);
}
function decodeRedirectErrorDigest(digest) {
	if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_REDIRECT}:{`)) try {
		let parsed = JSON.parse(digest.slice(28));
		if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string" && typeof parsed.location === "string" && typeof parsed.reloadDocument === "boolean" && typeof parsed.replace === "boolean") return parsed;
	} catch {}
}
function decodeRouteErrorResponseDigest(digest) {
	if (digest.startsWith(`${ERROR_DIGEST_BASE}:${ERROR_DIGEST_ROUTE_ERROR_RESPONSE}:{`)) try {
		let parsed = JSON.parse(digest.slice(40));
		if (typeof parsed === "object" && parsed && typeof parsed.status === "number" && typeof parsed.statusText === "string") return new ErrorResponseImpl(parsed.status, parsed.statusText, parsed.data);
	} catch {}
}
function useHref(to, { relative } = {}) {
	invariant$1(useInRouterContext(), `useHref() may be used only in the context of a <Router> component.`);
	let { basename, navigator } = React.useContext(NavigationContext);
	let { hash, pathname, search } = useResolvedPath(to, { relative });
	let joinedPathname = pathname;
	if (basename !== "/") joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
	return navigator.createHref({
		pathname: joinedPathname,
		search,
		hash
	});
}
function useInRouterContext() {
	return React.useContext(LocationContext) != null;
}
function useLocation$2() {
	invariant$1(useInRouterContext(), `useLocation() may be used only in the context of a <Router> component.`);
	return React.useContext(LocationContext).location;
}
function useNavigationType() {
	return React.useContext(LocationContext).navigationType;
}
function useMatch(pattern) {
	invariant$1(useInRouterContext(), `useMatch() may be used only in the context of a <Router> component.`);
	let { pathname } = useLocation$2();
	return React.useMemo(() => matchPath(pattern, decodePath(pathname)), [pathname, pattern]);
}
function useIsomorphicLayoutEffect(cb) {
	if (!React.useContext(NavigationContext).static) React.useLayoutEffect(cb);
}
function useNavigate$6() {
	let { isDataRoute } = React.useContext(RouteContext);
	return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
	invariant$1(useInRouterContext(), `useNavigate() may be used only in the context of a <Router> component.`);
	let dataRouterContext = React.useContext(DataRouterContext);
	let { basename, navigator } = React.useContext(NavigationContext);
	let { matches } = React.useContext(RouteContext);
	let { pathname: locationPathname } = useLocation$2();
	let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
	let activeRef = React.useRef(false);
	useIsomorphicLayoutEffect(() => {
		activeRef.current = true;
	});
	return React.useCallback((to, options = {}) => {
		warning(activeRef.current, navigateEffectWarning);
		if (!activeRef.current) return;
		if (typeof to === "number") {
			navigator.go(to);
			return;
		}
		let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
		if (dataRouterContext == null && basename !== "/") path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
		(!!options.replace ? navigator.replace : navigator.push)(path, options.state, options);
	}, [
		basename,
		navigator,
		routePathnamesJson,
		locationPathname,
		dataRouterContext
	]);
}
function useOutletContext() {
	return React.useContext(OutletContext);
}
function useOutlet(context) {
	let outlet = React.useContext(RouteContext).outlet;
	return React.useMemo(() => outlet && /* @__PURE__ */ React.createElement(OutletContext.Provider, { value: context }, outlet), [outlet, context]);
}
function useParams$2() {
	let { matches } = React.useContext(RouteContext);
	return matches[matches.length - 1]?.params ?? {};
}
function useResolvedPath(to, { relative } = {}) {
	let { matches } = React.useContext(RouteContext);
	let { pathname: locationPathname } = useLocation$2();
	let routePathnamesJson = JSON.stringify(getResolveToMatches(matches));
	return React.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [
		to,
		routePathnamesJson,
		locationPathname,
		relative
	]);
}
function useRoutes(routes, locationArg) {
	return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterOpts) {
	invariant$1(useInRouterContext(), `useRoutes() may be used only in the context of a <Router> component.`);
	let { navigator } = React.useContext(NavigationContext);
	let { matches: parentMatches } = React.useContext(RouteContext);
	let routeMatch = parentMatches[parentMatches.length - 1];
	let parentParams = routeMatch ? routeMatch.params : {};
	let parentPathname = routeMatch ? routeMatch.pathname : "/";
	let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
	let parentRoute = routeMatch && routeMatch.route;
	{
		let parentPath = parentRoute && parentRoute.path || "";
		warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*") || parentPath.endsWith("*?"), `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${parentPathname}" (under <Route path="${parentPath}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${parentPath}"> to <Route path="${parentPath === "/" ? "*" : `${parentPath}/*`}">.`);
	}
	let locationFromContext = useLocation$2();
	let location;
	if (locationArg) {
		let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
		invariant$1(parentPathnameBase === "/" || parsedLocationArg.pathname?.startsWith(parentPathnameBase), `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${parentPathnameBase}" but pathname "${parsedLocationArg.pathname}" was given in the \`location\` prop.`);
		location = parsedLocationArg;
	} else location = locationFromContext;
	let pathname = location.pathname || "/";
	let remainingPathname = pathname;
	if (parentPathnameBase !== "/") {
		let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
		remainingPathname = "/" + pathname.replace(/^\//, "").split("/").slice(parentSegments.length).join("/");
	}
	let matches = dataRouterOpts && dataRouterOpts.state.matches.length ? dataRouterOpts.state.matches.map((m) => Object.assign(m, { route: dataRouterOpts.manifest[m.route.id] || m.route })) : matchRoutes(routes, { pathname: remainingPathname });
	warning(parentRoute || matches != null, `No routes matched location "${location.pathname}${location.search}${location.hash}" `);
	warning(matches == null || matches[matches.length - 1].route.element !== void 0 || matches[matches.length - 1].route.Component !== void 0 || matches[matches.length - 1].route.lazy !== void 0, `Matched leaf route at location "${location.pathname}${location.search}${location.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);
	let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
		params: Object.assign({}, parentParams, match.params),
		pathname: joinPaths([parentPathnameBase, navigator.encodeLocation ? navigator.encodeLocation(match.pathname.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathname]),
		pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, navigator.encodeLocation ? navigator.encodeLocation(match.pathnameBase.replace(/%/g, "%25").replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : match.pathnameBase])
	})), parentMatches, dataRouterOpts);
	if (locationArg && renderedMatches) return /* @__PURE__ */ React.createElement(LocationContext.Provider, { value: {
		location: {
			pathname: "/",
			search: "",
			hash: "",
			state: null,
			key: "default",
			mask: void 0,
			...location
		},
		navigationType: "POP"
	} }, renderedMatches);
	return renderedMatches;
}
function DefaultErrorComponent() {
	let error = useRouteError();
	let message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : JSON.stringify(error);
	let stack = error instanceof Error ? error.stack : null;
	let lightgrey = "rgba(200,200,200, 0.5)";
	let preStyles = {
		padding: "0.5rem",
		backgroundColor: lightgrey
	};
	let codeStyles = {
		padding: "2px 4px",
		backgroundColor: lightgrey
	};
	let devInfo = null;
	console.error("Error handled by React Router default ErrorBoundary:", error);
	devInfo = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "💿 Hey developer 👋"), /* @__PURE__ */ React.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", /* @__PURE__ */ React.createElement("code", { style: codeStyles }, "ErrorBoundary"), " or", " ", /* @__PURE__ */ React.createElement("code", { style: codeStyles }, "errorElement"), " prop on your route."));
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ React.createElement("h3", { style: { fontStyle: "italic" } }, message), stack ? /* @__PURE__ */ React.createElement("pre", { style: preStyles }, stack) : null, devInfo);
}
function RSCErrorHandler({ children, error }) {
	let { basename } = React.useContext(NavigationContext);
	if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
		let redirect2 = decodeRedirectErrorDigest(error.digest);
		if (redirect2) {
			let existingRedirect = errorRedirectHandledMap.get(error);
			if (existingRedirect) throw existingRedirect;
			let parsed = parseToInfo(redirect2.location, basename);
			let target = parsed.absoluteURL || parsed.to;
			if (hasInvalidProtocol(target)) throw new Error("Invalid redirect location");
			if (isBrowser && !errorRedirectHandledMap.get(error)) if (parsed.isExternal || redirect2.reloadDocument) window.location.href = target;
			else {
				const redirectPromise = Promise.resolve().then(() => window.__reactRouterDataRouter.navigate(parsed.to, { replace: redirect2.replace }));
				errorRedirectHandledMap.set(error, redirectPromise);
				throw redirectPromise;
			}
			return /* @__PURE__ */ React.createElement("meta", {
				httpEquiv: "refresh",
				content: `0;url=${target}`
			});
		}
	}
	return children;
}
function RenderedRoute({ routeContext, match, children }) {
	let dataRouterContext = React.useContext(DataRouterContext);
	if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
	return /* @__PURE__ */ React.createElement(RouteContext.Provider, { value: routeContext }, children);
}
function _renderMatches(matches, parentMatches = [], dataRouterOpts) {
	let dataRouterState = dataRouterOpts?.state;
	if (matches == null) {
		if (!dataRouterState) return null;
		if (dataRouterState.errors) matches = dataRouterState.matches;
		else if (parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) matches = dataRouterState.matches;
		else return null;
	}
	let renderedMatches = matches;
	let errors = dataRouterState?.errors;
	if (errors != null) {
		let errorIndex = renderedMatches.findIndex((m) => m.route.id && errors?.[m.route.id] !== void 0);
		invariant$1(errorIndex >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(errors).join(",")}`);
		renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
	}
	let renderFallback = false;
	let fallbackIndex = -1;
	if (dataRouterOpts && dataRouterState) {
		renderFallback = dataRouterState.renderFallback;
		for (let i = 0; i < renderedMatches.length; i++) {
			let match = renderedMatches[i];
			if (match.route.HydrateFallback || match.route.hydrateFallbackElement) fallbackIndex = i;
			if (match.route.id) {
				let { loaderData, errors: errors2 } = dataRouterState;
				let needsToRunLoader = match.route.loader && !loaderData.hasOwnProperty(match.route.id) && (!errors2 || errors2[match.route.id] === void 0);
				if (match.route.lazy || needsToRunLoader) {
					if (dataRouterOpts.isStatic) renderFallback = true;
					if (fallbackIndex >= 0) renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
					else renderedMatches = [renderedMatches[0]];
					break;
				}
			}
		}
	}
	let onErrorHandler = dataRouterOpts?.onError;
	let onError = dataRouterState && onErrorHandler ? (error, errorInfo) => {
		onErrorHandler(error, {
			location: dataRouterState.location,
			params: dataRouterState.matches?.[0]?.params ?? {},
			pattern: getRoutePattern(dataRouterState.matches),
			errorInfo
		});
	} : void 0;
	return renderedMatches.reduceRight((outlet, match, index) => {
		let error;
		let shouldRenderHydrateFallback = false;
		let errorElement = null;
		let hydrateFallbackElement = null;
		if (dataRouterState) {
			error = errors && match.route.id ? errors[match.route.id] : void 0;
			errorElement = match.route.errorElement || defaultErrorElement;
			if (renderFallback) {
				if (fallbackIndex < 0 && index === 0) {
					warningOnce("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration");
					shouldRenderHydrateFallback = true;
					hydrateFallbackElement = null;
				} else if (fallbackIndex === index) {
					shouldRenderHydrateFallback = true;
					hydrateFallbackElement = match.route.hydrateFallbackElement || null;
				}
			}
		}
		let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
		let getChildren = () => {
			let children;
			if (error) children = errorElement;
			else if (shouldRenderHydrateFallback) children = hydrateFallbackElement;
			else if (match.route.Component) children = /* @__PURE__ */ React.createElement(match.route.Component, null);
			else if (match.route.element) children = match.route.element;
			else children = outlet;
			return /* @__PURE__ */ React.createElement(RenderedRoute, {
				match,
				routeContext: {
					outlet,
					matches: matches2,
					isDataRoute: dataRouterState != null
				},
				children
			});
		};
		return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ React.createElement(RenderErrorBoundary, {
			location: dataRouterState.location,
			revalidation: dataRouterState.revalidation,
			component: errorElement,
			error,
			children: getChildren(),
			routeContext: {
				outlet: null,
				matches: matches2,
				isDataRoute: true
			},
			onError
		}) : getChildren();
	}, null);
}
function getDataRouterConsoleError(hookName) {
	return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext(hookName) {
	let ctx = React.useContext(DataRouterContext);
	invariant$1(ctx, getDataRouterConsoleError(hookName));
	return ctx;
}
function useDataRouterState(hookName) {
	let state = React.useContext(DataRouterStateContext);
	invariant$1(state, getDataRouterConsoleError(hookName));
	return state;
}
function useRouteContext(hookName) {
	let route = React.useContext(RouteContext);
	invariant$1(route, getDataRouterConsoleError(hookName));
	return route;
}
function useCurrentRouteId(hookName) {
	let route = useRouteContext(hookName);
	let thisRoute = route.matches[route.matches.length - 1];
	invariant$1(thisRoute.route.id, `${hookName} can only be used on routes that contain a unique "id"`);
	return thisRoute.route.id;
}
function useRouteId() {
	return useCurrentRouteId("useRouteId");
}
function useNavigation() {
	let state = useDataRouterState("useNavigation");
	return React.useMemo(() => {
		let { matches, historyAction, ...rest } = state.navigation;
		return rest;
	}, [state.navigation]);
}
function useRevalidator() {
	let dataRouterContext = useDataRouterContext("useRevalidator");
	let state = useDataRouterState("useRevalidator");
	let revalidate = React.useCallback(async () => {
		await dataRouterContext.router.revalidate();
	}, [dataRouterContext.router]);
	return React.useMemo(() => ({
		revalidate,
		state: state.revalidation
	}), [revalidate, state.revalidation]);
}
function useMatches() {
	let { matches, loaderData } = useDataRouterState("useMatches");
	return React.useMemo(() => matches.map((m) => convertRouteMatchToUiMatch(m, loaderData)), [matches, loaderData]);
}
function useLoaderData() {
	let state = useDataRouterState("useLoaderData");
	let routeId = useCurrentRouteId("useLoaderData");
	return state.loaderData[routeId];
}
function useRouteLoaderData(routeId) {
	return useDataRouterState("useRouteLoaderData").loaderData[routeId];
}
function useActionData() {
	let state = useDataRouterState("useActionData");
	let routeId = useCurrentRouteId("useLoaderData");
	return state.actionData ? state.actionData[routeId] : void 0;
}
function useRouteError() {
	let error = React.useContext(RouteErrorContext);
	let state = useDataRouterState("useRouteError");
	let routeId = useCurrentRouteId("useRouteError");
	if (error !== void 0) return error;
	return state.errors?.[routeId];
}
function useAsyncValue() {
	return React.useContext(AwaitContext)?._data;
}
function useAsyncError() {
	return React.useContext(AwaitContext)?._error;
}
function useBlocker(shouldBlock) {
	let { router, basename } = useDataRouterContext("useBlocker");
	let state = useDataRouterState("useBlocker");
	let [blockerKey, setBlockerKey] = React.useState("");
	let blockerFunction = React.useCallback((arg) => {
		if (typeof shouldBlock !== "function") return !!shouldBlock;
		if (basename === "/") return shouldBlock(arg);
		let { currentLocation, nextLocation, historyAction } = arg;
		return shouldBlock({
			currentLocation: {
				...currentLocation,
				pathname: stripBasename(currentLocation.pathname, basename) || currentLocation.pathname
			},
			nextLocation: {
				...nextLocation,
				pathname: stripBasename(nextLocation.pathname, basename) || nextLocation.pathname
			},
			historyAction
		});
	}, [basename, shouldBlock]);
	React.useEffect(() => {
		let key = String(++blockerId);
		setBlockerKey(key);
		return () => router.deleteBlocker(key);
	}, [router]);
	React.useEffect(() => {
		if (blockerKey !== "") router.getBlocker(blockerKey, blockerFunction);
	}, [
		router,
		blockerKey,
		blockerFunction
	]);
	return blockerKey && state.blockers.has(blockerKey) ? state.blockers.get(blockerKey) : IDLE_BLOCKER;
}
function useNavigateStable() {
	let { router } = useDataRouterContext("useNavigate");
	let id = useCurrentRouteId("useNavigate");
	let activeRef = React.useRef(false);
	useIsomorphicLayoutEffect(() => {
		activeRef.current = true;
	});
	return React.useCallback(async (to, options = {}) => {
		warning(activeRef.current, navigateEffectWarning);
		if (!activeRef.current) return;
		if (typeof to === "number") await router.navigate(to);
		else await router.navigate(to, {
			fromRouteId: id,
			...options
		});
	}, [router, id]);
}
function warningOnce(key, cond, message) {
	if (!cond && !alreadyWarned[key]) {
		alreadyWarned[key] = true;
		warning(false, message);
	}
}
function useRoute(...args) {
	const currentRouteId = useCurrentRouteId("useRoute");
	const id = args[0] ?? currentRouteId;
	const state = useDataRouterState("useRoute");
	const route = state.matches.find(({ route: route2 }) => route2.id === id);
	if (route === void 0) return void 0;
	return {
		handle: route.route.handle,
		loaderData: state.loaderData[id],
		actionData: state.actionData?.[id]
	};
}
function toRouterStateMatch(match) {
	return {
		id: match.route.id,
		pathname: match.pathname,
		params: match.params,
		handle: match.route.handle
	};
}
function useRouterState() {
	let { location, historyAction: type, matches, navigation } = useDataRouterState("unstable_useRouterState");
	let active = React.useMemo(() => ({
		type,
		location,
		searchParams: new URLSearchParams(location.search),
		params: matches[matches.length - 1]?.params ?? {},
		matches: matches.map((m) => toRouterStateMatch(m))
	}), [
		location,
		matches,
		type
	]);
	let pending = React.useMemo(() => {
		if (navigation.state === "idle") return null;
		let shared = {
			type: navigation.historyAction,
			location: navigation.location,
			searchParams: new URLSearchParams(navigation.location.search),
			params: navigation.matches[navigation.matches.length - 1]?.params ?? {},
			matches: navigation.matches.map((m) => toRouterStateMatch(m))
		};
		return navigation.state === "loading" ? {
			...shared,
			state: "loading",
			formMethod: navigation.formMethod,
			formAction: navigation.formAction,
			formEncType: navigation.formEncType,
			formData: navigation.formData,
			json: navigation.json,
			text: navigation.text
		} : {
			...shared,
			state: "submitting",
			formMethod: navigation.formMethod,
			formAction: navigation.formAction,
			formEncType: navigation.formEncType,
			formData: navigation.formData,
			json: navigation.json,
			text: navigation.text
		};
	}, [navigation]);
	return React.useMemo(() => ({
		active,
		pending
	}), [active, pending]);
}
function warnOnce(condition, message) {
	if (!condition && !alreadyWarned2[message]) {
		alreadyWarned2[message] = true;
		console.warn(message);
	}
}
function useOptimisticSafe(val) {
	if (useOptimisticImpl) return useOptimisticImpl(val);
	else return [val, stableUseOptimisticSetter];
}
function mapRouteProperties(route) {
	let updates = { hasErrorBoundary: route.hasErrorBoundary || route.ErrorBoundary != null || route.errorElement != null };
	if (route.Component) {
		if (route.element) warning(false, "You should not include both `Component` and `element` on your route - `Component` will be used.");
		Object.assign(updates, {
			element: React.createElement(route.Component),
			Component: void 0
		});
	}
	if (route.HydrateFallback) {
		if (route.hydrateFallbackElement) warning(false, "You should not include both `HydrateFallback` and `hydrateFallbackElement` on your route - `HydrateFallback` will be used.");
		Object.assign(updates, {
			hydrateFallbackElement: React.createElement(route.HydrateFallback),
			HydrateFallback: void 0
		});
	}
	if (route.ErrorBoundary) {
		if (route.errorElement) warning(false, "You should not include both `ErrorBoundary` and `errorElement` on your route - `ErrorBoundary` will be used.");
		Object.assign(updates, {
			errorElement: React.createElement(route.ErrorBoundary),
			ErrorBoundary: void 0
		});
	}
	return updates;
}
function createMemoryRouter(routes, opts) {
	return createRouter({
		basename: opts?.basename,
		getContext: opts?.getContext,
		future: opts?.future,
		history: createMemoryHistory({
			initialEntries: opts?.initialEntries,
			initialIndex: opts?.initialIndex
		}),
		hydrationData: opts?.hydrationData,
		routes,
		hydrationRouteProperties,
		mapRouteProperties,
		dataStrategy: opts?.dataStrategy,
		patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
		instrumentations: opts?.instrumentations
	}).initialize();
}
function RouterProvider$1({ router, flushSync: reactDomFlushSyncImpl, onError, useTransitions }) {
	useTransitions = useIsRSCRouterContext() || useTransitions;
	let [_state, setStateImpl] = React.useState(router.state);
	let [state, setOptimisticState] = useOptimisticSafe(_state);
	let [pendingState, setPendingState] = React.useState();
	let [vtContext, setVtContext] = React.useState({ isTransitioning: false });
	let [renderDfd, setRenderDfd] = React.useState();
	let [transition, setTransition] = React.useState();
	let [interruption, setInterruption] = React.useState();
	let fetcherData = React.useRef(/* @__PURE__ */ new Map());
	let setState = React.useCallback((newState, { deletedFetchers, newErrors, flushSync, viewTransitionOpts }) => {
		if (newErrors && onError) Object.values(newErrors).forEach((error) => onError(error, {
			location: newState.location,
			params: newState.matches[0]?.params ?? {},
			pattern: getRoutePattern(newState.matches)
		}));
		newState.fetchers.forEach((fetcher, key) => {
			if (fetcher.data !== void 0) fetcherData.current.set(key, fetcher.data);
		});
		deletedFetchers.forEach((key) => fetcherData.current.delete(key));
		warnOnce(flushSync === false || reactDomFlushSyncImpl != null, "You provided the `flushSync` option to a router update, but you are not using the `<RouterProvider>` from `react-router/dom` so `ReactDOM.flushSync()` is unavailable.  Please update your app to `import { RouterProvider } from \"react-router/dom\"` and ensure you have `react-dom` installed as a dependency to use the `flushSync` option.");
		let isViewTransitionAvailable = router.window != null && router.window.document != null && typeof router.window.document.startViewTransition === "function";
		warnOnce(viewTransitionOpts == null || isViewTransitionAvailable, "You provided the `viewTransition` option to a router update, but you do not appear to be running in a DOM environment as `window.startViewTransition` is not available.");
		if (!viewTransitionOpts || !isViewTransitionAvailable) {
			if (reactDomFlushSyncImpl && flushSync) reactDomFlushSyncImpl(() => setStateImpl(newState));
			else if (useTransitions === false) setStateImpl(newState);
			else React.startTransition(() => {
				if (useTransitions === true) setOptimisticState((s) => getOptimisticRouterState(s, newState));
				setStateImpl(newState);
			});
			return;
		}
		if (reactDomFlushSyncImpl && flushSync) {
			reactDomFlushSyncImpl(() => {
				if (transition) {
					renderDfd?.resolve();
					transition.skipTransition();
				}
				setVtContext({
					isTransitioning: true,
					flushSync: true,
					currentLocation: viewTransitionOpts.currentLocation,
					nextLocation: viewTransitionOpts.nextLocation
				});
			});
			let t = router.window.document.startViewTransition(() => {
				reactDomFlushSyncImpl(() => setStateImpl(newState));
			});
			t.finished.finally(() => {
				reactDomFlushSyncImpl(() => {
					setRenderDfd(void 0);
					setTransition(void 0);
					setPendingState(void 0);
					setVtContext({ isTransitioning: false });
				});
			});
			reactDomFlushSyncImpl(() => setTransition(t));
			return;
		}
		if (transition) {
			renderDfd?.resolve();
			transition.skipTransition();
			setInterruption({
				state: newState,
				currentLocation: viewTransitionOpts.currentLocation,
				nextLocation: viewTransitionOpts.nextLocation
			});
		} else {
			setPendingState(newState);
			setVtContext({
				isTransitioning: true,
				flushSync: false,
				currentLocation: viewTransitionOpts.currentLocation,
				nextLocation: viewTransitionOpts.nextLocation
			});
		}
	}, [
		router.window,
		reactDomFlushSyncImpl,
		transition,
		renderDfd,
		useTransitions,
		setOptimisticState,
		onError
	]);
	React.useLayoutEffect(() => router.subscribe(setState), [router, setState]);
	React.useEffect(() => {
		if (vtContext.isTransitioning && !vtContext.flushSync) setRenderDfd(new Deferred());
	}, [vtContext]);
	React.useEffect(() => {
		if (renderDfd && pendingState && router.window) {
			let newState = pendingState;
			let renderPromise = renderDfd.promise;
			let transition2 = router.window.document.startViewTransition(async () => {
				if (useTransitions === false) setStateImpl(newState);
				else React.startTransition(() => {
					if (useTransitions === true) setOptimisticState((s) => getOptimisticRouterState(s, newState));
					setStateImpl(newState);
				});
				await renderPromise;
			});
			transition2.finished.finally(() => {
				setRenderDfd(void 0);
				setTransition(void 0);
				setPendingState(void 0);
				setVtContext({ isTransitioning: false });
			});
			setTransition(transition2);
		}
	}, [
		pendingState,
		renderDfd,
		router.window,
		useTransitions,
		setOptimisticState
	]);
	React.useEffect(() => {
		if (renderDfd && pendingState && state.location.key === pendingState.location.key) renderDfd.resolve();
	}, [
		renderDfd,
		transition,
		state.location,
		pendingState
	]);
	React.useEffect(() => {
		if (!vtContext.isTransitioning && interruption) {
			setPendingState(interruption.state);
			setVtContext({
				isTransitioning: true,
				flushSync: false,
				currentLocation: interruption.currentLocation,
				nextLocation: interruption.nextLocation
			});
			setInterruption(void 0);
		}
	}, [vtContext.isTransitioning, interruption]);
	let navigator = React.useMemo(() => {
		return {
			createHref: router.createHref,
			encodeLocation: router.encodeLocation,
			go: (n) => router.navigate(n),
			push: (to, state2, opts) => router.navigate(to, {
				state: state2,
				preventScrollReset: opts?.preventScrollReset
			}),
			replace: (to, state2, opts) => router.navigate(to, {
				replace: true,
				state: state2,
				preventScrollReset: opts?.preventScrollReset
			})
		};
	}, [router]);
	let basename = router.basename || "/";
	let dataRouterContext = React.useMemo(() => ({
		router,
		navigator,
		static: false,
		basename,
		onError
	}), [
		router,
		navigator,
		basename,
		onError
	]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ React.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ React.createElement(FetchersContext.Provider, { value: fetcherData.current }, /* @__PURE__ */ React.createElement(ViewTransitionContext.Provider, { value: vtContext }, /* @__PURE__ */ React.createElement(Router, {
		basename,
		location: state.location,
		navigationType: state.historyAction,
		navigator,
		useTransitions
	}, /* @__PURE__ */ React.createElement(MemoizedDataRoutes, {
		routes: router.routes,
		manifest: router.manifest,
		future: router.future,
		state,
		isStatic: false,
		onError
	})))))), null);
}
function getOptimisticRouterState(currentState, newState) {
	return {
		...currentState,
		navigation: newState.navigation.state !== "idle" ? newState.navigation : currentState.navigation,
		revalidation: newState.revalidation !== "idle" ? newState.revalidation : currentState.revalidation,
		actionData: newState.navigation.state !== "submitting" ? newState.actionData : currentState.actionData,
		fetchers: newState.fetchers
	};
}
function DataRoutes2({ routes, manifest, future, state, isStatic, onError }) {
	return useRoutesImpl(routes, void 0, {
		manifest,
		state,
		isStatic,
		onError,
		future
	});
}
function MemoryRouter({ basename, children, initialEntries, initialIndex, useTransitions }) {
	let historyRef = React.useRef();
	if (historyRef.current == null) historyRef.current = createMemoryHistory({
		initialEntries,
		initialIndex,
		v5Compat: true
	});
	let history = historyRef.current;
	let [state, setStateImpl] = React.useState({
		action: history.action,
		location: history.location
	});
	let setState = React.useCallback((newState) => {
		if (useTransitions === false) setStateImpl(newState);
		else React.startTransition(() => setStateImpl(newState));
	}, [useTransitions]);
	React.useLayoutEffect(() => history.listen(setState), [history, setState]);
	return /* @__PURE__ */ React.createElement(Router, {
		basename,
		children,
		location: state.location,
		navigationType: state.action,
		navigator: history,
		useTransitions
	});
}
function Navigate({ to, replace: replace2, state, relative }) {
	invariant$1(useInRouterContext(), `<Navigate> may be used only in the context of a <Router> component.`);
	let { static: isStatic } = React.useContext(NavigationContext);
	warning(!isStatic, `<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.`);
	let { matches } = React.useContext(RouteContext);
	let { pathname: locationPathname } = useLocation$2();
	let navigate = useNavigate$6();
	let path = resolveTo(to, getResolveToMatches(matches), locationPathname, relative === "path");
	let jsonPath = JSON.stringify(path);
	React.useEffect(() => {
		navigate(JSON.parse(jsonPath), {
			replace: replace2,
			state,
			relative
		});
	}, [
		navigate,
		jsonPath,
		relative,
		replace2,
		state
	]);
	return null;
}
function Outlet(props) {
	return useOutlet(props.context);
}
function Route$1(props) {
	invariant$1(false, `A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.`);
}
function Router({ basename: basenameProp = "/", children = null, location: locationProp, navigationType = "POP", navigator, static: staticProp = false, useTransitions }) {
	invariant$1(!useInRouterContext(), `You cannot render a <Router> inside another <Router>. You should never have more than one in your app.`);
	let basename = basenameProp.replace(/^\/*/, "/");
	let navigationContext = React.useMemo(() => ({
		basename,
		navigator,
		static: staticProp,
		useTransitions,
		future: {}
	}), [
		basename,
		navigator,
		staticProp,
		useTransitions
	]);
	if (typeof locationProp === "string") locationProp = parsePath(locationProp);
	let { pathname = "/", search = "", hash = "", state = null, key = "default", mask } = locationProp;
	let locationContext = React.useMemo(() => {
		let trailingPathname = stripBasename(pathname, basename);
		if (trailingPathname == null) return null;
		return {
			location: {
				pathname: trailingPathname,
				search,
				hash,
				state,
				key,
				mask
			},
			navigationType
		};
	}, [
		basename,
		pathname,
		search,
		hash,
		state,
		key,
		navigationType,
		mask
	]);
	warning(locationContext != null, `<Router basename="${basename}"> is not able to match the URL "${pathname}${search}${hash}" because it does not start with the basename, so the <Router> won't render anything.`);
	if (locationContext == null) return null;
	return /* @__PURE__ */ React.createElement(NavigationContext.Provider, { value: navigationContext }, /* @__PURE__ */ React.createElement(LocationContext.Provider, {
		children,
		value: locationContext
	}));
}
function Routes$1({ children, location }) {
	return useRoutes(createRoutesFromChildren(children), location);
}
function Await({ children, errorElement, resolve }) {
	let dataRouterContext = React.useContext(DataRouterContext);
	let dataRouterStateContext = React.useContext(DataRouterStateContext);
	let onError = React.useCallback((error, errorInfo) => {
		if (dataRouterContext && dataRouterContext.onError && dataRouterStateContext) dataRouterContext.onError(error, {
			location: dataRouterStateContext.location,
			params: dataRouterStateContext.matches[0]?.params || {},
			pattern: getRoutePattern(dataRouterStateContext.matches),
			errorInfo
		});
	}, [dataRouterContext, dataRouterStateContext]);
	return /* @__PURE__ */ React.createElement(AwaitErrorBoundary, {
		resolve,
		errorElement,
		onError
	}, /* @__PURE__ */ React.createElement(ResolveAwait, null, children));
}
function ResolveAwait({ children }) {
	let data2 = useAsyncValue();
	let toRender = typeof children === "function" ? children(data2) : children;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, toRender);
}
function createRoutesFromChildren(children, parentPath = []) {
	let routes = [];
	React.Children.forEach(children, (element, index) => {
		if (!React.isValidElement(element)) return;
		let treePath = [...parentPath, index];
		if (element.type === React.Fragment) {
			routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
			return;
		}
		invariant$1(element.type === Route$1, `[${typeof element.type === "string" ? element.type : element.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`);
		invariant$1(!element.props.index || !element.props.children, "An index route cannot have child routes.");
		let route = {
			id: element.props.id || treePath.join("-"),
			caseSensitive: element.props.caseSensitive,
			element: element.props.element,
			Component: element.props.Component,
			index: element.props.index,
			path: element.props.path,
			middleware: element.props.middleware,
			loader: element.props.loader,
			action: element.props.action,
			hydrateFallbackElement: element.props.hydrateFallbackElement,
			HydrateFallback: element.props.HydrateFallback,
			errorElement: element.props.errorElement,
			ErrorBoundary: element.props.ErrorBoundary,
			hasErrorBoundary: element.props.hasErrorBoundary === true || element.props.ErrorBoundary != null || element.props.errorElement != null,
			shouldRevalidate: element.props.shouldRevalidate,
			handle: element.props.handle,
			lazy: element.props.lazy
		};
		if (element.props.children) route.children = createRoutesFromChildren(element.props.children, treePath);
		routes.push(route);
	});
	return routes;
}
function renderMatches(matches) {
	return _renderMatches(matches);
}
function useRouteComponentProps() {
	return {
		params: useParams$2(),
		loaderData: useLoaderData(),
		actionData: useActionData(),
		matches: useMatches()
	};
}
function WithComponentProps({ children }) {
	const props = useRouteComponentProps();
	return React.cloneElement(children, props);
}
function withComponentProps(Component4) {
	return function WithComponentProps2() {
		const props = useRouteComponentProps();
		return React.createElement(Component4, props);
	};
}
function useHydrateFallbackProps() {
	return {
		params: useParams$2(),
		loaderData: useLoaderData(),
		actionData: useActionData()
	};
}
function WithHydrateFallbackProps({ children }) {
	const props = useHydrateFallbackProps();
	return React.cloneElement(children, props);
}
function withHydrateFallbackProps(HydrateFallback) {
	return function WithHydrateFallbackProps2() {
		const props = useHydrateFallbackProps();
		return React.createElement(HydrateFallback, props);
	};
}
function useErrorBoundaryProps() {
	return {
		params: useParams$2(),
		loaderData: useLoaderData(),
		actionData: useActionData(),
		error: useRouteError()
	};
}
function WithErrorBoundaryProps({ children }) {
	const props = useErrorBoundaryProps();
	return React.cloneElement(children, props);
}
function withErrorBoundaryProps(ErrorBoundary) {
	return function WithErrorBoundaryProps2() {
		const props = useErrorBoundaryProps();
		return React.createElement(ErrorBoundary, props);
	};
}
function isHtmlElement(object) {
	return typeof HTMLElement !== "undefined" && object instanceof HTMLElement;
}
function isButtonElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "button";
}
function isFormElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "form";
}
function isInputElement(object) {
	return isHtmlElement(object) && object.tagName.toLowerCase() === "input";
}
function isModifiedEvent(event) {
	return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
	return event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event);
}
function createSearchParams(init = "") {
	return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo2, key) => {
		let value = init[key];
		return memo2.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
	}, []));
}
function getSearchParamsForLocation(locationSearch, defaultSearchParams) {
	let searchParams = createSearchParams(locationSearch);
	if (defaultSearchParams) defaultSearchParams.forEach((_, key) => {
		if (!searchParams.has(key)) defaultSearchParams.getAll(key).forEach((value) => {
			searchParams.append(key, value);
		});
	});
	return searchParams;
}
function isFormDataSubmitterSupported() {
	if (_formDataSupportsSubmitter === null) try {
		new FormData(document.createElement("form"), 0);
		_formDataSupportsSubmitter = false;
	} catch (e) {
		_formDataSupportsSubmitter = true;
	}
	return _formDataSupportsSubmitter;
}
function getFormEncType(encType) {
	if (encType != null && !supportedFormEncTypes.has(encType)) {
		warning(false, `"${encType}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${defaultEncType}"`);
		return null;
	}
	return encType;
}
function getFormSubmissionInfo(target, basename) {
	let method;
	let action;
	let encType;
	let formData;
	let body;
	if (isFormElement(target)) {
		let attr = target.getAttribute("action");
		action = attr ? stripBasename(attr, basename) : null;
		method = target.getAttribute("method") || defaultMethod;
		encType = getFormEncType(target.getAttribute("enctype")) || defaultEncType;
		formData = new FormData(target);
	} else if (isButtonElement(target) || isInputElement(target) && (target.type === "submit" || target.type === "image")) {
		let form = target.form;
		if (form == null) throw new Error(`Cannot submit a <button> or <input type="submit"> without a <form>`);
		let attr = target.getAttribute("formaction") || form.getAttribute("action");
		action = attr ? stripBasename(attr, basename) : null;
		method = target.getAttribute("formmethod") || form.getAttribute("method") || defaultMethod;
		encType = getFormEncType(target.getAttribute("formenctype")) || getFormEncType(form.getAttribute("enctype")) || defaultEncType;
		formData = new FormData(form, target);
		if (!isFormDataSubmitterSupported()) {
			let { name, type, value } = target;
			if (type === "image") {
				let prefix = name ? `${name}.` : "";
				formData.append(`${prefix}x`, "0");
				formData.append(`${prefix}y`, "0");
			} else if (name) formData.append(name, value);
		}
	} else if (isHtmlElement(target)) throw new Error(`Cannot submit element that is not <form>, <button>, or <input type="submit|image">`);
	else {
		method = defaultMethod;
		action = null;
		encType = defaultEncType;
		body = target;
	}
	if (formData && encType === "text/plain") {
		body = formData;
		formData = void 0;
	}
	return {
		action,
		method: method.toLowerCase(),
		encType,
		formData,
		body
	};
}
function createLineSplittingTransform() {
	const decoder = new TextDecoder();
	let leftover = "";
	return new TransformStream({
		transform(chunk, controller) {
			const str = decoder.decode(chunk, { stream: true });
			const parts = (leftover + str).split("\n");
			leftover = parts.pop() || "";
			for (const part of parts) controller.enqueue(part);
		},
		flush(controller) {
			if (leftover) controller.enqueue(leftover);
		}
	});
}
async function flatten(input) {
	const { indices } = this;
	const existing = indices.get(input);
	if (existing) return [existing];
	if (input === void 0) return UNDEFINED;
	if (input === null) return NULL;
	if (Number.isNaN(input)) return NAN;
	if (input === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY;
	if (input === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY;
	if (input === 0 && 1 / input < 0) return NEGATIVE_ZERO;
	const index = this.index++;
	indices.set(input, index);
	const stack = [[input, index]];
	await stringify.call(this, stack);
	return index;
}
async function stringify(stack) {
	const { deferred, indices, plugins, postPlugins } = this;
	const str = this.stringified;
	let lastYieldTime = getNow();
	const flattenValue = (value) => {
		const existing = indices.get(value);
		if (existing) return [existing];
		if (value === void 0) return UNDEFINED;
		if (value === null) return NULL;
		if (Number.isNaN(value)) return NAN;
		if (value === Number.POSITIVE_INFINITY) return POSITIVE_INFINITY;
		if (value === Number.NEGATIVE_INFINITY) return NEGATIVE_INFINITY;
		if (value === 0 && 1 / value < 0) return NEGATIVE_ZERO;
		const index = this.index++;
		indices.set(value, index);
		stack.push([value, index]);
		return index;
	};
	let i = 0;
	while (stack.length > 0) {
		const now = getNow();
		if (++i % 6e3 === 0 && now - lastYieldTime >= TIME_LIMIT_MS) {
			await yieldToMain();
			lastYieldTime = getNow();
		}
		const [input, index] = stack.pop();
		const partsForObj = (obj) => Object.keys(obj).map((k) => `"_${flattenValue(k)}":${flattenValue(obj[k])}`).join(",");
		let error = null;
		switch (typeof input) {
			case "boolean":
			case "number":
			case "string":
				str[index] = JSON.stringify(input);
				break;
			case "bigint":
				str[index] = `["${TYPE_BIGINT}","${input}"]`;
				break;
			case "symbol": {
				const keyFor = Symbol.keyFor(input);
				if (!keyFor) error = /* @__PURE__ */ new Error("Cannot encode symbol unless created with Symbol.for()");
				else str[index] = `["${TYPE_SYMBOL}",${JSON.stringify(keyFor)}]`;
				break;
			}
			case "object": {
				if (!input) {
					str[index] = `${NULL}`;
					break;
				}
				const isArray = Array.isArray(input);
				let pluginHandled = false;
				if (!isArray && plugins) for (const plugin of plugins) {
					const pluginResult = plugin(input);
					if (Array.isArray(pluginResult)) {
						pluginHandled = true;
						const [pluginIdentifier, ...rest] = pluginResult;
						str[index] = `[${JSON.stringify(pluginIdentifier)}`;
						if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
						str[index] += "]";
						break;
					}
				}
				if (!pluginHandled) {
					let result = isArray ? "[" : "{";
					if (isArray) {
						for (let i2 = 0; i2 < input.length; i2++) result += (i2 ? "," : "") + (i2 in input ? flattenValue(input[i2]) : HOLE);
						str[index] = `${result}]`;
					} else if (input instanceof Date) {
						const dateTime = input.getTime();
						str[index] = `["${TYPE_DATE}",${Number.isNaN(dateTime) ? JSON.stringify("invalid") : dateTime}]`;
					} else if (input instanceof URL) str[index] = `["${TYPE_URL}",${JSON.stringify(input.href)}]`;
					else if (input instanceof RegExp) str[index] = `["${TYPE_REGEXP}",${JSON.stringify(input.source)},${JSON.stringify(input.flags)}]`;
					else if (input instanceof Set) if (input.size > 0) str[index] = `["${TYPE_SET}",${[...input].map((val) => flattenValue(val)).join(",")}]`;
					else str[index] = `["${TYPE_SET}"]`;
					else if (input instanceof Map) if (input.size > 0) str[index] = `["${TYPE_MAP}",${[...input].flatMap(([k, v]) => [flattenValue(k), flattenValue(v)]).join(",")}]`;
					else str[index] = `["${TYPE_MAP}"]`;
					else if (input instanceof Promise) {
						str[index] = `["${TYPE_PROMISE}",${index}]`;
						deferred[index] = input;
					} else if (input instanceof Error) {
						str[index] = `["${TYPE_ERROR}",${JSON.stringify(input.message)}`;
						if (input.name !== "Error") str[index] += `,${JSON.stringify(input.name)}`;
						str[index] += "]";
					} else if (Object.getPrototypeOf(input) === null) str[index] = `["${TYPE_NULL_OBJECT}",{${partsForObj(input)}}]`;
					else if (isPlainObject2(input)) str[index] = `{${partsForObj(input)}}`;
					else error = /* @__PURE__ */ new Error("Cannot encode object with prototype");
				}
				break;
			}
			default: {
				const isArray = Array.isArray(input);
				let pluginHandled = false;
				if (!isArray && plugins) for (const plugin of plugins) {
					const pluginResult = plugin(input);
					if (Array.isArray(pluginResult)) {
						pluginHandled = true;
						const [pluginIdentifier, ...rest] = pluginResult;
						str[index] = `[${JSON.stringify(pluginIdentifier)}`;
						if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
						str[index] += "]";
						break;
					}
				}
				if (!pluginHandled) error = /* @__PURE__ */ new Error("Cannot encode function or unexpected type");
			}
		}
		if (error) {
			let pluginHandled = false;
			if (postPlugins) for (const plugin of postPlugins) {
				const pluginResult = plugin(input);
				if (Array.isArray(pluginResult)) {
					pluginHandled = true;
					const [pluginIdentifier, ...rest] = pluginResult;
					str[index] = `[${JSON.stringify(pluginIdentifier)}`;
					if (rest.length > 0) str[index] += `,${rest.map((v) => flattenValue(v)).join(",")}`;
					str[index] += "]";
					break;
				}
			}
			if (!pluginHandled) throw error;
		}
	}
}
function isPlainObject2(thing) {
	const proto = Object.getPrototypeOf(thing);
	return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === objectProtoNames2;
}
function unflatten(parsed) {
	const { hydrated, values } = this;
	if (typeof parsed === "number") return hydrate.call(this, parsed);
	if (!Array.isArray(parsed) || !parsed.length) throw new SyntaxError();
	const startIndex = values.length;
	for (const value of parsed) values.push(value);
	hydrated.length = values.length;
	return hydrate.call(this, startIndex);
}
function hydrate(index) {
	const { hydrated, values, deferred, plugins } = this;
	let result;
	const stack = [[index, (v) => {
		result = v;
	}]];
	let postRun = [];
	while (stack.length > 0) {
		const [index2, set] = stack.pop();
		switch (index2) {
			case UNDEFINED:
				set(void 0);
				continue;
			case NULL:
				set(null);
				continue;
			case NAN:
				set(NaN);
				continue;
			case POSITIVE_INFINITY:
				set(Infinity);
				continue;
			case NEGATIVE_INFINITY:
				set(-Infinity);
				continue;
			case NEGATIVE_ZERO:
				set(-0);
				continue;
		}
		if (hydrated[index2]) {
			set(hydrated[index2]);
			continue;
		}
		const value = values[index2];
		if (!value || typeof value !== "object") {
			hydrated[index2] = value;
			set(value);
			continue;
		}
		if (Array.isArray(value)) if (typeof value[0] === "string") {
			const [type, b, c] = value;
			switch (type) {
				case TYPE_DATE:
					set(hydrated[index2] = new Date(b));
					continue;
				case TYPE_URL:
					set(hydrated[index2] = new URL(b));
					continue;
				case TYPE_BIGINT:
					set(hydrated[index2] = BigInt(b));
					continue;
				case TYPE_REGEXP:
					set(hydrated[index2] = new RegExp(b, c));
					continue;
				case TYPE_SYMBOL:
					set(hydrated[index2] = Symbol.for(b));
					continue;
				case TYPE_SET:
					const newSet = /* @__PURE__ */ new Set();
					hydrated[index2] = newSet;
					for (let i = value.length - 1; i > 0; i--) stack.push([value[i], (v) => {
						newSet.add(v);
					}]);
					set(newSet);
					continue;
				case TYPE_MAP:
					const map = /* @__PURE__ */ new Map();
					hydrated[index2] = map;
					for (let i = value.length - 2; i > 0; i -= 2) {
						const r = [];
						stack.push([value[i + 1], (v) => {
							r[1] = v;
						}]);
						stack.push([value[i], (k) => {
							r[0] = k;
						}]);
						postRun.push(() => {
							map.set(r[0], r[1]);
						});
					}
					set(map);
					continue;
				case TYPE_NULL_OBJECT:
					const obj = /* @__PURE__ */ Object.create(null);
					hydrated[index2] = obj;
					for (const key of Object.keys(b).reverse()) {
						const r = [];
						stack.push([b[key], (v) => {
							r[1] = v;
						}]);
						stack.push([Number(key.slice(1)), (k) => {
							r[0] = k;
						}]);
						postRun.push(() => {
							obj[r[0]] = r[1];
						});
					}
					set(obj);
					continue;
				case TYPE_PROMISE:
					if (hydrated[b]) set(hydrated[index2] = hydrated[b]);
					else {
						const d = new Deferred2();
						deferred[b] = d;
						set(hydrated[index2] = d.promise);
					}
					continue;
				case TYPE_ERROR:
					const [, message, errorType] = value;
					let error = errorType && globalObj && SUPPORTED_ERROR_TYPES.includes(errorType) && errorType in globalObj && typeof globalObj[errorType] === "function" ? new globalObj[errorType](message) : new Error(message);
					hydrated[index2] = error;
					set(error);
					continue;
				case TYPE_PREVIOUS_RESOLVED:
					set(hydrated[index2] = hydrated[b]);
					continue;
				default:
					if (Array.isArray(plugins)) {
						const r = [];
						const vals = value.slice(1);
						for (let i = 0; i < vals.length; i++) {
							const v = vals[i];
							stack.push([v, (v2) => {
								r[i] = v2;
							}]);
						}
						postRun.push(() => {
							for (const plugin of plugins) {
								const result2 = plugin(value[0], ...r);
								if (result2) {
									set(hydrated[index2] = result2.value);
									return;
								}
							}
							throw new SyntaxError();
						});
						continue;
					}
					throw new SyntaxError();
			}
		} else {
			const array = [];
			hydrated[index2] = array;
			for (let i = 0; i < value.length; i++) {
				const n = value[i];
				if (n !== HOLE) stack.push([n, (v) => {
					array[i] = v;
				}]);
			}
			set(array);
			continue;
		}
		else {
			const object = {};
			hydrated[index2] = object;
			for (const key of Object.keys(value).reverse()) {
				const r = [];
				stack.push([value[key], (v) => {
					r[1] = v;
				}]);
				stack.push([Number(key.slice(1)), (k) => {
					r[0] = k;
				}]);
				postRun.push(() => {
					object[r[0]] = r[1];
				});
			}
			set(object);
			continue;
		}
	}
	while (postRun.length > 0) postRun.pop()();
	return result;
}
async function decode(readable, options) {
	const { plugins } = options ?? {};
	const done = new Deferred2();
	const reader = readable.pipeThrough(createLineSplittingTransform()).getReader();
	const decoder = {
		values: [],
		hydrated: [],
		deferred: {},
		plugins
	};
	const decoded = await decodeInitial.call(decoder, reader);
	let donePromise = done.promise;
	if (decoded.done) done.resolve();
	else donePromise = decodeDeferred.call(decoder, reader).then(done.resolve).catch((reason) => {
		for (const deferred of Object.values(decoder.deferred)) deferred.reject(reason);
		done.reject(reason);
	});
	return {
		done: donePromise.then(() => reader.closed),
		value: decoded.value
	};
}
async function decodeInitial(reader) {
	const read = await reader.read();
	if (!read.value) throw new SyntaxError();
	let line;
	try {
		line = JSON.parse(read.value);
	} catch (reason) {
		throw new SyntaxError();
	}
	return {
		done: read.done,
		value: unflatten.call(this, line)
	};
}
async function decodeDeferred(reader) {
	let read = await reader.read();
	while (!read.done) {
		if (!read.value) continue;
		const line = read.value;
		switch (line[0]) {
			case TYPE_PROMISE: {
				const colonIndex = line.indexOf(":");
				const deferredId = Number(line.slice(1, colonIndex));
				const deferred = this.deferred[deferredId];
				if (!deferred) throw new Error(`Deferred ID ${deferredId} not found in stream`);
				const lineData = line.slice(colonIndex + 1);
				let jsonLine;
				try {
					jsonLine = JSON.parse(lineData);
				} catch (reason) {
					throw new SyntaxError();
				}
				const value = unflatten.call(this, jsonLine);
				deferred.resolve(value);
				break;
			}
			case TYPE_ERROR: {
				const colonIndex = line.indexOf(":");
				const deferredId = Number(line.slice(1, colonIndex));
				const deferred = this.deferred[deferredId];
				if (!deferred) throw new Error(`Deferred ID ${deferredId} not found in stream`);
				const lineData = line.slice(colonIndex + 1);
				let jsonLine;
				try {
					jsonLine = JSON.parse(lineData);
				} catch (reason) {
					throw new SyntaxError();
				}
				const value = unflatten.call(this, jsonLine);
				deferred.reject(value);
				break;
			}
			default: throw new SyntaxError();
		}
		read = await reader.read();
	}
}
function encode(input, options) {
	const { onComplete, plugins, postPlugins, signal } = options ?? {};
	const encoder = {
		deferred: {},
		index: 0,
		indices: /* @__PURE__ */ new Map(),
		stringified: [],
		plugins,
		postPlugins,
		signal
	};
	const textEncoder = new TextEncoder();
	let lastSentIndex = 0;
	return new ReadableStream({ async start(controller) {
		const id = await flatten.call(encoder, input);
		if (Array.isArray(id)) throw new Error("This should never happen");
		if (id < 0) controller.enqueue(textEncoder.encode(`${id}
`));
		else {
			controller.enqueue(textEncoder.encode(`[${encoder.stringified.join(",")}]
`));
			lastSentIndex = encoder.stringified.length - 1;
		}
		const seenPromises = /* @__PURE__ */ new WeakSet();
		let processingChain = Promise.resolve();
		if (Object.keys(encoder.deferred).length) {
			let raceDone;
			const racePromise = new Promise((resolve, reject) => {
				raceDone = resolve;
				if (signal) {
					const rejectPromise = () => reject(signal.reason || /* @__PURE__ */ new Error("Signal was aborted."));
					if (signal.aborted) rejectPromise();
					else signal.addEventListener("abort", (event) => {
						rejectPromise();
					});
				}
			});
			while (Object.keys(encoder.deferred).length > 0) {
				for (const [deferredId, deferred] of Object.entries(encoder.deferred)) {
					if (seenPromises.has(deferred)) continue;
					seenPromises.add(encoder.deferred[Number(deferredId)] = Promise.race([racePromise, deferred]).then((resolved) => {
						processingChain = processingChain.then(async () => {
							const id2 = await flatten.call(encoder, resolved);
							if (Array.isArray(id2)) {
								controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`));
								encoder.index++;
								lastSentIndex++;
							} else if (id2 < 0) controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:${id2}
`));
							else {
								const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
								controller.enqueue(textEncoder.encode(`${TYPE_PROMISE}${deferredId}:[${values}]
`));
								lastSentIndex = encoder.stringified.length - 1;
							}
						});
						return processingChain;
					}, (reason) => {
						processingChain = processingChain.then(async () => {
							if (!reason || typeof reason !== "object" || !(reason instanceof Error)) reason = /* @__PURE__ */ new Error("An unknown error occurred");
							const id2 = await flatten.call(encoder, reason);
							if (Array.isArray(id2)) {
								controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:[["${TYPE_PREVIOUS_RESOLVED}",${id2[0]}]]
`));
								encoder.index++;
								lastSentIndex++;
							} else if (id2 < 0) controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:${id2}
`));
							else {
								const values = encoder.stringified.slice(lastSentIndex + 1).join(",");
								controller.enqueue(textEncoder.encode(`${TYPE_ERROR}${deferredId}:[${values}]
`));
								lastSentIndex = encoder.stringified.length - 1;
							}
						});
						return processingChain;
					}).finally(() => {
						delete encoder.deferred[Number(deferredId)];
					}));
				}
				await Promise.race(Object.values(encoder.deferred));
			}
			raceDone();
		}
		await Promise.all(Object.values(encoder.deferred));
		await processingChain;
		controller.close();
		onComplete?.();
	} });
}
async function createRequestInit(request) {
	let init = { signal: request.signal };
	if (request.method !== "GET") {
		init.method = request.method;
		let contentType = request.headers.get("Content-Type");
		if (contentType && /\bapplication\/json\b/.test(contentType)) {
			init.headers = { "Content-Type": contentType };
			init.body = JSON.stringify(await request.json());
		} else if (contentType && /\btext\/plain\b/.test(contentType)) {
			init.headers = { "Content-Type": contentType };
			init.body = await request.text();
		} else if (contentType && /\bapplication\/x-www-form-urlencoded\b/.test(contentType)) init.body = new URLSearchParams(await request.text());
		else init.body = await request.formData();
	}
	return init;
}
function escapeHtml(html) {
	return html.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
function invariant2(value, message) {
	if (value === false || value === null || typeof value === "undefined") throw new Error(message);
}
function StreamTransfer({ context, identifier, reader, textDecoder, nonce }) {
	if (!context.renderMeta || !context.renderMeta.didRenderScripts) return null;
	if (!context.renderMeta.streamCache) context.renderMeta.streamCache = {};
	let { streamCache } = context.renderMeta;
	let promise = streamCache[identifier];
	if (!promise) promise = streamCache[identifier] = reader.read().then((result) => {
		streamCache[identifier].result = {
			done: result.done,
			value: textDecoder.decode(result.value, { stream: true })
		};
	}).catch((e) => {
		streamCache[identifier].error = e;
	});
	if (promise.error) throw promise.error;
	if (promise.result === void 0) throw promise;
	let { done, value } = promise.result;
	let scriptTag = value ? /* @__PURE__ */ React.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `window.__reactRouterContext.streamController.enqueue(${escapeHtml(JSON.stringify(value))});` }
	}) : null;
	if (done) return /* @__PURE__ */ React.createElement(React.Fragment, null, scriptTag, /* @__PURE__ */ React.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `window.__reactRouterContext.streamController.close();` }
	}));
	else return /* @__PURE__ */ React.createElement(React.Fragment, null, scriptTag, /* @__PURE__ */ React.createElement(React.Suspense, null, /* @__PURE__ */ React.createElement(StreamTransfer, {
		context,
		identifier: identifier + 1,
		reader,
		textDecoder,
		nonce
	})));
}
function getTurboStreamSingleFetchDataStrategy(getRouter, manifest, routeModules, ssr, basename, trailingSlashAware) {
	let dataStrategy = getSingleFetchDataStrategyImpl(getRouter, (match) => {
		let manifestRoute = manifest.routes[match.route.id];
		invariant2(manifestRoute, "Route not found in manifest");
		return {
			hasLoader: manifestRoute.hasLoader,
			hasClientLoader: manifestRoute.hasClientLoader
		};
	}, fetchAndDecodeViaTurboStream, ssr, basename, trailingSlashAware);
	return async (args) => args.runClientMiddleware(dataStrategy);
}
function getSingleFetchDataStrategyImpl(getRouter, getRouteInfo, fetchAndDecode, ssr, basename, trailingSlashAware, shouldAllowOptOut = () => true) {
	return async (args) => {
		let { request, matches, fetcherKey } = args;
		let router = getRouter();
		if (request.method !== "GET") return singleFetchActionStrategy(args, fetchAndDecode, basename, trailingSlashAware);
		let foundRevalidatingServerLoader = matches.some((m) => {
			let { hasLoader, hasClientLoader } = getRouteInfo(m);
			return m.shouldCallHandler() && hasLoader && !hasClientLoader;
		});
		if (!ssr && !foundRevalidatingServerLoader) return nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename, trailingSlashAware);
		if (fetcherKey) return singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename, trailingSlashAware);
		return singleFetchLoaderNavigationStrategy(args, router, getRouteInfo, fetchAndDecode, ssr, basename, trailingSlashAware, shouldAllowOptOut);
	};
}
async function singleFetchActionStrategy(args, fetchAndDecode, basename, trailingSlashAware) {
	let actionMatch = args.matches.find((m) => m.shouldCallHandler());
	invariant2(actionMatch, "No action match found");
	let actionStatus = void 0;
	let result = await actionMatch.resolve(async (handler) => {
		return await handler(async () => {
			let { data: data2, status } = await fetchAndDecode(args, basename, trailingSlashAware, [actionMatch.route.id]);
			actionStatus = status;
			return unwrapSingleFetchResult(data2, actionMatch.route.id);
		});
	});
	if (isResponse(result.result) || isRouteErrorResponse(result.result) || isDataWithResponseInit(result.result)) return { [actionMatch.route.id]: result };
	return { [actionMatch.route.id]: {
		type: result.type,
		result: data(result.result, actionStatus)
	} };
}
async function nonSsrStrategy(args, getRouteInfo, fetchAndDecode, basename, trailingSlashAware) {
	let matchesToLoad = args.matches.filter((m) => m.shouldCallHandler());
	let results = {};
	await Promise.all(matchesToLoad.map((m) => m.resolve(async (handler) => {
		try {
			let { hasClientLoader } = getRouteInfo(m);
			let routeId = m.route.id;
			let result = hasClientLoader ? await handler(async () => {
				let { data: data2 } = await fetchAndDecode(args, basename, trailingSlashAware, [routeId]);
				return unwrapSingleFetchResult(data2, routeId);
			}) : await handler();
			results[m.route.id] = {
				type: "data",
				result
			};
		} catch (e) {
			results[m.route.id] = {
				type: "error",
				result: e
			};
		}
	})));
	return results;
}
async function singleFetchLoaderNavigationStrategy(args, router, getRouteInfo, fetchAndDecode, ssr, basename, trailingSlashAware, shouldAllowOptOut = () => true) {
	let routesParams = /* @__PURE__ */ new Set();
	let foundOptOutRoute = false;
	let routeDfds = args.matches.map(() => createDeferred2());
	let singleFetchDfd = createDeferred2();
	let results = {};
	let resolvePromise = Promise.all(args.matches.map(async (m, i) => m.resolve(async (handler) => {
		routeDfds[i].resolve();
		let routeId = m.route.id;
		let { hasLoader, hasClientLoader } = getRouteInfo(m);
		let defaultShouldRevalidate = !m.shouldRevalidateArgs || m.shouldRevalidateArgs.actionStatus == null || m.shouldRevalidateArgs.actionStatus < 400;
		if (!m.shouldCallHandler(defaultShouldRevalidate)) {
			foundOptOutRoute || (foundOptOutRoute = m.shouldRevalidateArgs != null && hasLoader);
			return;
		}
		if (shouldAllowOptOut(m) && hasClientLoader) {
			if (hasLoader) foundOptOutRoute = true;
			try {
				results[routeId] = {
					type: "data",
					result: await handler(async () => {
						let { data: data2 } = await fetchAndDecode(args, basename, trailingSlashAware, [routeId]);
						return unwrapSingleFetchResult(data2, routeId);
					})
				};
			} catch (e) {
				results[routeId] = {
					type: "error",
					result: e
				};
			}
			return;
		}
		if (hasLoader) routesParams.add(routeId);
		try {
			results[routeId] = {
				type: "data",
				result: await handler(async () => {
					return unwrapSingleFetchResult(await singleFetchDfd.promise, routeId);
				})
			};
		} catch (e) {
			results[routeId] = {
				type: "error",
				result: e
			};
		}
	})));
	await Promise.all(routeDfds.map((d) => d.promise));
	if ((!router.state.initialized && router.state.navigation.state === "idle" || routesParams.size === 0) && !window.__reactRouterHdrActive) singleFetchDfd.resolve({ routes: {} });
	else {
		let targetRoutes = ssr && foundOptOutRoute && routesParams.size > 0 ? [...routesParams.keys()] : void 0;
		try {
			let data2 = await fetchAndDecode(args, basename, trailingSlashAware, targetRoutes);
			singleFetchDfd.resolve(data2.data);
		} catch (e) {
			singleFetchDfd.reject(e);
		}
	}
	await resolvePromise;
	await bubbleMiddlewareErrors(singleFetchDfd.promise, args.matches, routesParams, results);
	return results;
}
async function bubbleMiddlewareErrors(singleFetchPromise, matches, routesParams, results) {
	try {
		let middlewareError;
		let fetchedData = await singleFetchPromise;
		if ("routes" in fetchedData) {
			for (let match of matches) if (match.route.id in fetchedData.routes) {
				let routeResult = fetchedData.routes[match.route.id];
				if ("error" in routeResult) {
					middlewareError = routeResult.error;
					if (results[match.route.id]?.result == null) results[match.route.id] = {
						type: "error",
						result: middlewareError
					};
					break;
				}
			}
		}
		if (middlewareError !== void 0) Array.from(routesParams.values()).forEach((routeId) => {
			if (results[routeId].result instanceof SingleFetchNoResultError) results[routeId].result = middlewareError;
		});
	} catch (e) {}
}
async function singleFetchLoaderFetcherStrategy(args, fetchAndDecode, basename, trailingSlashAware) {
	let fetcherMatch = args.matches.find((m) => m.shouldCallHandler());
	invariant2(fetcherMatch, "No fetcher match found");
	let routeId = fetcherMatch.route.id;
	let result = await fetcherMatch.resolve(async (handler) => handler(async () => {
		let { data: data2 } = await fetchAndDecode(args, basename, trailingSlashAware, [routeId]);
		return unwrapSingleFetchResult(data2, routeId);
	}));
	return { [fetcherMatch.route.id]: result };
}
function stripIndexParam$1(url) {
	let indexValues = url.searchParams.getAll("index");
	url.searchParams.delete("index");
	let indexValuesToKeep = [];
	for (let indexValue of indexValues) if (indexValue) indexValuesToKeep.push(indexValue);
	for (let toKeep of indexValuesToKeep) url.searchParams.append("index", toKeep);
	return url;
}
function singleFetchUrl(reqUrl, basename, trailingSlashAware, extension) {
	let url = typeof reqUrl === "string" ? new URL(reqUrl, typeof window === "undefined" ? "server://singlefetch/" : window.location.origin) : reqUrl;
	if (trailingSlashAware) if (url.pathname.endsWith("/")) url.pathname = `${url.pathname}_.${extension}`;
	else url.pathname = `${url.pathname}.${extension}`;
	else if (url.pathname === "/") url.pathname = `_root.${extension}`;
	else if (basename && stripBasename(url.pathname, basename) === "/") url.pathname = `${removeTrailingSlash(basename)}/_root.${extension}`;
	else url.pathname = `${removeTrailingSlash(url.pathname)}.${extension}`;
	return url;
}
async function fetchAndDecodeViaTurboStream(args, basename, trailingSlashAware, targetRoutes) {
	let { request } = args;
	let url = singleFetchUrl(request.url, basename, trailingSlashAware, "data");
	if (request.method === "GET") {
		url = stripIndexParam$1(url);
		if (targetRoutes) url.searchParams.set("_routes", targetRoutes.join(","));
	}
	let res = await fetch(url, await createRequestInit(request));
	if (res.status >= 400 && !res.headers.has("X-Remix-Response")) throw new ErrorResponseImpl(res.status, res.statusText, await res.text());
	if (res.status === 204 && res.headers.has("X-Remix-Redirect")) return {
		status: 202,
		data: { redirect: {
			redirect: res.headers.get("X-Remix-Redirect"),
			status: Number(res.headers.get("X-Remix-Status") || "302"),
			revalidate: res.headers.get("X-Remix-Revalidate") === "true",
			reload: res.headers.get("X-Remix-Reload-Document") === "true",
			replace: res.headers.get("X-Remix-Replace") === "true"
		} }
	};
	if (NO_BODY_STATUS_CODES.has(res.status)) {
		let routes = {};
		if (targetRoutes && request.method !== "GET") routes[targetRoutes[0]] = { data: void 0 };
		return {
			status: res.status,
			data: { routes }
		};
	}
	invariant2(res.body, "No response body to decode");
	try {
		let decoded = await decodeViaTurboStream(res.body, window);
		let data2;
		if (request.method === "GET") {
			let typed = decoded.value;
			if (SingleFetchRedirectSymbol in typed) data2 = { redirect: typed[SingleFetchRedirectSymbol] };
			else data2 = { routes: typed };
		} else {
			let typed = decoded.value;
			let routeId = targetRoutes?.[0];
			invariant2(routeId, "No routeId found for single fetch call decoding");
			if ("redirect" in typed) data2 = { redirect: typed };
			else data2 = { routes: { [routeId]: typed } };
		}
		return {
			status: res.status,
			data: data2
		};
	} catch (e) {
		throw new Error("Unable to decode turbo-stream response");
	}
}
function decodeViaTurboStream(body, global) {
	return decode(body, { plugins: [(type, ...rest) => {
		if (type === "SanitizedError") {
			let [name, message, stack] = rest;
			let Constructor = Error;
			if (name && SUPPORTED_ERROR_TYPES.includes(name) && name in global && typeof global[name] === "function") Constructor = global[name];
			let error = new Constructor(message);
			error.stack = stack;
			return { value: error };
		}
		if (type === "ErrorResponse") {
			let [data2, status, statusText] = rest;
			return { value: new ErrorResponseImpl(status, statusText, data2) };
		}
		if (type === "SingleFetchRedirect") return { value: { [SingleFetchRedirectSymbol]: rest[0] } };
		if (type === "SingleFetchClassInstance") return { value: rest[0] };
		if (type === "SingleFetchFallback") return { value: void 0 };
	}] });
}
function unwrapSingleFetchResult(result, routeId) {
	if ("redirect" in result) {
		let { redirect: location, revalidate, reload, replace: replace2, status } = result.redirect;
		throw redirect(location, {
			status,
			headers: {
				...revalidate ? { "X-Remix-Revalidate": "yes" } : null,
				...reload ? { "X-Remix-Reload-Document": "yes" } : null,
				...replace2 ? { "X-Remix-Replace": "yes" } : null
			}
		});
	}
	let routeResult = result.routes[routeId];
	if (routeResult == null) throw new SingleFetchNoResultError(`No result found for routeId "${routeId}"`);
	else if ("error" in routeResult) throw routeResult.error;
	else if ("data" in routeResult) return routeResult.data;
	else throw new Error(`Invalid response found for routeId "${routeId}"`);
}
function createDeferred2() {
	let resolve;
	let reject;
	let promise = new Promise((res, rej) => {
		resolve = async (val) => {
			res(val);
			try {
				await promise;
			} catch (e) {}
		};
		reject = async (error) => {
			rej(error);
			try {
				await promise;
			} catch (e) {}
		};
	});
	return {
		promise,
		resolve,
		reject
	};
}
async function loadRouteModule(route, routeModulesCache) {
	if (route.id in routeModulesCache) return routeModulesCache[route.id];
	try {
		let routeModule = await import(
			/* @vite-ignore */
			/* webpackIgnore: true */
			route.module
);
		routeModulesCache[route.id] = routeModule;
		return routeModule;
	} catch (error) {
		console.error(`Error loading route module \`${route.module}\`, reloading page...`);
		console.error(error);
		if (window.__reactRouterContext && window.__reactRouterContext.isSpaMode && void 0);
		window.location.reload();
		return new Promise(() => {});
	}
}
function getKeyedLinksForMatches(matches, routeModules, manifest) {
	return dedupeLinkDescriptors(matches.map((match) => {
		let module = routeModules[match.route.id];
		let route = manifest.routes[match.route.id];
		return [route && route.css ? route.css.map((href) => ({
			rel: "stylesheet",
			href
		})) : [], module?.links?.() || []];
	}).flat(2), getModuleLinkHrefs(matches, manifest));
}
function getRouteCssDescriptors(route) {
	if (!route.css) return [];
	return route.css.map((href) => ({
		rel: "stylesheet",
		href
	}));
}
async function prefetchRouteCss(route) {
	if (!route.css) return;
	let descriptors = getRouteCssDescriptors(route);
	await Promise.all(descriptors.map(prefetchStyleLink));
}
async function prefetchStyleLinks(route, routeModule) {
	if (!route.css && !routeModule.links || !isPreloadSupported()) return;
	let descriptors = [];
	if (route.css) descriptors.push(...getRouteCssDescriptors(route));
	if (routeModule.links) descriptors.push(...routeModule.links());
	if (descriptors.length === 0) return;
	let styleLinks = [];
	for (let descriptor of descriptors) if (!isPageLinkDescriptor(descriptor) && descriptor.rel === "stylesheet") styleLinks.push({
		...descriptor,
		rel: "preload",
		as: "style"
	});
	await Promise.all(styleLinks.map(prefetchStyleLink));
}
async function prefetchStyleLink(descriptor) {
	return new Promise((resolve) => {
		if (descriptor.media && !window.matchMedia(descriptor.media).matches || document.querySelector(`link[rel="stylesheet"][href="${descriptor.href}"]`)) return resolve();
		let link = document.createElement("link");
		Object.assign(link, descriptor);
		function removeLink() {
			if (document.head.contains(link)) document.head.removeChild(link);
		}
		link.onload = () => {
			removeLink();
			resolve();
		};
		link.onerror = () => {
			removeLink();
			resolve();
		};
		document.head.appendChild(link);
	});
}
function isPageLinkDescriptor(object) {
	return object != null && typeof object.page === "string";
}
function isHtmlLinkDescriptor(object) {
	if (object == null) return false;
	if (object.href == null) return object.rel === "preload" && typeof object.imageSrcSet === "string" && typeof object.imageSizes === "string";
	return typeof object.rel === "string" && typeof object.href === "string";
}
async function getKeyedPrefetchLinks(matches, manifest, routeModules) {
	return dedupeLinkDescriptors((await Promise.all(matches.map(async (match) => {
		let route = manifest.routes[match.route.id];
		if (route) {
			let mod = await loadRouteModule(route, routeModules);
			return mod.links ? mod.links() : [];
		}
		return [];
	}))).flat(1).filter(isHtmlLinkDescriptor).filter((link) => link.rel === "stylesheet" || link.rel === "preload").map((link) => link.rel === "stylesheet" ? {
		...link,
		rel: "prefetch",
		as: "style"
	} : {
		...link,
		rel: "prefetch"
	}));
}
function getNewMatchesForLinks(page, nextMatches, currentMatches, manifest, location, mode) {
	let isNew = (match, index) => {
		if (!currentMatches[index]) return true;
		return match.route.id !== currentMatches[index].route.id;
	};
	let matchPathChanged = (match, index) => {
		return currentMatches[index].pathname !== match.pathname || currentMatches[index].route.path?.endsWith("*") && currentMatches[index].params["*"] !== match.params["*"];
	};
	if (mode === "assets") return nextMatches.filter((match, index) => isNew(match, index) || matchPathChanged(match, index));
	if (mode === "data") return nextMatches.filter((match, index) => {
		let manifestRoute = manifest.routes[match.route.id];
		if (!manifestRoute || !manifestRoute.hasLoader) return false;
		if (isNew(match, index) || matchPathChanged(match, index)) return true;
		if (match.route.shouldRevalidate) {
			let routeChoice = match.route.shouldRevalidate({
				currentUrl: new URL(location.pathname + location.search + location.hash, window.origin),
				currentParams: currentMatches[0]?.params || {},
				nextUrl: new URL(page, window.origin),
				nextParams: match.params,
				defaultShouldRevalidate: true
			});
			if (typeof routeChoice === "boolean") return routeChoice;
		}
		return true;
	});
	return [];
}
function getModuleLinkHrefs(matches, manifest, { includeHydrateFallback } = {}) {
	return dedupeHrefs(matches.map((match) => {
		let route = manifest.routes[match.route.id];
		if (!route) return [];
		let hrefs = [route.module];
		if (route.clientActionModule) hrefs = hrefs.concat(route.clientActionModule);
		if (route.clientLoaderModule) hrefs = hrefs.concat(route.clientLoaderModule);
		if (includeHydrateFallback && route.hydrateFallbackModule) hrefs = hrefs.concat(route.hydrateFallbackModule);
		if (route.imports) hrefs = hrefs.concat(route.imports);
		return hrefs;
	}).flat(1));
}
function dedupeHrefs(hrefs) {
	return [...new Set(hrefs)];
}
function sortKeys(obj) {
	let sorted = {};
	let keys = Object.keys(obj).sort();
	for (let key of keys) sorted[key] = obj[key];
	return sorted;
}
function dedupeLinkDescriptors(descriptors, preloads) {
	let set = /* @__PURE__ */ new Set();
	let preloadsSet = new Set(preloads);
	return descriptors.reduce((deduped, descriptor) => {
		if (preloads && !isPageLinkDescriptor(descriptor) && descriptor.as === "script" && descriptor.href && preloadsSet.has(descriptor.href)) return deduped;
		let key = JSON.stringify(sortKeys(descriptor));
		if (!set.has(key)) {
			set.add(key);
			deduped.push({
				key,
				link: descriptor
			});
		}
		return deduped;
	}, []);
}
function isPreloadSupported() {
	if (_isPreloadSupported !== void 0) return _isPreloadSupported;
	let el = document.createElement("link");
	_isPreloadSupported = el.relList.supports("preload");
	el = null;
	return _isPreloadSupported;
}
function RemixRootDefaultHydrateFallback() {
	let { nonce } = useFrameworkContext();
	return /* @__PURE__ */ React.createElement(BoundaryShell, {
		title: "Loading...",
		renderScripts: true
	}, /* @__PURE__ */ React.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `
              console.log(
                "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this " +
                "when your app is loading JS modules and/or running \`clientLoader\` " +
                "functions. Check out https://reactrouter.com/start/framework/route-module#hydratefallback " +
                "for more information."
              );
            ` }
	}));
}
function groupRoutesByParentId$1(manifest) {
	let routes = {};
	Object.values(manifest).forEach((route) => {
		if (route) {
			let parentId = route.parentId || "";
			if (!routes[parentId]) routes[parentId] = [];
			routes[parentId].push(route);
		}
	});
	return routes;
}
function getRouteComponents(route, routeModule, isSpaMode) {
	let Component4 = getRouteModuleComponent(routeModule);
	let HydrateFallback = routeModule.HydrateFallback && (!isSpaMode || route.id === "root") ? routeModule.HydrateFallback : route.id === "root" ? RemixRootDefaultHydrateFallback : void 0;
	let ErrorBoundary = routeModule.ErrorBoundary ? routeModule.ErrorBoundary : route.id === "root" ? () => /* @__PURE__ */ React.createElement(RemixRootDefaultErrorBoundary, { error: useRouteError() }) : void 0;
	if (route.id === "root" && routeModule.Layout) return {
		...Component4 ? { element: /* @__PURE__ */ React.createElement(routeModule.Layout, null, /* @__PURE__ */ React.createElement(Component4, null)) } : { Component: Component4 },
		...ErrorBoundary ? { errorElement: /* @__PURE__ */ React.createElement(routeModule.Layout, null, /* @__PURE__ */ React.createElement(ErrorBoundary, null)) } : { ErrorBoundary },
		...HydrateFallback ? { hydrateFallbackElement: /* @__PURE__ */ React.createElement(routeModule.Layout, null, /* @__PURE__ */ React.createElement(HydrateFallback, null)) } : { HydrateFallback }
	};
	return {
		Component: Component4,
		ErrorBoundary,
		HydrateFallback
	};
}
function createServerRoutes(manifest, routeModules, future, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId$1(manifest), spaModeLazyPromise = Promise.resolve({ Component: () => null })) {
	return (routesByParentId[parentId] || []).map((route) => {
		let routeModule = routeModules[route.id];
		invariant2(routeModule, "No `routeModule` available to create server routes");
		let dataRoute = {
			...getRouteComponents(route, routeModule, isSpaMode),
			caseSensitive: route.caseSensitive,
			id: route.id,
			index: route.index,
			path: route.path,
			handle: routeModule.handle,
			lazy: isSpaMode ? () => spaModeLazyPromise : void 0,
			loader: route.hasLoader || route.hasClientLoader ? () => null : void 0
		};
		let children = createServerRoutes(manifest, routeModules, future, isSpaMode, route.id, routesByParentId, spaModeLazyPromise);
		if (children.length > 0) dataRoute.children = children;
		return dataRoute;
	});
}
function createClientRoutesWithHMRRevalidationOptOut(needsRevalidation, manifest, routeModulesCache, initialState, ssr, isSpaMode) {
	return createClientRoutes(manifest, routeModulesCache, initialState, ssr, isSpaMode, "", groupRoutesByParentId$1(manifest), needsRevalidation);
}
function preventInvalidServerHandlerCall$1(type, route) {
	if (type === "loader" && !route.hasLoader || type === "action" && !route.hasAction) {
		let msg = `You are trying to call ${type === "action" ? "serverAction()" : "serverLoader()"} on a route that does not have a server ${type} (routeId: "${route.id}")`;
		console.error(msg);
		throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
	}
}
function noActionDefinedError(type, routeId) {
	let article = type === "clientAction" ? "a" : "an";
	let msg = `Route "${routeId}" does not have ${article} ${type}, but you are trying to submit to it. To fix this, please add ${article} \`${type}\` function to the route`;
	console.error(msg);
	throw new ErrorResponseImpl(405, "Method Not Allowed", new Error(msg), true);
}
function createClientRoutes(manifest, routeModulesCache, initialState, ssr, isSpaMode, parentId = "", routesByParentId = groupRoutesByParentId$1(manifest), needsRevalidation) {
	return (routesByParentId[parentId] || []).map((route) => {
		let routeModule = routeModulesCache[route.id];
		function fetchServerHandler(singleFetch) {
			invariant2(typeof singleFetch === "function", "No single fetch function available for route handler");
			return singleFetch();
		}
		function fetchServerLoader(singleFetch) {
			if (!route.hasLoader) return Promise.resolve(null);
			return fetchServerHandler(singleFetch);
		}
		function fetchServerAction(singleFetch) {
			if (!route.hasAction) throw noActionDefinedError("action", route.id);
			return fetchServerHandler(singleFetch);
		}
		function prefetchModule(modulePath) {
			import(
				/* @vite-ignore */
				/* webpackIgnore: true */
				modulePath
);
		}
		function prefetchRouteModuleChunks(route2) {
			if (route2.clientActionModule) prefetchModule(route2.clientActionModule);
			if (route2.clientLoaderModule) prefetchModule(route2.clientLoaderModule);
		}
		async function prefetchStylesAndCallHandler(handler) {
			let cachedModule = routeModulesCache[route.id];
			let linkPrefetchPromise = cachedModule ? prefetchStyleLinks(route, cachedModule) : Promise.resolve();
			try {
				return handler();
			} finally {
				await linkPrefetchPromise;
			}
		}
		let dataRoute = {
			id: route.id,
			index: route.index,
			path: route.path
		};
		if (routeModule) {
			Object.assign(dataRoute, {
				...dataRoute,
				...getRouteComponents(route, routeModule, isSpaMode),
				middleware: routeModule.clientMiddleware,
				handle: routeModule.handle,
				shouldRevalidate: getShouldRevalidateFunction(dataRoute.path, routeModule, route, ssr, needsRevalidation)
			});
			let hasInitialData = initialState && initialState.loaderData && route.id in initialState.loaderData;
			let initialData = hasInitialData ? initialState?.loaderData?.[route.id] : void 0;
			let hasInitialError = initialState && initialState.errors && route.id in initialState.errors;
			let initialError = hasInitialError ? initialState?.errors?.[route.id] : void 0;
			let isHydrationRequest = needsRevalidation == null && (routeModule.clientLoader?.hydrate === true || !route.hasLoader);
			dataRoute.loader = async ({ request, params, context, pattern, url }, singleFetch) => {
				let _isHydrationRequest = isHydrationRequest;
				isHydrationRequest = false;
				return await prefetchStylesAndCallHandler(async () => {
					invariant2(routeModule, "No `routeModule` available for critical-route loader");
					if (!routeModule.clientLoader) return fetchServerLoader(singleFetch);
					return routeModule.clientLoader({
						request,
						params,
						context,
						pattern,
						url,
						async serverLoader() {
							preventInvalidServerHandlerCall$1("loader", route);
							if (_isHydrationRequest) {
								if (hasInitialData) return initialData;
								if (hasInitialError) throw initialError;
							}
							return fetchServerLoader(singleFetch);
						}
					});
				});
			};
			dataRoute.loader.hydrate = shouldHydrateRouteLoader(route.id, routeModule.clientLoader, route.hasLoader, isSpaMode);
			dataRoute.action = ({ request, params, context, pattern, url }, singleFetch) => {
				return prefetchStylesAndCallHandler(async () => {
					invariant2(routeModule, "No `routeModule` available for critical-route action");
					if (!routeModule.clientAction) {
						if (isSpaMode) throw noActionDefinedError("clientAction", route.id);
						return fetchServerAction(singleFetch);
					}
					return routeModule.clientAction({
						request,
						params,
						context,
						pattern,
						url,
						async serverAction() {
							preventInvalidServerHandlerCall$1("action", route);
							return fetchServerAction(singleFetch);
						}
					});
				});
			};
		} else {
			if (!route.hasClientLoader) dataRoute.loader = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
				return fetchServerLoader(singleFetch);
			});
			if (!route.hasClientAction) dataRoute.action = (_, singleFetch) => prefetchStylesAndCallHandler(() => {
				if (isSpaMode) throw noActionDefinedError("clientAction", route.id);
				return fetchServerAction(singleFetch);
			});
			let lazyRoutePromise;
			async function getLazyRoute() {
				if (lazyRoutePromise) return await lazyRoutePromise;
				lazyRoutePromise = (async () => {
					if (route.clientLoaderModule || route.clientActionModule) await new Promise((resolve) => setTimeout(resolve, 0));
					let routeModulePromise = loadRouteModuleWithBlockingLinks(route, routeModulesCache);
					prefetchRouteModuleChunks(route);
					return await routeModulePromise;
				})();
				return await lazyRoutePromise;
			}
			dataRoute.lazy = {
				loader: route.hasClientLoader ? async () => {
					let { clientLoader } = route.clientLoaderModule ? await import(
						/* @vite-ignore */
						/* webpackIgnore: true */
						route.clientLoaderModule
) : await getLazyRoute();
					invariant2(clientLoader, "No `clientLoader` export found");
					return (args, singleFetch) => clientLoader({
						...args,
						async serverLoader() {
							preventInvalidServerHandlerCall$1("loader", route);
							return fetchServerLoader(singleFetch);
						}
					});
				} : void 0,
				action: route.hasClientAction ? async () => {
					let clientActionPromise = route.clientActionModule ? import(
						/* @vite-ignore */
						/* webpackIgnore: true */
						route.clientActionModule
) : getLazyRoute();
					prefetchRouteModuleChunks(route);
					let { clientAction } = await clientActionPromise;
					invariant2(clientAction, "No `clientAction` export found");
					return (args, singleFetch) => clientAction({
						...args,
						async serverAction() {
							preventInvalidServerHandlerCall$1("action", route);
							return fetchServerAction(singleFetch);
						}
					});
				} : void 0,
				middleware: route.hasClientMiddleware ? async () => {
					let { clientMiddleware } = route.clientMiddlewareModule ? await import(
						/* @vite-ignore */
						/* webpackIgnore: true */
						route.clientMiddlewareModule
) : await getLazyRoute();
					invariant2(clientMiddleware, "No `clientMiddleware` export found");
					return clientMiddleware;
				} : void 0,
				shouldRevalidate: async () => {
					let lazyRoute = await getLazyRoute();
					return getShouldRevalidateFunction(dataRoute.path, lazyRoute, route, ssr, needsRevalidation);
				},
				handle: async () => (await getLazyRoute()).handle,
				Component: async () => (await getLazyRoute()).Component,
				ErrorBoundary: route.hasErrorBoundary ? async () => (await getLazyRoute()).ErrorBoundary : void 0
			};
		}
		let children = createClientRoutes(manifest, routeModulesCache, initialState, ssr, isSpaMode, route.id, routesByParentId, needsRevalidation);
		if (children.length > 0) dataRoute.children = children;
		return dataRoute;
	});
}
function getShouldRevalidateFunction(path, route, manifestRoute, ssr, needsRevalidation) {
	if (needsRevalidation) return wrapShouldRevalidateForHdr(manifestRoute.id, route.shouldRevalidate, needsRevalidation);
	if (!ssr && manifestRoute.hasLoader && !manifestRoute.hasClientLoader) {
		let myParams = path ? compilePath(path)[1].map((p) => p.paramName) : [];
		const didParamsChange = (opts) => myParams.some((p) => opts.currentParams[p] !== opts.nextParams[p]);
		if (route.shouldRevalidate) {
			let fn = route.shouldRevalidate;
			return (opts) => fn({
				...opts,
				defaultShouldRevalidate: didParamsChange(opts)
			});
		} else return (opts) => didParamsChange(opts);
	}
	return route.shouldRevalidate;
}
function wrapShouldRevalidateForHdr(routeId, routeShouldRevalidate, needsRevalidation) {
	let handledRevalidation = false;
	return (arg) => {
		if (!handledRevalidation) {
			handledRevalidation = true;
			return needsRevalidation.has(routeId);
		}
		return routeShouldRevalidate ? routeShouldRevalidate(arg) : arg.defaultShouldRevalidate;
	};
}
async function loadRouteModuleWithBlockingLinks(route, routeModules) {
	let routeModulePromise = loadRouteModule(route, routeModules);
	let prefetchRouteCssPromise = prefetchRouteCss(route);
	let routeModule = await routeModulePromise;
	await Promise.all([prefetchRouteCssPromise, prefetchStyleLinks(route, routeModule)]);
	return {
		Component: getRouteModuleComponent(routeModule),
		ErrorBoundary: routeModule.ErrorBoundary,
		clientMiddleware: routeModule.clientMiddleware,
		clientAction: routeModule.clientAction,
		clientLoader: routeModule.clientLoader,
		handle: routeModule.handle,
		links: routeModule.links,
		meta: routeModule.meta,
		shouldRevalidate: routeModule.shouldRevalidate
	};
}
function getRouteModuleComponent(routeModule) {
	if (routeModule.default == null) return void 0;
	if (!(typeof routeModule.default === "object" && Object.keys(routeModule.default).length === 0)) return routeModule.default;
}
function shouldHydrateRouteLoader(routeId, clientLoader, hasLoader, isSpaMode) {
	return isSpaMode && routeId !== "root" || clientLoader != null && (clientLoader.hydrate === true || hasLoader !== true);
}
function getPathsWithAncestors(paths) {
	let result = /* @__PURE__ */ new Set();
	paths.forEach((path) => {
		if (!path.startsWith("/")) path = `/${path}`;
		for (let i = 1; i < path.length; i++) if (path[i] === "/") result.add(path.slice(0, i));
		result.add(path);
	});
	return Array.from(result);
}
function isFogOfWarEnabled(routeDiscovery, ssr) {
	return routeDiscovery.mode === "lazy" && ssr === true;
}
function getPartialManifest({ sri, ...manifest }, router) {
	let routeIds = new Set(router.state.matches.map((m) => m.route.id));
	let segments = router.state.location.pathname.split("/").filter(Boolean);
	let paths = ["/"];
	segments.pop();
	while (segments.length > 0) {
		paths.push(`/${segments.join("/")}`);
		segments.pop();
	}
	paths.forEach((path) => {
		let matches = matchRoutesImpl(router.routes, path, router.basename || "/", false, router.branches);
		if (matches) matches.forEach((m) => routeIds.add(m.route.id));
	});
	let initialRoutes = [...routeIds].reduce((acc, id) => Object.assign(acc, { [id]: manifest.routes[id] }), {});
	return {
		...manifest,
		routes: initialRoutes,
		sri: sri ? true : void 0
	};
}
function getPatchRoutesOnNavigationFunction(getRouter, manifest, routeModules, ssr, routeDiscovery, isSpaMode, basename) {
	if (!isFogOfWarEnabled(routeDiscovery, ssr)) return;
	return async ({ path, patch, signal, fetcherKey }) => {
		if (discoveredPaths$1.has(path)) return;
		let { state } = getRouter();
		await fetchAndApplyManifestPatches$1([path], fetcherKey ? window.location.href : createPath(state.navigation.location || state.location), manifest, routeModules, ssr, isSpaMode, basename, routeDiscovery.manifestPath, patch, signal);
	};
}
function useFogOFWarDiscovery(router, manifest, routeModules, ssr, routeDiscovery, isSpaMode) {
	React.useEffect(() => {
		if (!isFogOfWarEnabled(routeDiscovery, ssr) || window.navigator?.connection?.saveData === true) return;
		function registerElement(el) {
			let path = el.tagName === "FORM" ? el.getAttribute("action") : el.getAttribute("href");
			if (!path) return;
			let pathname = el.tagName === "A" ? el.pathname : new URL(path, window.location.origin).pathname;
			if (!discoveredPaths$1.has(pathname)) nextPaths$1.add(pathname);
		}
		async function fetchPatches() {
			document.querySelectorAll("a[data-discover], form[data-discover]").forEach(registerElement);
			let lazyPaths = Array.from(nextPaths$1.keys()).filter((path) => {
				if (discoveredPaths$1.has(path)) {
					nextPaths$1.delete(path);
					return false;
				}
				return true;
			});
			if (lazyPaths.length === 0) return;
			try {
				await fetchAndApplyManifestPatches$1(lazyPaths, null, manifest, routeModules, ssr, isSpaMode, router.basename, routeDiscovery.manifestPath, router.patchRoutes);
			} catch (e) {
				console.error("Failed to fetch manifest patches", e);
			}
		}
		let debouncedFetchPatches = debounce$1(fetchPatches, 100);
		fetchPatches();
		let observer = new MutationObserver(() => debouncedFetchPatches());
		observer.observe(document.documentElement, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [
				"data-discover",
				"href",
				"action"
			]
		});
		return () => observer.disconnect();
	}, [
		ssr,
		isSpaMode,
		manifest,
		routeModules,
		router,
		routeDiscovery
	]);
}
function getManifestPath(_manifestPath, basename) {
	let manifestPath = _manifestPath || "/__manifest";
	return basename == null ? manifestPath : joinPaths([basename, manifestPath]);
}
async function fetchAndApplyManifestPatches$1(paths, errorReloadPath, manifest, routeModules, ssr, isSpaMode, basename, manifestPath, patchRoutes, signal) {
	paths = getPathsWithAncestors(paths);
	const searchParams = new URLSearchParams();
	searchParams.set("paths", paths.sort().join(","));
	searchParams.set("version", manifest.version);
	let url = new URL(getManifestPath(manifestPath, basename), window.location.origin);
	url.search = searchParams.toString();
	if (url.toString().length > 7680) {
		nextPaths$1.clear();
		return;
	}
	let serverPatches;
	try {
		let res = await fetch(url, { signal });
		if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
		else if (res.status === 204 && res.headers.has("X-Remix-Reload-Document")) {
			if (!errorReloadPath) {
				console.warn("Detected a manifest version mismatch during eager route discovery. The next navigation/fetch to an undiscovered route will result in a new document navigation to sync up with the latest manifest.");
				return;
			}
			try {
				if (sessionStorage.getItem(MANIFEST_VERSION_STORAGE_KEY) === manifest.version) {
					console.error("Unable to discover routes due to manifest version mismatch.");
					return;
				}
				sessionStorage.setItem(MANIFEST_VERSION_STORAGE_KEY, manifest.version);
			} catch {}
			window.location.href = errorReloadPath;
			console.warn("Detected manifest version mismatch, reloading...");
			await new Promise(() => {});
		} else if (res.status >= 400) throw new Error(await res.text());
		try {
			sessionStorage.removeItem(MANIFEST_VERSION_STORAGE_KEY);
		} catch {}
		serverPatches = await res.json();
	} catch (e) {
		if (signal?.aborted) return;
		throw e;
	}
	let knownRoutes = new Set(Object.keys(manifest.routes));
	let patches = Object.values(serverPatches).reduce((acc, route) => {
		if (route && !knownRoutes.has(route.id)) acc[route.id] = route;
		return acc;
	}, {});
	Object.assign(manifest.routes, patches);
	paths.forEach((p) => addToFifoQueue$1(p, discoveredPaths$1));
	let parentIds = /* @__PURE__ */ new Set();
	Object.values(patches).forEach((patch) => {
		if (patch && (!patch.parentId || !patches[patch.parentId])) parentIds.add(patch.parentId);
	});
	parentIds.forEach((parentId) => patchRoutes(parentId || null, createClientRoutes(patches, routeModules, null, ssr, isSpaMode, parentId)));
}
function addToFifoQueue$1(path, queue) {
	if (queue.size >= discoveredPathsMaxSize$1) {
		let first = queue.values().next().value;
		queue.delete(first);
	}
	queue.add(path);
}
function debounce$1(callback, wait) {
	let timeoutId;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => callback(...args), wait);
	};
}
function useDataRouterContext2() {
	let context = React.useContext(DataRouterContext);
	invariant2(context, "You must render this element inside a <DataRouterContext.Provider> element");
	return context;
}
function useDataRouterStateContext() {
	let context = React.useContext(DataRouterStateContext);
	invariant2(context, "You must render this element inside a <DataRouterStateContext.Provider> element");
	return context;
}
function useFrameworkContext() {
	let context = React.useContext(FrameworkContext);
	invariant2(context, "You must render this element inside a <HydratedRouter> element");
	return context;
}
function usePrefetchBehavior(prefetch, theirElementProps) {
	let frameworkContext = React.useContext(FrameworkContext);
	let [maybePrefetch, setMaybePrefetch] = React.useState(false);
	let [shouldPrefetch, setShouldPrefetch] = React.useState(false);
	let { onFocus, onBlur, onMouseEnter, onMouseLeave, onTouchStart } = theirElementProps;
	let ref = React.useRef(null);
	React.useEffect(() => {
		if (prefetch === "render") setShouldPrefetch(true);
		if (prefetch === "viewport") {
			let callback = (entries) => {
				entries.forEach((entry) => {
					setShouldPrefetch(entry.isIntersecting);
				});
			};
			let observer = new IntersectionObserver(callback, { threshold: .5 });
			if (ref.current) observer.observe(ref.current);
			return () => {
				observer.disconnect();
			};
		}
	}, [prefetch]);
	React.useEffect(() => {
		if (maybePrefetch) {
			let id = setTimeout(() => {
				setShouldPrefetch(true);
			}, 100);
			return () => {
				clearTimeout(id);
			};
		}
	}, [maybePrefetch]);
	let setIntent = () => {
		setMaybePrefetch(true);
	};
	let cancelIntent = () => {
		setMaybePrefetch(false);
		setShouldPrefetch(false);
	};
	if (!frameworkContext) return [
		false,
		ref,
		{}
	];
	if (prefetch !== "intent") return [
		shouldPrefetch,
		ref,
		{}
	];
	return [
		shouldPrefetch,
		ref,
		{
			onFocus: composeEventHandlers(onFocus, setIntent),
			onBlur: composeEventHandlers(onBlur, cancelIntent),
			onMouseEnter: composeEventHandlers(onMouseEnter, setIntent),
			onMouseLeave: composeEventHandlers(onMouseLeave, cancelIntent),
			onTouchStart: composeEventHandlers(onTouchStart, setIntent)
		}
	];
}
function composeEventHandlers(theirHandler, ourHandler) {
	return (event) => {
		theirHandler && theirHandler(event);
		if (!event.defaultPrevented) ourHandler(event);
	};
}
function getActiveMatches(matches, errors, isSpaMode) {
	if (isSpaMode && !isHydrated) return [matches[0]];
	if (errors) {
		let errorIdx = matches.findIndex((m) => errors[m.route.id] !== void 0);
		return matches.slice(0, errorIdx + 1);
	}
	return matches;
}
function Links({ nonce, crossOrigin }) {
	let { isSpaMode, manifest, routeModules, criticalCss, nonce: contextNonce } = useFrameworkContext();
	let { errors, matches: routerMatches } = useDataRouterStateContext();
	let matches = getActiveMatches(routerMatches, errors, isSpaMode);
	let keyedLinks = React.useMemo(() => getKeyedLinksForMatches(matches, routeModules, manifest), [
		matches,
		routeModules,
		manifest
	]);
	if (nonce == null && contextNonce) nonce = contextNonce;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, typeof criticalCss === "string" ? /* @__PURE__ */ React.createElement("style", {
		[CRITICAL_CSS_DATA_ATTRIBUTE]: "",
		nonce,
		dangerouslySetInnerHTML: { __html: criticalCss }
	}) : null, typeof criticalCss === "object" ? /* @__PURE__ */ React.createElement("link", {
		[CRITICAL_CSS_DATA_ATTRIBUTE]: "",
		rel: "stylesheet",
		href: criticalCss.href,
		nonce,
		crossOrigin
	}) : null, keyedLinks.map(({ key, link }) => isPageLinkDescriptor(link) ? /* @__PURE__ */ React.createElement(PrefetchPageLinks, {
		key,
		nonce,
		...link,
		crossOrigin: link.crossOrigin ?? crossOrigin
	}) : /* @__PURE__ */ React.createElement("link", {
		key,
		nonce,
		...link,
		crossOrigin: link.crossOrigin ?? crossOrigin
	})));
}
function PrefetchPageLinks({ page, ...linkProps }) {
	let rsc = useIsRSCRouterContext();
	let { nonce: contextNonce } = useFrameworkContext();
	let { router } = useDataRouterContext2();
	let matches = React.useMemo(() => matchRoutes(router.routes, page, router.basename), [
		router.routes,
		page,
		router.basename
	]);
	if (!matches) return null;
	if (linkProps.nonce == null && contextNonce) linkProps = {
		...linkProps,
		nonce: contextNonce
	};
	if (rsc) return /* @__PURE__ */ React.createElement(RSCPrefetchPageLinksImpl, {
		page,
		matches,
		...linkProps
	});
	return /* @__PURE__ */ React.createElement(PrefetchPageLinksImpl, {
		page,
		matches,
		...linkProps
	});
}
function useKeyedPrefetchLinks(matches) {
	let { manifest, routeModules } = useFrameworkContext();
	let [keyedPrefetchLinks, setKeyedPrefetchLinks] = React.useState([]);
	React.useEffect(() => {
		let interrupted = false;
		getKeyedPrefetchLinks(matches, manifest, routeModules).then((links) => {
			if (!interrupted) setKeyedPrefetchLinks(links);
		});
		return () => {
			interrupted = true;
		};
	}, [
		matches,
		manifest,
		routeModules
	]);
	return keyedPrefetchLinks;
}
function RSCPrefetchPageLinksImpl({ page, matches: nextMatches, ...linkProps }) {
	let location = useLocation$2();
	let { future } = useFrameworkContext();
	let { basename } = useDataRouterContext2();
	let dataHrefs = React.useMemo(() => {
		if (page === location.pathname + location.search + location.hash) return [];
		let url = singleFetchUrl(page, basename, future.v8_trailingSlashAwareDataRequests, "rsc");
		let hasSomeRoutesWithShouldRevalidate = false;
		let targetRoutes = [];
		for (let match of nextMatches) if (typeof match.route.shouldRevalidate === "function") hasSomeRoutesWithShouldRevalidate = true;
		else targetRoutes.push(match.route.id);
		if (hasSomeRoutesWithShouldRevalidate && targetRoutes.length > 0) url.searchParams.set("_routes", targetRoutes.join(","));
		return [url.pathname + url.search];
	}, [
		basename,
		future.v8_trailingSlashAwareDataRequests,
		page,
		location,
		nextMatches
	]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React.createElement("link", {
		key: href,
		rel: "prefetch",
		as: "fetch",
		href,
		...linkProps
	})));
}
function PrefetchPageLinksImpl({ page, matches: nextMatches, ...linkProps }) {
	let location = useLocation$2();
	let { future, manifest, routeModules } = useFrameworkContext();
	let { basename } = useDataRouterContext2();
	let { loaderData, matches } = useDataRouterStateContext();
	let newMatchesForData = React.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "data"), [
		page,
		nextMatches,
		matches,
		manifest,
		location
	]);
	let newMatchesForAssets = React.useMemo(() => getNewMatchesForLinks(page, nextMatches, matches, manifest, location, "assets"), [
		page,
		nextMatches,
		matches,
		manifest,
		location
	]);
	let dataHrefs = React.useMemo(() => {
		if (page === location.pathname + location.search + location.hash) return [];
		let routesParams = /* @__PURE__ */ new Set();
		let foundOptOutRoute = false;
		nextMatches.forEach((m) => {
			let manifestRoute = manifest.routes[m.route.id];
			if (!manifestRoute || !manifestRoute.hasLoader) return;
			if (!newMatchesForData.some((m2) => m2.route.id === m.route.id) && m.route.id in loaderData && routeModules[m.route.id]?.shouldRevalidate) foundOptOutRoute = true;
			else if (manifestRoute.hasClientLoader) foundOptOutRoute = true;
			else routesParams.add(m.route.id);
		});
		if (routesParams.size === 0) return [];
		let url = singleFetchUrl(page, basename, future.v8_trailingSlashAwareDataRequests, "data");
		if (foundOptOutRoute && routesParams.size > 0) url.searchParams.set("_routes", nextMatches.filter((m) => routesParams.has(m.route.id)).map((m) => m.route.id).join(","));
		return [url.pathname + url.search];
	}, [
		basename,
		future.v8_trailingSlashAwareDataRequests,
		loaderData,
		location,
		manifest,
		newMatchesForData,
		nextMatches,
		page,
		routeModules
	]);
	let moduleHrefs = React.useMemo(() => getModuleLinkHrefs(newMatchesForAssets, manifest), [newMatchesForAssets, manifest]);
	let keyedPrefetchLinks = useKeyedPrefetchLinks(newMatchesForAssets);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, dataHrefs.map((href) => /* @__PURE__ */ React.createElement("link", {
		key: href,
		rel: "prefetch",
		as: "fetch",
		href,
		...linkProps
	})), moduleHrefs.map((href) => /* @__PURE__ */ React.createElement("link", {
		key: href,
		rel: "modulepreload",
		href,
		...linkProps
	})), keyedPrefetchLinks.map(({ key, link }) => /* @__PURE__ */ React.createElement("link", {
		key,
		nonce: linkProps.nonce,
		...link,
		crossOrigin: link.crossOrigin ?? linkProps.crossOrigin
	})));
}
function Meta() {
	let { isSpaMode, routeModules } = useFrameworkContext();
	let { errors, matches: routerMatches, loaderData } = useDataRouterStateContext();
	let location = useLocation$2();
	let _matches = getActiveMatches(routerMatches, errors, isSpaMode);
	let error = null;
	if (errors) error = errors[_matches[_matches.length - 1].route.id];
	let meta = [];
	let leafMeta = null;
	let matches = [];
	for (let i = 0; i < _matches.length; i++) {
		let _match = _matches[i];
		let routeId = _match.route.id;
		let data2 = loaderData[routeId];
		let params = _match.params;
		let routeModule = routeModules[routeId];
		let routeMeta = [];
		let match = {
			id: routeId,
			data: data2,
			loaderData: data2,
			meta: [],
			params: _match.params,
			pathname: _match.pathname,
			handle: _match.route.handle,
			error
		};
		matches[i] = match;
		if (routeModule?.meta) routeMeta = typeof routeModule.meta === "function" ? routeModule.meta({
			data: data2,
			loaderData: data2,
			params,
			location,
			matches,
			error
		}) : Array.isArray(routeModule.meta) ? [...routeModule.meta] : routeModule.meta;
		else if (leafMeta) routeMeta = [...leafMeta];
		routeMeta = routeMeta || [];
		if (!Array.isArray(routeMeta)) throw new Error("The route at " + _match.route.path + " returns an invalid value. All route meta functions must return an array of meta objects.\n\nTo reference the meta function API, see https://reactrouter.com/start/framework/route-module#meta");
		match.meta = routeMeta;
		matches[i] = match;
		meta = [...routeMeta];
		leafMeta = meta;
	}
	return /* @__PURE__ */ React.createElement(React.Fragment, null, meta.flat().map((metaProps) => {
		if (!metaProps) return null;
		if ("tagName" in metaProps) {
			let { tagName, ...rest } = metaProps;
			if (!isValidMetaTag(tagName)) {
				console.warn(`A meta object uses an invalid tagName: ${tagName}. Expected either 'link' or 'meta'`);
				return null;
			}
			let Comp = tagName;
			return /* @__PURE__ */ React.createElement(Comp, {
				key: JSON.stringify(rest),
				...rest
			});
		}
		if ("title" in metaProps) return /* @__PURE__ */ React.createElement("title", { key: "title" }, String(metaProps.title));
		if ("charset" in metaProps) {
			metaProps.charSet ?? (metaProps.charSet = metaProps.charset);
			delete metaProps.charset;
		}
		if ("charSet" in metaProps && metaProps.charSet != null) return typeof metaProps.charSet === "string" ? /* @__PURE__ */ React.createElement("meta", {
			key: "charSet",
			charSet: metaProps.charSet
		}) : null;
		if ("script:ld+json" in metaProps) try {
			let json = JSON.stringify(metaProps["script:ld+json"]);
			return /* @__PURE__ */ React.createElement("script", {
				key: `script:ld+json:${json}`,
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: escapeHtml(json) }
			});
		} catch (e) {
			return null;
		}
		return /* @__PURE__ */ React.createElement("meta", {
			key: JSON.stringify(metaProps),
			...metaProps
		});
	}));
}
function isValidMetaTag(tagName) {
	return typeof tagName === "string" && /^(meta|link)$/.test(tagName);
}
function setIsHydrated() {
	isHydrated = true;
}
function Scripts(scriptProps) {
	let { manifest, serverHandoffString, isSpaMode, renderMeta, routeDiscovery, ssr, nonce: contextNonce } = useFrameworkContext();
	let { router, static: isStatic, staticContext } = useDataRouterContext2();
	let { matches: routerMatches } = useDataRouterStateContext();
	let isRSCRouterContext = useIsRSCRouterContext();
	let enableFogOfWar = isFogOfWarEnabled(routeDiscovery, ssr);
	if (scriptProps.nonce == null && contextNonce) scriptProps = {
		...scriptProps,
		nonce: contextNonce
	};
	if (renderMeta) renderMeta.didRenderScripts = true;
	let matches = getActiveMatches(routerMatches, null, isSpaMode);
	React.useEffect(() => {
		setIsHydrated();
	}, []);
	let initialScripts = React.useMemo(() => {
		if (isRSCRouterContext) return null;
		let contextScript = staticContext ? `window.__reactRouterContext = ${serverHandoffString};window.__reactRouterContext.stream = new ReadableStream({start(controller){window.__reactRouterContext.streamController = controller;}}).pipeThrough(new TextEncoderStream());` : " ";
		let routeModulesScript = !isStatic ? " " : `${manifest.hmr?.runtime ? `import ${JSON.stringify(manifest.hmr.runtime)};` : ""}${!enableFogOfWar ? `import ${JSON.stringify(manifest.url)}` : ""};
${matches.map((match, routeIndex) => {
			let routeVarName = `route${routeIndex}`;
			let manifestEntry = manifest.routes[match.route.id];
			invariant2(manifestEntry, `Route ${match.route.id} not found in manifest`);
			let { clientActionModule, clientLoaderModule, clientMiddlewareModule, hydrateFallbackModule, module } = manifestEntry;
			let chunks = [
				...clientActionModule ? [{
					module: clientActionModule,
					varName: `${routeVarName}_clientAction`
				}] : [],
				...clientLoaderModule ? [{
					module: clientLoaderModule,
					varName: `${routeVarName}_clientLoader`
				}] : [],
				...clientMiddlewareModule ? [{
					module: clientMiddlewareModule,
					varName: `${routeVarName}_clientMiddleware`
				}] : [],
				...hydrateFallbackModule ? [{
					module: hydrateFallbackModule,
					varName: `${routeVarName}_HydrateFallback`
				}] : [],
				{
					module,
					varName: `${routeVarName}_main`
				}
			];
			if (chunks.length === 1) return `import * as ${routeVarName} from ${JSON.stringify(module)};`;
			return [chunks.map((chunk) => `import * as ${chunk.varName} from "${chunk.module}";`).join("\n"), `const ${routeVarName} = {${chunks.map((chunk) => `...${chunk.varName}`).join(",")}};`].join("\n");
		}).join("\n")}
  ${enableFogOfWar ? `window.__reactRouterManifest = ${JSON.stringify(getPartialManifest(manifest, router), null, 2)};` : ""}
  window.__reactRouterRouteModules = {${matches.map((match, index) => `${JSON.stringify(match.route.id)}:route${index}`).join(",")}};

import(${JSON.stringify(manifest.entry.module)});`;
		return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", {
			...scriptProps,
			suppressHydrationWarning: true,
			dangerouslySetInnerHTML: { __html: contextScript },
			type: void 0
		}), /* @__PURE__ */ React.createElement("script", {
			...scriptProps,
			suppressHydrationWarning: true,
			dangerouslySetInnerHTML: { __html: routeModulesScript },
			type: "module",
			async: true
		}));
	}, []);
	let preloads = isHydrated || isRSCRouterContext ? [] : [...new Set(manifest.entry.imports.concat(getModuleLinkHrefs(matches, manifest, { includeHydrateFallback: true })))];
	let sri = typeof manifest.sri === "object" ? manifest.sri : {};
	warnOnce(!isRSCRouterContext, "The <Scripts /> element is a no-op when using RSC and can be safely removed.");
	return isHydrated || isRSCRouterContext ? null : /* @__PURE__ */ React.createElement(React.Fragment, null, typeof manifest.sri === "object" ? /* @__PURE__ */ React.createElement("script", {
		...scriptProps,
		"rr-importmap": "",
		type: "importmap",
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: JSON.stringify({ integrity: sri }) }
	}) : null, !enableFogOfWar ? /* @__PURE__ */ React.createElement("link", {
		rel: "modulepreload",
		href: manifest.url,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[manifest.url],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	}) : null, /* @__PURE__ */ React.createElement("link", {
		rel: "modulepreload",
		href: manifest.entry.module,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[manifest.entry.module],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	}), preloads.map((path) => /* @__PURE__ */ React.createElement("link", {
		key: path,
		rel: "modulepreload",
		href: path,
		crossOrigin: scriptProps.crossOrigin,
		integrity: sri[path],
		nonce: scriptProps.nonce,
		suppressHydrationWarning: true
	})), initialScripts);
}
function mergeRefs(...refs) {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === "function") ref(value);
			else if (ref != null) ref.current = value;
		});
	};
}
function RemixRootDefaultErrorBoundary({ error, isOutsideRemixApp }) {
	let { nonce } = useFrameworkContext();
	console.error(error);
	let heyDeveloper = /* @__PURE__ */ React.createElement("script", {
		nonce,
		dangerouslySetInnerHTML: { __html: `
        console.log(
          "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      ` }
	});
	if (isRouteErrorResponse(error)) return /* @__PURE__ */ React.createElement(BoundaryShell, { title: "Unhandled Thrown Response!" }, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText), heyDeveloper);
	let errorInstance;
	if (error instanceof Error) errorInstance = error;
	else {
		let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
		errorInstance = new Error(errorString);
	}
	return /* @__PURE__ */ React.createElement(BoundaryShell, {
		title: "Application Error!",
		isOutsideRemixApp
	}, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"), /* @__PURE__ */ React.createElement("pre", { style: {
		padding: "2rem",
		background: "hsla(10, 50%, 50%, 0.1)",
		color: "red",
		overflow: "auto"
	} }, errorInstance.stack), heyDeveloper);
}
function BoundaryShell({ title, renderScripts, isOutsideRemixApp, children }) {
	let { routeModules } = useFrameworkContext();
	if (routeModules.root?.Layout && !isOutsideRemixApp) return children;
	return /* @__PURE__ */ React.createElement("html", { lang: "en" }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ React.createElement("meta", {
		name: "viewport",
		content: "width=device-width,initial-scale=1,viewport-fit=cover"
	}), /* @__PURE__ */ React.createElement("title", null, title)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement("main", { style: {
		fontFamily: "system-ui, sans-serif",
		padding: "2rem"
	} }, children, renderScripts ? /* @__PURE__ */ React.createElement(Scripts, null) : null)));
}
function createBrowserRouter(routes, opts) {
	return createRouter({
		basename: opts?.basename,
		getContext: opts?.getContext,
		future: opts?.future,
		history: createBrowserHistory({ window: opts?.window }),
		hydrationData: opts?.hydrationData || parseHydrationData(),
		routes,
		mapRouteProperties,
		hydrationRouteProperties,
		dataStrategy: opts?.dataStrategy,
		patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
		window: opts?.window,
		instrumentations: opts?.instrumentations
	}).initialize();
}
function createHashRouter(routes, opts) {
	return createRouter({
		basename: opts?.basename,
		getContext: opts?.getContext,
		future: opts?.future,
		history: createHashHistory({ window: opts?.window }),
		hydrationData: opts?.hydrationData || parseHydrationData(),
		routes,
		mapRouteProperties,
		hydrationRouteProperties,
		dataStrategy: opts?.dataStrategy,
		patchRoutesOnNavigation: opts?.patchRoutesOnNavigation,
		window: opts?.window,
		instrumentations: opts?.instrumentations
	}).initialize();
}
function parseHydrationData() {
	let state = window?.__staticRouterHydrationData;
	if (state && state.errors) state = {
		...state,
		errors: deserializeErrors(state.errors)
	};
	return state;
}
function deserializeErrors(errors) {
	if (!errors) return null;
	let entries = Object.entries(errors);
	let serialized = {};
	for (let [key, val] of entries) if (val && val.__type === "RouteErrorResponse") serialized[key] = new ErrorResponseImpl(val.status, val.statusText, val.data, val.internal === true);
	else if (val && val.__type === "Error") {
		if (typeof val.__subType === "string" && SUPPORTED_ERROR_TYPES.includes(val.__subType)) {
			let ErrorConstructor = window[val.__subType];
			if (typeof ErrorConstructor === "function") try {
				let error = new ErrorConstructor(val.message);
				error.stack = "";
				serialized[key] = error;
			} catch (e) {}
		}
		if (serialized[key] == null) {
			let error = new Error(val.message);
			error.stack = "";
			serialized[key] = error;
		}
	} else serialized[key] = val;
	return serialized;
}
function BrowserRouter({ basename, children, useTransitions, window: window2 }) {
	let historyRef = React.useRef();
	if (historyRef.current == null) historyRef.current = createBrowserHistory({
		window: window2,
		v5Compat: true
	});
	let history = historyRef.current;
	let [state, setStateImpl] = React.useState({
		action: history.action,
		location: history.location
	});
	let setState = React.useCallback((newState) => {
		if (useTransitions === false) setStateImpl(newState);
		else React.startTransition(() => setStateImpl(newState));
	}, [useTransitions]);
	React.useLayoutEffect(() => history.listen(setState), [history, setState]);
	return /* @__PURE__ */ React.createElement(Router, {
		basename,
		children,
		location: state.location,
		navigationType: state.action,
		navigator: history,
		useTransitions
	});
}
function HashRouter({ basename, children, useTransitions, window: window2 }) {
	let historyRef = React.useRef();
	if (historyRef.current == null) historyRef.current = createHashHistory({
		window: window2,
		v5Compat: true
	});
	let history = historyRef.current;
	let [state, setStateImpl] = React.useState({
		action: history.action,
		location: history.location
	});
	let setState = React.useCallback((newState) => {
		if (useTransitions === false) setStateImpl(newState);
		else React.startTransition(() => setStateImpl(newState));
	}, [useTransitions]);
	React.useLayoutEffect(() => history.listen(setState), [history, setState]);
	return /* @__PURE__ */ React.createElement(Router, {
		basename,
		children,
		location: state.location,
		navigationType: state.action,
		navigator: history,
		useTransitions
	});
}
function HistoryRouter({ basename, children, history, useTransitions }) {
	let [state, setStateImpl] = React.useState({
		action: history.action,
		location: history.location
	});
	let setState = React.useCallback((newState) => {
		if (useTransitions === false) setStateImpl(newState);
		else React.startTransition(() => setStateImpl(newState));
	}, [useTransitions]);
	React.useLayoutEffect(() => history.listen(setState), [history, setState]);
	return /* @__PURE__ */ React.createElement(Router, {
		basename,
		children,
		location: state.location,
		navigationType: state.action,
		navigator: history,
		useTransitions
	});
}
function ScrollRestoration({ getKey, storageKey, ...props }) {
	let remixContext = React.useContext(FrameworkContext);
	let { basename } = React.useContext(NavigationContext);
	let location = useLocation$2();
	let matches = useMatches();
	useScrollRestoration({
		getKey,
		storageKey
	});
	let ssrKey = React.useMemo(() => {
		if (!remixContext || !getKey) return null;
		let userKey = getScrollRestorationKey(location, matches, basename, getKey);
		return userKey !== location.key ? userKey : null;
	}, []);
	if (!remixContext || remixContext.isSpaMode) return null;
	let restoreScroll = ((storageKey2, restoreKey) => {
		if (!window.history.state || !window.history.state.key) {
			let key = Math.random().toString(32).slice(2);
			window.history.replaceState({ key }, "");
		}
		try {
			let storedY = JSON.parse(sessionStorage.getItem(storageKey2) || "{}")[restoreKey || window.history.state.key];
			if (typeof storedY === "number") window.scrollTo(0, storedY);
		} catch (error) {
			console.error(error);
			sessionStorage.removeItem(storageKey2);
		}
	}).toString();
	if (props.nonce == null && remixContext?.nonce) props.nonce = remixContext.nonce;
	return /* @__PURE__ */ React.createElement("script", {
		...props,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: `(${restoreScroll})(${escapeHtml(JSON.stringify(storageKey || SCROLL_RESTORATION_STORAGE_KEY))}, ${escapeHtml(JSON.stringify(ssrKey))})` }
	});
}
function getDataRouterConsoleError2(hookName) {
	return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function useDataRouterContext3(hookName) {
	let ctx = React.useContext(DataRouterContext);
	invariant$1(ctx, getDataRouterConsoleError2(hookName));
	return ctx;
}
function useDataRouterState2(hookName) {
	let state = React.useContext(DataRouterStateContext);
	invariant$1(state, getDataRouterConsoleError2(hookName));
	return state;
}
function useLinkClickHandler(to, { target, replace: replaceProp, mask, state, preventScrollReset, relative, viewTransition, defaultShouldRevalidate, useTransitions } = {}) {
	let navigate = useNavigate$6();
	let location = useLocation$2();
	let path = useResolvedPath(to, { relative });
	return React.useCallback((event) => {
		if (shouldProcessLinkClick(event, target)) {
			event.preventDefault();
			let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
			let doNavigate = () => navigate(to, {
				replace: replace2,
				mask,
				state,
				preventScrollReset,
				relative,
				viewTransition,
				defaultShouldRevalidate
			});
			if (useTransitions) React.startTransition(() => doNavigate());
			else doNavigate();
		}
	}, [
		location,
		navigate,
		path,
		replaceProp,
		mask,
		state,
		target,
		to,
		preventScrollReset,
		relative,
		viewTransition,
		defaultShouldRevalidate,
		useTransitions
	]);
}
function useSearchParams(defaultInit) {
	warning(typeof URLSearchParams !== "undefined", `You cannot use the \`useSearchParams\` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params.`);
	let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
	let hasSetSearchParamsRef = React.useRef(false);
	let location = useLocation$2();
	let searchParams = React.useMemo(() => getSearchParamsForLocation(location.search, hasSetSearchParamsRef.current ? null : defaultSearchParamsRef.current), [location.search]);
	let navigate = useNavigate$6();
	return [searchParams, React.useCallback((nextInit, navigateOptions) => {
		const newSearchParams = createSearchParams(typeof nextInit === "function" ? nextInit(new URLSearchParams(searchParams)) : nextInit);
		hasSetSearchParamsRef.current = true;
		navigate("?" + newSearchParams, navigateOptions);
	}, [navigate, searchParams])];
}
function useSubmit() {
	let { router } = useDataRouterContext3("useSubmit");
	let { basename } = React.useContext(NavigationContext);
	let currentRouteId = useRouteId();
	let routerFetch = router.fetch;
	let routerNavigate = router.navigate;
	return React.useCallback(async (target, options = {}) => {
		let { action, method, encType, formData, body } = getFormSubmissionInfo(target, basename);
		if (options.navigate === false) await routerFetch(options.fetcherKey || getUniqueFetcherId(), currentRouteId, options.action || action, {
			defaultShouldRevalidate: options.defaultShouldRevalidate,
			preventScrollReset: options.preventScrollReset,
			formData,
			body,
			formMethod: options.method || method,
			formEncType: options.encType || encType,
			flushSync: options.flushSync
		});
		else await routerNavigate(options.action || action, {
			defaultShouldRevalidate: options.defaultShouldRevalidate,
			preventScrollReset: options.preventScrollReset,
			formData,
			body,
			formMethod: options.method || method,
			formEncType: options.encType || encType,
			replace: options.replace,
			state: options.state,
			fromRouteId: currentRouteId,
			flushSync: options.flushSync,
			viewTransition: options.viewTransition
		});
	}, [
		routerFetch,
		routerNavigate,
		basename,
		currentRouteId
	]);
}
function useFormAction(action, { relative } = {}) {
	let { basename } = React.useContext(NavigationContext);
	let routeContext = React.useContext(RouteContext);
	invariant$1(routeContext, "useFormAction must be used inside a RouteContext");
	let [match] = routeContext.matches.slice(-1);
	let path = { ...useResolvedPath(action ? action : ".", { relative }) };
	let location = useLocation$2();
	if (action == null) {
		path.search = location.search;
		let params = new URLSearchParams(path.search);
		let indexValues = params.getAll("index");
		if (indexValues.some((v) => v === "")) {
			params.delete("index");
			indexValues.filter((v) => v).forEach((v) => params.append("index", v));
			let qs = params.toString();
			path.search = qs ? `?${qs}` : "";
		}
	}
	if ((!action || action === ".") && match.route.index) path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
	if (basename !== "/") path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
	return createPath(path);
}
function useFetcher({ key } = {}) {
	let { router } = useDataRouterContext3("useFetcher");
	let state = useDataRouterState2("useFetcher");
	let fetcherData = React.useContext(FetchersContext);
	let route = React.useContext(RouteContext);
	let routeId = route.matches[route.matches.length - 1]?.route.id;
	invariant$1(fetcherData, `useFetcher must be used inside a FetchersContext`);
	invariant$1(route, `useFetcher must be used inside a RouteContext`);
	invariant$1(routeId != null, `useFetcher can only be used on routes that contain a unique "id"`);
	let defaultKey = React.useId();
	let [fetcherKey, setFetcherKey] = React.useState(key || defaultKey);
	if (key && key !== fetcherKey) setFetcherKey(key);
	let { deleteFetcher, getFetcher, resetFetcher, fetch: routerFetch } = router;
	React.useEffect(() => {
		getFetcher(fetcherKey);
		return () => deleteFetcher(fetcherKey);
	}, [
		deleteFetcher,
		getFetcher,
		fetcherKey
	]);
	let load = React.useCallback(async (href, opts) => {
		invariant$1(routeId, "No routeId available for fetcher.load()");
		await routerFetch(fetcherKey, routeId, href, opts);
	}, [
		fetcherKey,
		routeId,
		routerFetch
	]);
	let submitImpl = useSubmit();
	let submit = React.useCallback(async (target, opts) => {
		await submitImpl(target, {
			...opts,
			navigate: false,
			fetcherKey
		});
	}, [fetcherKey, submitImpl]);
	let reset = React.useCallback((opts) => resetFetcher(fetcherKey, opts), [resetFetcher, fetcherKey]);
	let FetcherForm = React.useMemo(() => {
		let FetcherForm2 = React.forwardRef((props, ref) => {
			return /* @__PURE__ */ React.createElement(Form, {
				...props,
				navigate: false,
				fetcherKey,
				ref
			});
		});
		FetcherForm2.displayName = "fetcher.Form";
		return FetcherForm2;
	}, [fetcherKey]);
	let fetcher = state.fetchers.get(fetcherKey) || IDLE_FETCHER;
	let data2 = fetcherData.get(fetcherKey);
	return React.useMemo(() => ({
		Form: FetcherForm,
		submit,
		load,
		reset,
		...fetcher,
		data: data2
	}), [
		FetcherForm,
		submit,
		load,
		reset,
		fetcher,
		data2
	]);
}
function useFetchers() {
	let state = useDataRouterState2("useFetchers");
	return React.useMemo(() => Array.from(state.fetchers.entries()).map(([key, fetcher]) => ({
		...fetcher,
		key
	})), [state.fetchers]);
}
function getScrollRestorationKey(location, matches, basename, getKey) {
	let key = null;
	if (getKey) if (basename !== "/") key = getKey({
		...location,
		pathname: stripBasename(location.pathname, basename) || location.pathname
	}, matches);
	else key = getKey(location, matches);
	if (key == null) key = location.key;
	return key;
}
function useScrollRestoration({ getKey, storageKey } = {}) {
	let { router } = useDataRouterContext3("useScrollRestoration");
	let { restoreScrollPosition, preventScrollReset } = useDataRouterState2("useScrollRestoration");
	let { basename } = React.useContext(NavigationContext);
	let location = useLocation$2();
	let matches = useMatches();
	let navigation = useNavigation();
	React.useEffect(() => {
		window.history.scrollRestoration = "manual";
		return () => {
			window.history.scrollRestoration = "auto";
		};
	}, []);
	usePageHide(React.useCallback(() => {
		if (navigation.state === "idle") {
			let key = getScrollRestorationKey(location, matches, basename, getKey);
			savedScrollPositions[key] = window.scrollY;
		}
		try {
			sessionStorage.setItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY, JSON.stringify(savedScrollPositions));
		} catch (error) {
			warning(false, `Failed to save scroll positions in sessionStorage, <ScrollRestoration /> will not work properly (${error}).`);
		}
		window.history.scrollRestoration = "auto";
	}, [
		navigation.state,
		getKey,
		basename,
		location,
		matches,
		storageKey
	]));
	if (typeof document !== "undefined") {
		React.useLayoutEffect(() => {
			try {
				let sessionPositions = sessionStorage.getItem(storageKey || SCROLL_RESTORATION_STORAGE_KEY);
				if (sessionPositions) savedScrollPositions = JSON.parse(sessionPositions);
			} catch (e) {}
		}, [storageKey]);
		React.useLayoutEffect(() => {
			let disableScrollRestoration = router?.enableScrollRestoration(savedScrollPositions, () => window.scrollY, getKey ? (location2, matches2) => getScrollRestorationKey(location2, matches2, basename, getKey) : void 0);
			return () => disableScrollRestoration && disableScrollRestoration();
		}, [
			router,
			basename,
			getKey
		]);
		React.useLayoutEffect(() => {
			if (restoreScrollPosition === false) return;
			if (typeof restoreScrollPosition === "number") {
				window.scrollTo(0, restoreScrollPosition);
				return;
			}
			try {
				if (location.hash) {
					let el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
					if (el) {
						el.scrollIntoView();
						return;
					}
				}
			} catch {
				warning(false, `"${location.hash.slice(1)}" is not a decodable element ID. The view will not scroll to it.`);
			}
			if (preventScrollReset === true) return;
			window.scrollTo(0, 0);
		}, [
			location,
			restoreScrollPosition,
			preventScrollReset
		]);
	}
}
function useBeforeUnload(callback, options) {
	let { capture } = options || {};
	React.useEffect(() => {
		let opts = capture != null ? { capture } : void 0;
		window.addEventListener("beforeunload", callback, opts);
		return () => {
			window.removeEventListener("beforeunload", callback, opts);
		};
	}, [callback, capture]);
}
function usePageHide(callback, options) {
	let { capture } = options || {};
	React.useEffect(() => {
		let opts = capture != null ? { capture } : void 0;
		window.addEventListener("pagehide", callback, opts);
		return () => {
			window.removeEventListener("pagehide", callback, opts);
		};
	}, [callback, capture]);
}
function usePrompt({ when, message }) {
	let blocker = useBlocker(when);
	React.useEffect(() => {
		if (blocker.state === "blocked") if (window.confirm(message)) setTimeout(blocker.proceed, 0);
		else blocker.reset();
	}, [blocker, message]);
	React.useEffect(() => {
		if (blocker.state === "blocked" && !when) blocker.reset();
	}, [blocker, when]);
}
function useViewTransitionState(to, { relative } = {}) {
	let vtContext = React.useContext(ViewTransitionContext);
	invariant$1(vtContext != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
	let { basename } = useDataRouterContext3("useViewTransitionState");
	let path = useResolvedPath(to, { relative });
	if (!vtContext.isTransitioning) return false;
	let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
	let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
	return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
function StaticRouter$1({ basename, children, location: locationProp = "/" }) {
	if (typeof locationProp === "string") locationProp = parsePath(locationProp);
	let action = "POP";
	let location = {
		pathname: locationProp.pathname || "/",
		search: locationProp.search || "",
		hash: locationProp.hash || "",
		state: locationProp.state != null ? locationProp.state : null,
		key: locationProp.key || "default",
		mask: void 0
	};
	let staticNavigator = getStatelessNavigator();
	return /* @__PURE__ */ React.createElement(Router, {
		basename,
		children,
		location,
		navigationType: action,
		navigator: staticNavigator,
		static: true,
		useTransitions: false
	});
}
function StaticRouterProvider({ context, router, hydrate: hydrate2 = true, nonce }) {
	invariant$1(router && context, "You must provide `router` and `context` to <StaticRouterProvider>");
	let dataRouterContext = {
		router,
		navigator: getStatelessNavigator(),
		static: true,
		staticContext: context,
		basename: context.basename || "/"
	};
	let fetchersContext = /* @__PURE__ */ new Map();
	let hydrateScript = "";
	if (hydrate2 !== false) {
		let data2 = {
			loaderData: context.loaderData,
			actionData: context.actionData,
			errors: serializeErrors(context.errors)
		};
		hydrateScript = `window.__staticRouterHydrationData = JSON.parse(${escapeHtml(JSON.stringify(JSON.stringify(data2)))});`;
	}
	let { state } = dataRouterContext.router;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DataRouterContext.Provider, { value: dataRouterContext }, /* @__PURE__ */ React.createElement(DataRouterStateContext.Provider, { value: state }, /* @__PURE__ */ React.createElement(FetchersContext.Provider, { value: fetchersContext }, /* @__PURE__ */ React.createElement(ViewTransitionContext.Provider, { value: { isTransitioning: false } }, /* @__PURE__ */ React.createElement(Router, {
		basename: dataRouterContext.basename,
		location: state.location,
		navigationType: state.historyAction,
		navigator: dataRouterContext.navigator,
		static: dataRouterContext.static,
		useTransitions: false
	}, /* @__PURE__ */ React.createElement(DataRoutes2, {
		manifest: router.manifest,
		routes: router.routes,
		future: router.future,
		state,
		isStatic: true
	})))))), hydrateScript ? /* @__PURE__ */ React.createElement("script", {
		suppressHydrationWarning: true,
		nonce,
		dangerouslySetInnerHTML: { __html: hydrateScript }
	}) : null);
}
function serializeErrors(errors) {
	if (!errors) return null;
	let entries = Object.entries(errors);
	let serialized = {};
	for (let [key, val] of entries) if (isRouteErrorResponse(val)) serialized[key] = {
		...val,
		__type: "RouteErrorResponse"
	};
	else if (val instanceof Error) serialized[key] = {
		message: val.message,
		__type: "Error",
		...val.name !== "Error" ? { __subType: val.name } : {}
	};
	else serialized[key] = val;
	return serialized;
}
function getStatelessNavigator() {
	return {
		createHref,
		encodeLocation,
		push(to) {
			throw new Error(`You cannot use navigator.push() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)})\` somewhere in your app.`);
		},
		replace(to) {
			throw new Error(`You cannot use navigator.replace() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${JSON.stringify(to)}, { replace: true })\` somewhere in your app.`);
		},
		go(delta) {
			throw new Error(`You cannot use navigator.go() on the server because it is a stateless environment. This error was probably triggered when you did a \`navigate(${delta})\` somewhere in your app.`);
		},
		back() {
			throw new Error(`You cannot use navigator.back() on the server because it is a stateless environment.`);
		},
		forward() {
			throw new Error(`You cannot use navigator.forward() on the server because it is a stateless environment.`);
		}
	};
}
function createStaticHandler2(routes, opts) {
	return createStaticHandler(routes, {
		...opts,
		mapRouteProperties
	});
}
function createStaticRouter(routes, context, opts = {}) {
	let manifest = {};
	let dataRoutes = convertRoutesToDataRoutes(routes, mapRouteProperties, void 0, manifest);
	let matches = context.matches.map((match) => {
		let route = manifest[match.route.id] || match.route;
		return {
			...match,
			route
		};
	});
	let msg = (method) => `You cannot use router.${method}() on the server because it is a stateless environment`;
	return {
		get basename() {
			return context.basename;
		},
		get future() {
			return {
				v8_middleware: false,
				v8_passThroughRequests: false,
				v8_trailingSlashAwareDataRequests: false,
				...opts?.future
			};
		},
		get state() {
			return {
				historyAction: "POP",
				location: context.location,
				matches,
				loaderData: context.loaderData,
				actionData: context.actionData,
				errors: context.errors,
				initialized: true,
				renderFallback: false,
				navigation: IDLE_NAVIGATION,
				restoreScrollPosition: null,
				preventScrollReset: false,
				revalidation: "idle",
				fetchers: /* @__PURE__ */ new Map(),
				blockers: /* @__PURE__ */ new Map()
			};
		},
		get routes() {
			return dataRoutes;
		},
		get branches() {
			return opts.branches;
		},
		get manifest() {
			return manifest;
		},
		get window() {},
		initialize() {
			throw msg("initialize");
		},
		subscribe() {
			throw msg("subscribe");
		},
		enableScrollRestoration() {
			throw msg("enableScrollRestoration");
		},
		navigate() {
			throw msg("navigate");
		},
		fetch() {
			throw msg("fetch");
		},
		revalidate() {
			throw msg("revalidate");
		},
		createHref,
		encodeLocation,
		getFetcher() {
			return IDLE_FETCHER;
		},
		deleteFetcher() {
			throw msg("deleteFetcher");
		},
		resetFetcher() {
			throw msg("resetFetcher");
		},
		dispose() {
			throw msg("dispose");
		},
		getBlocker() {
			return IDLE_BLOCKER;
		},
		deleteBlocker() {
			throw msg("deleteBlocker");
		},
		patchRoutes() {
			throw msg("patchRoutes");
		},
		_internalFetchControllers: /* @__PURE__ */ new Map(),
		_internalSetRoutes() {
			throw msg("_internalSetRoutes");
		},
		_internalSetStateDoNotUseOrYouWillBreakYourApp() {
			throw msg("_internalSetStateDoNotUseOrYouWillBreakYourApp");
		}
	};
}
function createHref(to) {
	return typeof to === "string" ? to : createPath(to);
}
function encodeLocation(to) {
	let href = typeof to === "string" ? to : createPath(to);
	href = href.replace(/ $/, "%20");
	let encoded = ABSOLUTE_URL_REGEX.test(href) ? new URL(href) : new URL(href, "http://localhost");
	return {
		pathname: encoded.pathname,
		search: encoded.search,
		hash: encoded.hash
	};
}
var __typeError, __accessCheck, __privateGet, __privateAdd, __privateSet, ABSOLUTE_URL_REGEX, PROTOCOL_RELATIVE_URL_REGEX, Action, PopStateEventType, _map, RouterContextProvider, unsupportedLazyRouteObjectKeys, unsupportedLazyRouteFunctionKeys, paramRe, dynamicSegmentValue, indexRouteValue, emptySegmentValue, staticSegmentValue, splatPenalty, isSplat, isAbsoluteUrl, removeDoubleSlashes, joinPaths, removeTrailingSlash, normalizePathname, normalizeSearch, normalizeHash, DataWithResponseInit, redirect, redirectDocument, replace, SUPPORTED_ERROR_TYPES, ErrorResponseImpl, isBrowser, UninstrumentedSymbol, objectProtoNames, validMutationMethodsArr, validMutationMethods, validRequestMethodsArr, validRequestMethods, redirectStatusCodes, redirectPreserveMethodStatusCodes, IDLE_NAVIGATION, IDLE_FETCHER, IDLE_BLOCKER, defaultMapRouteProperties, TRANSITIONS_STORAGE_KEY, ResetLoaderDataSymbol, _routes, _branches, _hmrRoutes, _hmrBranches, DataRoutes, lazyRoutePropertyCache, loadLazyRouteProperty, lazyRouteFunctionCache, invalidProtocols, DataRouterContext, DataRouterStateContext, RSCRouterContext, ViewTransitionContext, FetchersContext, AwaitContext, AwaitContextProvider, NavigationContext, LocationContext, RouteContext, RouteErrorContext, ERROR_DIGEST_BASE, ERROR_DIGEST_REDIRECT, ERROR_DIGEST_ROUTE_ERROR_RESPONSE, navigateEffectWarning, OutletContext, defaultErrorElement, RenderErrorBoundary, errorRedirectHandledMap, blockerId, alreadyWarned, alreadyWarned2, useOptimisticImpl, stableUseOptimisticSetter, hydrationRouteProperties, Deferred, MemoizedDataRoutes, AwaitErrorBoundary, createRoutesFromElements, defaultMethod, defaultEncType, _formDataSupportsSubmitter, supportedFormEncTypes, HOLE, NAN, NEGATIVE_INFINITY, NEGATIVE_ZERO, NULL, POSITIVE_INFINITY, UNDEFINED, TYPE_BIGINT, TYPE_DATE, TYPE_ERROR, TYPE_MAP, TYPE_NULL_OBJECT, TYPE_PROMISE, TYPE_REGEXP, TYPE_SET, TYPE_SYMBOL, TYPE_URL, TYPE_PREVIOUS_RESOLVED, Deferred2, TIME_LIMIT_MS, getNow, yieldToMain, objectProtoNames2, globalObj, ESCAPE_LOOKUP, ESCAPE_REGEX, SingleFetchRedirectSymbol, SingleFetchNoResultError, NO_BODY_STATUS_CODES, _isPreloadSupported, nextPaths$1, discoveredPathsMaxSize$1, discoveredPaths$1, MANIFEST_VERSION_STORAGE_KEY, FrameworkContext, CRITICAL_CSS_DATA_ATTRIBUTE, isHydrated, RemixErrorBoundary, isBrowser2, Link$7, NavLink, Form, fetcherId, getUniqueFetcherId, SCROLL_RESTORATION_STORAGE_KEY, savedScrollPositions;
var init_chunk_4ZMWKKQ3 = __esmMin((() => {
	__typeError = (msg) => {
		throw TypeError(msg);
	};
	__accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
	__privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
	__privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
	__privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
	ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|[\\/]{2})/i;
	PROTOCOL_RELATIVE_URL_REGEX = /^[\\/]{2}/;
	Action = /* @__PURE__ */ ((Action2) => {
		Action2["Pop"] = "POP";
		Action2["Push"] = "PUSH";
		Action2["Replace"] = "REPLACE";
		return Action2;
	})(Action || {});
	PopStateEventType = "popstate";
	RouterContextProvider = class {
		/**
		* Create a new `RouterContextProvider` instance
		* @param init An optional initial context map to populate the provider with
		*/
		constructor(init) {
			__privateAdd(this, _map, /* @__PURE__ */ new Map());
			if (init) for (let [context, value] of init) this.set(context, value);
		}
		/**
		* Access a value from the context. If no value has been set for the context,
		* it will return the context's `defaultValue` if provided, or throw an error
		* if no `defaultValue` was set.
		* @param context The context to get the value for
		* @returns The value for the context, or the context's `defaultValue` if no
		* value was set
		*/
		get(context) {
			if (__privateGet(this, _map).has(context)) return __privateGet(this, _map).get(context);
			if (context.defaultValue !== void 0) return context.defaultValue;
			throw new Error("No value found for context");
		}
		/**
		* Set a value for the context. If the context already has a value set, this
		* will overwrite it.
		*
		* @param context The context to set the value for
		* @param value The value to set for the context
		* @returns {void}
		*/
		set(context, value) {
			__privateGet(this, _map).set(context, value);
		}
	};
	_map = /* @__PURE__ */ new WeakMap();
	unsupportedLazyRouteObjectKeys = /* @__PURE__ */ new Set([
		"lazy",
		"caseSensitive",
		"path",
		"id",
		"index",
		"children"
	]);
	unsupportedLazyRouteFunctionKeys = /* @__PURE__ */ new Set([
		"lazy",
		"caseSensitive",
		"path",
		"id",
		"index",
		"middleware",
		"children"
	]);
	paramRe = /^:[\w-]+$/;
	dynamicSegmentValue = 3;
	indexRouteValue = 2;
	emptySegmentValue = 1;
	staticSegmentValue = 10;
	splatPenalty = -2;
	isSplat = (s) => s === "*";
	isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX.test(url);
	removeDoubleSlashes = (path) => path.replace(/[\\/]{2,}/g, "/");
	joinPaths = (paths) => removeDoubleSlashes(paths.join("/"));
	removeTrailingSlash = (path) => path.replace(/\/+$/, "");
	normalizePathname = (pathname) => removeTrailingSlash(pathname).replace(/^\/*/, "/");
	normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
	normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
	DataWithResponseInit = class {
		constructor(data2, init) {
			this.type = "DataWithResponseInit";
			this.data = data2;
			this.init = init || null;
		}
	};
	redirect = (url, init = 302) => {
		let responseInit = init;
		if (typeof responseInit === "number") responseInit = { status: responseInit };
		else if (typeof responseInit.status === "undefined") responseInit.status = 302;
		let headers = new Headers(responseInit.headers);
		headers.set("Location", url);
		return new Response(null, {
			...responseInit,
			headers
		});
	};
	redirectDocument = (url, init) => {
		let response = redirect(url, init);
		response.headers.set("X-Remix-Reload-Document", "true");
		return response;
	};
	replace = (url, init) => {
		let response = redirect(url, init);
		response.headers.set("X-Remix-Replace", "true");
		return response;
	};
	SUPPORTED_ERROR_TYPES = [
		"EvalError",
		"RangeError",
		"ReferenceError",
		"SyntaxError",
		"TypeError",
		"URIError"
	];
	ErrorResponseImpl = class {
		constructor(status, statusText, data2, internal = false) {
			this.status = status;
			this.statusText = statusText || "";
			this.internal = internal;
			if (data2 instanceof Error) {
				this.data = data2.toString();
				this.error = data2;
			} else this.data = data2;
		}
	};
	isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
	UninstrumentedSymbol = Symbol("Uninstrumented");
	objectProtoNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
	validMutationMethodsArr = [
		"POST",
		"PUT",
		"PATCH",
		"DELETE"
	];
	validMutationMethods = new Set(validMutationMethodsArr);
	validRequestMethodsArr = ["GET", ...validMutationMethodsArr];
	validRequestMethods = new Set(validRequestMethodsArr);
	redirectStatusCodes = /* @__PURE__ */ new Set([
		301,
		302,
		303,
		307,
		308
	]);
	redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
	IDLE_NAVIGATION = {
		state: "idle",
		location: void 0,
		matches: void 0,
		historyAction: void 0,
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0
	};
	IDLE_FETCHER = {
		state: "idle",
		data: void 0,
		formMethod: void 0,
		formAction: void 0,
		formEncType: void 0,
		formData: void 0,
		json: void 0,
		text: void 0
	};
	IDLE_BLOCKER = {
		state: "unblocked",
		proceed: void 0,
		reset: void 0,
		location: void 0
	};
	defaultMapRouteProperties = (route) => ({ hasErrorBoundary: Boolean(route.hasErrorBoundary) });
	TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
	ResetLoaderDataSymbol = Symbol("ResetLoaderData");
	DataRoutes = class {
		constructor(routes) {
			__privateAdd(this, _routes);
			__privateAdd(this, _branches);
			__privateAdd(this, _hmrRoutes);
			__privateAdd(this, _hmrBranches);
			__privateSet(this, _routes, routes);
			__privateSet(this, _branches, flattenAndRankRoutes(routes));
		}
		/** The stable route tree */
		get stableRoutes() {
			return __privateGet(this, _routes);
		}
		/** The in-flight route tree if one is active, otherwise the stable tree */
		get activeRoutes() {
			return __privateGet(this, _hmrRoutes) ?? __privateGet(this, _routes);
		}
		/** Pre-computed branches */
		get branches() {
			return __privateGet(this, _hmrBranches) ?? __privateGet(this, _branches);
		}
		get hasHMRRoutes() {
			return __privateGet(this, _hmrRoutes) != null;
		}
		/** Replace the stable route tree and recompute its branches */
		setRoutes(routes) {
			__privateSet(this, _routes, routes);
			__privateSet(this, _branches, flattenAndRankRoutes(routes));
		}
		/** Set a new in-flight route tree and recompute its branches */
		setHmrRoutes(routes) {
			__privateSet(this, _hmrRoutes, routes);
			__privateSet(this, _hmrBranches, flattenAndRankRoutes(routes));
		}
		/** Commit in-flight routes/branches to the stable slot and clear in-flight */
		commitHmrRoutes() {
			if (__privateGet(this, _hmrRoutes)) {
				__privateSet(this, _routes, __privateGet(this, _hmrRoutes));
				__privateSet(this, _branches, __privateGet(this, _hmrBranches));
				__privateSet(this, _hmrRoutes, void 0);
				__privateSet(this, _hmrBranches, void 0);
			}
		}
	};
	_routes = /* @__PURE__ */ new WeakMap();
	_branches = /* @__PURE__ */ new WeakMap();
	_hmrRoutes = /* @__PURE__ */ new WeakMap();
	_hmrBranches = /* @__PURE__ */ new WeakMap();
	lazyRoutePropertyCache = /* @__PURE__ */ new WeakMap();
	loadLazyRouteProperty = ({ key, route, manifest, mapRouteProperties: mapRouteProperties2 }) => {
		let routeToUpdate = manifest[route.id];
		invariant$1(routeToUpdate, "No route found in manifest");
		if (!routeToUpdate.lazy || typeof routeToUpdate.lazy !== "object") return;
		let lazyFn = routeToUpdate.lazy[key];
		if (!lazyFn) return;
		let cache = lazyRoutePropertyCache.get(routeToUpdate);
		if (!cache) {
			cache = {};
			lazyRoutePropertyCache.set(routeToUpdate, cache);
		}
		let cachedPromise = cache[key];
		if (cachedPromise) return cachedPromise;
		let propertyPromise = (async () => {
			let isUnsupported = isUnsupportedLazyRouteObjectKey(key);
			let isStaticallyDefined = routeToUpdate[key] !== void 0 && key !== "hasErrorBoundary";
			if (isUnsupported) {
				warning(!isUnsupported, "Route property " + key + " is not a supported lazy route property. This property will be ignored.");
				cache[key] = Promise.resolve();
			} else if (isStaticallyDefined) warning(false, `Route "${routeToUpdate.id}" has a static property "${key}" defined. The lazy property will be ignored.`);
			else {
				let value = await lazyFn();
				if (value != null) {
					Object.assign(routeToUpdate, { [key]: value });
					Object.assign(routeToUpdate, mapRouteProperties2(routeToUpdate));
				}
			}
			if (typeof routeToUpdate.lazy === "object") {
				routeToUpdate.lazy[key] = void 0;
				if (Object.values(routeToUpdate.lazy).every((value) => value === void 0)) routeToUpdate.lazy = void 0;
			}
		})();
		cache[key] = propertyPromise;
		return propertyPromise;
	};
	lazyRouteFunctionCache = /* @__PURE__ */ new WeakMap();
	invalidProtocols = [
		"about:",
		"blob:",
		"chrome:",
		"chrome-untrusted:",
		"content:",
		"data:",
		"devtools:",
		"file:",
		"filesystem:",
		"javascript:"
	];
	DataRouterContext = React.createContext(null);
	DataRouterContext.displayName = "DataRouter";
	DataRouterStateContext = React.createContext(null);
	DataRouterStateContext.displayName = "DataRouterState";
	RSCRouterContext = React.createContext(false);
	ViewTransitionContext = React.createContext({ isTransitioning: false });
	ViewTransitionContext.displayName = "ViewTransition";
	FetchersContext = React.createContext(/* @__PURE__ */ new Map());
	FetchersContext.displayName = "Fetchers";
	AwaitContext = React.createContext(null);
	AwaitContext.displayName = "Await";
	AwaitContextProvider = (props) => React.createElement(AwaitContext.Provider, props);
	NavigationContext = React.createContext(null);
	NavigationContext.displayName = "Navigation";
	LocationContext = React.createContext(null);
	LocationContext.displayName = "Location";
	RouteContext = React.createContext({
		outlet: null,
		matches: [],
		isDataRoute: false
	});
	RouteContext.displayName = "Route";
	RouteErrorContext = React.createContext(null);
	RouteErrorContext.displayName = "RouteError";
	ERROR_DIGEST_BASE = "REACT_ROUTER_ERROR";
	ERROR_DIGEST_REDIRECT = "REDIRECT";
	ERROR_DIGEST_ROUTE_ERROR_RESPONSE = "ROUTE_ERROR_RESPONSE";
	navigateEffectWarning = `You should call navigate() in a React.useEffect(), not when your component is first rendered.`;
	OutletContext = React.createContext(null);
	defaultErrorElement = /* @__PURE__ */ React.createElement(DefaultErrorComponent, null);
	RenderErrorBoundary = class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				location: props.location,
				revalidation: props.revalidation,
				error: props.error
			};
		}
		static getDerivedStateFromError(error) {
			return { error };
		}
		static getDerivedStateFromProps(props, state) {
			if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") return {
				error: props.error,
				location: props.location,
				revalidation: props.revalidation
			};
			return {
				error: props.error !== void 0 ? props.error : state.error,
				location: state.location,
				revalidation: props.revalidation || state.revalidation
			};
		}
		componentDidCatch(error, errorInfo) {
			if (this.props.onError) this.props.onError(error, errorInfo);
			else console.error("React Router caught the following error during render", error);
		}
		render() {
			let error = this.state.error;
			if (this.context && typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
				const decoded = decodeRouteErrorResponseDigest(error.digest);
				if (decoded) error = decoded;
			}
			let result = error !== void 0 ? /* @__PURE__ */ React.createElement(RouteContext.Provider, { value: this.props.routeContext }, /* @__PURE__ */ React.createElement(RouteErrorContext.Provider, {
				value: error,
				children: this.props.component
			})) : this.props.children;
			if (this.context) return /* @__PURE__ */ React.createElement(RSCErrorHandler, { error }, result);
			return result;
		}
	};
	RenderErrorBoundary.contextType = RSCRouterContext;
	errorRedirectHandledMap = /* @__PURE__ */ new WeakMap();
	blockerId = 0;
	alreadyWarned = {};
	alreadyWarned2 = {};
	useOptimisticImpl = React["useOptimistic"];
	stableUseOptimisticSetter = () => void 0;
	hydrationRouteProperties = ["HydrateFallback", "hydrateFallbackElement"];
	Deferred = class {
		constructor() {
			this.status = "pending";
			this.promise = new Promise((resolve, reject) => {
				this.resolve = (value) => {
					if (this.status === "pending") {
						this.status = "resolved";
						resolve(value);
					}
				};
				this.reject = (reason) => {
					if (this.status === "pending") {
						this.status = "rejected";
						reject(reason);
					}
				};
			});
		}
	};
	MemoizedDataRoutes = React.memo(DataRoutes2);
	AwaitErrorBoundary = class extends React.Component {
		constructor(props) {
			super(props);
			this.state = { error: null };
		}
		static getDerivedStateFromError(error) {
			return { error };
		}
		componentDidCatch(error, errorInfo) {
			if (this.props.onError) this.props.onError(error, errorInfo);
			else console.error("<Await> caught the following error during render", error, errorInfo);
		}
		render() {
			let { children, errorElement, resolve } = this.props;
			let promise = null;
			let status = 0;
			if (!(resolve instanceof Promise)) {
				status = 1;
				promise = Promise.resolve();
				Object.defineProperty(promise, "_tracked", { get: () => true });
				Object.defineProperty(promise, "_data", { get: () => resolve });
			} else if (this.state.error) {
				status = 2;
				let renderError = this.state.error;
				promise = Promise.reject().catch(() => {});
				Object.defineProperty(promise, "_tracked", { get: () => true });
				Object.defineProperty(promise, "_error", { get: () => renderError });
			} else if (resolve._tracked) {
				promise = resolve;
				status = "_error" in promise ? 2 : "_data" in promise ? 1 : 0;
			} else {
				status = 0;
				Object.defineProperty(resolve, "_tracked", { get: () => true });
				promise = resolve.then((data2) => Object.defineProperty(resolve, "_data", { get: () => data2 }), (error) => {
					this.props.onError?.(error);
					Object.defineProperty(resolve, "_error", { get: () => error });
				});
			}
			if (status === 2 && !errorElement) throw promise._error;
			if (status === 2) return /* @__PURE__ */ React.createElement(AwaitContext.Provider, {
				value: promise,
				children: errorElement
			});
			if (status === 1) return /* @__PURE__ */ React.createElement(AwaitContext.Provider, {
				value: promise,
				children
			});
			throw promise;
		}
	};
	createRoutesFromElements = createRoutesFromChildren;
	defaultMethod = "get";
	defaultEncType = "application/x-www-form-urlencoded";
	_formDataSupportsSubmitter = null;
	supportedFormEncTypes = /* @__PURE__ */ new Set([
		"application/x-www-form-urlencoded",
		"multipart/form-data",
		"text/plain"
	]);
	HOLE = -1;
	NAN = -2;
	NEGATIVE_INFINITY = -3;
	NEGATIVE_ZERO = -4;
	NULL = -5;
	POSITIVE_INFINITY = -6;
	UNDEFINED = -7;
	TYPE_BIGINT = "B";
	TYPE_DATE = "D";
	TYPE_ERROR = "E";
	TYPE_MAP = "M";
	TYPE_NULL_OBJECT = "N";
	TYPE_PROMISE = "P";
	TYPE_REGEXP = "R";
	TYPE_SET = "S";
	TYPE_SYMBOL = "Y";
	TYPE_URL = "U";
	TYPE_PREVIOUS_RESOLVED = "Z";
	Deferred2 = class {
		constructor() {
			this.promise = new Promise((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
			});
		}
	};
	TIME_LIMIT_MS = 1;
	getNow = () => Date.now();
	yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));
	objectProtoNames2 = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
	globalObj = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : void 0;
	ESCAPE_LOOKUP = {
		"&": "\\u0026",
		">": "\\u003e",
		"<": "\\u003c",
		"\u2028": "\\u2028",
		"\u2029": "\\u2029"
	};
	ESCAPE_REGEX = /[&><\u2028\u2029]/g;
	SingleFetchRedirectSymbol = Symbol("SingleFetchRedirect");
	SingleFetchNoResultError = class extends Error {};
	NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([
		100,
		101,
		204,
		205
	]);
	nextPaths$1 = /* @__PURE__ */ new Set();
	discoveredPathsMaxSize$1 = 1e3;
	discoveredPaths$1 = /* @__PURE__ */ new Set();
	MANIFEST_VERSION_STORAGE_KEY = "react-router-manifest-version";
	FrameworkContext = React.createContext(void 0);
	FrameworkContext.displayName = "FrameworkContext";
	CRITICAL_CSS_DATA_ATTRIBUTE = "data-react-router-critical-css";
	isHydrated = false;
	RemixErrorBoundary = class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				error: props.error || null,
				location: props.location
			};
		}
		static getDerivedStateFromError(error) {
			return { error };
		}
		static getDerivedStateFromProps(props, state) {
			if (state.location !== props.location) return {
				error: props.error || null,
				location: props.location
			};
			return {
				error: props.error || state.error,
				location: state.location
			};
		}
		render() {
			if (this.state.error) return /* @__PURE__ */ React.createElement(RemixRootDefaultErrorBoundary, {
				error: this.state.error,
				isOutsideRemixApp: true
			});
			else return this.props.children;
		}
	};
	isBrowser2 = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
	try {
		if (isBrowser2) window.__reactRouterVersion = "7.18.0";
	} catch (e) {}
	HistoryRouter.displayName = "unstable_HistoryRouter";
	Link$7 = React.forwardRef(function LinkWithRef({ onClick, discover = "render", prefetch = "none", relative, reloadDocument, replace: replace2, mask, state, target, to, preventScrollReset, viewTransition, defaultShouldRevalidate, ...rest }, forwardedRef) {
		let { basename, navigator, useTransitions } = React.useContext(NavigationContext);
		let isAbsolute = typeof to === "string" && ABSOLUTE_URL_REGEX.test(to);
		let parsed = parseToInfo(to, basename);
		to = parsed.to;
		let href = useHref(to, { relative });
		let location = useLocation$2();
		let maskedHref = null;
		if (mask) {
			let resolved = resolveTo(mask, [], location.mask ? location.mask.pathname : "/", true);
			if (basename !== "/") resolved.pathname = resolved.pathname === "/" ? basename : joinPaths([basename, resolved.pathname]);
			maskedHref = navigator.createHref(resolved);
		}
		let [shouldPrefetch, prefetchRef, prefetchHandlers] = usePrefetchBehavior(prefetch, rest);
		let internalOnClick = useLinkClickHandler(to, {
			replace: replace2,
			mask,
			state,
			target,
			preventScrollReset,
			relative,
			viewTransition,
			defaultShouldRevalidate,
			useTransitions
		});
		function handleClick(event) {
			if (onClick) onClick(event);
			if (!event.defaultPrevented) internalOnClick(event);
		}
		let isSpaLink = !(parsed.isExternal || reloadDocument);
		let link = /* @__PURE__ */ React.createElement("a", {
			...rest,
			...prefetchHandlers,
			href: (isSpaLink ? maskedHref : void 0) || parsed.absoluteURL || href,
			onClick: isSpaLink ? handleClick : onClick,
			ref: mergeRefs(forwardedRef, prefetchRef),
			target,
			"data-discover": !isAbsolute && discover === "render" ? "true" : void 0
		});
		return shouldPrefetch && !isAbsolute ? /* @__PURE__ */ React.createElement(React.Fragment, null, link, /* @__PURE__ */ React.createElement(PrefetchPageLinks, { page: href })) : link;
	});
	Link$7.displayName = "Link";
	NavLink = React.forwardRef(function NavLinkWithRef({ "aria-current": ariaCurrentProp = "page", caseSensitive = false, className: classNameProp = "", end = false, style: styleProp, to, viewTransition, children, ...rest }, ref) {
		let path = useResolvedPath(to, { relative: rest.relative });
		let location = useLocation$2();
		let routerState = React.useContext(DataRouterStateContext);
		let { navigator, basename } = React.useContext(NavigationContext);
		let isTransitioning = routerState != null && useViewTransitionState(path) && viewTransition === true;
		let toPathname = navigator.encodeLocation ? navigator.encodeLocation(path).pathname : path.pathname;
		let locationPathname = location.pathname;
		let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
		if (!caseSensitive) {
			locationPathname = locationPathname.toLowerCase();
			nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
			toPathname = toPathname.toLowerCase();
		}
		if (nextLocationPathname && basename) nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
		const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
		let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
		let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
		let renderProps = {
			isActive,
			isPending,
			isTransitioning
		};
		let ariaCurrent = isActive ? ariaCurrentProp : void 0;
		let className;
		if (typeof classNameProp === "function") className = classNameProp(renderProps);
		else className = [
			classNameProp,
			isActive ? "active" : null,
			isPending ? "pending" : null,
			isTransitioning ? "transitioning" : null
		].filter(Boolean).join(" ");
		let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
		return /* @__PURE__ */ React.createElement(Link$7, {
			...rest,
			"aria-current": ariaCurrent,
			className,
			ref,
			style,
			to,
			viewTransition
		}, typeof children === "function" ? children(renderProps) : children);
	});
	NavLink.displayName = "NavLink";
	Form = React.forwardRef(({ discover = "render", fetcherKey, navigate, reloadDocument, replace: replace2, state, method = defaultMethod, action, onSubmit, relative, preventScrollReset, viewTransition, defaultShouldRevalidate, ...props }, forwardedRef) => {
		let { useTransitions } = React.useContext(NavigationContext);
		let submit = useSubmit();
		let formAction = useFormAction(action, { relative });
		let formMethod = method.toLowerCase() === "get" ? "get" : "post";
		let isAbsolute = typeof action === "string" && ABSOLUTE_URL_REGEX.test(action);
		let submitHandler = (event) => {
			onSubmit && onSubmit(event);
			if (event.defaultPrevented) return;
			event.preventDefault();
			let submitter = event.nativeEvent.submitter;
			let submitMethod = submitter?.getAttribute("formmethod") || method;
			let doSubmit = () => submit(submitter || event.currentTarget, {
				fetcherKey,
				method: submitMethod,
				navigate,
				replace: replace2,
				state,
				relative,
				preventScrollReset,
				viewTransition,
				defaultShouldRevalidate
			});
			if (useTransitions && navigate !== false) React.startTransition(() => doSubmit());
			else doSubmit();
		};
		return /* @__PURE__ */ React.createElement("form", {
			ref: forwardedRef,
			method: formMethod,
			action: formAction,
			onSubmit: reloadDocument ? onSubmit : submitHandler,
			...props,
			"data-discover": !isAbsolute && discover === "render" ? "true" : void 0
		});
	});
	Form.displayName = "Form";
	ScrollRestoration.displayName = "ScrollRestoration";
	fetcherId = 0;
	getUniqueFetcherId = () => `__${String(++fetcherId)}__`;
	SCROLL_RESTORATION_STORAGE_KEY = "react-router-scroll-positions";
	savedScrollPositions = {};
}));
//#endregion
//#region node_modules/react-router/dist/development/chunk-E4MTK73K.mjs
/**
* react-router v7.18.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function ServerRouter({ context, url, nonce }) {
	if (typeof url === "string") url = new URL(url);
	let { manifest, routeModules, criticalCss, serverHandoffString } = context;
	let routes = createServerRoutes(manifest.routes, routeModules, context.future, context.isSpaMode);
	context.staticHandlerContext.loaderData = { ...context.staticHandlerContext.loaderData };
	for (let match of context.staticHandlerContext.matches) {
		let routeId = match.route.id;
		let route = routeModules[routeId];
		let manifestRoute = context.manifest.routes[routeId];
		if (route && manifestRoute && shouldHydrateRouteLoader(routeId, route.clientLoader, manifestRoute.hasLoader, context.isSpaMode) && (route.HydrateFallback || !manifestRoute.hasLoader)) delete context.staticHandlerContext.loaderData[routeId];
	}
	let router = createStaticRouter(routes, context.staticHandlerContext, { branches: context.branches });
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FrameworkContext.Provider, { value: {
		manifest,
		routeModules,
		criticalCss,
		serverHandoffString,
		future: context.future,
		ssr: context.ssr,
		isSpaMode: context.isSpaMode,
		routeDiscovery: context.routeDiscovery,
		nonce,
		serializeError: context.serializeError,
		renderMeta: context.renderMeta
	} }, /* @__PURE__ */ React.createElement(RemixErrorBoundary, { location: router.state.location }, /* @__PURE__ */ React.createElement(StaticRouterProvider, {
		router,
		context: context.staticHandlerContext,
		hydrate: false
	}))), context.serverHandoffStream ? /* @__PURE__ */ React.createElement(React.Suspense, null, /* @__PURE__ */ React.createElement(StreamTransfer, {
		context,
		identifier: 0,
		reader: context.serverHandoffStream.getReader(),
		textDecoder: new TextDecoder(),
		nonce
	})) : null);
}
function createRoutesStub(routes, _context) {
	return function RoutesTestStub({ initialEntries, initialIndex, hydrationData, future }) {
		let routerRef = React.useRef();
		let frameworkContextRef = React.useRef();
		if (routerRef.current == null) {
			frameworkContextRef.current = {
				future: {
					v8_passThroughRequests: future?.v8_passThroughRequests === true,
					v8_middleware: future?.v8_middleware === true,
					v8_trailingSlashAwareDataRequests: future?.v8_trailingSlashAwareDataRequests === true
				},
				manifest: {
					routes: {},
					entry: {
						imports: [],
						module: ""
					},
					url: "",
					version: ""
				},
				routeModules: {},
				ssr: false,
				isSpaMode: false,
				routeDiscovery: {
					mode: "lazy",
					manifestPath: "/__manifest"
				}
			};
			routerRef.current = createMemoryRouter(processRoutes(convertRoutesToDataRoutes(routes, (r) => r), _context !== void 0 ? _context : future?.v8_middleware ? new RouterContextProvider() : {}, frameworkContextRef.current.manifest, frameworkContextRef.current.routeModules), {
				initialEntries,
				initialIndex,
				hydrationData
			});
		}
		return /* @__PURE__ */ React.createElement(FrameworkContext.Provider, { value: frameworkContextRef.current }, /* @__PURE__ */ React.createElement(RouterProvider$1, { router: routerRef.current }));
	};
}
function processRoutes(routes, context, manifest, routeModules, parentId) {
	return routes.map((route) => {
		if (!route.id) throw new Error("Expected a route.id in react-router processRoutes() function");
		let newRoute = {
			id: route.id,
			path: route.path,
			index: route.index,
			Component: route.Component ? withComponentProps(route.Component) : void 0,
			HydrateFallback: route.HydrateFallback ? withHydrateFallbackProps(route.HydrateFallback) : void 0,
			ErrorBoundary: route.ErrorBoundary ? withErrorBoundaryProps(route.ErrorBoundary) : void 0,
			action: route.action ? (args) => route.action({
				...args,
				context
			}) : void 0,
			loader: route.loader ? (args) => route.loader({
				...args,
				context
			}) : void 0,
			middleware: route.middleware ? route.middleware.map((mw) => (...args) => mw({
				...args[0],
				context
			}, args[1])) : void 0,
			handle: route.handle,
			shouldRevalidate: route.shouldRevalidate
		};
		let entryRoute = {
			id: route.id,
			path: route.path,
			index: route.index,
			parentId,
			hasAction: route.action != null,
			hasLoader: route.loader != null,
			hasClientAction: false,
			hasClientLoader: false,
			hasClientMiddleware: false,
			hasErrorBoundary: route.ErrorBoundary != null,
			module: "build/stub-path-to-module.js",
			clientActionModule: void 0,
			clientLoaderModule: void 0,
			clientMiddlewareModule: void 0,
			hydrateFallbackModule: void 0
		};
		manifest.routes[newRoute.id] = entryRoute;
		routeModules[route.id] = {
			default: newRoute.Component || Outlet,
			ErrorBoundary: newRoute.ErrorBoundary || void 0,
			handle: route.handle,
			links: route.links,
			meta: route.meta,
			shouldRevalidate: route.shouldRevalidate
		};
		if (route.children) newRoute.children = processRoutes(route.children, context, manifest, routeModules, newRoute.id);
		return newRoute;
	});
}
function byteStringToUint8Array(byteString) {
	let array = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) array[i] = byteString.charCodeAt(i);
	return array;
}
async function encodeCookieValue(value, secrets) {
	let encoded = encodeData(value);
	if (secrets.length > 0) encoded = await sign(encoded, secrets[0]);
	return encoded;
}
async function decodeCookieValue(value, secrets) {
	if (secrets.length > 0) {
		for (let secret of secrets) {
			let unsignedValue = await unsign(value, secret);
			if (unsignedValue !== false) return decodeData(unsignedValue);
		}
		return null;
	}
	return decodeData(value);
}
function encodeData(value) {
	return btoa(myUnescape(encodeURIComponent(JSON.stringify(value))));
}
function decodeData(value) {
	try {
		return JSON.parse(decodeURIComponent(myEscape(atob(value))));
	} catch (e) {
		return {};
	}
}
function myEscape(value) {
	let str = value.toString();
	let result = "";
	let index = 0;
	let chr, code;
	while (index < str.length) {
		chr = str.charAt(index++);
		if (/[\w*+\-./@]/.exec(chr)) result += chr;
		else {
			code = chr.charCodeAt(0);
			if (code < 256) result += "%" + hex(code, 2);
			else result += "%u" + hex(code, 4).toUpperCase();
		}
	}
	return result;
}
function hex(code, length) {
	let result = code.toString(16);
	while (result.length < length) result = "0" + result;
	return result;
}
function myUnescape(value) {
	let str = value.toString();
	let result = "";
	let index = 0;
	let chr, part;
	while (index < str.length) {
		chr = str.charAt(index++);
		if (chr === "%") if (str.charAt(index) === "u") {
			part = str.slice(index + 1, index + 5);
			if (/^[\da-f]{4}$/i.exec(part)) {
				result += String.fromCharCode(parseInt(part, 16));
				index += 5;
				continue;
			}
		} else {
			part = str.slice(index, index + 2);
			if (/^[\da-f]{2}$/i.exec(part)) {
				result += String.fromCharCode(parseInt(part, 16));
				index += 2;
				continue;
			}
		}
		result += chr;
	}
	return result;
}
function warnOnceAboutExpiresCookie(name, expires) {
	warnOnce(!expires, `The "${name}" cookie has an "expires" property set. This will cause the expires value to not be updated when the session is committed. Instead, you should set the expires value when serializing the cookie. You can use \`commitSession(session, { expires })\` if using a session storage object, or \`cookie.serialize("value", { expires })\` if you're using the cookie directly.`);
}
function createEntryRouteModules(manifest) {
	return Object.keys(manifest).reduce((memo, routeId) => {
		let route = manifest[routeId];
		if (route) memo[routeId] = route.module;
		return memo;
	}, {});
}
function isServerMode(value) {
	return value === "development" || value === "production" || value === "test";
}
function sanitizeError(error, serverMode) {
	if (error instanceof Error && serverMode !== "development") {
		let sanitized = /* @__PURE__ */ new Error("Unexpected Server Error");
		sanitized.stack = void 0;
		return sanitized;
	}
	return error;
}
function sanitizeErrors(errors, serverMode) {
	return Object.entries(errors).reduce((acc, [routeId, error]) => {
		return Object.assign(acc, { [routeId]: sanitizeError(error, serverMode) });
	}, {});
}
function serializeError(error, serverMode) {
	let sanitized = sanitizeError(error, serverMode);
	return {
		message: sanitized.message,
		stack: sanitized.stack
	};
}
function invariant(value, message) {
	if (value === false || value === null || typeof value === "undefined") {
		console.error("The following error is a bug in React Router; please open an issue! https://github.com/remix-run/react-router/issues/new/choose");
		throw new Error(message);
	}
}
function matchServerRoutes(manifest, dataRoutes, branches, pathname, basename) {
	let matches = matchRoutesImpl(dataRoutes, pathname, basename ?? "/", false, branches);
	if (!matches) return null;
	return matches.map((match) => {
		let route = manifest[match.route.id];
		invariant(route, `Route with id "${match.route.id}" not found in manifest.`);
		return {
			params: match.params,
			pathname: match.pathname,
			route
		};
	});
}
async function callRouteHandler(handler, args, future) {
	let result = await handler({
		request: future.v8_passThroughRequests ? args.request : stripRoutesParam(stripIndexParam(args.request)),
		url: args.url,
		params: args.params,
		context: args.context,
		pattern: args.pattern
	});
	if (isDataWithResponseInit(result) && result.init && result.init.status && isRedirectStatusCode(result.init.status)) throw new Response(null, result.init);
	return result;
}
function stripIndexParam(request) {
	let url = new URL(request.url);
	let indexValues = url.searchParams.getAll("index");
	url.searchParams.delete("index");
	let indexValuesToKeep = [];
	for (let indexValue of indexValues) if (indexValue) indexValuesToKeep.push(indexValue);
	for (let toKeep of indexValuesToKeep) url.searchParams.append("index", toKeep);
	let init = {
		method: request.method,
		body: request.body,
		headers: request.headers,
		signal: request.signal
	};
	if (init.body) init.duplex = "half";
	return new Request(url.href, init);
}
function stripRoutesParam(request) {
	let url = new URL(request.url);
	url.searchParams.delete("_routes");
	let init = {
		method: request.method,
		body: request.body,
		headers: request.headers,
		signal: request.signal
	};
	if (init.body) init.duplex = "half";
	return new Request(url.href, init);
}
function setDevServerHooks(devServerHooks) {
	globalThis[globalDevServerHooksKey] = devServerHooks;
}
function getDevServerHooks() {
	return globalThis[globalDevServerHooksKey];
}
function getBuildTimeHeader(request, headerName) {
	if (typeof process !== "undefined") try {
		if (process.env.hasOwnProperty("IS_RR_BUILD_REQUEST") && process.env.IS_RR_BUILD_REQUEST === "yes") return request.headers.get(headerName);
	} catch (e) {}
	return null;
}
function groupRoutesByParentId(manifest) {
	let routes = {};
	Object.values(manifest).forEach((route) => {
		if (route) {
			let parentId = route.parentId || "";
			if (!routes[parentId]) routes[parentId] = [];
			routes[parentId].push(route);
		}
	});
	return routes;
}
function createStaticHandlerDataRoutes(manifest, future, parentId = "", routesByParentId = groupRoutesByParentId(manifest)) {
	return (routesByParentId[parentId] || []).map((route) => {
		let commonRoute = {
			hasErrorBoundary: route.id === "root" || route.module.ErrorBoundary != null,
			id: route.id,
			path: route.path,
			middleware: route.module.middleware,
			loader: route.module.loader ? async (args) => {
				let preRenderedData = getBuildTimeHeader(args.request, "X-React-Router-Prerender-Data");
				if (preRenderedData != null) {
					let encoded = preRenderedData ? decodeURI(preRenderedData) : preRenderedData;
					invariant(encoded, "Missing prerendered data for route");
					let uint8array = new TextEncoder().encode(encoded);
					let data2 = (await decodeViaTurboStream(new ReadableStream({ start(controller) {
						controller.enqueue(uint8array);
						controller.close();
					} }), global)).value;
					if (data2 && SingleFetchRedirectSymbol in data2) {
						let result = data2[SingleFetchRedirectSymbol];
						let init = { status: result.status };
						if (result.reload) throw redirectDocument(result.redirect, init);
						else if (result.replace) throw replace(result.redirect, init);
						else throw redirect(result.redirect, init);
					} else {
						invariant(data2 && route.id in data2, "Unable to decode prerendered data");
						let result = data2[route.id];
						invariant("data" in result, "Unable to process prerendered data");
						return result.data;
					}
				}
				return await callRouteHandler(route.module.loader, args, future);
			} : void 0,
			action: route.module.action ? (args) => callRouteHandler(route.module.action, args, future) : void 0,
			handle: route.module.handle
		};
		return route.index ? {
			index: true,
			...commonRoute
		} : {
			caseSensitive: route.caseSensitive,
			children: createStaticHandlerDataRoutes(manifest, future, route.id, routesByParentId),
			...commonRoute
		};
	});
}
function createServerHandoffString(serverHandoff) {
	return escapeHtml(JSON.stringify(serverHandoff));
}
function getDocumentHeaders(context, build) {
	return getDocumentHeadersImpl(context, (m) => {
		let route = build.routes[m.route.id];
		invariant(route, `Route with id "${m.route.id}" not found in build`);
		return route.module.headers;
	});
}
function getDocumentHeadersImpl(context, getRouteHeadersFn, _defaultHeaders) {
	let boundaryIdx = context.errors ? context.matches.findIndex((m) => context.errors[m.route.id]) : -1;
	let matches = boundaryIdx >= 0 ? context.matches.slice(0, boundaryIdx + 1) : context.matches;
	let errorHeaders;
	if (boundaryIdx >= 0) {
		let { actionHeaders, actionData, loaderHeaders, loaderData } = context;
		context.matches.slice(boundaryIdx).some((match) => {
			let id = match.route.id;
			if (actionHeaders[id] && (!actionData || !actionData.hasOwnProperty(id))) errorHeaders = actionHeaders[id];
			else if (loaderHeaders[id] && !loaderData.hasOwnProperty(id)) errorHeaders = loaderHeaders[id];
			return errorHeaders != null;
		});
	}
	const defaultHeaders = new Headers(_defaultHeaders);
	return matches.reduce((parentHeaders, match, idx) => {
		let { id } = match.route;
		let loaderHeaders = context.loaderHeaders[id] || new Headers();
		let actionHeaders = context.actionHeaders[id] || new Headers();
		let includeErrorHeaders = errorHeaders != null && idx === matches.length - 1;
		let includeErrorCookies = includeErrorHeaders && errorHeaders !== loaderHeaders && errorHeaders !== actionHeaders;
		let headersFn = getRouteHeadersFn(match);
		if (headersFn == null) {
			let headers2 = new Headers(parentHeaders);
			if (includeErrorCookies) prependCookies(errorHeaders, headers2);
			prependCookies(actionHeaders, headers2);
			prependCookies(loaderHeaders, headers2);
			return headers2;
		}
		let headers = new Headers(typeof headersFn === "function" ? headersFn({
			loaderHeaders,
			parentHeaders,
			actionHeaders,
			errorHeaders: includeErrorHeaders ? errorHeaders : void 0
		}) : headersFn);
		if (includeErrorCookies) prependCookies(errorHeaders, headers);
		prependCookies(actionHeaders, headers);
		prependCookies(loaderHeaders, headers);
		prependCookies(parentHeaders, headers);
		return headers;
	}, new Headers(defaultHeaders));
}
function prependCookies(parentHeaders, childHeaders) {
	let parentSetCookieString = parentHeaders.get("Set-Cookie");
	if (parentSetCookieString) {
		let cookies = splitCookiesString(parentSetCookieString);
		let childCookies = new Set(childHeaders.getSetCookie());
		cookies.forEach((cookie) => {
			if (!childCookies.has(cookie)) childHeaders.append("Set-Cookie", cookie);
		});
	}
}
function throwIfPotentialCSRFAttack(request, allowedActionOrigins) {
	let originHeader = request.headers.get("origin");
	let originDomain = null;
	try {
		originDomain = typeof originHeader === "string" && originHeader !== "null" ? new URL(originHeader).host : originHeader;
	} catch {
		throw new Error(`\`origin\` header is not a valid URL. Aborting the action.`);
	}
	let host = new URL(request.url).host;
	if (originDomain && originDomain !== host) {
		if (!isAllowedOrigin(originDomain, allowedActionOrigins)) throw new Error("The `request.url` host does not match `origin` header from a forwarded action request. Aborting the action.");
	}
}
function matchWildcardDomain(domain, pattern) {
	const domainParts = domain.split(".");
	const patternParts = pattern.split(".");
	if (patternParts.length < 1) return false;
	if (domainParts.length < patternParts.length) return false;
	while (patternParts.length) {
		const patternPart = patternParts.pop();
		const domainPart = domainParts.pop();
		switch (patternPart) {
			case "": return false;
			case "*": if (domainPart) continue;
			else return false;
			case "**":
				if (patternParts.length > 0) return false;
				return domainPart !== void 0;
			case void 0:
			default: if (domainPart !== patternPart) return false;
		}
	}
	return domainParts.length === 0;
}
function isAllowedOrigin(originDomain, allowedActionOrigins = []) {
	return allowedActionOrigins.some((allowedOrigin) => allowedOrigin && (allowedOrigin === originDomain || matchWildcardDomain(originDomain, allowedOrigin)));
}
function getNormalizedPath(request, basename, future) {
	basename = basename || "/";
	let url = new URL(request.url);
	let pathname = url.pathname;
	if (future?.v8_trailingSlashAwareDataRequests) if (pathname.endsWith("/_.data")) pathname = pathname.replace(/_\.data$/, "");
	else pathname = pathname.replace(/\.data$/, "");
	else {
		if (stripBasename(pathname, basename) === "/_root.data") pathname = basename;
		else if (pathname.endsWith(".data")) pathname = pathname.replace(/\.data$/, "");
		if (stripBasename(pathname, basename) !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	}
	let searchParams = new URLSearchParams(url.search);
	searchParams.delete("_routes");
	let search = searchParams.toString();
	if (search) search = `?${search}`;
	return {
		pathname,
		search,
		hash: ""
	};
}
async function singleFetchAction(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError) {
	try {
		try {
			throwIfPotentialCSRFAttack(request, Array.isArray(build.allowedActionOrigins) ? build.allowedActionOrigins : []);
		} catch (e) {
			return handleQueryError(/* @__PURE__ */ new Error("Bad Request"), 400);
		}
		let handlerRequest = build.future.v8_passThroughRequests ? request : new Request(handlerUrl, {
			method: request.method,
			body: request.body,
			headers: request.headers,
			signal: request.signal,
			...request.body ? { duplex: "half" } : void 0
		});
		return handleQueryResult(await staticHandler.query(handlerRequest, {
			requestContext: loadContext,
			skipLoaderErrorBubbling: true,
			skipRevalidation: true,
			generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
				try {
					return handleQueryResult(await query(handlerRequest));
				} catch (error) {
					return handleQueryError(error);
				}
			} : void 0,
			normalizePath: (r) => getNormalizedPath(r, build.basename, build.future)
		}));
	} catch (error) {
		return handleQueryError(error);
	}
	function handleQueryResult(result) {
		return isResponse(result) ? result : staticContextToResponse(result);
	}
	function handleQueryError(error, status = 500) {
		handleError(error);
		return generateSingleFetchResponse(request, build, serverMode, {
			result: { error },
			headers: new Headers(),
			status
		});
	}
	function staticContextToResponse(context) {
		let headers = getDocumentHeaders(context, build);
		if (isRedirectStatusCode(context.statusCode) && headers.has("Location")) return new Response(null, {
			status: context.statusCode,
			headers
		});
		if (context.errors) {
			Object.values(context.errors).forEach((err) => {
				if (!isRouteErrorResponse(err) || err.error) handleError(err);
			});
			context.errors = sanitizeErrors(context.errors, serverMode);
		}
		let singleFetchResult;
		if (context.errors) singleFetchResult = { error: Object.values(context.errors)[0] };
		else singleFetchResult = { data: Object.values(context.actionData || {})[0] };
		return generateSingleFetchResponse(request, build, serverMode, {
			result: singleFetchResult,
			headers,
			status: context.statusCode
		});
	}
}
async function singleFetchLoaders(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError) {
	let routesParam = new URL(request.url).searchParams.get("_routes");
	let loadRouteIds = routesParam ? new Set(routesParam.split(",")) : null;
	try {
		let handlerRequest = build.future.v8_passThroughRequests ? request : new Request(handlerUrl, {
			headers: request.headers,
			signal: request.signal
		});
		return handleQueryResult(await staticHandler.query(handlerRequest, {
			requestContext: loadContext,
			filterMatchesToLoad: (m) => !loadRouteIds || loadRouteIds.has(m.route.id),
			skipLoaderErrorBubbling: true,
			generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
				try {
					return handleQueryResult(await query(handlerRequest));
				} catch (error) {
					return handleQueryError(error);
				}
			} : void 0,
			normalizePath: (r) => getNormalizedPath(r, build.basename, build.future)
		}));
	} catch (error) {
		return handleQueryError(error);
	}
	function handleQueryResult(result) {
		return isResponse(result) ? result : staticContextToResponse(result);
	}
	function handleQueryError(error) {
		handleError(error);
		return generateSingleFetchResponse(request, build, serverMode, {
			result: { error },
			headers: new Headers(),
			status: 500
		});
	}
	function staticContextToResponse(context) {
		let headers = getDocumentHeaders(context, build);
		if (isRedirectStatusCode(context.statusCode) && headers.has("Location")) return new Response(null, {
			status: context.statusCode,
			headers
		});
		if (context.errors) {
			Object.values(context.errors).forEach((err) => {
				if (!isRouteErrorResponse(err) || err.error) handleError(err);
			});
			context.errors = sanitizeErrors(context.errors, serverMode);
		}
		let results = {};
		let loadedMatches = new Set(context.matches.filter((m) => loadRouteIds ? loadRouteIds.has(m.route.id) : m.route.loader != null).map((m) => m.route.id));
		if (context.errors) for (let [id, error] of Object.entries(context.errors)) results[id] = { error };
		for (let [id, data2] of Object.entries(context.loaderData)) if (!(id in results) && loadedMatches.has(id)) results[id] = { data: data2 };
		return generateSingleFetchResponse(request, build, serverMode, {
			result: results,
			headers,
			status: context.statusCode
		});
	}
}
function generateSingleFetchResponse(request, build, serverMode, { result, headers, status }) {
	let resultHeaders = new Headers(headers);
	resultHeaders.set("X-Remix-Response", "yes");
	if (SERVER_NO_BODY_STATUS_CODES.has(status)) return new Response(null, {
		status,
		headers: resultHeaders
	});
	resultHeaders.set("Content-Type", "text/x-script");
	resultHeaders.delete("Content-Length");
	return new Response(encodeViaTurboStream(result, request.signal, build.entry.module.streamTimeout, serverMode), {
		status: status || 200,
		headers: resultHeaders
	});
}
function generateSingleFetchRedirectResponse(redirectResponse, request, build, serverMode) {
	let redirect2 = getSingleFetchRedirect(redirectResponse.status, redirectResponse.headers, build.basename);
	let headers = new Headers(redirectResponse.headers);
	headers.delete("Location");
	headers.set("Content-Type", "text/x-script");
	return generateSingleFetchResponse(request, build, serverMode, {
		result: request.method === "GET" ? { [SingleFetchRedirectSymbol]: redirect2 } : redirect2,
		headers,
		status: 202
	});
}
function getSingleFetchRedirect(status, headers, basename) {
	let redirect2 = headers.get("Location");
	if (basename) redirect2 = stripBasename(redirect2, basename) || redirect2;
	return {
		redirect: redirect2,
		status,
		revalidate: headers.has("X-Remix-Revalidate") || headers.has("Set-Cookie"),
		reload: headers.has("X-Remix-Reload-Document"),
		replace: headers.has("X-Remix-Replace")
	};
}
function encodeViaTurboStream(data2, requestSignal, streamTimeout, serverMode) {
	let controller = new AbortController();
	let timeoutId = setTimeout(() => {
		controller.abort(/* @__PURE__ */ new Error("Server Timeout"));
		cleanupCallbacks();
	}, typeof streamTimeout === "number" ? streamTimeout : 4950);
	let abortControllerOnRequestAbort = () => {
		controller.abort(requestSignal.reason);
		cleanupCallbacks();
	};
	requestSignal.addEventListener("abort", abortControllerOnRequestAbort);
	let cleanupCallbacks = () => {
		clearTimeout(timeoutId);
		requestSignal.removeEventListener("abort", abortControllerOnRequestAbort);
	};
	return encode(data2, {
		signal: controller.signal,
		onComplete: cleanupCallbacks,
		plugins: [(value) => {
			if (value instanceof Error) {
				let { name, message, stack } = serverMode === "production" ? sanitizeError(value, serverMode) : value;
				return [
					"SanitizedError",
					name,
					message,
					stack
				];
			}
			if (value instanceof ErrorResponseImpl) {
				let { data: data3, status, statusText } = value;
				return [
					"ErrorResponse",
					data3,
					status,
					statusText
				];
			}
			if (value && typeof value === "object" && SingleFetchRedirectSymbol in value) return ["SingleFetchRedirect", value[SingleFetchRedirectSymbol]];
		}],
		postPlugins: [(value) => {
			if (!value) return;
			if (typeof value !== "object") return;
			return ["SingleFetchClassInstance", Object.fromEntries(Object.entries(value))];
		}, () => ["SingleFetchFallback"]]
	});
}
function derive(build, mode) {
	let dataRoutes = createStaticHandlerDataRoutes(build.routes, build.future);
	let serverMode = isServerMode(mode) ? mode : "production";
	let staticHandler = createStaticHandler(dataRoutes, {
		basename: build.basename,
		instrumentations: build.entry.module.instrumentations,
		future: build.future
	});
	let errorHandler = build.entry.module.handleError || ((error, { request }) => {
		if (serverMode !== "test" && !request.signal.aborted) console.error(isRouteErrorResponse(error) && error.error ? error.error : error);
	});
	let requestHandler = async (request, initialContext) => {
		let params = {};
		let loadContext;
		let handleError = (error) => {
			if (mode === "development") getDevServerHooks()?.processRequestError?.(error);
			errorHandler(error, {
				context: loadContext,
				params,
				request
			});
		};
		if (build.future.v8_middleware) {
			if (initialContext && !(initialContext instanceof RouterContextProvider)) {
				let error = /* @__PURE__ */ new Error("Invalid `context` value provided to `handleRequest`. When middleware is enabled you must return an instance of `RouterContextProvider` from your `getLoadContext` function.");
				handleError(error);
				return returnLastResortErrorResponse(error, serverMode);
			}
			loadContext = initialContext || new RouterContextProvider();
		} else loadContext = initialContext || {};
		let requestUrl = new URL(request.url);
		let normalizedPathname = getNormalizedPath(request, build.basename, build.future).pathname;
		let isSpaMode = getBuildTimeHeader(request, "X-React-Router-SPA-Mode") === "yes";
		if (!build.ssr) {
			let decodedPath = decodeURI(normalizedPathname);
			if (build.basename && build.basename !== "/") {
				let strippedPath = stripBasename(decodedPath, build.basename);
				if (strippedPath == null) {
					errorHandler(new ErrorResponseImpl(404, "Not Found", `Refusing to prerender the \`${decodedPath}\` path because it does not start with the basename \`${build.basename}\``), {
						context: loadContext,
						params,
						request
					});
					return new Response("Not Found", {
						status: 404,
						statusText: "Not Found"
					});
				}
				decodedPath = strippedPath;
			}
			if (build.prerender.length === 0) isSpaMode = true;
			else if (!build.prerender.includes(decodedPath.replace(/\/$/, "")) && !build.prerender.includes(decodedPath.replace(/[^/]$/, "/"))) if (requestUrl.pathname.endsWith(".data")) {
				errorHandler(new ErrorResponseImpl(404, "Not Found", `Refusing to SSR the path \`${decodedPath}\` because \`ssr:false\` is set and the path is not included in the \`prerender\` config, so in production the path will be a 404.`), {
					context: loadContext,
					params,
					request
				});
				return new Response("Not Found", {
					status: 404,
					statusText: "Not Found"
				});
			} else isSpaMode = true;
		}
		let manifestUrl = getManifestPath(build.routeDiscovery.manifestPath, build.basename);
		if (build.routeDiscovery.mode === "lazy" && requestUrl.pathname === manifestUrl) try {
			return await handleManifestRequest(build, staticHandler.dataRoutes, staticHandler._internalRouteBranches, requestUrl);
		} catch (e) {
			handleError(e);
			return new Response("Unknown Server Error", { status: 500 });
		}
		let matches = matchServerRoutes(build.routes, staticHandler.dataRoutes, staticHandler._internalRouteBranches, normalizedPathname, build.basename);
		if (matches && matches.length > 0) Object.assign(params, matches[0].params);
		let response;
		if (requestUrl.pathname.endsWith(".data")) {
			response = await handleSingleFetchRequest(serverMode, build, staticHandler, request, normalizedPathname, loadContext, handleError);
			if (isRedirectResponse(response)) response = generateSingleFetchRedirectResponse(response, request, build, serverMode);
			if (build.entry.module.handleDataRequest) {
				response = await build.entry.module.handleDataRequest(response, {
					context: loadContext,
					params: matches ? matches[0].params : {},
					request
				});
				if (isRedirectResponse(response)) response = generateSingleFetchRedirectResponse(response, request, build, serverMode);
			}
		} else if (!isSpaMode && matches && matches[matches.length - 1].route.module.default == null && matches[matches.length - 1].route.module.ErrorBoundary == null) response = await handleResourceRequest(serverMode, build, staticHandler, matches.slice(-1)[0].route.id, request, loadContext, handleError);
		else {
			let { pathname } = requestUrl;
			let criticalCss = void 0;
			if (build.unstable_getCriticalCss) criticalCss = await build.unstable_getCriticalCss({ pathname });
			else if (mode === "development" && getDevServerHooks()?.getCriticalCss) criticalCss = await getDevServerHooks()?.getCriticalCss?.(pathname);
			response = await handleDocumentRequest(serverMode, build, staticHandler, request, loadContext, handleError, isSpaMode, criticalCss);
		}
		if (request.method === "HEAD") return new Response(null, {
			headers: response.headers,
			status: response.status,
			statusText: response.statusText
		});
		return response;
	};
	if (build.entry.module.instrumentations) requestHandler = instrumentHandler(requestHandler, build.entry.module.instrumentations.map((i) => i.handler).filter(Boolean));
	return {
		serverMode,
		staticHandler,
		errorHandler,
		requestHandler
	};
}
async function handleManifestRequest(build, dataRoutes, branches, url) {
	if (url.toString().length > 7680) return new Response(null, {
		statusText: "Bad Request",
		status: 400
	});
	if (build.assets.version !== url.searchParams.get("version")) return new Response(null, {
		status: 204,
		headers: { "X-Remix-Reload-Document": "true" }
	});
	let patches = {};
	if (url.searchParams.has("paths")) {
		let pathParam = url.searchParams.get("paths") || "";
		let paths = new Set(pathParam.split(",").filter(Boolean));
		for (let path of paths) {
			if (!path.startsWith("/")) path = `/${path}`;
			let matches = matchServerRoutes(build.routes, dataRoutes, branches, path, build.basename);
			if (matches) for (let match of matches) {
				let routeId = match.route.id;
				let route = build.assets.routes[routeId];
				if (route) patches[routeId] = route;
			}
		}
		return Response.json(patches, { headers: { "Cache-Control": "public, max-age=31536000, immutable" } });
	}
	return new Response("Invalid Request", { status: 400 });
}
async function handleSingleFetchRequest(serverMode, build, staticHandler, request, normalizedPath, loadContext, handleError) {
	let handlerUrl = new URL(request.url);
	handlerUrl.pathname = normalizedPath;
	return isMutationMethod(request.method) ? await singleFetchAction(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError) : await singleFetchLoaders(build, serverMode, staticHandler, request, handlerUrl, loadContext, handleError);
}
async function handleDocumentRequest(serverMode, build, staticHandler, request, loadContext, handleError, isSpaMode, criticalCss) {
	try {
		if (isMutationMethod(request.method)) try {
			throwIfPotentialCSRFAttack(request, Array.isArray(build.allowedActionOrigins) ? build.allowedActionOrigins : []);
		} catch (e) {
			handleError(e);
			return new Response("Bad Request", { status: 400 });
		}
		let result = await staticHandler.query(request, {
			requestContext: loadContext,
			generateMiddlewareResponse: build.future.v8_middleware ? async (query) => {
				try {
					let innerResult = await query(request);
					if (!isResponse(innerResult)) innerResult = await renderHtml(innerResult, isSpaMode);
					return innerResult;
				} catch (error) {
					handleError(error);
					return new Response(null, { status: 500 });
				}
			} : void 0,
			normalizePath: (r) => getNormalizedPath(r, build.basename, build.future)
		});
		if (!isResponse(result)) result = await renderHtml(result, isSpaMode);
		return result;
	} catch (error) {
		handleError(error);
		return new Response(null, { status: 500 });
	}
	async function renderHtml(context, isSpaMode2) {
		let headers = getDocumentHeaders(context, build);
		if (SERVER_NO_BODY_STATUS_CODES.has(context.statusCode)) return new Response(null, {
			status: context.statusCode,
			headers
		});
		if (context.errors) {
			Object.values(context.errors).forEach((err) => {
				if (!isRouteErrorResponse(err) || err.error) handleError(err);
			});
			context.errors = sanitizeErrors(context.errors, serverMode);
		}
		let state = {
			loaderData: context.loaderData,
			actionData: context.actionData,
			errors: context.errors
		};
		let baseServerHandoff = {
			basename: build.basename,
			future: build.future,
			routeDiscovery: build.routeDiscovery,
			ssr: build.ssr,
			isSpaMode: isSpaMode2
		};
		let entryContext = {
			manifest: build.assets,
			branches: staticHandler._internalRouteBranches,
			routeModules: createEntryRouteModules(build.routes),
			staticHandlerContext: context,
			criticalCss,
			serverHandoffString: createServerHandoffString({
				...baseServerHandoff,
				criticalCss
			}),
			serverHandoffStream: encodeViaTurboStream(state, request.signal, build.entry.module.streamTimeout, serverMode),
			renderMeta: {},
			future: build.future,
			ssr: build.ssr,
			routeDiscovery: build.routeDiscovery,
			isSpaMode: isSpaMode2,
			serializeError: (err) => serializeError(err, serverMode)
		};
		let handleDocumentRequestFunction = build.entry.module.default;
		try {
			return await handleDocumentRequestFunction(request, context.statusCode, headers, entryContext, loadContext);
		} catch (error) {
			handleError(error);
			let errorForSecondRender = error;
			if (isResponse(error)) try {
				let data2 = await unwrapResponse(error);
				errorForSecondRender = new ErrorResponseImpl(error.status, error.statusText, data2);
			} catch (e) {}
			context = getStaticContextFromError(staticHandler.dataRoutes, context, errorForSecondRender);
			if (context.errors) context.errors = sanitizeErrors(context.errors, serverMode);
			let state2 = {
				loaderData: context.loaderData,
				actionData: context.actionData,
				errors: context.errors
			};
			entryContext = {
				...entryContext,
				staticHandlerContext: context,
				serverHandoffString: createServerHandoffString(baseServerHandoff),
				serverHandoffStream: encodeViaTurboStream(state2, request.signal, build.entry.module.streamTimeout, serverMode),
				renderMeta: {}
			};
			try {
				return await handleDocumentRequestFunction(request, context.statusCode, headers, entryContext, loadContext);
			} catch (error2) {
				handleError(error2);
				return returnLastResortErrorResponse(error2, serverMode);
			}
		}
	}
}
async function handleResourceRequest(serverMode, build, staticHandler, routeId, request, loadContext, handleError) {
	try {
		return handleQueryRouteResult(await staticHandler.queryRoute(request, {
			routeId,
			requestContext: loadContext,
			generateMiddlewareResponse: build.future.v8_middleware ? async (queryRoute) => {
				try {
					return handleQueryRouteResult(await queryRoute(request));
				} catch (error) {
					return handleQueryRouteError(error);
				}
			} : void 0,
			normalizePath: (r) => getNormalizedPath(r, build.basename, build.future)
		}));
	} catch (error) {
		return handleQueryRouteError(error);
	}
	function handleQueryRouteResult(result) {
		if (isResponse(result)) return result;
		if (typeof result === "string") return new Response(result);
		return Response.json(result);
	}
	function handleQueryRouteError(error) {
		if (isResponse(error)) return error;
		if (isRouteErrorResponse(error)) {
			handleError(error);
			return errorResponseToJson(error, serverMode);
		}
		if (error instanceof Error && error.message === "Expected a response from queryRoute") {
			let newError = /* @__PURE__ */ new Error("Expected a Response to be returned from resource route handler");
			handleError(newError);
			return returnLastResortErrorResponse(newError, serverMode);
		}
		handleError(error);
		return returnLastResortErrorResponse(error, serverMode);
	}
}
function errorResponseToJson(errorResponse, serverMode) {
	return Response.json(serializeError(errorResponse.error || /* @__PURE__ */ new Error("Unexpected Server Error"), serverMode), {
		status: errorResponse.status,
		statusText: errorResponse.statusText
	});
}
function returnLastResortErrorResponse(error, serverMode) {
	let message = "Unexpected Server Error";
	if (serverMode !== "production") message += `

${String(error)}`;
	return new Response(message, {
		status: 500,
		headers: { "Content-Type": "text/plain" }
	});
}
function unwrapResponse(response) {
	let contentType = response.headers.get("Content-Type");
	return contentType && /\bapplication\/json\b/.test(contentType) ? response.body == null ? null : response.json() : response.text();
}
function flash(name) {
	return `__flash_${name}__`;
}
function createSessionStorage({ cookie: cookieArg, createData, readData, updateData, deleteData }) {
	let cookie = isCookie(cookieArg) ? cookieArg : createCookie(cookieArg?.name || "__session", cookieArg);
	warnOnceAboutSigningSessionCookie(cookie);
	return {
		async getSession(cookieHeader, options) {
			let id = cookieHeader && await cookie.parse(cookieHeader, options);
			return createSession(id && await readData(id) || {}, id || "");
		},
		async commitSession(session, options) {
			let { id, data: data2 } = session;
			let expires = options?.maxAge != null ? new Date(Date.now() + options.maxAge * 1e3) : options?.expires != null ? options.expires : cookie.expires;
			if (id) await updateData(id, data2, expires);
			else id = await createData(data2, expires);
			return cookie.serialize(id, options);
		},
		async destroySession(session, options) {
			await deleteData(session.id);
			return cookie.serialize("", {
				...options,
				maxAge: void 0,
				expires: /* @__PURE__ */ new Date(0)
			});
		}
	};
}
function warnOnceAboutSigningSessionCookie(cookie) {
	warnOnce(cookie.isSigned, `The "${cookie.name}" cookie is not signed, but session cookies should be signed to prevent tampering on the client before they are sent back to the server. See https://reactrouter.com/explanation/sessions-and-cookies#signing-cookies for more information.`);
}
function createCookieSessionStorage({ cookie: cookieArg } = {}) {
	let cookie = isCookie(cookieArg) ? cookieArg : createCookie(cookieArg?.name || "__session", cookieArg);
	warnOnceAboutSigningSessionCookie(cookie);
	return {
		async getSession(cookieHeader, options) {
			return createSession(cookieHeader && await cookie.parse(cookieHeader, options) || {});
		},
		async commitSession(session, options) {
			let serializedCookie = await cookie.serialize(session.data, options);
			if (serializedCookie.length > 4096) throw new Error("Cookie length will exceed browser maximum. Length: " + serializedCookie.length);
			return serializedCookie;
		},
		async destroySession(_session, options) {
			return cookie.serialize("", {
				...options,
				maxAge: void 0,
				expires: /* @__PURE__ */ new Date(0)
			});
		}
	};
}
function createMemorySessionStorage({ cookie } = {}) {
	let map = /* @__PURE__ */ new Map();
	return createSessionStorage({
		cookie,
		async createData(data2, expires) {
			let id = Math.random().toString(36).substring(2, 10);
			map.set(id, {
				data: data2,
				expires
			});
			return id;
		},
		async readData(id) {
			if (map.has(id)) {
				let { data: data2, expires } = map.get(id);
				if (!expires || expires > /* @__PURE__ */ new Date()) return data2;
				if (expires) map.delete(id);
			}
			return null;
		},
		async updateData(id, data2, expires) {
			map.set(id, {
				data: data2,
				expires
			});
		},
		async deleteData(id) {
			map.delete(id);
		}
	});
}
function href(path, ...args) {
	let params = args[0];
	let result = trimTrailingSplat(path).replace(/\/:([\w-]+)(\?)?/g, (_, param, questionMark) => {
		const isRequired = questionMark === void 0;
		const value = params?.[param];
		if (isRequired && value === void 0) throw new Error(`Path '${path}' requires param '${param}' but it was not provided`);
		return value === void 0 ? "" : "/" + value;
	});
	if (path.endsWith("*")) {
		const value = params?.["*"];
		if (value !== void 0) result += "/" + value;
	}
	return result || "/";
}
function trimTrailingSplat(path) {
	let i = path.length - 1;
	let char = path[i];
	if (char !== "*" && char !== "/") return path;
	i--;
	for (; i >= 0; i--) if (path[i] !== "/") break;
	return path.slice(0, i + 1);
}
function injectRSCPayload(rscStream) {
	let decoder = new TextDecoder();
	let resolveFlightDataPromise;
	let flightDataPromise = new Promise((resolve) => resolveFlightDataPromise = resolve);
	let startedRSC = false;
	let buffered = [];
	let timeout = null;
	function flushBufferedChunks(controller) {
		for (let chunk of buffered) {
			let buf = decoder.decode(chunk, { stream: true });
			if (buf.endsWith(trailer)) buf = buf.slice(0, -trailer.length);
			controller.enqueue(encoder2.encode(buf));
		}
		buffered.length = 0;
		timeout = null;
	}
	return new TransformStream({
		transform(chunk, controller) {
			buffered.push(chunk);
			if (timeout) return;
			timeout = setTimeout(async () => {
				flushBufferedChunks(controller);
				if (!startedRSC) {
					startedRSC = true;
					writeRSCStream(rscStream, controller).catch((err) => controller.error(err)).then(resolveFlightDataPromise);
				}
			}, 0);
		},
		async flush(controller) {
			await flightDataPromise;
			if (timeout) {
				clearTimeout(timeout);
				flushBufferedChunks(controller);
			}
			controller.enqueue(encoder2.encode("</body></html>"));
		}
	});
}
async function writeRSCStream(rscStream, controller) {
	let decoder = new TextDecoder("utf-8", { fatal: true });
	const reader = rscStream.getReader();
	try {
		let read;
		while ((read = await reader.read()) && !read.done) {
			const chunk = read.value;
			try {
				writeChunk(JSON.stringify(decoder.decode(chunk, { stream: true })), controller);
			} catch (e) {
				writeChunk(`Uint8Array.from(atob(${JSON.stringify(btoa(String.fromCodePoint(...chunk)))}), m => m.codePointAt(0))`, controller);
			}
		}
	} finally {
		reader.releaseLock();
	}
	let remaining = decoder.decode();
	if (remaining.length) writeChunk(JSON.stringify(remaining), controller);
}
function writeChunk(chunk, controller) {
	controller.enqueue(encoder2.encode(`<script>${escapeScript(`(self.__FLIGHT_DATA||=[]).push(${chunk})`)}<\/script>`));
}
function escapeScript(script) {
	return script.replace(/<!--/g, "<\\!--").replace(/<\/(script)/gi, "</\\$1");
}
function ErrorWrapper({ renderAppShell, title, children }) {
	if (!renderAppShell) return children;
	return /* @__PURE__ */ React3.createElement("html", { lang: "en" }, /* @__PURE__ */ React3.createElement("head", null, /* @__PURE__ */ React3.createElement("meta", { charSet: "utf-8" }), /* @__PURE__ */ React3.createElement("meta", {
		name: "viewport",
		content: "width=device-width,initial-scale=1,viewport-fit=cover"
	}), /* @__PURE__ */ React3.createElement("title", null, title)), /* @__PURE__ */ React3.createElement("body", null, /* @__PURE__ */ React3.createElement("main", { style: {
		fontFamily: "system-ui, sans-serif",
		padding: "2rem"
	} }, children)));
}
function RSCDefaultRootErrorBoundaryImpl({ error, renderAppShell }) {
	console.error(error);
	let heyDeveloper = /* @__PURE__ */ React3.createElement("script", { dangerouslySetInnerHTML: { __html: `
        console.log(
          "\u{1F4BF} Hey developer \u{1F44B}. You can provide a way better UX than this when your app throws errors. Check out https://reactrouter.com/how-to/error-boundary for more information."
        );
      ` } });
	if (isRouteErrorResponse(error)) return /* @__PURE__ */ React3.createElement(ErrorWrapper, {
		renderAppShell,
		title: "Unhandled Thrown Response!"
	}, /* @__PURE__ */ React3.createElement("h1", { style: { fontSize: "24px" } }, error.status, " ", error.statusText), heyDeveloper);
	let errorInstance;
	if (error instanceof Error) errorInstance = error;
	else {
		let errorString = error == null ? "Unknown Error" : typeof error === "object" && "toString" in error ? error.toString() : JSON.stringify(error);
		errorInstance = new Error(errorString);
	}
	return /* @__PURE__ */ React3.createElement(ErrorWrapper, {
		renderAppShell,
		title: "Application Error!"
	}, /* @__PURE__ */ React3.createElement("h1", { style: { fontSize: "24px" } }, "Application Error"), /* @__PURE__ */ React3.createElement("pre", { style: {
		padding: "2rem",
		background: "hsla(10, 50%, 50%, 0.1)",
		color: "red",
		overflow: "auto"
	} }, errorInstance.stack), heyDeveloper);
}
function RSCDefaultRootErrorBoundary({ hasRootLayout }) {
	let error = useRouteError();
	if (hasRootLayout === void 0) throw new Error("Missing 'hasRootLayout' prop");
	return /* @__PURE__ */ React3.createElement(RSCDefaultRootErrorBoundaryImpl, {
		renderAppShell: !hasRootLayout,
		error
	});
}
function createRSCRouteModules(payload) {
	const routeModules = {};
	for (const match of payload.matches) populateRSCRouteModules(routeModules, match);
	return routeModules;
}
function populateRSCRouteModules(routeModules, matches) {
	matches = Array.isArray(matches) ? matches : [matches];
	for (const match of matches) routeModules[match.id] = {
		links: match.links,
		meta: match.meta,
		default: noopComponent
	};
}
function useSafe(promise) {
	if (useImpl) return useImpl(promise);
	throw new Error("React Router v7 requires React 19+ for RSC features.");
}
async function routeRSCServerRequest({ request, serverResponse, createFromReadableStream, renderHTML, hydrate = true }) {
	const url = new URL(request.url);
	if (isReactServerRequest(url) || isManifestRequest(url) || request.headers.has("rsc-action-id") || serverResponse.headers.get("React-Router-Resource") === "true") return serverResponse;
	if (!serverResponse.body) throw new Error("Missing body in server response");
	const detectRedirectResponse = serverResponse.clone();
	let serverResponseB = null;
	if (hydrate) serverResponseB = serverResponse.clone();
	const body = serverResponse.body;
	let buffer;
	let streamControllers = [];
	const createStream = () => {
		if (!buffer) {
			buffer = [];
			return body.pipeThrough(new TransformStream({
				transform(chunk, controller) {
					buffer.push(chunk);
					controller.enqueue(chunk);
					streamControllers.forEach((c) => c.enqueue(chunk));
				},
				flush() {
					streamControllers.forEach((c) => c.close());
					streamControllers = [];
				}
			}));
		}
		return new ReadableStream({ start(controller) {
			buffer.forEach((chunk) => controller.enqueue(chunk));
			streamControllers.push(controller);
		} });
	};
	let deepestRenderedBoundaryId = null;
	const getPayload = () => {
		const payloadPromise = Promise.resolve(createFromReadableStream(createStream()));
		return Object.defineProperties(payloadPromise, {
			_deepestRenderedBoundaryId: {
				get() {
					return deepestRenderedBoundaryId;
				},
				set(boundaryId) {
					deepestRenderedBoundaryId = boundaryId;
				}
			},
			formState: { get() {
				return payloadPromise.then((payload) => payload.type === "render" ? payload.formState : void 0);
			} }
		});
	};
	let renderRedirect;
	let renderError;
	try {
		if (!detectRedirectResponse.body) throw new Error("Failed to clone server response");
		const payload = await createFromReadableStream(detectRedirectResponse.body);
		if (serverResponse.status === 202 && payload.type === "redirect") {
			if (hasInvalidProtocol(payload.location)) throw new Error("Invalid redirect location");
			const headers2 = new Headers(serverResponse.headers);
			headers2.delete("Content-Encoding");
			headers2.delete("Content-Length");
			headers2.delete("Content-Type");
			headers2.delete("X-Remix-Response");
			headers2.set("Location", payload.location);
			return new Response(serverResponseB?.body || "", {
				headers: headers2,
				status: payload.status,
				statusText: serverResponse.statusText
			});
		}
		let reactHeaders = new Headers();
		let status = serverResponse.status;
		let statusText = serverResponse.statusText;
		let html = await renderHTML(getPayload, {
			onError(error) {
				if (typeof error === "object" && error && "digest" in error && typeof error.digest === "string") {
					renderRedirect = decodeRedirectErrorDigest(error.digest);
					if (renderRedirect) return error.digest;
					let routeErrorResponse = decodeRouteErrorResponseDigest(error.digest);
					if (routeErrorResponse) {
						renderError = routeErrorResponse;
						status = routeErrorResponse.status;
						statusText = routeErrorResponse.statusText;
						return error.digest;
					}
				}
			},
			onHeaders(headers2) {
				for (const [key, value] of headers2) reactHeaders.append(key, value);
			}
		});
		const headers = new Headers(reactHeaders);
		for (const [key, value] of serverResponse.headers) headers.append(key, value);
		headers.set("Content-Type", "text/html; charset=utf-8");
		if (renderRedirect) {
			if (hasInvalidProtocol(renderRedirect.location)) throw new Error("Invalid redirect location");
			headers.set("Location", renderRedirect.location);
			return new Response(html, {
				status: renderRedirect.status,
				headers
			});
		}
		const redirectTransform = new TransformStream({ flush(controller) {
			if (renderRedirect) {
				if (hasInvalidProtocol(renderRedirect.location)) return;
				controller.enqueue(new TextEncoder().encode(`<meta http-equiv="refresh" content="0;url=${escapeHtml(renderRedirect.location)}"/>`));
			}
		} });
		if (!hydrate) return new Response(html.pipeThrough(redirectTransform), {
			status,
			statusText,
			headers
		});
		if (!serverResponseB?.body) throw new Error("Failed to clone server response");
		const body2 = html.pipeThrough(injectRSCPayload(serverResponseB.body)).pipeThrough(redirectTransform);
		return new Response(body2, {
			status,
			statusText,
			headers
		});
	} catch (error) {
		if (error instanceof Response) return error;
		if (renderRedirect) {
			if (hasInvalidProtocol(renderRedirect.location)) throw new Error("Invalid redirect location");
			return new Response(`Redirect: ${renderRedirect.location}`, {
				status: renderRedirect.status,
				headers: { Location: renderRedirect.location }
			});
		}
		try {
			let normalizedError = renderError ?? error;
			let [status, statusText] = isRouteErrorResponse(normalizedError) ? [normalizedError.status, normalizedError.statusText] : [500, ""];
			let retryRedirect;
			let reactHeaders = new Headers();
			const html = await renderHTML(() => {
				const payloadPromise = Promise.resolve(createFromReadableStream(createStream())).then((payload) => Object.assign(payload, {
					status,
					errors: deepestRenderedBoundaryId ? { [deepestRenderedBoundaryId]: normalizedError } : {}
				}));
				return Object.defineProperties(payloadPromise, {
					_deepestRenderedBoundaryId: {
						get() {
							return deepestRenderedBoundaryId;
						},
						set(boundaryId) {
							deepestRenderedBoundaryId = boundaryId;
						}
					},
					formState: { get() {
						return payloadPromise.then((payload) => payload.type === "render" ? payload.formState : void 0);
					} }
				});
			}, {
				onError(error2) {
					if (typeof error2 === "object" && error2 && "digest" in error2 && typeof error2.digest === "string") {
						retryRedirect = decodeRedirectErrorDigest(error2.digest);
						if (retryRedirect) return error2.digest;
						let routeErrorResponse = decodeRouteErrorResponseDigest(error2.digest);
						if (routeErrorResponse) {
							status = routeErrorResponse.status;
							statusText = routeErrorResponse.statusText;
							return error2.digest;
						}
					}
				},
				onHeaders(headers2) {
					for (const [key, value] of headers2) reactHeaders.append(key, value);
				}
			});
			const headers = new Headers(reactHeaders);
			for (const [key, value] of serverResponse.headers) headers.append(key, value);
			headers.set("Content-Type", "text/html; charset=utf-8");
			if (retryRedirect) {
				if (hasInvalidProtocol(retryRedirect.location)) throw new Error("Invalid redirect location");
				headers.set("Location", retryRedirect.location);
				return new Response(html, {
					status: retryRedirect.status,
					headers
				});
			}
			const retryRedirectTransform = new TransformStream({ flush(controller) {
				if (retryRedirect) {
					if (hasInvalidProtocol(retryRedirect.location)) return;
					controller.enqueue(new TextEncoder().encode(`<meta http-equiv="refresh" content="0;url=${escapeHtml(retryRedirect.location)}"/>`));
				}
			} });
			if (!hydrate) return new Response(html.pipeThrough(retryRedirectTransform), {
				status,
				statusText,
				headers
			});
			if (!serverResponseB?.body) throw new Error("Failed to clone server response");
			const body2 = html.pipeThrough(injectRSCPayload(serverResponseB.body)).pipeThrough(retryRedirectTransform);
			return new Response(body2, {
				status,
				statusText,
				headers
			});
		} catch (error2) {}
		throw error;
	}
}
function RSCStaticRouter({ getPayload }) {
	const decoded = getPayload();
	const payload = useSafe(decoded);
	if (payload.type === "redirect") {
		if (hasInvalidProtocol(payload.location)) throw new Error("Invalid redirect location");
		throw new Response(null, {
			status: payload.status,
			headers: { Location: payload.location }
		});
	}
	if (payload.type !== "render") return null;
	let patchedLoaderData = { ...payload.loaderData };
	for (const match of payload.matches) if (shouldHydrateRouteLoader(match.id, match.clientLoader, match.hasLoader, false) && (match.hydrateFallbackElement || !match.hasLoader)) delete patchedLoaderData[match.id];
	const context = {
		get _deepestRenderedBoundaryId() {
			return decoded._deepestRenderedBoundaryId ?? null;
		},
		set _deepestRenderedBoundaryId(boundaryId) {
			decoded._deepestRenderedBoundaryId = boundaryId;
		},
		actionData: payload.actionData,
		actionHeaders: {},
		basename: payload.basename,
		errors: payload.errors,
		loaderData: patchedLoaderData,
		loaderHeaders: {},
		location: payload.location,
		statusCode: 200,
		matches: payload.matches.map((match) => ({
			params: match.params,
			pathname: match.pathname,
			pathnameBase: match.pathnameBase,
			route: {
				id: match.id,
				action: match.hasAction || !!match.clientAction,
				handle: match.handle,
				hasErrorBoundary: match.hasErrorBoundary,
				loader: match.hasLoader || !!match.clientLoader,
				index: match.index,
				path: match.path,
				shouldRevalidate: match.shouldRevalidate
			}
		}))
	};
	const router = createStaticRouter(payload.matches.reduceRight((previous, match) => {
		const route = {
			id: match.id,
			action: match.hasAction || !!match.clientAction,
			element: match.element,
			errorElement: match.errorElement,
			handle: match.handle,
			hasErrorBoundary: !!match.errorElement,
			hydrateFallbackElement: match.hydrateFallbackElement,
			index: match.index,
			loader: match.hasLoader || !!match.clientLoader,
			path: match.path,
			shouldRevalidate: match.shouldRevalidate
		};
		if (previous.length > 0) route.children = previous;
		return [route];
	}, []), context);
	const frameworkContext = {
		future: {
			v8_middleware: false,
			v8_trailingSlashAwareDataRequests: true,
			v8_passThroughRequests: true
		},
		isSpaMode: false,
		ssr: true,
		criticalCss: "",
		manifest: {
			routes: {},
			version: "1",
			url: "",
			entry: {
				module: "",
				imports: []
			}
		},
		routeDiscovery: payload.routeDiscovery.mode === "initial" ? {
			mode: "initial",
			manifestPath: defaultManifestPath$1
		} : {
			mode: "lazy",
			manifestPath: payload.routeDiscovery.manifestPath || defaultManifestPath$1
		},
		routeModules: createRSCRouteModules(payload)
	};
	return /* @__PURE__ */ React.createElement(RSCRouterContext.Provider, { value: true }, /* @__PURE__ */ React.createElement(RSCRouterGlobalErrorBoundary, { location: payload.location }, /* @__PURE__ */ React.createElement(FrameworkContext.Provider, { value: frameworkContext }, /* @__PURE__ */ React.createElement(StaticRouterProvider, {
		context,
		router,
		hydrate: false,
		nonce: payload.nonce
	}))));
}
function isReactServerRequest(url) {
	return url.pathname.endsWith(".rsc");
}
function isManifestRequest(url) {
	return url.pathname.endsWith(".manifest");
}
function getHydrationData({ state, routes, getRouteInfo, location, basename, isSpaMode }) {
	let hydrationData = {
		...state,
		loaderData: { ...state.loaderData }
	};
	let initialMatches = matchRoutes(routes, location, basename);
	if (initialMatches) for (let match of initialMatches) {
		let routeId = match.route.id;
		let routeInfo = getRouteInfo(routeId);
		if (shouldHydrateRouteLoader(routeId, routeInfo.clientLoader, routeInfo.hasLoader, isSpaMode) && (routeInfo.hasHydrateFallback || !routeInfo.hasLoader)) delete hydrationData.loaderData[routeId];
		else if (!routeInfo.hasLoader) hydrationData.loaderData[routeId] = null;
	}
	return hydrationData;
}
var encoder, sign, unsign, createKey, createCookie, isCookie, ServerMode, globalDevServerHooksKey, SERVER_NO_BODY_STATUS_CODES, createRequestHandler, createSession, isSession, encoder2, trailer, RSCRouterGlobalErrorBoundary, noopComponent, defaultManifestPath$1, useImpl;
var init_chunk_E4MTK73K = __esmMin((() => {
	init_chunk_4ZMWKKQ3();
	encoder = /* @__PURE__ */ new TextEncoder();
	sign = async (value, secret) => {
		let data2 = encoder.encode(value);
		let key = await createKey(secret, ["sign"]);
		let signature = await crypto.subtle.sign("HMAC", key, data2);
		let hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=+$/, "");
		return value + "." + hash;
	};
	unsign = async (cookie, secret) => {
		let index = cookie.lastIndexOf(".");
		let value = cookie.slice(0, index);
		let hash = cookie.slice(index + 1);
		let data2 = encoder.encode(value);
		let key = await createKey(secret, ["verify"]);
		try {
			let signature = byteStringToUint8Array(atob(hash));
			return await crypto.subtle.verify("HMAC", key, signature, data2) ? value : false;
		} catch (e) {
			return false;
		}
	};
	createKey = async (secret, usages) => crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, usages);
	createCookie = (name, cookieOptions = {}) => {
		let { secrets = [], ...options } = {
			path: "/",
			sameSite: "lax",
			...cookieOptions
		};
		warnOnceAboutExpiresCookie(name, options.expires);
		return {
			get name() {
				return name;
			},
			get isSigned() {
				return secrets.length > 0;
			},
			get expires() {
				return typeof options.maxAge !== "undefined" ? new Date(Date.now() + options.maxAge * 1e3) : options.expires;
			},
			async parse(cookieHeader, parseOptions) {
				if (!cookieHeader) return null;
				let cookies = parse(cookieHeader, {
					...options,
					...parseOptions
				});
				if (name in cookies) {
					let value = cookies[name];
					if (typeof value === "string" && value !== "") return await decodeCookieValue(value, secrets);
					else return "";
				} else return null;
			},
			async serialize(value, serializeOptions) {
				return serialize(name, value === "" ? "" : await encodeCookieValue(value, secrets), {
					...options,
					...serializeOptions
				});
			}
		};
	};
	isCookie = (object) => {
		return object != null && typeof object.name === "string" && typeof object.isSigned === "boolean" && typeof object.parse === "function" && typeof object.serialize === "function";
	};
	ServerMode = /* @__PURE__ */ ((ServerMode2) => {
		ServerMode2["Development"] = "development";
		ServerMode2["Production"] = "production";
		ServerMode2["Test"] = "test";
		return ServerMode2;
	})(ServerMode || {});
	globalDevServerHooksKey = "__reactRouterDevServerHooks";
	SERVER_NO_BODY_STATUS_CODES = /* @__PURE__ */ new Set([...NO_BODY_STATUS_CODES, 304]);
	createRequestHandler = (build, mode) => {
		let _build;
		let serverMode;
		let staticHandler;
		let errorHandler;
		let _requestHandler;
		return async function requestHandler(request, initialContext) {
			_build = typeof build === "function" ? await build() : build;
			if (typeof build === "function") {
				let derived = derive(_build, mode);
				serverMode = derived.serverMode;
				staticHandler = derived.staticHandler;
				errorHandler = derived.errorHandler;
				_requestHandler = derived.requestHandler;
			} else if (!serverMode || !staticHandler || !errorHandler || !_requestHandler) {
				let derived = derive(_build, mode);
				serverMode = derived.serverMode;
				staticHandler = derived.staticHandler;
				errorHandler = derived.errorHandler;
				_requestHandler = derived.requestHandler;
			}
			return _requestHandler(request, initialContext);
		};
	};
	createSession = (initialData = {}, id = "") => {
		let map = new Map(Object.entries(initialData));
		return {
			get id() {
				return id;
			},
			get data() {
				return Object.fromEntries(map);
			},
			has(name) {
				return map.has(name) || map.has(flash(name));
			},
			get(name) {
				if (map.has(name)) return map.get(name);
				let flashName = flash(name);
				if (map.has(flashName)) {
					let value = map.get(flashName);
					map.delete(flashName);
					return value;
				}
			},
			set(name, value) {
				map.set(name, value);
			},
			flash(name, value) {
				map.set(flash(name), value);
			},
			unset(name) {
				map.delete(name);
			}
		};
	};
	isSession = (object) => {
		return object != null && typeof object.id === "string" && typeof object.data !== "undefined" && typeof object.has === "function" && typeof object.get === "function" && typeof object.set === "function" && typeof object.flash === "function" && typeof object.unset === "function";
	};
	encoder2 = new TextEncoder();
	trailer = "</body></html>";
	RSCRouterGlobalErrorBoundary = class extends React3.Component {
		constructor(props) {
			super(props);
			this.state = {
				error: null,
				location: props.location
			};
		}
		static getDerivedStateFromError(error) {
			return { error };
		}
		static getDerivedStateFromProps(props, state) {
			if (state.location !== props.location) return {
				error: null,
				location: props.location
			};
			return {
				error: state.error,
				location: state.location
			};
		}
		render() {
			if (this.state.error) return /* @__PURE__ */ React3.createElement(RSCDefaultRootErrorBoundaryImpl, {
				error: this.state.error,
				renderAppShell: true
			});
			else return this.props.children;
		}
	};
	noopComponent = () => null;
	defaultManifestPath$1 = "/__manifest";
	useImpl = React["use"];
}));
//#endregion
//#region node_modules/react-router/dist/development/dom-export.mjs
/**
* react-router v7.18.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var dom_export_exports = /* @__PURE__ */ __exportAll({
	HydratedRouter: () => HydratedRouter$1,
	RouterProvider: () => RouterProvider2,
	unstable_RSCHydratedRouter: () => RSCHydratedRouter,
	unstable_createCallServer: () => createCallServer,
	unstable_getRSCStream: () => getRSCStream
});
function RouterProvider2(props) {
	return /* @__PURE__ */ React.createElement(RouterProvider$1, {
		flushSync: ReactDOM.flushSync,
		...props
	});
}
function initSsrInfo() {
	if (!ssrInfo && window.__reactRouterContext && window.__reactRouterManifest && window.__reactRouterRouteModules) {
		if (window.__reactRouterManifest.sri === true) {
			const importMap = document.querySelector("script[rr-importmap]");
			if (importMap?.textContent) try {
				window.__reactRouterManifest.sri = JSON.parse(importMap.textContent).integrity;
			} catch (err) {
				console.error("Failed to parse import map", err);
			}
		}
		ssrInfo = {
			context: window.__reactRouterContext,
			manifest: window.__reactRouterManifest,
			routeModules: window.__reactRouterRouteModules,
			stateDecodingPromise: void 0,
			router: void 0,
			routerInitialized: false
		};
	}
}
function createHydratedRouter({ getContext, instrumentations }) {
	initSsrInfo();
	if (!ssrInfo) throw new Error("You must be using the SSR features of React Router in order to skip passing a `router` prop to `<RouterProvider>`");
	let localSsrInfo = ssrInfo;
	if (!ssrInfo.stateDecodingPromise) {
		let stream = ssrInfo.context.stream;
		invariant$1(stream, "No stream found for single fetch decoding");
		ssrInfo.context.stream = void 0;
		ssrInfo.stateDecodingPromise = decodeViaTurboStream(stream, window).then((value) => {
			ssrInfo.context.state = value.value;
			localSsrInfo.stateDecodingPromise.value = true;
		}).catch((e) => {
			localSsrInfo.stateDecodingPromise.error = e;
		});
	}
	if (ssrInfo.stateDecodingPromise.error) throw ssrInfo.stateDecodingPromise.error;
	if (!ssrInfo.stateDecodingPromise.value) throw ssrInfo.stateDecodingPromise;
	let routes = createClientRoutes(ssrInfo.manifest.routes, ssrInfo.routeModules, ssrInfo.context.state, ssrInfo.context.ssr, ssrInfo.context.isSpaMode);
	let hydrationData = void 0;
	if (ssrInfo.context.isSpaMode) {
		let { loaderData } = ssrInfo.context.state;
		if (ssrInfo.manifest.routes.root?.hasLoader && loaderData && "root" in loaderData) hydrationData = { loaderData: { root: loaderData.root } };
	} else hydrationData = getHydrationData({
		state: ssrInfo.context.state,
		routes,
		getRouteInfo: (routeId) => ({
			clientLoader: ssrInfo.routeModules[routeId]?.clientLoader,
			hasLoader: ssrInfo.manifest.routes[routeId]?.hasLoader === true,
			hasHydrateFallback: ssrInfo.routeModules[routeId]?.HydrateFallback != null
		}),
		location: window.location,
		basename: window.__reactRouterContext?.basename,
		isSpaMode: ssrInfo.context.isSpaMode
	});
	if (window.history.state && window.history.state.masked) window.history.replaceState({
		...window.history.state,
		masked: void 0
	}, "");
	let router2 = createRouter({
		routes,
		history: createBrowserHistory(),
		basename: ssrInfo.context.basename,
		getContext,
		hydrationData,
		hydrationRouteProperties,
		instrumentations,
		mapRouteProperties,
		future: { v8_passThroughRequests: ssrInfo.context.future.v8_passThroughRequests },
		dataStrategy: getTurboStreamSingleFetchDataStrategy(() => router2, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.basename, ssrInfo.context.future.v8_trailingSlashAwareDataRequests),
		patchRoutesOnNavigation: getPatchRoutesOnNavigationFunction(() => router2, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode, ssrInfo.context.basename)
	});
	ssrInfo.router = router2;
	if (router2.state.initialized) {
		ssrInfo.routerInitialized = true;
		router2.initialize();
	}
	router2.createRoutesForHMR = createClientRoutesWithHMRRevalidationOptOut;
	window.__reactRouterDataRouter = router2;
	return router2;
}
function HydratedRouter$1(props) {
	if (!router) router = createHydratedRouter({
		getContext: props.getContext,
		instrumentations: props.instrumentations
	});
	let [criticalCss, setCriticalCss] = React.useState(process.env.NODE_ENV === "development" ? ssrInfo?.context.criticalCss : void 0);
	React.useEffect(() => {
		if (process.env.NODE_ENV === "development") setCriticalCss(void 0);
	}, []);
	React.useEffect(() => {
		if (process.env.NODE_ENV === "development" && criticalCss === void 0) document.querySelectorAll(`[${CRITICAL_CSS_DATA_ATTRIBUTE}]`).forEach((element) => element.remove());
	}, [criticalCss]);
	let [location2, setLocation] = React.useState(router.state.location);
	React.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router && !ssrInfo.routerInitialized) {
			ssrInfo.routerInitialized = true;
			ssrInfo.router.initialize();
		}
	}, []);
	React.useLayoutEffect(() => {
		if (ssrInfo && ssrInfo.router) return ssrInfo.router.subscribe((newState) => {
			if (newState.location !== location2) setLocation(newState.location);
		});
	}, [location2]);
	invariant$1(ssrInfo, "ssrInfo unavailable for HydratedRouter");
	useFogOFWarDiscovery(router, ssrInfo.manifest, ssrInfo.routeModules, ssrInfo.context.ssr, ssrInfo.context.routeDiscovery, ssrInfo.context.isSpaMode);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(FrameworkContext.Provider, { value: {
		manifest: ssrInfo.manifest,
		routeModules: ssrInfo.routeModules,
		future: ssrInfo.context.future,
		criticalCss,
		ssr: ssrInfo.context.ssr,
		isSpaMode: ssrInfo.context.isSpaMode,
		routeDiscovery: ssrInfo.context.routeDiscovery
	} }, /* @__PURE__ */ React.createElement(RemixErrorBoundary, { location: location2 }, /* @__PURE__ */ React.createElement(RouterProvider2, {
		router,
		useTransitions: props.useTransitions,
		onError: props.onError
	}))), /* @__PURE__ */ React.createElement(React.Fragment, null));
}
function createCallServer({ createFromReadableStream, createTemporaryReferenceSet, encodeReply, fetch: fetchImplementation = fetch }) {
	const globalVar = window;
	let landedActionId = 0;
	return async (id, args) => {
		let actionId = globalVar.__routerActionID = (globalVar.__routerActionID ?? (globalVar.__routerActionID = 0)) + 1;
		const temporaryReferences = createTemporaryReferenceSet();
		const payloadPromise = fetchImplementation(new Request(location.href, {
			body: await encodeReply(args, { temporaryReferences }),
			method: "POST",
			headers: {
				Accept: "text/x-component",
				"rsc-action-id": id
			}
		})).then((response) => {
			if (!response.body) throw new Error("No response body");
			return createFromReadableStream(response.body, { temporaryReferences });
		});
		React.startTransition(() => Promise.resolve(payloadPromise).then(async (payload) => {
			if (payload.type === "redirect") {
				let location2 = normalizeRedirectLocation(payload.location);
				if (payload.reload || isExternalLocation(location2)) {
					if (hasInvalidProtocol(location2)) throw new Error("Invalid redirect location");
					window.location.href = location2;
					return;
				}
				React.startTransition(() => {
					globalVar.__reactRouterDataRouter.navigate(location2, { replace: payload.replace });
				});
				return;
			}
			if (payload.type !== "action") throw new Error("Unexpected payload type");
			const rerender = await payload.rerender;
			if (rerender && landedActionId < actionId && globalVar.__routerActionID <= actionId) {
				if (rerender.type === "redirect") {
					let location2 = normalizeRedirectLocation(rerender.location);
					if (rerender.reload || isExternalLocation(location2)) {
						if (hasInvalidProtocol(location2)) throw new Error("Invalid redirect location");
						window.location.href = location2;
						return;
					}
					React.startTransition(() => {
						globalVar.__reactRouterDataRouter.navigate(location2, { replace: rerender.replace });
					});
					return;
				}
				React.startTransition(() => {
					let lastMatch;
					for (const match of rerender.matches) {
						globalVar.__reactRouterDataRouter.patchRoutes(lastMatch?.id ?? null, [createRouteFromServerManifest(match)], true);
						lastMatch = match;
					}
					window.__reactRouterDataRouter._internalSetStateDoNotUseOrYouWillBreakYourApp({
						loaderData: Object.assign({}, globalVar.__reactRouterDataRouter.state.loaderData, rerender.loaderData),
						errors: rerender.errors ? Object.assign({}, globalVar.__reactRouterDataRouter.state.errors, rerender.errors) : null
					});
				});
			}
		}).catch(() => {}));
		return payloadPromise.then((payload) => {
			if (payload.type !== "action" && payload.type !== "redirect") throw new Error("Unexpected payload type");
			return payload.actionResult;
		});
	};
}
function createRouterFromPayload({ fetchImplementation, createFromReadableStream, getContext, payload }) {
	const globalVar = window;
	if (globalVar.__reactRouterDataRouter && globalVar.__reactRouterRouteModules) return {
		router: globalVar.__reactRouterDataRouter,
		routeModules: globalVar.__reactRouterRouteModules
	};
	if (payload.type !== "render") throw new Error("Invalid payload type");
	globalVar.__reactRouterRouteModules = globalVar.__reactRouterRouteModules ?? {};
	populateRSCRouteModules(globalVar.__reactRouterRouteModules, payload.matches);
	let routes = payload.matches.reduceRight((previous, match) => {
		const route = createRouteFromServerManifest(match, payload);
		if (previous.length > 0) route.children = previous;
		else if (!route.index) route.children = [];
		return [route];
	}, []);
	let applyPatchesPromise;
	globalVar.__reactRouterDataRouter = createRouter({
		routes,
		getContext,
		basename: payload.basename,
		history: createBrowserHistory(),
		hydrationData: getHydrationData({
			state: {
				loaderData: payload.loaderData,
				actionData: payload.actionData,
				errors: payload.errors
			},
			routes,
			getRouteInfo: (routeId) => {
				let match = payload.matches.find((m) => m.id === routeId);
				invariant$1(match, "Route not found in payload");
				return {
					clientLoader: match.clientLoader,
					hasLoader: match.hasLoader,
					hasHydrateFallback: match.hydrateFallbackElement != null
				};
			},
			location: payload.location,
			basename: payload.basename,
			isSpaMode: false
		}),
		async patchRoutesOnNavigation({ path, signal }) {
			if (payload.routeDiscovery.mode === "initial") {
				if (!applyPatchesPromise) applyPatchesPromise = (async () => {
					if (!payload.patches) return;
					let patches = await payload.patches;
					React.startTransition(() => {
						patches.forEach((p) => {
							window.__reactRouterDataRouter.patchRoutes(p.parentId ?? null, [createRouteFromServerManifest(p)]);
						});
					});
				})();
				await applyPatchesPromise;
				return;
			}
			if (discoveredPaths.has(path)) return;
			await fetchAndApplyManifestPatches([path], createFromReadableStream, fetchImplementation, signal);
		},
		dataStrategy: getRSCSingleFetchDataStrategy(() => globalVar.__reactRouterDataRouter, true, payload.basename, createFromReadableStream, fetchImplementation)
	});
	if (globalVar.__reactRouterDataRouter.state.initialized) {
		globalVar.__routerInitialized = true;
		globalVar.__reactRouterDataRouter.initialize();
	} else globalVar.__routerInitialized = false;
	let lastLoaderData = void 0;
	globalVar.__reactRouterDataRouter.subscribe(({ loaderData, actionData }) => {
		if (lastLoaderData !== loaderData) globalVar.__routerActionID = (globalVar.__routerActionID ?? (globalVar.__routerActionID = 0)) + 1;
	});
	globalVar.__reactRouterDataRouter._updateRoutesForHMR = (routeUpdateByRouteId) => {
		const oldRoutes = window.__reactRouterDataRouter.routes;
		const newRoutes = [];
		function walkRoutes(routes2, parentId) {
			return routes2.map((route) => {
				const routeUpdate = routeUpdateByRouteId.get(route.id);
				if (routeUpdate) {
					const { routeModule, hasAction, hasComponent, hasErrorBoundary, hasLoader } = routeUpdate;
					const newRoute = createRouteFromServerManifest({
						clientAction: routeModule.clientAction,
						clientLoader: routeModule.clientLoader,
						element: route.element,
						errorElement: route.errorElement,
						handle: route.handle,
						hasAction,
						hasComponent,
						hasErrorBoundary,
						hasLoader,
						hydrateFallbackElement: route.hydrateFallbackElement,
						id: route.id,
						index: route.index,
						links: routeModule.links,
						meta: routeModule.meta,
						parentId,
						path: route.path,
						shouldRevalidate: routeModule.shouldRevalidate
					});
					if (route.children) newRoute.children = walkRoutes(route.children, route.id);
					return newRoute;
				}
				const updatedRoute = { ...route };
				if (route.children) updatedRoute.children = walkRoutes(route.children, route.id);
				return updatedRoute;
			});
		}
		newRoutes.push(...walkRoutes(oldRoutes, void 0));
		window.__reactRouterDataRouter._internalSetRoutes(newRoutes);
	};
	return {
		router: globalVar.__reactRouterDataRouter,
		routeModules: globalVar.__reactRouterRouteModules
	};
}
function getRSCSingleFetchDataStrategy(getRouter, ssr, basename, createFromReadableStream, fetchImplementation) {
	let dataStrategy = getSingleFetchDataStrategyImpl(getRouter, (match) => {
		let M = match;
		return {
			hasLoader: M.route.hasLoader,
			hasClientLoader: M.route.hasClientLoader,
			hasComponent: M.route.hasComponent,
			hasAction: M.route.hasAction,
			hasClientAction: M.route.hasClientAction
		};
	}, getFetchAndDecodeViaRSC(createFromReadableStream, fetchImplementation), ssr, basename, true, (match) => {
		let M = match;
		return M.route.hasComponent && !M.route.element;
	});
	return async (args) => args.runClientMiddleware(async () => {
		let context = args.context;
		context.set(renderedRoutesContext, []);
		let results = await dataStrategy(args);
		const renderedRoutesById = /* @__PURE__ */ new Map();
		for (const route of context.get(renderedRoutesContext)) {
			if (!renderedRoutesById.has(route.id)) renderedRoutesById.set(route.id, []);
			renderedRoutesById.get(route.id).push(route);
		}
		React.startTransition(() => {
			for (const match of args.matches) {
				const renderedRoutes = renderedRoutesById.get(match.route.id);
				if (renderedRoutes) for (const rendered of renderedRoutes) window.__reactRouterDataRouter.patchRoutes(rendered.parentId ?? null, [createRouteFromServerManifest(rendered)], true);
			}
		});
		return results;
	});
}
function getFetchAndDecodeViaRSC(createFromReadableStream, fetchImplementation) {
	return async (args, basename, trailingSlashAware, targetRoutes) => {
		let { request, context } = args;
		let url = singleFetchUrl(request.url, basename, trailingSlashAware, "rsc");
		if (request.method === "GET") {
			url = stripIndexParam$1(url);
			if (targetRoutes) url.searchParams.set("_routes", targetRoutes.join(","));
		}
		let res = await fetchImplementation(new Request(url, await createRequestInit(request)));
		if (res.status >= 400 && !res.headers.has("X-Remix-Response")) throw new ErrorResponseImpl(res.status, res.statusText, await res.text());
		invariant$1(res.body, "No response body to decode");
		try {
			const payload = await createFromReadableStream(res.body, { temporaryReferences: void 0 });
			if (payload.type === "redirect") return {
				status: res.status,
				data: { redirect: {
					redirect: payload.location,
					reload: payload.reload,
					replace: payload.replace,
					revalidate: false,
					status: payload.status
				} }
			};
			if (payload.type !== "render") throw new Error("Unexpected payload type");
			context.get(renderedRoutesContext).push(...payload.matches);
			let results = { routes: {} };
			const dataKey = isMutationMethod(request.method) ? "actionData" : "loaderData";
			for (let [routeId, data] of Object.entries(payload[dataKey] || {})) results.routes[routeId] = { data };
			if (payload.errors) for (let [routeId, error] of Object.entries(payload.errors)) results.routes[routeId] = { error };
			return {
				status: res.status,
				data: results
			};
		} catch (cause) {
			throw new Error("Unable to decode RSC response", { cause });
		}
	};
}
function RSCHydratedRouter({ createFromReadableStream, fetch: fetchImplementation = fetch, payload, getContext }) {
	if (payload.type !== "render") throw new Error("Invalid payload type");
	let { routeDiscovery } = payload;
	let { router: router2, routeModules } = React.useMemo(() => createRouterFromPayload({
		payload,
		fetchImplementation,
		getContext,
		createFromReadableStream
	}), [
		createFromReadableStream,
		payload,
		fetchImplementation,
		getContext
	]);
	React.useEffect(() => {
		setIsHydrated();
	}, []);
	React.useLayoutEffect(() => {
		const globalVar = window;
		if (!globalVar.__routerInitialized) {
			globalVar.__routerInitialized = true;
			globalVar.__reactRouterDataRouter.initialize();
		}
	}, []);
	let [{ routes, state }, setState] = React.useState(() => ({
		routes: cloneRoutes(router2.routes),
		state: router2.state
	}));
	React.useLayoutEffect(() => router2.subscribe((newState) => {
		if (diffRoutes(router2.routes, routes)) React.startTransition(() => {
			setState({
				routes: cloneRoutes(router2.routes),
				state: newState
			});
		});
	}), [
		router2.subscribe,
		routes,
		router2
	]);
	const transitionEnabledRouter = React.useMemo(() => ({
		...router2,
		state,
		routes
	}), [
		router2,
		routes,
		state
	]);
	React.useEffect(() => {
		if (routeDiscovery.mode === "initial" || window.navigator?.connection?.saveData === true) return;
		function registerElement(el) {
			let path = el.tagName === "FORM" ? el.getAttribute("action") : el.getAttribute("href");
			if (!path) return;
			let pathname = el.tagName === "A" ? el.pathname : new URL(path, window.location.origin).pathname;
			if (!discoveredPaths.has(pathname)) nextPaths.add(pathname);
		}
		async function fetchPatches() {
			document.querySelectorAll("a[data-discover], form[data-discover]").forEach(registerElement);
			let paths = Array.from(nextPaths.keys()).filter((path) => {
				if (discoveredPaths.has(path)) {
					nextPaths.delete(path);
					return false;
				}
				return true;
			});
			if (paths.length === 0) return;
			try {
				await fetchAndApplyManifestPatches(paths, createFromReadableStream, fetchImplementation);
			} catch (e) {
				console.error("Failed to fetch manifest patches", e);
			}
		}
		let debouncedFetchPatches = debounce(fetchPatches, 100);
		fetchPatches();
		new MutationObserver(() => debouncedFetchPatches()).observe(document.documentElement, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [
				"data-discover",
				"href",
				"action"
			]
		});
	}, [
		routeDiscovery,
		createFromReadableStream,
		fetchImplementation
	]);
	const frameworkContext = {
		future: {
			v8_middleware: false,
			v8_trailingSlashAwareDataRequests: true,
			v8_passThroughRequests: true
		},
		isSpaMode: false,
		ssr: true,
		criticalCss: "",
		manifest: {
			routes: {},
			version: "1",
			url: "",
			entry: {
				module: "",
				imports: []
			}
		},
		routeDiscovery: payload.routeDiscovery.mode === "initial" ? {
			mode: "initial",
			manifestPath: defaultManifestPath
		} : {
			mode: "lazy",
			manifestPath: payload.routeDiscovery.manifestPath || defaultManifestPath
		},
		routeModules
	};
	return /* @__PURE__ */ React.createElement(RSCRouterContext.Provider, { value: true }, /* @__PURE__ */ React.createElement(RSCRouterGlobalErrorBoundary, { location: state.location }, /* @__PURE__ */ React.createElement(FrameworkContext.Provider, { value: frameworkContext }, /* @__PURE__ */ React.createElement(RouterProvider$1, {
		router: transitionEnabledRouter,
		flushSync: ReactDOM.flushSync
	}))));
}
function createRouteFromServerManifest(match, payload) {
	let hasInitialData = payload && match.id in payload.loaderData;
	let initialData = payload?.loaderData[match.id];
	let hasInitialError = payload?.errors && match.id in payload.errors;
	let initialError = payload?.errors?.[match.id];
	let isHydrationRequest = match.clientLoader?.hydrate === true || !match.hasLoader || match.hasComponent && !match.element;
	invariant$1(window.__reactRouterRouteModules);
	populateRSCRouteModules(window.__reactRouterRouteModules, match);
	let dataRoute = {
		id: match.id,
		element: match.element,
		errorElement: match.errorElement,
		handle: match.handle,
		hasErrorBoundary: match.hasErrorBoundary,
		hydrateFallbackElement: match.hydrateFallbackElement,
		index: match.index,
		loader: match.clientLoader ? async (args, singleFetch) => {
			let _isHydrationRequest = isHydrationRequest;
			isHydrationRequest = false;
			return await match.clientLoader({
				...args,
				serverLoader: () => {
					preventInvalidServerHandlerCall("loader", match.id, match.hasLoader);
					if (_isHydrationRequest) {
						if (hasInitialData) return initialData;
						if (hasInitialError) throw initialError;
					}
					return callSingleFetch(singleFetch);
				}
			});
		} : ((_, singleFetch) => callSingleFetch(singleFetch)),
		action: match.clientAction ? (args, singleFetch) => match.clientAction({
			...args,
			serverAction: async () => {
				preventInvalidServerHandlerCall("action", match.id, match.hasLoader);
				return await callSingleFetch(singleFetch);
			}
		}) : match.hasAction ? (_, singleFetch) => callSingleFetch(singleFetch) : () => {
			throw noActionDefinedError("action", match.id);
		},
		path: match.path,
		shouldRevalidate: match.shouldRevalidate,
		hasLoader: true,
		hasClientLoader: match.clientLoader != null,
		hasAction: match.hasAction,
		hasClientAction: match.clientAction != null
	};
	if (typeof dataRoute.loader === "function") dataRoute.loader.hydrate = shouldHydrateRouteLoader(match.id, match.clientLoader, match.hasLoader, false);
	return dataRoute;
}
function callSingleFetch(singleFetch) {
	invariant$1(typeof singleFetch === "function", "Invalid singleFetch parameter");
	return singleFetch();
}
function preventInvalidServerHandlerCall(type, routeId, hasHandler) {
	if (!hasHandler) {
		let msg = `You are trying to call ${type === "action" ? "serverAction()" : "serverLoader()"} on a route that does not have a server ${type} (routeId: "${routeId}")`;
		console.error(msg);
		throw new ErrorResponseImpl(400, "Bad Request", new Error(msg), true);
	}
}
function getManifestUrl(paths) {
	if (paths.length === 0) return null;
	if (paths.length === 1) return new URL(`${paths[0]}.manifest`, window.location.origin);
	let basename = (window.__reactRouterDataRouter.basename ?? "").replace(/^\/|\/$/g, "");
	let url = new URL(`${basename}/.manifest`, window.location.origin);
	url.searchParams.set("paths", paths.sort().join(","));
	return url;
}
async function fetchAndApplyManifestPatches(paths, createFromReadableStream, fetchImplementation, signal) {
	paths = getPathsWithAncestors(paths);
	let url = getManifestUrl(paths);
	if (url == null) return;
	if (url.toString().length > 7680) {
		nextPaths.clear();
		return;
	}
	let response = await fetchImplementation(new Request(url, { signal }));
	if (!response.body || response.status < 200 || response.status >= 300) throw new Error("Unable to fetch new route matches from the server");
	let payload = await createFromReadableStream(response.body, { temporaryReferences: void 0 });
	if (payload.type !== "manifest") throw new Error("Failed to patch routes");
	paths.forEach((p) => addToFifoQueue(p, discoveredPaths));
	let patches = await payload.patches;
	React.startTransition(() => {
		patches.forEach((p) => {
			window.__reactRouterDataRouter.patchRoutes(p.parentId ?? null, [createRouteFromServerManifest(p)]);
		});
	});
}
function addToFifoQueue(path, queue) {
	if (queue.size >= discoveredPathsMaxSize) {
		let first = queue.values().next().value;
		if (typeof first === "string") queue.delete(first);
	}
	queue.add(path);
}
function debounce(callback, wait) {
	let timeoutId;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => callback(...args), wait);
	};
}
function isExternalLocation(location2) {
	return new URL(location2, window.location.href).origin !== window.location.origin;
}
function normalizeRedirectLocation(location2) {
	if (PROTOCOL_RELATIVE_URL_REGEX.test(location2)) {
		let path = resolvePath(location2);
		return path.pathname + path.search + path.hash;
	}
	return location2;
}
function cloneRoutes(routes) {
	if (!routes) return void 0;
	return routes.map((route) => ({
		...route,
		children: cloneRoutes(route.children)
	}));
}
function diffRoutes(a, b) {
	if (a.length !== b.length) return true;
	return a.some((route, index) => {
		if (route.element !== b[index].element) return true;
		if (route.errorElement !== b[index].errorElement) return true;
		if (route.hydrateFallbackElement !== b[index].hydrateFallbackElement) return true;
		if (route.hasErrorBoundary !== b[index].hasErrorBoundary) return true;
		if (route.hasLoader !== b[index].hasLoader) return true;
		if (route.hasClientLoader !== b[index].hasClientLoader) return true;
		if (route.hasAction !== b[index].hasAction) return true;
		if (route.hasClientAction !== b[index].hasClientAction) return true;
		return diffRoutes(route.children || [], b[index].children || []);
	});
}
function getRSCStream() {
	let encoder = new TextEncoder();
	let streamController = null;
	let rscStream = new ReadableStream({ start(controller) {
		if (typeof window === "undefined") return;
		let handleChunk = (chunk) => {
			if (typeof chunk === "string") controller.enqueue(encoder.encode(chunk));
			else controller.enqueue(chunk);
		};
		window.__FLIGHT_DATA || (window.__FLIGHT_DATA = []);
		window.__FLIGHT_DATA.forEach(handleChunk);
		window.__FLIGHT_DATA.push = (chunk) => {
			handleChunk(chunk);
			return 0;
		};
		streamController = controller;
	} });
	if (typeof document !== "undefined" && document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => {
		streamController?.close();
	});
	else streamController?.close();
	return rscStream;
}
var ssrInfo, router, defaultManifestPath, renderedRoutesContext, nextPaths, discoveredPathsMaxSize, discoveredPaths;
var init_dom_export = __esmMin((() => {
	init_chunk_E4MTK73K();
	init_chunk_4ZMWKKQ3();
	ssrInfo = null;
	router = null;
	defaultManifestPath = "/__manifest";
	renderedRoutesContext = createContext$1();
	nextPaths = /* @__PURE__ */ new Set();
	discoveredPathsMaxSize = 1e3;
	discoveredPaths = /* @__PURE__ */ new Set();
}));
//#endregion
//#region node_modules/react-router/dist/development/index.mjs
/**
* react-router v7.18.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var development_exports = /* @__PURE__ */ __exportAll({
	Await: () => Await,
	BrowserRouter: () => BrowserRouter,
	Form: () => Form,
	HashRouter: () => HashRouter,
	IDLE_BLOCKER: () => IDLE_BLOCKER,
	IDLE_FETCHER: () => IDLE_FETCHER,
	IDLE_NAVIGATION: () => IDLE_NAVIGATION,
	Link: () => Link$7,
	Links: () => Links,
	MemoryRouter: () => MemoryRouter,
	Meta: () => Meta,
	NavLink: () => NavLink,
	Navigate: () => Navigate,
	NavigationType: () => Action,
	Outlet: () => Outlet,
	PrefetchPageLinks: () => PrefetchPageLinks,
	Route: () => Route$1,
	Router: () => Router,
	RouterContextProvider: () => RouterContextProvider,
	RouterProvider: () => RouterProvider$1,
	Routes: () => Routes$1,
	Scripts: () => Scripts,
	ScrollRestoration: () => ScrollRestoration,
	ServerRouter: () => ServerRouter,
	StaticRouter: () => StaticRouter$1,
	StaticRouterProvider: () => StaticRouterProvider,
	UNSAFE_AwaitContextProvider: () => AwaitContextProvider,
	UNSAFE_DataRouterContext: () => DataRouterContext,
	UNSAFE_DataRouterStateContext: () => DataRouterStateContext,
	UNSAFE_ErrorResponseImpl: () => ErrorResponseImpl,
	UNSAFE_FetchersContext: () => FetchersContext,
	UNSAFE_FrameworkContext: () => FrameworkContext,
	UNSAFE_LocationContext: () => LocationContext,
	UNSAFE_NavigationContext: () => NavigationContext,
	UNSAFE_RSCDefaultRootErrorBoundary: () => RSCDefaultRootErrorBoundary,
	UNSAFE_RemixErrorBoundary: () => RemixErrorBoundary,
	UNSAFE_RouteContext: () => RouteContext,
	UNSAFE_ServerMode: () => ServerMode,
	UNSAFE_SingleFetchRedirectSymbol: () => SingleFetchRedirectSymbol,
	UNSAFE_ViewTransitionContext: () => ViewTransitionContext,
	UNSAFE_WithComponentProps: () => WithComponentProps,
	UNSAFE_WithErrorBoundaryProps: () => WithErrorBoundaryProps,
	UNSAFE_WithHydrateFallbackProps: () => WithHydrateFallbackProps,
	UNSAFE_createBrowserHistory: () => createBrowserHistory,
	UNSAFE_createClientRoutes: () => createClientRoutes,
	UNSAFE_createClientRoutesWithHMRRevalidationOptOut: () => createClientRoutesWithHMRRevalidationOptOut,
	UNSAFE_createHashHistory: () => createHashHistory,
	UNSAFE_createMemoryHistory: () => createMemoryHistory,
	UNSAFE_createRouter: () => createRouter,
	UNSAFE_decodeViaTurboStream: () => decodeViaTurboStream,
	UNSAFE_getHydrationData: () => getHydrationData,
	UNSAFE_getPatchRoutesOnNavigationFunction: () => getPatchRoutesOnNavigationFunction,
	UNSAFE_getTurboStreamSingleFetchDataStrategy: () => getTurboStreamSingleFetchDataStrategy,
	UNSAFE_hydrationRouteProperties: () => hydrationRouteProperties,
	UNSAFE_invariant: () => invariant$1,
	UNSAFE_mapRouteProperties: () => mapRouteProperties,
	UNSAFE_shouldHydrateRouteLoader: () => shouldHydrateRouteLoader,
	UNSAFE_useFogOFWarDiscovery: () => useFogOFWarDiscovery,
	UNSAFE_useScrollRestoration: () => useScrollRestoration,
	UNSAFE_withComponentProps: () => withComponentProps,
	UNSAFE_withErrorBoundaryProps: () => withErrorBoundaryProps,
	UNSAFE_withHydrateFallbackProps: () => withHydrateFallbackProps,
	createBrowserRouter: () => createBrowserRouter,
	createContext: () => createContext$1,
	createCookie: () => createCookie,
	createCookieSessionStorage: () => createCookieSessionStorage,
	createHashRouter: () => createHashRouter,
	createMemoryRouter: () => createMemoryRouter,
	createMemorySessionStorage: () => createMemorySessionStorage,
	createPath: () => createPath,
	createRequestHandler: () => createRequestHandler,
	createRoutesFromChildren: () => createRoutesFromChildren,
	createRoutesFromElements: () => createRoutesFromElements,
	createRoutesStub: () => createRoutesStub,
	createSearchParams: () => createSearchParams,
	createSession: () => createSession,
	createSessionStorage: () => createSessionStorage,
	createStaticHandler: () => createStaticHandler2,
	createStaticRouter: () => createStaticRouter,
	data: () => data,
	generatePath: () => generatePath,
	href: () => href,
	isCookie: () => isCookie,
	isRouteErrorResponse: () => isRouteErrorResponse,
	isSession: () => isSession,
	matchPath: () => matchPath,
	matchRoutes: () => matchRoutes,
	parsePath: () => parsePath,
	redirect: () => redirect,
	redirectDocument: () => redirectDocument,
	renderMatches: () => renderMatches,
	replace: () => replace,
	resolvePath: () => resolvePath,
	unstable_HistoryRouter: () => HistoryRouter,
	unstable_RSCStaticRouter: () => RSCStaticRouter,
	unstable_routeRSCServerRequest: () => routeRSCServerRequest,
	unstable_setDevServerHooks: () => setDevServerHooks,
	unstable_usePrompt: () => usePrompt,
	unstable_useRoute: () => useRoute,
	unstable_useRouterState: () => useRouterState,
	useActionData: () => useActionData,
	useAsyncError: () => useAsyncError,
	useAsyncValue: () => useAsyncValue,
	useBeforeUnload: () => useBeforeUnload,
	useBlocker: () => useBlocker,
	useFetcher: () => useFetcher,
	useFetchers: () => useFetchers,
	useFormAction: () => useFormAction,
	useHref: () => useHref,
	useInRouterContext: () => useInRouterContext,
	useLinkClickHandler: () => useLinkClickHandler,
	useLoaderData: () => useLoaderData,
	useLocation: () => useLocation$2,
	useMatch: () => useMatch,
	useMatches: () => useMatches,
	useNavigate: () => useNavigate$6,
	useNavigation: () => useNavigation,
	useNavigationType: () => useNavigationType,
	useOutlet: () => useOutlet,
	useOutletContext: () => useOutletContext,
	useParams: () => useParams$2,
	useResolvedPath: () => useResolvedPath,
	useRevalidator: () => useRevalidator,
	useRouteError: () => useRouteError,
	useRouteLoaderData: () => useRouteLoaderData,
	useRoutes: () => useRoutes,
	useSearchParams: () => useSearchParams,
	useSubmit: () => useSubmit,
	useViewTransitionState: () => useViewTransitionState
});
var init_development = __esmMin((() => {
	init_chunk_E4MTK73K();
	init_chunk_4ZMWKKQ3();
}));
//#endregion
//#region node_modules/react-router-dom/dist/index.js
/**
* react-router-dom v7.18.0
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: () => from[key],
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
	var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
	var index_exports = {};
	__export(index_exports, {
		HydratedRouter: () => import_dom.HydratedRouter,
		RouterProvider: () => import_dom.RouterProvider
	});
	module.exports = __toCommonJS(index_exports);
	var import_dom = (init_dom_export(), __toCommonJS(dom_export_exports));
	__reExport(index_exports, (init_development(), __toCommonJS(development_exports)), module.exports);
	0 && (module.exports = {
		HydratedRouter,
		RouterProvider,
		...(init_development(), __toCommonJS(development_exports))
	});
}));
var slug_map_default = {
	ivsrcn5: "bubbits",
	zhlfn2n: "bubble-blasters",
	x3d1r9q: "bubble-match-merge",
	j8uuwf8: "bubble-pop-legend",
	"2821h1s": "bubble-shooter-vale",
	q27wfqf: "bubble-shooter-vintage",
	mz0cy21: "pop-the-bubble",
	a41uui8: "topsy-turvy",
	ev4o5ti: "eggy-car-unblocked",
	hqmtm5h: "fireboy-and-watergirl-7-and-friends",
	"1c94ju0": "bitlife",
	"5genmbw": "basketball-stars-2026",
	"6om41ob": "moto-road-rash-3d",
	ty1iqik: "moto-x3m-unblocked",
	kmx2tum: "parkour-race",
	oqo4evi: "penalty-shooters-3",
	"95ldneo": "retro-bowl",
	cjb1wuk: "snow-rider-3d-unblocked",
	"0xtqekb": "hockey-taka",
	"17e4uz1": "swimmer-rush",
	"0hzrc10": "crazy-grand-prix",
	"4sa0u5a": "funny-city-gopniks",
	"9j0xu89": "carnado-stunt-car",
	"7kl63uk": "jelly-truck",
	jfnoqy1: "snow-rider-3d-2",
	fpjkube: "snow-rider-3d-nostalgia",
	z0zjfav: "bomb-it-8",
	fkqlojw: "vex-try-to-fly",
	gey4jyh: "wheelie-bike",
	"1a0nu6j": "volley-random",
	ohc4ym4: "vector",
	jqnqho4: "uno",
	"9j255cq": "time-shooter-3-swat",
	yx0ytod: "telekinesis",
	up74mn1: "tanuki-sunset",
	"4soapmo": "talking-tom-run",
	"9l1zpin": "super-mario-flash-3",
	v26i0eo: "soccer-random",
	fs5cin9: "slow-roads",
	lz9xh11: "riddle-school-5",
	"9n7hvic": "papas-sushiria",
	fdtdkwt: "papas-pizzeria",
	bn7de67: "idle-breakout",
	ke07jg7: "holeio",
	"9gtk89q": "funny-shooter-2",
	xeoylke: "earn-to-die-2012-part-2",
	akb0uur: "cookie-clicker-2",
	"2mfncz2": "color-tunnel",
	btzkiex: "cluster-rush",
	a3stdco: "car-drawing",
	ckeopu6: "boxing-random",
	ive42ij: "big-tower-tiny-square-2",
	u0u9s5p: "bank-robbery-2",
	fon1eil: "a-small-world-cup",
	oa0obvw: "age-of-war",
	cgbf6z1: "yohoho-io",
	jf4txnv: "xmas-slope",
	i6une8s: "traffic-mania",
	ahne070: "super-tunnel-rush",
	"693x371": "stunt-car-challenge-3",
	nakwzly: "stunt-paradise",
	h7gk6z8: "subway-clash-3d",
	d0psk82: "soccer-skills-world-cup",
	"02arxab": "soccer-skills-euro-cup",
	ytha6h0: "soccer-skills-champions-league",
	s3lcloa: "soccar",
	chy82fr: "slopey",
	q4clzrr: "slope-3",
	uf0yjg0: "slope-unblocked",
	jxi24qj: "slime-road",
	pvl7u6f: "skiing-fred",
	zf2hgsj: "retro-highway",
	dzm5cq4: "retro-bowl-college",
	"38u8k2i": "rambling-racer",
	"7raz88i": "stack",
	z0hlvsd: "ragdoll-hit",
	"1sk11l6": "ragdoll-drop",
	l3463oz: "raft-life",
	xuszkzu: "poor-eddie",
	mkmvj77: "police-pursuit-2",
	vwgzmr1: "parking-fury-3d",
	"2b5jisl": "parking-fury-2",
	nfye071: "neon-biker",
	ctcdoyh: "need-for-madness",
	"46rfld2": "my-perfect-hotel",
	nq9y5b5: "rooftop-shooters",
	y3kx0b8: "life-the-game-stay-safe",
	ag4ssm3: "level-devil-unblocked",
	kpomn1f: "life-the-game",
	"8atfrfp": "huggy-wuggy-shooter",
	"3lpn3h6": "highway-racer-3d",
	vqv26rv: "heroball-adventures",
	mfr0j43: "geometry-dash-unblocked",
	bi8fulq: "idle-mokey",
	w3r2uoy: "funny-mad-racing",
	"4ihhu7j": "foot-chinko",
	"3hv3a9t": "football-legends",
	bck0ypz: "eugenes-life",
	kkdetm2: "escape-road",
	"5g6ehmp": "hard-life",
	fnnyidy: "endless-truck",
	fsf40x5: "elasticman",
	"8o40r28": "eagle-ride",
	q136c68: "dune-surfer",
	n9xmghc: "duck-duck-clicker",
	hywhrra: "drift-dudes",
	"9gr025e": "drift-boss",
	"681bhmh": "dreadhead-parkour",
	"3snd0q1": "doodle-jump",
	q3t24pe: "death-chase-3",
	fnxlooy: "death-chase",
	"3eankrt": "crazy-cars",
	"2ap6o2u": "cookie-clicker",
	oxiigj8: "cars-thief-tank-edition",
	w8dlgyf: "car-rush",
	uzhor25: "burnin-rubber-5-xs",
	"3i5j6xc": "breaking-the-bank",
	shme37o: "brain-test-3-tricky-quests",
	e5lkn5d: "escape-from-school",
	gsyw485: "blumgi-ball",
	mcwtes7: "block-the-pig",
	cw86lqc: "blacktop-police-chase",
	h0q5knv: "rocket-soccer-derby",
	skk8953: "blumgi-rocket",
	armr3io: "crossy-road",
	kka65rk: "subway-surfers-new-york",
	ha78sv9: "monster-car",
	xqbkvgs: "drive-mad",
	by8ab49: "basket-and-ball",
	m0xkgzq: "bad-ice-cream-3",
	gbuqgp7: "afterlife-the",
	"55vb395": "agent-walker-vs-skibidi-toilets",
	kc9pyp5: "adventure-drivers",
	"4t89nrg": "1v1lol",
	ml7wwt8: "bow-mania",
	"48aepx9": "penalty-superstar",
	httqqzj: "penalty-shooters-x",
	hxvjf99: "penalty-shooters-1",
	w7veoky: "vex-x3m",
	oqo7dcp: "vex-x3m-2",
	uqc5z04: "vex-x3m-3",
	"3fc270d": "escape-or-die-troll-devil-levels",
	nnbe6eg: "devil-duck-not-a-troll-game",
	v1q934n: "devil-dash",
	e5q6bt9: "snowboard-kings-2022",
	"91b3g5k": "snowboard-king-2024",
	gwq8qzn: "obby-parkour-racing",
	h7i9rw5: "snow-rush-3d",
	"63bhnud": "snow-rider-obby-parkour",
	e2x04k7: "bomb-it-mission",
	"8btpaso": "zombocalypse",
	"1lbcqji": "zombie-war",
	"2d5ye4h": "zombie-train",
	"156e3g3": "zombie-survival",
	cozw2c3: "zombie-shooter",
	hzsf74s: "zombie-situation",
	k3asjtx: "zombie-riot",
	unpkqed: "zombie-resurrection",
	s38mn61: "zombie-outbreak-arena",
	fqg6a71: "zombie-monster-truck",
	b27xta6: "zombie-invasion",
	jf0f07x: "zombie-inc",
	jx6zhys: "zombie-horde-3",
	nmvqmg5: "zombie-house",
	pyre4mc: "zombie-horde-2",
	b8kqbo3: "zombie-horde",
	gce0cqm: "zombie-fight-club",
	"2l5wg2a": "zombie-derby-2",
	"1dtwowe": "zombie-derby",
	"5hai4ay": "zombie-cats",
	"66ouk5s": "zombie-crypt",
	"4tiithg": "zombie-baseball",
	"3kyefbk": "zombie-burger",
	k9bsjd5: "zig-zag",
	"5rr7o0v": "zig-up",
	"4w0yb4b": "zassin",
	"286gxi2": "you-are-lucky",
	"9gihpe9": "yellow-copter",
	tczv275: "yellow",
	u4ipw4g: "wormsio",
	mhiiwxn: "worm-food",
	"36xtum2": "wormateio",
	jyiitex: "world-wars-2",
	i3io27s: "world-wars",
	"1xzzfr9": "working-stiffs",
	j484pzy: "word-search",
	"5xxt85e": "word-scramble",
	"75knaak": "word-maze",
	ltpgum5: "word-maker",
	bfspscl: "wordle-unlimited",
	gevfsux: "word-crash",
	rvie32p: "word-blix",
	ioc7ytk: "woobies",
	"5sveo8n": "wonder-rocket",
	whkr6ad: "zumba-mania",
	tao8c57: "zuma-shooter",
	kcy2tda: "zuma",
	stgq1lu: "zrist",
	"4jyiqh5": "zoo-run",
	v3l6nwj: "zoo-pinball",
	vk95ggf: "zombotron-2",
	d4elnem: "zombotron",
	"04u77ai": "zombokill",
	"87qpfa3": "zombocalypse-2",
	k2dk178: "winter-falling",
	c6nc7z7: "william-the-conqueror",
	u7mgao7: "will-hero",
	"7hu4uzb": "why-did-the-chicken-cross-the-road",
	"982xn2l": "wheres-my-blankie-2",
	wm2jjfz: "wheres-my-blankie",
	"4lnx7mt": "where-is-cat",
	"3vwp79z": "wheely-7",
	fcozv1j: "whack-your-ex",
	glin7v8: "whack-your-computer",
	"679ypgg": "whack-your-boss",
	"0gkq03f": "wedding-nails",
	em3sqc6: "we-become-what-we-behold",
	"8mfk9w7": "water-sons",
	j76ra1w: "water-polo",
	s7vjxt3: "watermelon",
	ha9boht: "water-flow",
	yv3z0pl: "warship-fury",
	g1imvvp: "war-machine",
	x8maxie: "warlords",
	ofsviz1: "warfare-1944",
	"7jy412t": "warfare-1917",
	kyu4yl4: "visitors",
	rif590a: "vex-2",
	x4w3ae9: "vertical-drop-heroes",
	x1fbfme: "vehicles-2",
	k7mbmll: "vehicles",
	decuvc2: "vampire-skills",
	sayzqxx: "use-boxmen",
	"85bxicc": "uphill-rush-2",
	rw23p0y: "uphill-rush",
	"2mgyc40": "unstable",
	"1dnhrqu": "unicycle-hero",
	cnwwfbo: "unfair-ninja",
	"3b19lnb": "unfair-mario",
	"8lq61x0": "underneath",
	shnvx6u: "ultimate-douchebag-workout",
	eax7rz3: "ultimate-defense-2",
	"3bliccz": "ultimate-chess",
	"6i7bdxd": "ultimate-assassin-3",
	mbblwa5: "ultimate-assassin-2",
	vcv1fue: "ultimate-assassin",
	mi0xaa7: "two-tubes-3d",
	"6cmotsb": "typing-fighter",
	"5g57hd1": "two-aliens-adventure",
	fr99is5: "twin-shot-2",
	r55k37w: "twin-shot",
	qdf56pt: "twin-cat-warrior",
	v8vsj4u: "twelve",
	ixy0sxb: "twang",
	gltre4k: "turtle-trigger",
	"7gy15l7": "turning-lathe",
	"4ehumkr": "tunnel-racing",
	slbp608: "tug-war-2",
	ck77gqr: "tug-war",
	x98e8d4: "tug-of-war",
	"5zmul8i": "tube-jumpers",
	ze9ve7a: "tu-95",
	hpbho0s: "trump-wheelie",
	yebpfqt: "tu-46",
	misxmyk: "truck-loader-5",
	pjjoonu: "truck-loader",
	"7ha4m16": "trollface-quest-13",
	"74jqnob": "trollface-quest-5",
	kmxcq6p: "trollface-quest-4",
	"0rf563t": "trollface-quest-3",
	wyrwcik: "trollface-quest-unblocked",
	mahhda4: "tricky-taps",
	nh8hmw0: "trick-hoops-challenge",
	yqdzdik: "trials-ice-ride",
	v080mwt: "t-rex-runner",
	"70lr2lr": "train-taxi",
	rb7v0na: "trainsio",
	"63yaycv": "traffic-control",
	mrsx3ze: "tradecraft",
	hur90x3: "toy-claw-machine",
	bogscy2: "toxic-2",
	"8v97p59": "toxic",
	iu2b3fb: "tower-defense",
	om4tdd3: "tower-switchle",
	y46knsw: "tower-builder",
	"5pdqtea": "totem-destroyer",
	"1h5kmqs": "toss-the-turtle",
	ywt0nt7: "torture-chamber-3",
	"79cekre": "torture-chamber-2",
	ujczpmv: "torture-chamber",
	"74qm8mt": "tony-hawks-pro-skater-4",
	h4sbdts: "tomb-of-the-mask-unblocked",
	ljlwdzm: "tom-and-jerry-run",
	"5dgw0y7": "tofu-drift",
	"45swo8z": "toca-boca-pets",
	yb659iu: "toca-boca",
	"2oyeawm": "wolverine-tokyo-fury",
	"2hwry99": "winter-flip",
	"4caysmx": "tile-step",
	zp3tkyo: "tile-master-match",
	upmi6qh: "tiktok-vsco-girls",
	uavljqp: "tiktok-trends",
	jlp6mik: "tic-tac-toe",
	ouuv789: "throw-a-potato-again",
	"1e8uhuv": "throw-a-potato",
	"6r9ne9c": "three-goblets",
	j791ks6: "this-is-the-only-level-2",
	rtxbcww: "this-is-the-only-level",
	h4ka2ym: "thing-thing-arena-2",
	coaacsu: "thing-thing-arena",
	"9r9zw2n": "thing-thing-4",
	em2778w: "thing-thing-3",
	uikxam5: "thing-thing-2",
	azne5el: "thing-thing",
	zadr8yx: "thief-life",
	i8kknyw: "the-waitress",
	fygjtnh: "the-visitor-returns",
	w551red: "the-visitor-massacre-at-camp-happy",
	vtiveqn: "the-visitor",
	jkkia7o: "the-sun-for-the-vampire",
	"3hr6365": "the-soul-driver",
	tc1lyi5: "the-platform",
	j9zzojo: "the-office-guy",
	uoc8re2: "the-milk-quest",
	d3zbopm: "theme-hotel",
	"7t489zt": "the-mechanicer",
	"2ve4jj2": "the-little-giant",
	fnvbfq6: "the-legend-of-zelda",
	qgbwnwc: "the-last-stand-union-city",
	"8qzboqm": "the-last-stand-2",
	bucuzvr: "the-last-door-prologue",
	go4cn7d: "the-kitty-story",
	"0eaxfdp": "the-kings-league",
	mtoj1dm: "the-king-of-fighters",
	"40zo7q1": "the-ironic-zombie",
	nwgurf0: "the-impossible-quiz",
	uc151yt: "the-heist",
	mjvcyco: "the-green-mission",
	"34bmqzy": "the-game-replaying",
	logzymi: "the-game-reimagine",
	jvet514: "the-fish-master",
	qclxbef: "the-final-earth-2",
	gbc664d: "the-farmer",
	dcfevr7: "the-fancy-pants-adventure-2",
	us2ijbl: "the-deepest-sleep",
	yx6arfc: "the-enchanted-cave",
	rkp6bln: "the-classroom-3",
	mzrxdir: "the-classroom-2",
	neaw4uy: "the-cargo",
	"2paam7a": "the-binding-of-isaac-wrath-of-the-lamb",
	fkayg38: "the-big-hitter-baseball",
	"3wt9jfh": "the-boomlands",
	ps85t6b: "the-battle-cats",
	vo5kmjl: "the-battle",
	vwtn0s4: "tetris-n-blox",
	a0h9w7a: "tetris",
	"4cqfa8s": "tetra-blocks",
	p3slmpr: "test-subject-green",
	"2deed4q": "test-subject-complete",
	ol9dfdb: "test-subject-blue",
	tfr7tss: "territory-war-3",
	ntfbg71: "territory-war",
	"2fq3ef1": "terraria",
	vi1l5so: "tennis-open",
	ejkd1x2: "temple-go",
	yiiqua5: "teleport-jumper",
	hhq0qv8: "teelonians-the-clan-wars",
	qey1ii7: "tattoo-drawing",
	arx3kdy: "tasty-planet-2",
	"38rhc9d": "tasty-planet",
	"9x665iz": "tap-goal",
	ufz74xb: "tap-and-fly",
	"33k2mbs": "tank-stars",
	j0qzbfc: "tanks-shooter",
	rfx0m2r: "tank-mayhem",
	qvvia0n: "tank-heroes",
	y2ejg3q: "tankers",
	bbb6nkd: "tank-defender",
	uwe9u8i: "tank-battle",
	du71zzu: "tangerine-tycoon",
	admmh5e: "talking-tom",
	"5o35dy9": "talking-angela",
	uxbe4j6: "takeover",
	vpt3di2: "tail-swing",
	"1z8nu5n": "tactical-assassin-3",
	tu0uoi7: "swords-and-souls",
	gf4qhvh: "swing-star",
	sb26d8j: "swindler-2",
	"4y6bm0e": "swindler",
	rhlkedz: "swimming-pro",
	"9hn1myg": "sweet-drmzzz",
	"6ie1gma": "sweet-candy",
	ia52yp3: "sushi-rush",
	ucf9qvd: "sushi-go-round",
	k78yrpi: "sushi-cat-a-pult",
	l1x4r3i: "tiny-rifles",
	h4695jh: "tiny-castle",
	qukzgui: "survival-craft",
	orjge0l: "super-stacker-2",
	"2795yes": "super-stacker",
	i78xwoo: "super-sneak",
	"0wvcypq": "super-slugger",
	"93elt9h": "super-omar-climb",
	yh5hx9d: "super-oliver-world",
	b5rfcpe: "super-meat-boy",
	"8uq00hk": "super-mario-world",
	"4mu05o7": "super-mario-sunshine-64",
	wb5yzbj: "super-mario-run",
	m3sd49u: "super-mario-crossover",
	mxe3reo: "super-mario-bros-star",
	z8ugzml: "super-mario-bros",
	"88jugsp": "super-mario-64",
	udcgr4c: "super-mario-63",
	d5jrni5: "super-jump-ball",
	dgi06gf: "superhot-line-miami",
	"00sh2tq": "superfighters-ultimate",
	omeho8r: "super-fighters-rampage",
	f9dax4y: "super-brawl-tanks",
	ffrnm2o: "suika-playground",
	waj4zzx: "suika",
	"8durxhp": "sugar-warrior",
	d53z6wa: "sugar-sugar-2",
	mkfpq1o: "sugar-sugar",
	em94u5g: "sugar-cookies",
	heq48ux: "sues-cooking",
	bkhf34d: "sue-school",
	dzwvu9u: "stunt-pilot",
	ne44od3: "stunt-crasher",
	i30ua15: "strongman-simulator",
	ekaxsgr: "strike-force-kitty-3",
	yjj61nc: "strike-force-kitty-4",
	"81760sm": "strike-force-kitty-2",
	"1dzaiiw": "strike-force-kitty",
	tv7hn4b: "strike-force-heroes",
	"0h312y2": "street-racer-underground",
	eii0izl: "street-fighter-2",
	yf3gmxp: "street-fighter",
	w90gni1: "stranded-isle",
	fyolrsy: "storm-the-house-3",
	"0l6knks": "storyteller",
	of5k25v: "storm-ops-4",
	xrpll74: "storm-ops",
	tmvh7de: "stop-the-darkness",
	exkh9vm: "stick-rpg-complete",
	uu5atm1: "sticky-sorcerer",
	bcpz0te: "stick-war",
	cbwutqz: "stick-rpg",
	"3ar2i14": "stickjet-challenge",
	"4e254sg": "stick-figure-badminton-3",
	ov9416u: "stick-fly",
	zu82dvo: "stick-figure-badminton",
	qhrnho9: "stick-duel",
	s3rgjlt: "stick-clash",
	wq3zhmk: "stick-basketball",
	j9bxced: "stick-archers-battle",
	n824h27: "steel-dangers",
	hpvllbd: "steam-trucker",
	cgw9bhb: "star-ball",
	fxfymyj: "state-of-play-baseball",
	r2r4v6a: "stairs",
	ktk18r9: "squid-defender",
	mruwipz: "staggy-the-boy-scout-slayer-2",
	xnu3a8n: "square-meal",
	r5dmpxk: "sprinter",
	"9szjo2v": "springy-walk",
	yr4payo: "spring-nail-art",
	"8pmtu3j": "sports-heads-volleyball",
	"6x2s9dj": "sports-heads-tennis",
	fq3qlzl: "sports-heads-ice-hockey",
	c7ngvig: "sports-heads-football-championship",
	ilw1j3p: "sports-heads-basketball-championship",
	lpvql2v: "splashy",
	"7q5e9h8": "spider-solitaire",
	"2jzzslb": "spiders",
	ri6rz3e: "speed-ball",
	"2baajtd": "speedback",
	d64d83n: "special-rescue-team",
	"20xz7v0": "space-racing",
	fr0itvr: "space-ball",
	sm1ap7p: "south-park-creator-3",
	ni2wziw: "sort-the-court",
	nyy3l1f: "sort-it",
	smoin0t: "sonny-2",
	v4n89nm: "sonny",
	c0y4idf: "sonic-the-hedgehog",
	htb2huo: "sonic-smash-brothers",
	"6zd29c3": "sonic-revert",
	t0wriah: "sonic-crazy-world",
	r4i4c7g: "sushi-cat",
	wpyx5js: "so-much-money",
	xsf766n: "solitaire",
	"75e8jlv": "soldier-missions",
	saeamtv: "soldier-legend",
	d7zddsc: "sokoban",
	tw5hh81: "snowballio",
	fzd9n0e: "snowball-adventure",
	h6m7moa: "sniper-assassin-4",
	es88t2v: "sniper-assassin-3",
	r8o1yh0: "sniper-assassin-2",
	kp0p2ij: "snakeis",
	pmgr3wr: "snail-bob-8",
	xqbmiez: "snail-bob-7",
	wr7kk0j: "snail-bob-5",
	hnnaxj2: "snail-bob-6",
	vqryotq: "snail-bob-4",
	"40rmrz3": "snail-bob-3",
	uq3j8gl: "snail-bob-2",
	atnls4m: "snail-bob-unblocked",
	ep7velf: "smashy-road",
	pwmpn8d: "smiley-cubes",
	"5ojcof0": "smashing-soccer",
	"89t5e9c": "small-archer",
	"7wnevyb": "slush-invaders",
	qqxgh9p: "slugger-baseball",
	euq0dzu: "slot-car-racing",
	h1xy76x: "slope-run",
	k29phoh: "slope-2-players",
	swkb8qu: "slope-2",
	obk9xct: "slither-battle",
	lwyso2e: "sling-wars",
	iz24k8d: "skywire",
	uem7s4f: "sling-wars-2",
	jvo21xh: "sling-tomb",
	"9bnai6s": "slime-laboratory",
	cm48xfn: "slender-man",
	gmcdz9s: "sleepy-knight",
	"1am99i5": "skywire-2",
	"1pjnmyd": "sleepwalk",
	xjsm88d: "sky-serpents",
	"3llfsj4": "skull-racer",
	lcu0qdx: "ski-king",
	ry844ny: "skull-kid-2",
	ecbsxty: "sketchman",
	dnwykh3: "sinjid-shadow-of-the-warrior",
	j9szdi2: "sift-heads-world",
	"2jeyqcj": "silly-sausage",
	lfpzz58: "sift-heads-5",
	tqp0l79: "sift-heads-4",
	maana3o: "sift-heads-3",
	ax4r56k: "sift-heads-1",
	blq6bg8: "sift-heads-2",
	"3omrjn2": "siegius-arena",
	"16jftey": "siegius",
	n9zufao: "shuffle-time-4",
	ibv919z: "shuffle-time-3",
	d5o7gag: "shuffle-time-2",
	qnpjydj: "shotgun-vs-zombies",
	sdup43d: "short-ride",
	xzuvcwv: "short-life-2",
	kvwzzzy: "short-life",
	xx1rt0r: "shortcut-run",
	vyuqkr7: "shopping-street",
	"5m5wx18": "shopping-city",
	zb69ibo: "shopping-cart-hero-3",
	oabltpr: "shopping-cart-hero-2",
	"1suzb5l": "shop-empire-galaxy",
	yismufi: "shop-empire-fable",
	iujyz2q: "shop-empire-2",
	"1ttt08y": "shootm",
	"4e2mrkb": "shooter-2d",
	xayzti2: "ships-vs-monsters",
	cqdf51y: "shift-run",
	zkecffr: "sheep-farm",
	"38dg4hy": "shatter-baseball",
	dpka8ps: "shark-attack",
	"864w5dg": "shake-rush",
	pp9eyob: "shadowless",
	"8gndt8d": "shadez-2",
	avv6ygl: "seedz",
	"2efnwtn": "sector-01",
	uy4au86: "scribble",
	r4nagqj: "scrap-metal-heroes",
	vq53pn8: "scrap-metal-3",
	qklu35g: "scrambled-legs-2",
	"5627mpd": "scooter-xtreme",
	dchi1ze: "scrambled-legs",
	mz7ym33: "scooby-doo-spooky-speed",
	khoo79s: "scooby-doo-in-spooky-speed",
	"1vuhwpw": "scooby-doo-hurdle-race",
	"95it0f2": "sci-fighters",
	"6ggpq01": "scifi-flight-simulator",
	"6cmohy0": "school-bus-license",
	cwxhl05: "scary-maze-game-dx",
	"0u88cp8": "scary-maze",
	qt8ytk5: "save-the-monsters",
	d1ao2j2: "save-my-pet",
	cglq77a: "save-my-egg",
	"08qlkjx": "sas-zombie-assault-2",
	"0ad2mw2": "sas-zombie-assault",
	bj46fzk: "saras-cooking-class",
	i8ucq5p: "santa-runnn",
	xdw5xvm: "sonic-advance",
	tc4a8l5: "santa-run-3",
	p6dyosq: "santa-run-2",
	bx5s42g: "sandcastle",
	q46frhr: "ruthless-pandas",
	"0q1b1m0": "rustyard",
	c2ow31k: "rural-racer",
	"9bj9naw": "ruperts-zombie-diary",
	"4t7rxnb": "run-sausage-run",
	mkfsrc6: "run-race-3d",
	"4otpnja": "run-n-gun",
	g8byr6e: "run-3-unblocked",
	fgjww26: "run-2-unblocked",
	dhw5r39: "run-1-unblocked",
	m3aexr8: "rugby-challenge",
	ewih8pp: "rubber-rage",
	nwvdovm: "royal-thumble",
	dbbicd8: "royale-clans",
	"56opeo7": "royal-castle",
	n6oal2w: "rotate",
	rdvljeu: "rolling-ball",
	"4ecsocw": "rollercoaster-rush",
	"6i6hoa7": "rollercoaster-creator",
	"1afz6kq": "rogue-soul-2",
	uefu6xf: "rocket-pets",
	"9os7xts": "rogue-soul",
	p88j1z5: "rocket-league",
	k5bwxz2: "rocket-balance",
	gf9sywc: "robot-wants-kitty",
	"2y2ovca": "robot-wants-ice-cream",
	dty31a8: "robotic-emergence",
	la54x6i: "robo-fighter",
	"2v7zb2j": "road-madness",
	y0qxyd8: "road-fury",
	mbwvrz0: "ricochet-kills-4",
	k892737: "ricochet-kills-siberia",
	"852ik3l": "ricochet-kills-3",
	qc3blv1: "ricochet-kills-2",
	itp8eit: "return-to-riddle-school",
	s8d5jje: "ricochet-kills",
	"5eppmx3": "return-man-2-zombies",
	q4zsspl: "return-man-2",
	a85nic6: "retro-space-blaster",
	"9zyw201": "return-man-2-mud-bowl",
	w34dx3v: "retro-ping-pong",
	"1mhkv6o": "resort-empire",
	w40z78l: "red-warrior",
	wbdjhvx: "redhead-adventure",
	"1z0dnwc": "red-ball",
	hgvx2vb: "recoil",
	"793vncv": "rebuild",
	"9gmqadk": "real-offroad-4x4",
	hy2nmav: "realdrive",
	h4wwxk4: "reach-the-core",
	u2nlhi9: "roblox-tower-of-jump",
	fx9vq58: "roblox-grimace-shake",
	eqbw83h: "roblox-crush-stuff",
	"4qb35r9": "roblox-every-second-1-speed",
	"2zzvwel": "roblox-color-block",
	lo9jq57: "roblox-1-fly-every-second",
	rvk2tpk: "rapid-roll",
	efhopr0: "roblox-obby",
	fn5wdi6: "ranger-vs-zombies",
	"5yj004e": "random-heroes",
	zplxuij: "rail-surfers",
	"69kd35l": "railroad-rampage",
	rxhrh6e: "rage-3",
	rhfinf7: "rage-2",
	ulzceag: "rage",
	n5g9vwr: "ragdoll-launcher",
	"9elrpk0": "ragdoll-achievement",
	fej6jw5: "rabbit-samurai-2",
	guzvp85: "rabbit-samurai",
	q54epp7: "qwop",
	"1rufx8s": "puzzle-freak",
	yu3z359: "pursuit-of-hat-2",
	ospipcl: "pull-him-out",
	fcoy9e3: "punk-o-matic",
	er773oz: "prince-of-persia",
	bsfr673: "prison-parkour",
	l8x67l3: "primary",
	a12cd93: "press-the-button",
	fbu0m4e: "president-simulator",
	"1lsy5gw": "pre-civilization-bronze-age",
	a5jbg4g: "pou-classroom-slacking",
	pdbi14v: "potty-racers-3",
	h4ug5x3: "potty-racers-2",
	vlxu0re: "portal-defenders-tower-defense",
	"6w4ndti": "portal-defenders",
	pg6qaim: "portal-2",
	iuzfuki: "portal",
	gw50qzf: "poop-clicker-2",
	jl0t266: "poppy-playtime",
	i4u0mfp: "poly-art",
	rpevx3z: "pogo-swing",
	imjd97a: "santa-run-extrahard",
	ii9lu1k: "plasma-burst",
	"5tdaxz6": "plants-vs-zombies",
	"7e1kbmi": "plants",
	ocpprzp: "pizza-tower",
	u1w2yo3: "pizza-cafe",
	"5k0g3bv": "pixel-world",
	mn3efak: "pixel-sword",
	"31hwq5k": "pixel-shooter",
	xqtanl0: "pixel-quest-the-lost-idols",
	"6uwgkvs": "pixel-quest-the-lost-gifts",
	wpccz1x: "pixel-journey",
	"2ot8sxc": "pixel-friend-rescue",
	h2xak8r: "pixel-dino-run",
	t51mpdk: "pixel-dash",
	n8kieuz: "pipe-riders",
	w9j0lbt: "pipe-mania",
	gpvo6xw: "pinch-hitter-3",
	dn4smht: "pinch-hitter-2",
	"1w8rfd2": "pinch-hitter",
	td0262s: "pinatamasters",
	gg9wyg4: "pinata-hunter-4",
	iqhcrne: "pin-adventure",
	fp7al2d: "piggy-wiggy",
	g1fp0vt: "pig-dream",
	r3xc5bw: "pest-control",
	idkzbkq: "pico-school",
	"85cxv28": "pest-beat",
	e26gfp6: "perfect-craft",
	q8j171q: "pen-run",
	aql60lc: "penguin-diner-2",
	j87ois9: "penguin-diner",
	"0zdqv4z": "park-shop",
	uvti5xu: "parasite",
	doc1jp0: "paper-plane",
	sv95afj: "paper-minecraft",
	zzpjmql: "paperio-3d",
	f2ee2ug: "paperio-2",
	bs37p50: "papas-wingeria",
	"1idhs90": "papas-taco-mia",
	vq5lswc: "papas-scooperia",
	"4b38mlz": "papas-pastaria",
	ptse0dr: "papas-hot-doggeria",
	ugpgj80: "papas-pancakeria",
	rrm8bav: "papas-donuteria",
	xf96642: "papas-freezeria",
	"8ya7586": "papas-cheeseria",
	omkv0hu: "papas-cupcakeria",
	"0xe2qhm": "papas-burgeria",
	knnhxf6: "papas-bakeria",
	bbpy1e6: "papa-louie-when-pizzas-attack",
	nkt4oi8: "papa-louie-3-when-sundaes-attack",
	eodyrq3: "papa-louie-night-hunt-2",
	sg7sopn: "papa-louie-2-when-burgers-attack",
	zpcjn0c: "pandemic-2",
	q242dmv: "pandemic",
	t1krhd6: "panda-fight",
	itk1zbq: "paint-hit-2d",
	jnffwvq: "paint-hit",
	c0m2f9p: "paint-blob-ball",
	ypz2yli: "pacxon",
	i5kqfdt: "pacman-advanced",
	s6wgmzx: "pacman",
	qbtr8dg: "ovo-2",
	skavk2l: "oregon-trail",
	x0zzspm: "orcs-vs-elves",
	"9wn3ag8": "only-up-parkour",
	vo3wr9j: "one-piece-fighting",
	tasri6c: "only-up",
	"5nnaca5": "one-piece",
	w4ofa2q: "one-night-at-flumtys",
	n3odp1f: "one-chance",
	sfotf6i: "omega-nuggets-clicker",
	"93htym4": "office-slacking-4",
	zmuwio6: "office-slacking-2",
	dce95jz: "obey-the",
	tc06lu4: "obby-lucky-blocks-2-players",
	ey6esbi: "obby-jailbreak-2-players",
	q6bs6y5: "nyan-cat-lost-in-space",
	"6u5cw6x": "no-time-to-explain",
	zl53owg: "notebook-wars-3",
	x9a63su: "number-snake",
	xsk156l: "notebook-space-wars-2",
	"45j0vk3": "notebook-space-wars",
	cisgbfk: "noob-vs-zombie",
	hpkhkgy: "noob-steve-parkour",
	e6cmmxl: "noob-adventure",
	klgllbo: "ninja-painter",
	hit83ma: "n-gon",
	"74aa1iz": "n",
	q61q69b: "newgrounds-rumble",
	biyd1u2: "neon-run",
	zboejwl: "neon-rider",
	gcj2i6g: "neon-mask-maze",
	dsndvi7: "neon-cannon",
	"8qus2rj": "neon-blaster",
	jixjc3k: "necromancy",
	x1csta0: "nancy-drew-dossier",
	"72cka4g": "mystery-machine-motor-madness",
	mx18iou: "my-rusty-submarine",
	duodxlc: "my-new-room-2",
	"6vfithf": "my-little-pony",
	"8zmcy7b": "my-friend-pedro-arena",
	wt2jpvh: "my-friend-pedro",
	ap3m70q: "my-dear-boss",
	kj7ewi6: "plazma-burst",
	savhcz0: "playing-with-fire-2",
	bvctrb4: "mountain-bike-runner",
	urf4qp8: "moto-rider-go",
	gw7dkxi: "motor-flip",
	"9ds4pw7": "motherload",
	ixmn12x: "mortal-kombat-karnage",
	doflm7k: "more-bricks",
	jk8cefv: "more-bloons",
	lj6azp3: "monster-master",
	"39bun07": "monster-legions",
	"2ycx7q7": "monster-evolution",
	"3ks6igy": "monster-craft-2",
	ip7svqy: "monster-arena",
	rr2mf3u: "monopoly-idle",
	inwexoz: "monkey-island",
	w7h8azj: "monkey-go-happy",
	o3ecjcp: "money-movers-2",
	sv2s6up: "moby-dick",
	ncdlwy1: "moby-dick-2",
	o7fqrtx: "minecraft-parkour",
	"16p3s71": "mirrors-edge",
	"6dbs9qf": "miragine-war",
	"6q0ek07": "mini-train",
	fqtsoy0: "mini-tooth",
	"3svph0r": "mini-springs",
	fbad3n0: "mini-heads-party",
	pjx0etw: "mini-golf-master",
	"1cu01oq": "mini-golf",
	fpyvjlt: "mini-drifts",
	"3iknul7": "minesweeper",
	"8ukqv7t": "mine-rusher",
	"9tkwwon": "miner-cat-4",
	qo4y8jg: "minecraft-tower-defense-2",
	"6fs3yw3": "minecraft-tower-defense",
	wts3wti: "minecraft-skin-editor",
	"334vr5s": "minecraft-jigsaw-puzzle",
	e09e42q: "minecraft-editor",
	lochtm0: "minecraft-defense",
	"8l6uihq": "minecraft-classic",
	"60z7ffe": "minecraft-18",
	"5pkrs7o": "mine-clone",
	"05kduqu": "mine-caves",
	sxd5yny: "mine-brothers-the-magic-temple",
	g8pugig: "mine-blocks",
	"9gwtxep": "millionaire-to-billionaire",
	gon6gs1: "mighty-knight",
	ij9xcur: "mickey-and-friends",
	mn71axx: "miami-shark",
	bbc7ttn: "metroid-zero-mission",
	ndpu719: "metroid-fusion",
	pkkc0sz: "metal-soldiers",
	hle9nkv: "metal-slug-3",
	"5n29kgd": "merge-fruits",
	dneu3z4: "merge-defense",
	kf7m6wy: "memory-training",
	omc5gow: "melon-playground",
	ye0puae: "mega-truck",
	if1xexe: "megaman-zero-alpha",
	rvabwc9: "mega-miner",
	"30jmacx": "megaman-project-x",
	wxk9sd3: "meek-demo",
	m7za14g: "mecha-arena",
	d3i2ob6: "me-and-the-key-3",
	"3aelszj": "me-and-the-key-2",
	fcmt4wr: "mc-mart",
	h4mt8ly: "me-and-the-key",
	lnwxkzm: "mcdonalds-videogame",
	hvnpsz6: "matching-card-heroes",
	texaw3s: "mass-mayhem",
	f3blkir: "mario-street-fight",
	lx4sc4u: "mario-remix-boss-edition",
	bvl4pog: "mario-party-4",
	wzqwlh7: "mario-kart",
	vuiu7ak: "mario-combat",
	hi1cak5: "mario-and-luigi",
	"3053oll": "marblet",
	gcuyi67: "maptroid",
	ivh5pl0: "manic-rider",
	q76c8ta: "mainlands-wars",
	l2b87g2: "mahjong-sweet-easter",
	"55hlwtc": "magic-tiles",
	"6vm8e8n": "mahjong-quest",
	yw3k2b1: "maganic-wars",
	ic8dyxy: "mad-trucker-2",
	v8bf9w9: "mad-shark",
	e19ifmp: "madness-retaliation",
	"4kv8s6r": "madness-project-nexus",
	"1gz6k88": "madness-hydraulic",
	ifxg1zr: "madness-combat-defense",
	rz28wn1: "madness-accelerant",
	bdl10lb: "mad-dentist-2",
	kq6m9fv: "madden-nfl",
	ib2mo8d: "mad-burger",
	bva8mj8: "mad-arrow",
	qkup72s: "lunas-sun-cafe",
	"7z13to9": "lunas-sun-bakery",
	og086de: "ludo",
	"2qcbqeg": "lunas-kitchen",
	"31um4m1": "lucky-tower",
	y91uve2: "mutiny",
	c2k6g14: "mutate-the-labrat",
	rwaw4zu: "mutant-fighting-cup",
	ou4lq38: "must-pop-words",
	uof1abx: "mushroomer",
	"1nqkkxu": "murloc",
	xag9ub5: "mud-and-blood-3",
	srbieek: "mr-superfire",
	"0e77ehk": "mr-autofire",
	"3yz1t27": "line-rider",
	uyiq0fz: "light-it-up",
	"1mgt35v": "life-in-the-static",
	gd628z0: "level-editor",
	kqkzwbo: "lets-roll",
	u0iyode: "lemon-break",
	txrpy9t: "lemonade-world",
	k4pybhb: "lemonade-stand",
	azlv7ri: "legend-of-the-golden-robot",
	"73uj6l8": "legendary-warrior",
	bx01mx4: "le-chat-fonce",
	trkymgv: "learn-to-fly-idle",
	"4r444g6": "learn-to-fly-3",
	gl7v824: "learn-to-fly-2",
	"7xzxcyk": "learn-to-fly",
	p50h6z5: "last-line-of-defense",
	wad3qcv: "last-horizon",
	xhxb5y9: "lamphead",
	"2y5quct": "lady-dressup",
	"7knhb4x": "kung-fu-panda-surfers",
	qqno78o: "kukoo-machines",
	yrxkvrc: "knightmare-tower",
	l71v1dk: "knight-dash",
	"3kqkkpq": "knife-ninja",
	huq0yj6: "knife-hit",
	day567l: "kitts-kingdom",
	"2ui1edj": "kirby-and-the-amazing-mirror",
	jzl8osc: "kirby",
	oxblceb: "kings-strike",
	icd58m3: "king-of-drift",
	"3xaklg2": "king-of-drag",
	"7e0nows": "king-of-defense",
	"5p8usfi": "kingdom-defense",
	uk3bdty: "kindergarten",
	ho10x7h: "kill-time-in-your-office",
	jik5zzu: "kids-vs-ice-cream",
	"7vug3kt": "kick-the-buddy",
	urwjg1e: "kick-buttowski",
	bqyhh37: "kiba-and-kumba",
	o2ouavi: "kawairun",
	jonw1zv: "kart-race-2",
	r8s59j9: "kakato-otoshi",
	"6asgqpz": "just-one-boss",
	wema3ff: "justfalllol",
	"88fqmj2": "jurassic-park-tycoon",
	vde4ysg: "jumpin-jac-dash",
	ceiynhy: "jumpers-for-goalposts-3",
	m5e24bn: "jumpers-for-goalposts",
	le41rse: "jump-doper",
	a4otqjx: "jump-control",
	w9is45a: "jump-basket",
	zxdkklh: "jump-ball",
	kj5pbt5: "johnny-upgrade",
	"49kydma": "jim-loves-mary-2",
	q8qhc4l: "jim-loves-mary",
	jw2jkw5: "jewel-star",
	xole8nl: "jewel-magic",
	dserxgw: "jet-boy",
	vfqxlxe: "jelly-shift",
	uhuyqs9: "jelly-go",
	r8kck30: "jellydad-hero",
	cdgesxo: "jellybots",
	tz8154q: "jaywalking",
	w7cn2xc: "javelin-fighting",
	ytk2uma: "janissary-battles",
	psl34r5: "janes-hotel",
	w4kvuz7: "jailbreak-rush",
	q2libb8: "jacksmith",
	w0crpiu: "jack-frost",
	g28kdv6: "i-saw-her-standing-there",
	l7wvqxd: "iq-ball",
	ovm236m: "ipl-cricket-ultimate",
	t7aev5v: "intrusion-2",
	aoq6pc1: "intrusion",
	spw4jga: "into-space-3-xmas-story",
	xphcaeb: "into-space-2",
	hdj6o42: "into-space",
	a9gq3de: "interactive-buddy",
	ll4eo74: "inspector-blindson",
	xxhkfwq: "insectonator-zombie-mode",
	r3qwqqk: "insane-slime",
	"0ti9lla": "infiltrating-the-airship",
	w19jooj: "infectonator-world-dominator",
	"2fywrs4": "infectonator-2",
	amonnme: "infectonator",
	zr2mndd: "in-drmzzz",
	lu7375y: "indian-truck-simulator",
	i5xl1hg: "impostor-vs-crewmate",
	vb89snf: "i-have-1-day",
	"55dzhsv": "icy-tower",
	"48q7u0t": "ice-hockey",
	a8cog3i: "ice-cream-frenzy",
	yc58iha: "ice-cream-bar",
	"6ls3uph": "i-broke-the-time",
	"80fifjr": "hyper-tunnel",
	mh4o32m: "hyper-drift-car",
	jvd7ysq: "hunter-assassin",
	rcra6w8: "hungry-shark",
	fqqtn0n: "hungry-fish",
	rhn0f36: "how-to-raise-a-dragon",
	"27cxigk": "hover-racer-drive",
	emxh3bj: "house-paint",
	ddfe2le: "house-of-wolves",
	wyfx2j0: "hot-dog-bush",
	gmtghkh: "hot-air-2",
	ac6gw9k: "hot-air",
	oe4z41v: "hoshi-saga",
	"371osgi": "horse-run",
	qaefedc: "hong-kong-cafe",
	"3br5y06": "hoops-champ",
	da18ves: "lows-adventures-3",
	"7edp1io": "little-wheel",
	lxfor0x: "little-pixel-adventure",
	yai01tn: "little-jane",
	"699o8rq": "home-sheep-home-2",
	wrjo41u: "home-sheep-home",
	z9hbtyg: "home-run-mania",
	dopjv48: "hold-position-2",
	hdrakgn: "hobo-vs-zombies",
	gmyssab: "hobo-prison-brawl",
	hwxetcz: "hobo-7-heaven",
	bjeff14: "hobo-6-hell",
	dz1v4so: "hobo-5-space-brawl",
	gpk7c2b: "hobo-4-total-war",
	q70s123: "hobo-3-wanted",
	"2bq56e9": "hobo-2-prison-brawl",
	klfxw02: "hobo",
	x97lg5e: "hk-cafe",
	db5gaeq: "hit-villains",
	w03ejjx: "hit-or-knit",
	xrouuys: "hipster-kickball",
	"2euinnb": "high-dive-hero",
	qyxwgcb: "hexxagon",
	d7cw0xv: "hero-simulator",
	awuconx: "hero-rescue",
	mz0ux3s: "hello-kitty-wedding-doll-house",
	i0k4eoq: "hello-kitty-roller-rescue",
	m2t42jf: "hello-kitty-painting",
	yydwynv: "hello-kitty-happy-party-pals",
	i361ukj: "hello-kitty-dress-up",
	cex6iju: "hello-kitty-city-ride",
	hymqetw: "hello-kitty-adventure",
	fjlpd6q: "heli-attack-2",
	co7bx0w: "heist-2",
	"2tw1bk4": "heist",
	"70i3l6w": "hedgehog-launch",
	mg7cebe: "heart-star",
	myw2isl: "hasty-shaman",
	q0x2ah7: "haunt-the-house",
	i1ntfbc: "hard-hat-hustle",
	wtvuefy: "hard-court",
	uyvhypn: "happy-wheels",
	xf1wrii: "happy-tower",
	wy57ywl: "happy-racing",
	gw7xlqd: "happy-mart",
	r5e59f8: "hangman-plus",
	was2one: "happy-glass",
	lop0zng: "hangman",
	"3mxaomv": "hanger-2",
	"2fpy7cd": "handulum",
	"3b0ih8h": "hanger",
	"1c03vyd": "hands-of-war",
	"5e3cxh9": "handless-millionaire-2",
	"49io55j": "handless-millionaire",
	rhy2dy8: "hall-of-the-wild",
	x5bduhh: "gun-nightio",
	k1q2bas: "gunspin",
	c278xkz: "gun-knight",
	l6k6ien: "gunblood",
	g3n2l9l: "gum-drop-hop-4",
	n0fd706: "guitar-hero-3",
	yvfcrxu: "guitar-hero-2",
	"8413xdw": "gto-drift",
	w0qxqju: "grow-valley",
	"3idiovp": "grow-tower",
	xbp719m: "grow-rpg",
	fzi2c4r: "grow-nano",
	oenfdq0: "grow-island",
	"5389h0w": "grow-cube",
	"3me96t3": "grindcraft-remastered",
	gjtly0u: "g-robocorp",
	hqrasn5: "greedy-mimic",
	qpkeqko: "great-air-battles",
	qruwtp6: "gravity-duck-2",
	ue91xiq: "graveyard-shift",
	"0zx6v42": "granny",
	n6exlw2: "grab-them-by-the-eyes",
	zxq7p7m: "grabacat",
	pgri0i7: "governor-of-poker",
	vi907l4: "go-up-dash",
	w5e1lcp: "google-solitaire",
	"9zcyp9u": "google-santa-tracker",
	rvhj5cu: "google-maps-snake",
	luujlzj: "golf-park",
	tdqst8e: "gold-miner",
	dfubyqj: "go-kart-go",
	gnd3eee: "going-balls",
	jsafqbg: "go-go-gummo",
	dtc2z7i: "gods-playing-field",
	nncywh1: "go-bowling",
	s2pq0b9: "goal-south-africa",
	"21zh75n": "gimme-the-airpod",
	"117ojpw": "ghosts-n-goblins",
	vfi1bjs: "get-on-top",
	n7psmwu: "geometry-rash-unblocked",
	o0goksb: "geometry-meltdown-unblocked",
	"6g6caef": "geometry-jump-challenge-unblocked",
	qayjoj0: "geometry-jump-unblocked",
	uwy67me: "geometry-dash-world-unblocked",
	"82247wd": "geometry-dash-ship-unblocked",
	p9tx7zv: "geometry-dash-robot-unblocked",
	"1zw1ol5": "geometry-dash-nemesis-unblocked",
	jcj4dbu: "geometry-dash-jump-unblocked",
	"42146ub": "geometry-dash-finally-unblocked",
	r1lu4ky: "geometry-dash-classic-unblocked",
	mozjn3n: "geometrical-dash-unblocked",
	hhd1vlt: "geography-usa",
	br7y4xm: "gears-and-chains-spin-it-2",
	t0ckowi: "home-sheep-home-2-lost-in-space",
	wkwki9g: "galaxy-siege-2",
	msiilzv: "galaga",
	yen3sx5: "galactic-war",
	fomurp2: "future-buddy",
	"5687mqa": "funny-wheels-racers",
	lp67hs7: "funny-tennis",
	"19nzp7u": "funny-shopping",
	e4bv6ge: "funny-battle",
	"4k2534t": "fun-football",
	"0px24wx": "full-moon",
	"3u8y64j": "fruit-snake",
	j9qwpm0: "fruit-ninja",
	jnwv6ag: "fruit-master",
	iklm05j: "frost-bite-2",
	aq3zon2: "frontier",
	a7wzchx: "frog-rush",
	"4dzw0ol": "friday-night-funkin",
	"4semhm3": "freeway-fury",
	mgpamij: "free-rider-jumps",
	c4xfgew: "free-rider-3",
	attccjt: "free-gear",
	vignvb7: "freddy-nightmare-run",
	txmh9nh: "frantic-2",
	eap7kw7: "fragger",
	qbxxst6: "fpsio",
	r1ah77s: "fox-adventurer",
	rh0flta: "four-second-frenzy",
	jazjqcy: "fours",
	h384xc2: "formula-racing",
	v5fwlr4: "forgotten-hill-puppeteer",
	qp4qh80: "forbidden-arms",
	oqregsp: "football-superstars",
	"187yj7k": "football-manager",
	jzt3fqf: "football-launch",
	c83pe06: "football-heads",
	"7xpas84": "foosball",
	msbwhpm: "fnaf-unblocked",
	kpcdzqi: "fly-or-die",
	xwu64tv: "flying-tear",
	day5wlm: "flying-ninja",
	ffdvwsh: "fl-tron",
	"1o47zu8": "flood-runner-4",
	aiwjk92: "floor-is-lava",
	kou2yok: "flood-runner-3",
	at5140e: "flood-runner-2",
	udpj1g0: "flood-runner",
	qa1csjn: "flight",
	e2fda33: "flick-n-kick-2",
	v3sdzec: "flea-25",
	twvlwwg: "fleeing-the-complex",
	"50xaije": "flawed-dimension",
	kizk1ui: "five-nights-with-herobrine",
	"1yjb0dz": "five-day-at-freddys",
	vjdijco: "fit-the-shape",
	dj2fz2k: "fit-cats",
	emtpqmk: "fit-in-the-wall",
	mjs5yg3: "fishy-waters",
	bugm2kh: "fish-world",
	"3rzum9w": "fish-tales-2",
	ye8qpvp: "fish-tales",
	"69kaj9t": "fish-rescue-2",
	wop5yyi: "fishing-master",
	vnxaqkb: "fishingio",
	"3gkmftb": "fish-eat-fish",
	b18w2pq: "first-day-at-school",
	"1tjixq0": "fire-free",
	gldb77z: "fire-emblem",
	qg2sd6n: "fireboy-and-watergirl-6",
	pyj0c33: "fireboy-and-watergirl-5",
	"2s6xi0a": "fireboy-and-watergirl-3",
	tjp2c93: "fireboy-and-watergirl-2",
	lnvulo0: "fireboy-and-watergirl-unblocked",
	ulin04u: "fireblob",
	py89zcf: "fire-balls",
	"39kdjmk": "fire-and-ice",
	in665dk: "finger-golf",
	jrx0ssd: "final-ninja-zero",
	vdp0dlc: "final-ninja",
	"6u8chy4": "fever-frenzy",
	"03c94zj": "fifa-07",
	pwfv2us: "feudalism-3",
	pzuqmek: "feudalism-2",
	sanou58: "feed-us-lost-island",
	b87k9an: "feed-us-pirates",
	ktlblph: "feed-us-happy",
	go3vlry: "feed-us-4",
	"3pjpoii": "feed-us-3",
	s9td1rd: "feed-us-2",
	oea33td: "feed-me",
	"2swlygn": "feeding-frenzy",
	bwdv3kh: "fault-line",
	"2p18p6n": "fat-ninja",
	qc36jhg: "fatal-fighters-2",
	rs598gf: "fatal-fighters",
	"0re6zty": "fast-and-the-furious",
	nkzwl57: "fashion-star",
	xlhe6xc: "fashion-designer-party",
	f6jn64p: "farm-rush",
	uvyw785: "farm-mania-2",
	k5h4vw8: "farm-mania",
	l63m90h: "farm-frenzy-3",
	"0lh4404": "farmerella",
	o2cipz4: "farmer-day-3d",
	gok0hxh: "farm-doggie",
	ur6nnbi: "farafalla",
	kdm2h2h: "family-restaurant",
	lccu4up: "falling-puzzle",
	"2p72d9n": "gears-and-chains-spin-it",
	fp2c7gi: "garfields-scary-scavenger-hunt-2",
	arrf5zv: "garfields-scary-scavenger-hunt",
	n39stxx: "garfield-crazy-rescue",
	erjit9m: "gangsters",
	gpdpxsi: "galaxy-warriors",
	"1vszifa": "galaxy-siege-3",
	jszwm0e: "extreme-pamplona",
	zszhxpt: "extreme-bikers",
	wtta12n: "extreme-baseball",
	"8pwd25z": "extreme-ball",
	kmqyico: "exit-path",
	c0vy3dk: "evolvo",
	t10copb: "espn-arcade-baseball",
	rqcqq6b: "escaping-the-prison",
	t3ddbz2: "escape-the-room",
	joc2iap: "escape-masters",
	pv1cvge: "epic-war-2",
	gomxnci: "epic-war",
	bwonr01: "epic-combo",
	"7s975b6": "epic-boss-fighter",
	gbhpdwr: "epic-battle-fantasy-3",
	hn0jmts: "epic-battle-fantasy-2",
	cwhrprv: "epic-battle-fantasy",
	ru8tdbz: "endless-zombie-rampage-2",
	oo46lho: "endless-zombie-rampage",
	"4x9sihi": "endless-war-defense",
	w22fffn: "endless-war-7",
	ivlter1: "endless-war-5",
	yqi3c3s: "endless-war-4",
	pw7wfa5: "empires-of-arkeia",
	keobu5m: "el-papel",
	uhs9aj0: "element-fighters",
	"60c7gbb": "electric-man-2-hs",
	hbwsyag: "electric-man-2",
	ql68996: "electric-box-2",
	lvh2oyp: "egg-knight",
	mbp2wat: "effing-zombies",
	wl753wn: "effing-worms-xmas",
	gk94jlo: "effing-worms-2",
	"9u9nbx6": "effing-worms",
	m6jt9ez: "effing-machines",
	"91gvlb5": "effing-hail",
	pil9ij6: "edds-worlds-bang-boom-splat",
	"7lendax": "easy-joe-3",
	"4ot4wyf": "easy-joe-2",
	rk4z4la: "easy-joe",
	"0p0wej0": "earth-taken-3",
	"3iyx537": "earth-taken-2",
	"8ht5ixw": "earth-taken",
	xv4qlom: "dunkers",
	o75qu7r: "duck-life",
	"26o5a0f": "drift-challenge",
	h5j2dgw: "drag-racer-v3",
	nsjd3b3: "doodle-god",
	omua9tf: "doodle-devil",
	un53dyk: "dont-escape-3",
	"9dbbdz7": "diggy",
	"1e8lh28": "devilish-hairdresser",
	bovb7wd: "death-run-3d",
	wsbpv3e: "dead-zed",
	w6ba5zl: "dan-the-man",
	w1zu2it: "dad-n-me",
	pldzl4b: "cyberpunk-resistance",
	uidupb3: "cut-the-rope-time-travel",
	"4k75vx9": "crime-moto-racer",
	"998ito3": "crazy-for-speed",
	jspkv1t: "crazy-caves",
	kkaa9fb: "color-by-number",
	elu0f2s: "clash-of-skulls",
	"9a9ee18": "clash-of-armour",
	"7h9vnmx": "chibi-knight",
	gf4h9ir: "chess",
	f6kzub4: "charge-it",
	l3n4d9x: "chainsaw-dance",
	"1eikb8v": "cave-chaos-2",
	"8etwm8s": "cat-trap",
	"3l41jo6": "cat-ninja-2",
	rrverng: "cats-love-cake",
	k26zh46: "cat-ninja",
	kmx2yzl: "cat-mario",
	y5wdawr: "catch-the-candy",
	"7j0rtab": "cat-in-japan",
	"9freq3k": "cat-burglar-the-magic-museum",
	hghygc2: "cat-gunner",
	p7qgvlz: "castle-corp",
	fi29vrq: "castle-wars-2",
	"0yptetl": "castel-wars-modern",
	v3pyqjl: "castle-hotel",
	"3yymva4": "car-crash-test-3",
	gbg1y6o: "car-crash-test-2",
	tzw5axo: "capybara-garden",
	l8kvwv8: "car-crash-test",
	"0kqfcer": "cactus-mccoy-2",
	"1rkxxmp": "ca-brumbies-challenge",
	lg677bf: "burrito-bison-revenge",
	pzs5qtl: "bunnyland",
	oxredun: "brawl-tanks",
	s3sic1m: "brawl-stars-project-laser",
	"2ax2wii": "boxing-live-2",
	lf3e6bx: "boxing-live",
	rdim4k1: "bowling",
	edvzhix: "bouncy-dudes-io",
	"8gtkxcb": "bouncing-balls",
	h86v8wt: "bottle-flip-unblocked",
	j0o1js9: "boat-invasion",
	"7mxr4gw": "blacksmith-lab",
	w32fw2i: "big-tower-tiny-square",
	r7fds8t: "big-tall-small",
	bgrxca9: "bear-chase",
	"9p09w1l": "basketball-master",
	h1g2cuk: "balls-and-bricks",
	peg75d9: "balloon-invasion",
	"8rxavga": "ball-destroyer",
	"8wxrk2g": "ball-blast",
	uxvigel: "bad-time-simulator",
	xlsid3g: "bacon-may-die",
	zpqx8i7: "backyard-football",
	cnyqqp6: "awesome-tanks-2",
	ovf4jti: "awesome-tanks",
	ua2bdv1: "awesome-run-2",
	vl9t3rr: "armed-with-wings-2",
	"8jvhhek": "apple-worm",
	y3p2cw0: "alien-hominid",
	lsi3hri: "age-of-war-2",
	ya9ry3a: "adam-and-eve-6",
	q8u987l: "adam-and-eve-3",
	kyfdfuy: "abobos-big-adventure",
	xf9czc5: "2048-cupcakes",
	vwk4fq5: "99-balls",
	l0egtiz: "18-wheeler",
	"5p6ngss": "10-bullets",
	"0j8ya0k": "4th-and-goal-2022-unblocked",
	bu6zsou: "4th-and-goal-2018-unblocked",
	l978kti: "4th-and-goal-2016-unblocked",
	"2z9ceta": "4th-and-goal-2015-unblocked",
	nrwshgk: "4th-and-goal-2014-unblocked",
	"70tszw7": "4th-and-goal-2013-unblocked",
	"4x1thxx": "3-little-heroes",
	"258e1jj": "1-on-1-football",
	c6kxxwf: "zombies-are-coming-xtreme",
	"23oze8g": "zombie-bounce",
	x7l6zf3: "zik-zak",
	k37pf2a: "wrassling",
	clyyrgp: "worm-hunt-snake-game-io-zone",
	"7oo61pw": "worlds-hardest",
	"7u61yf4": "winter-clash-3d",
	e7l38jy: "winding-road",
	ad6ul2q: "who-is",
	wag664b: "watermelon-drop",
	jb23m95: "volleyball-challenge",
	sxght13: "vex-hyper-dash",
	plytetl: "vex-challenges",
	rl3jch3: "vex-9",
	ssqbexr: "vex-8",
	n77oeea: "vex-7",
	bcuov4d: "vex-6",
	ghfhvix: "vex-5",
	"72btqcc": "vex-4",
	jvb3z7u: "vex-3-xmas",
	"81cikso": "vex-3",
	q4rnlkb: "urban-stack",
	f0suurd: "urban-racer",
	gxhnpz5: "upwarp",
	"6miu4pu": "up-hill-racing-2",
	kxibqhy: "under-the-red-sky",
	n2j64of: "two-tunnel-3d",
	"4h6loxy": "two-ball-3d-dark",
	omnzbcq: "two-ball-3d",
	"2cskxyg": "tug-the-table",
	"8pk1wd8": "trollface-quest-usa-2",
	"9oxzq8h": "trollface-quest-usa-1",
	"340505d": "trollface-quest-horror-2",
	l9ch13k: "trollface-quest-horror-1",
	symjj4e: "toy-car-simulator",
	oxehmvm: "tiny-fishing",
	lwb8amb: "tiles-hop-3d",
	"5kdlk8k": "tiger-simulator-3d",
	xgcmk8u: "thumb-fighter-halloween",
	akj9v06: "thumb-fighter",
	sa777lf: "thumb-fighter-christmas",
	"3aj4t2i": "the-superhero-league",
	c9cm0qn: "there-is-no",
	"406fn2a": "tennis-masters",
	"2j0jn3a": "zoom-be-3",
	c7tc6ll: "zoom-be-2",
	nwdobw9: "zombroad",
	"9nc4ml5": "sweet-ball-sprint",
	anxihf0: "sushi-party-io",
	qg1drxj: "super-mx-the-champion",
	retqplw: "subway-surfers-winter-holiday",
	e0iqxcm: "subway-surfers-venice-online",
	vc8a60a: "subway-surfers-singapore",
	bbxdqks: "subway-surfers-new-orleans",
	frx8vgw: "subway-surfers-mumbai",
	gealh1c: "subway-surfers-bali",
	auhjywx: "subway-surfers-havana",
	zfhu4f0: "subway-surfers-tokyo-2022",
	"0j6bmsp": "street-dribble",
	m6kh1xn: "stick-war-ninja-duel",
	bluy2g8: "stickman-that-one-level",
	wbrg9ow: "stickmanhook",
	t1si2o7: "stickman-kombat-2d",
	pg6su9c: "stickman-fighter",
	r74yq9k: "stickman-escape",
	m997bzk: "stickman-climb",
	"1q842hz": "stickman-battle",
	a2wfl3d: "stacky-maze-2",
	vj5j4tg: "squid-shooter",
	fn5bko5: "spin-master",
	"318i20a": "spider-swing-manhattan",
	"9z7vanw": "sniper-shot-bullet-time",
	"5avzgoe": "sniper-code-2",
	wqcak4u: "snake-vs-worms",
	t63fsq1: "snake-vs-human",
	ato3te1: "snake",
	cxq00x7: "snake-is-mlg-edition",
	lujcqr4: "snail-bob-5-html-5",
	jk6qy0m: "smash-it",
	l5rn7wy: "slope-tunnel",
	tcnze7e: "slope-racing-3d",
	"466voul": "slope-city",
	v28g4r8: "slope-ball",
	k8ztqov: "sling-kong",
	"8s24jp8": "sling-drift",
	"0lvuu5z": "slime-hunter",
	vd6ve55: "skibidi-dash",
	yuka228: "silly-ways-to-die-christmas-party",
	jrfpfyk: "sheep-n-sheep",
	"8fy6av7": "sharkosaurus-rampage",
	"5rfplxk": "shape-fold-html-5",
	g32z45t: "senya-and-oscar-2",
	t0jpkvw: "saloon-robbery",
	rfdav0h: "rowdy-wrestling",
	"93miz9d": "rowdy-city-wrestling",
	"9slxa92": "round-hit-3d",
	tn8selb: "rope-slash-online",
	w4v9fk9: "temple-run-2-holi-festival",
	j0kfb9b: "temple-run-2",
	"51833t0": "tanko-io",
	"6mn30bz": "swingo",
	b5mzmk2: "rebels-clash",
	th4jit4: "raft-wars-2",
	spqdugp: "raft-wars-1",
	"4d4ksev": "quick-gun",
	"4503ifi": "puppet-master",
	epy0n20: "punchy-race",
	px1za8t: "protect-my-dog",
	asumix3: "pro-shooter",
	au2e08b: "prismo-coloring",
	"9go2t5o": "power-wash-cleanup",
	dzhg3hf: "pop-it-master",
	idpp3uh: "pool-club",
	"9qutww5": "police-endless-car",
	ksh48qt: "pocket-car-city",
	"8n8r8h3": "plonky",
	uqwb5px: "perfect-landing-plane-pilot",
	dzemp3w: "pixel-smash-duel",
	hzyq8bd: "party-time",
	"4kdpoa6": "parrot-simulator",
	"8mlbbsz": "parkour-jump",
	oep604l: "parkour-climb-and-jump",
	yp3c77l: "parkour-block-3d",
	us3q11x: "parkour-block-3",
	vcws29r: "parkour-block-2",
	on3y667: "panda-simulator-3d",
	"9z5dull": "paint-pop-3d-2",
	"7k74usl": "ovo-dimensions",
	fnwik5v: "ovo",
	"9vb94yx": "operation-desert-road",
	s2qq2c2: "obby-parkour-ultimate",
	qzvih01: "obby-flip",
	j1l61kp: "obby-challenge-prison-run",
	lgnnpq7: "noob-torch-flip-2d",
	"03p0u5o": "noob-nightmare-arcade",
	dhwqmj8: "noob-archer",
	mb8iysw: "night-offroad-cargo",
	"2pawi25": "neon-hill-rider",
	v1ohqmd: "moto-traffic-rider",
	dh3tf95: "rolly-vortex",
	j879q43: "rolling-sky",
	"5799olf": "rolling-ball-3d",
	"4pq7yeg": "moto-maniac-2",
	mau6rtj: "morph-balls",
	jd2j6jp: "merge-cakes",
	"2pastj4": "master-assassin",
	an4xb9z: "marble-run-3d",
	"4ox6the": "make-up-runner",
	gy86otl: "lost-yeti",
	"8r7m1za": "lines-to-fill",
	wgd528v: "killstreak-3d-shooter",
	i92gi3h: "karate-fighter",
	sb45ote: "johnny-trigger-sniper",
	e2gu5am: "johnny-revenge",
	ji1aflt: "jetpack-joyride",
	vba2bly: "italian-brainrot-clicker",
	bvm3l0g: "idle-lumber-inc",
	s5v3spa: "icy-purple-head",
	m7gpjpt: "house-of-hazards",
	djxcxw1: "hero-3-flying-robot",
	t8egey8: "help-the-hero-1",
	mzufd45: "heist-io",
	pb5g78t: "grass-cutter",
	"0h7md62": "gp-moto-racing",
	eikmp9l: "gold-digger-frvr",
	mxb97uu: "gladihoppers",
	u546cf1: "giraffe-winter-sports-simulator",
	gpqqv84: "getting-over-it",
	vfaho8t: "geometry-neon-dash-world-two-unblocked",
	"5kyc0az": "geometry-neon-dash-rainbow-unblocked",
	vdi334w: "geometry-dash-mr-dubstep-unblocked",
	"8mkb37i": "geometry-dash-bloodbath-unblocked",
	vr0cpew: "fortride-open-world",
	"206fvjt": "fnaf-2-unblocked",
	fs2is1v: "fnaf-sister-unblocked",
	"3zcj8ra": "fnaf-shooter-unblocked",
	wlxjy3e: "fnaf-4-unblocked",
	oviosfd: "fnaf-3-unblocked",
	u49d3kn: "flying-car-simulator",
	bu4tse7: "fnaf-1-unblocked",
	fmo7k46: "flying-wheels-evolution",
	z6a31m5: "fly-car-stunt-4",
	nwdhgmh: "fireboy-and-watergirl-4",
	prai8ld: "evolution-factor",
	ta65e6z: "escape-road-city",
	"8vxkyoe": "escape-raid",
	"5ic028k": "haunted-school",
	dtj6vz5: "haunted-school-2",
	w70cbve: "harvest-simulator",
	"57ilp6j": "halloween-lonely-road-racing",
	"174kv77": "g-switch-3",
	g9pp7do: "eatio-online",
	pzhkqey: "duo-survival-2",
	qq0eild: "duck-life-4",
	u6j04t4: "drift-io",
	"8f4lvsi": "drift-hunters-unblocked",
	fxhwrkc: "doctor-hero",
	cjhlftz: "distraction-driver",
	fbnuuvr: "dino-bros",
	qgpar4e: "demolition-derby-crash-racing",
	cf1gi24: "dasi-office-manager",
	yp9e08l: "dasi-hospital-manager",
	"2s9tjxn": "dark-runner",
	"7w6dhxr": "crowd-run-3d",
	xwlfal4: "crazy-intersection",
	wj7do3p: "city-car-driving-stunt-master",
	e5q1h0t: "catch-the-candy-html-5",
	fw30hej: "cartoon-racers-north-pole",
	nr3zaby: "cars-thief",
	"0mszejm": "car-detailing-master",
	il5nycs: "capitalist-bus-driver",
	jfl0leq: "candy-jump",
	ajggp6x: "bus-simulator-real",
	"3wj17cg": "bomb-it-4",
	"3carmxs": "bomb-it-3",
	"7p5wx0g": "blumgi-paintball",
	"3uhl3r9": "blumgi-dragon",
	"3rncvmm": "iron-snout",
	v5bvnij: "iron-snout-2",
	"2301lfe": "subway-surfers-hong-kong",
	b68mpra: "bitcoin-clicker",
	ddvmjxu: "big-bad-ape-1",
	b4s5mog: "beach-boxing-simulator",
	gy0133r: "battle-royale-noob-vs-pro",
	p7fw7om: "b-cubed",
	"52u9094": "basket-champs",
	i8plrhb: "basketball-superstars",
	okjwg0h: "basketball-stars",
	ba7dmmt: "basketball-legends",
	wtrp1ee: "barbershop-inc",
	e7wm3gy: "balls-avoid",
	sjqr0ew: "archers-random",
	"4yn4mte": "angry-gran-run",
	wqguugb: "airport-clash-3d",
	l9o9pis: "3d-moto-simulator-2",
	oddsasy: "boxrob-3",
	"2idcw9u": "boxing-physics-2",
	zvahojm: "bottle-flip-3d",
	"6tcu98z": "bomb-it-5",
	h0bxcci: "world-cup-rescue",
	peugc38: "world-cup-kicks",
	cw7fxjm: "world-cup-2010-penalty-shootout",
	"7xu11gr": "world-basketball-championship",
	"7x8zpt8": "world-basketball-challenge",
	gbstz5u: "wheely-8",
	wlgq8gu: "wheely-6",
	"0whlf8b": "wheely-5",
	u0ijz7n: "wheely-4",
	jl7pk1x: "wheely-3",
	p7f2mb1: "wheely-2",
	"55s60qs": "wheely",
	"3drihs6": "victors-nightmares",
	np8582j: "ultimate-flash-sonic",
	jiw4xw4: "truck-loader-4",
	avwvscw: "truck-loader-3",
	ardevyn: "truck-loader-2",
	"1r5awjr": "top-basketball",
	"589m9ph": "tomb-of-the-mask-color",
	e763ich: "time-shooter-2",
	p5hr9n9: "the-worlds-hardest-game-4",
	"6i6beqb": "the-impossible-quiz-book",
	iner812: "the-impossible-quiz-2",
	ovtrm0m: "the-gun-redux",
	"3xi9eu7": "tag",
	"9r8ampu": "tabs",
	m93ofhy: "swords-and-sandals-5",
	di26875: "swords-and-sandals-3",
	l6492v7: "swords-and-sandals-2",
	lbfym61: "swords-and-sandals",
	"99wuocu": "swipe-basketball",
	k3brrn4: "tiny-archer",
	fe2qgqg: "super-stickman-fight",
	cpurfui: "super-soccer-star",
	"5pr8qxv": "super-smash-flash-2-v04",
	ijt2qgx: "super-smash-flash-2",
	x3sd977: "super-smash-flash",
	v1iy4gw: "super-house-of-dead-ninjas",
	uxcfv9z: "submachine-6",
	"21ahxdu": "submachine-4",
	xijam51: "submachine-5",
	tcbz2w7: "submachine-3",
	"8o2so2u": "submachine-2",
	u37cb51: "submachine-1",
	yb44d9q: "stickman-street-fighter",
	ojcvpbs: "stickman-parkour-0",
	"54lzvps": "stickman-parkour",
	bh32doe: "stickman-jump",
	jszlzeg: "stickman-dismount",
	e957hu5: "stickman-dirtbike",
	p19oqgf: "stickman-avengers",
	utfxzry: "sports-heads-basketball",
	kyr8yr2: "space-is-key-xmas",
	z12r2xq: "space-is-key-2",
	r2u3zwf: "space-is-key",
	hbg691r: "spacebar-clicker",
	ferdn7l: "soccer-world-cup",
	d750l28: "soccer-star",
	"3vpqc7z": "soccer-sprint",
	ipnu9fq: "soccer-simulator-idle-tournament",
	cei1gjk: "soccer-physics",
	"1sq7ky6": "soccer-champ",
	jbwrbl2: "soccer-balls",
	xmm7och: "sniper-assassin-5",
	"14uqmff": "sniper-assassin",
	"3vosv0w": "smash-car-clicker-2",
	f4j1zoi: "smash-car-clicker",
	lfgdpm7: "simple-soccer-championship",
	rxwh09d: "road-of-the-dead",
	nuv4cim: "road-of-the-dead-2",
	mfr4b99: "riddle-transfer",
	"32365ar": "riddle-transfer-2",
	tcu3kk6: "riddle-school-4",
	u55goma: "riddle-school-3",
	powbu3n: "riddle-school-2",
	"0ed23ch": "riddle-school",
	"6xjkq72": "red-ball-4",
	qszj1hn: "red-ball-3",
	n1kul8k: "ragdoll-stick-duel",
	knth8zm: "poop-clicker",
	s09y80h: "pocket-soccer",
	byveokj: "penalty-world-cup-brazil",
	"44nwf08": "penalty-soccer",
	"4cngz47": "nightmares-the-adventures-5",
	nd97ivo: "nightmares-the-adventures-4",
	fg3bqzh: "nightmares-the-adventures-3",
	di3wegq: "nightmares-the-adventures-2",
	"3i7oxkl": "nightmares-the-adventures-1",
	dop1igm: "my-undead-neighbors",
	thg0hqt: "monster-truck-soccer",
	"9xyd5a5": "minicars-soccer",
	r03vkta: "mine-clicker",
	u1e0two: "must-escape-the-wizards-castle",
	f3yvf77: "idle-streamer",
	"8e4sjqe": "idle-mobs",
	k7gm4im: "idle-miner-tycoon",
	mc0axv0: "idle-house-build",
	h89gv5s: "idle-farmer",
	kspjop1: "idle-choco-tycoon",
	rwhna23: "idle-ant",
	xlr926l: "hungry-are-the-dead",
	pymt63d: "hill-climb-racing",
	"56epr52": "hill-climb-race-eggs",
	"6raf684": "hill-climb-again",
	"85s9pzq": "helix-jump",
	"8tcekx9": "helix-maze",
	"6lwr57r": "hangman-flash",
	q4pnt7i: "gun-mayhem-redux",
	t3l3mar: "gun-mayhem",
	ajwy7r6: "gun-mayhem-2",
	cqnmgk3: "gum-drop-hop-3",
	jcjwdrd: "gum-drop-hop-2",
	skku2vj: "gum-drop-hop",
	"4tfrd9z": "gravity-soccer-3",
	"6o1jtou": "gravity-soccer",
	"0r1gzga": "funny-ragdoll-wrestlers",
	i8idsav: "floor-jumper-escape",
	"3eazlhw": "fancy-pants-adventure-2",
	ryd1inx: "fancy-pants-adventure",
	"7z87vmc": "factory-balls-3",
	gugr3mf: "factory-balls-2",
	sp63o9a: "factory-balls",
	lqqtjgp: "escape-the-closet",
	qndn7p0: "escape-the-classroom",
	ggsy783: "escape-the-car",
	leis1gg: "escape-the-bathroom",
	e2ebg4q: "escape-by-granny",
	hw4p0mn: "eat-clicker",
	oh20xhk: "dunk-shot",
	"8crwsld": "dunk-down",
	as6tahi: "dungeon-adventure",
	k2h8zde: "duel-of-wizards",
	bld2bup: "duck-life-5",
	"02cuax1": "duck-life-3",
	r2ela9q: "duck-life-2",
	h0y0p81: "duck-hunt",
	"47kh26d": "drunken-duel-2",
	kk6rrnm: "drunken-duel",
	h7tavf4: "driving-simulator",
	j0zz45m: "driving-force-3",
	sozhmt3: "drive-a-cat",
	asch0e5: "drift-runners",
	ytnq6tg: "drift-racing",
	hfyctg7: "dress-up-monster-high",
	wsfx89u: "dress-to-impress",
	ydl9h1j: "dream-house-tycoon",
	pea80kp: "dream-club",
	eed7lz6: "draw-the-hill",
	i1jaegl: "draw-in",
	"1bzlj9m": "drag-racing-rivals",
	hw6hxgw: "drag-racer-v2",
	"6aq5nxz": "dragon-fist-3",
	"4h3qxp7": "dragon-boy-2",
	"7z9s6cj": "dragon-boy",
	a4vxvzp: "dragon-ball-z-the-legacy-of-goku",
	hdv8hxe: "dragon-ball-z-flappy-goku",
	wpnyuvs: "dragon-ball-z-devolution",
	zgsu2vv: "dragon-ball-kart",
	y2n1dmd: "dragon-ball-z",
	ommys0z: "dragon-ball-fierce-fighting-30",
	xpg8swj: "dragon-ball-fierce-fighting-3",
	"7d89w7y": "dragonball-advanced-adventure",
	"6cvn8wu": "dozen-bear",
	"6mx3fre": "douchebags-chick",
	"526vnbg": "douchebag-workout-2",
	p37s02b: "douchebag-beach-club",
	y9sei4q: "double-edged",
	g225kzl: "dotted-fill",
	mlz0wby: "doom-2d",
	"96wnsf6": "doodle-god-2",
	a60qv1s: "dont-escape-2",
	"12tz0h0": "fall-box",
	ljnazzb: "fairy-tail-vs-one-piece",
	sf21qli: "dolphin-olympics-2",
	zef8nx0: "dogfight-2",
	mi1sfgv: "doctor-acorn",
	ual13bx: "dirt-bike-5",
	fzrss6z: "dirt-bike-4",
	v0emtc8: "dino-run-2",
	"808fr6i": "dino-run",
	fh9n79z: "dino-meat-hunt",
	f2vmmq9: "diner-city",
	ugu4r9f: "diner-dash",
	"8vrh5oa": "dig-to-china",
	qzxikrq: "devilish-cooking",
	ybcxiss: "desktop-tower-defense",
	c47w8cv: "dental-adventure",
	pjzk126: "demons-down-under",
	"9m8rwr5": "demolition-derby",
	"34i79ng": "defend-your-nuts-2",
	kdb0ox2: "defend-your-nuts",
	drxf2d8: "deep-sleep",
	wx0ry3c: "deepest-sleep",
	jovmbrj: "deeper-sleep",
	"3qvu59m": "death-worm",
	"8ib6aq4": "death-soul",
	lpm4jqe: "dead-zed-2",
	di4gsoi: "deal-or-no-deal",
	"7sy3zi1": "dead-samurai-2",
	jif27jt: "dead-samurai",
	k3y2frj: "dead-drunk",
	q5xfp87: "day-of-meat",
	u7yn5ri: "dark-adventure",
	tih1xck: "curveball",
	sie0h8e: "cursor10",
	fwr6ih9: "cursed-treasure",
	ki1djv6: "cubefield",
	i31b50g: "cube-escape-arles",
	"5woqr0q": "crunchdown",
	lng1clc: "crunchball-3000",
	gh4bsy5: "crossy-chicken",
	"9trmwim": "cricket-world-cup",
	ve325jx: "cricket-master-blaster",
	zpnx5e3: "cricket-challenge",
	bv3zbau: "cricket",
	i5m70sg: "crazy-penguin-catapult",
	y65q39w: "creative-kill-chamber-2",
	pi5xlub: "crazy-taxi",
	h46cgbq: "crazy-flasher-3",
	zc5z6k9: "crash-bandicoot",
	cmxd13d: "craftmine",
	piq677d: "counter-terrorist",
	r9t5q9w: "corporation-inc",
	nitgthm: "corp",
	kytjtak: "cooking-mama",
	hq197bg: "cooking-frenzy",
	"0muvy7a": "cooking-fever",
	"914iccq": "cooking-fever-pizza-maker",
	tbqtpqf: "cooking-cookies",
	ggbiwvj: "cooking-academy",
	"8ut3ybs": "conquer-antarctica",
	m7ztxw4: "concussion",
	oaupv37: "commando-rush",
	scapg64: "commando-defense",
	"1ldfkut": "commando-3",
	tjk2rmu: "commando-2-hacked",
	zpi2j30: "commando-2",
	"7k1hkhh": "commando",
	jivz01g: "combat-hit",
	"28cx4r2": "color-world-origins",
	p7c8x9f: "color-world",
	cu7pi5q: "color-switch-drop",
	"710bmm9": "color-switch",
	dwcowvc: "color-shoot",
	qryg0oo: "color-flow",
	gmjo6rs: "coin-rush",
	gwehsi8: "coinbox-hero",
	"5kgz9l5": "climbing-over-it",
	nrwhvtr: "click-play",
	"9uhzfyb": "clicker-monsters",
	udxuvky: "clicker-heroes",
	"7zr09k9": "clear-vision-5",
	"86o2zps": "clear-vision-4",
	dj90yad: "clear-vision-2",
	uoa2k93: "clear-vision-3",
	ve9oc01: "clear-vision",
	oyoud61: "cleaning-the-system",
	j4dhkx3: "clash-of-the-worlds",
	qxhltrl: "civilizations-wars",
	ecdku6j: "civiballs-2",
	g7isn0k: "dont-escape",
	fyqd5sx: "city-idle",
	ps9rlvx: "circloo-2",
	fpjcby4: "chubby-birds",
	mmiznjk: "christmas-cat",
	qnlgveq: "choppy-orc",
	ccorh6o: "choose-your-weapon-4",
	"0heygzr": "chic-nails-salon",
	"623bvxh": "chicken-casserole",
	eo7fn32: "checkpoint",
	rkxpg6y: "checkers",
	tys59sg: "chaos-faction-2",
	px7rhfb: "champs-league",
	rgz90d6: "centipede",
	lb83i9t: "cave-chaos",
	avd6ksb: "castel-wars",
	tmc4ehx: "castaway-2",
	"29lz80i": "castaway",
	"34foame": "cartoon-baseball",
	h6fputb: "car-racing-winter",
	ncpf42g: "car-parking-challenge",
	sr0128m: "canopy",
	"0v6m0hc": "can-your-pet",
	ev77lry: "cannon-shot",
	"8u9g8ro": "cannon-basketball-2",
	"547gov6": "cannon-basketball",
	voal5sf: "candy-thieves",
	hanyh32: "cake-candy-business-tycoon",
	"0q92ljd": "call-of-duty",
	c3ua3vf: "cactus-mccoy",
	dsnpdpf: "bus-rush",
	"19db4jg": "business-simulator",
	"8nea7qr": "burrito-bison",
	xk8h4a3: "burger-mania",
	zuuewhg: "burger-shop",
	"974ff7b": "burger-cooking-chef",
	"5udi0xn": "bunny-b-ball",
	"5zel6mq": "bump-battle-royale",
	sx4r31f: "bullet-time-fighting",
	"3snd4o9": "bullet-time",
	"707s9to": "bullet-bill-3",
	e4m6mmx: "bullet-man",
	cspwx5i: "building-rush",
	wale5s9: "buggy-race",
	vi9v0di: "buckshot-roulette",
	jo6s7o3: "bubble-tanks-2",
	au9ct9s: "bubble-tanks",
	"3j3rzs4": "bubble-struggle-2",
	"828vbny": "bubble-shooter",
	x5ik81t: "bubble-shooter-archibald-the-pirate",
	"7irghan": "bubble-saga",
	dlyigi6: "bricks-breaker",
	hbjk58c: "brick-out",
	mnm665g: "brawl-stars",
	zixltib: "boxhead-the-rooms",
	"8i9kbhr": "boxhead-more-rooms",
	livhgpr: "boxhead-2play",
	vitklq2: "bowmaster",
	jc9zvp6: "bouncy-rush",
	j99elt1: "bounce-masters",
	bs24e5x: "boom-boom-zombie",
	wyhhc9t: "bomb-it-2",
	"2z9j20r": "bomb-it",
	uuf956m: "bob-the-robber-5",
	ii8m92i: "bob-the-robber-2",
	ynvbvo8: "bob-the-robber",
	zr27ufs: "bob-the-builder",
	q5kfvgl: "bobs-revenge",
	"5v66c4s": "board-game-classics",
	jgg9ff9: "blue-vs-red",
	n8uz69g: "blue-pixel",
	gp8rke6: "bloxorz",
	ro1v68a: "bloons-tower-defense-5",
	sb5gq18: "bloons-tower-defense-4-expansion",
	sj11so0: "bloons-tower-defense-4",
	"6ejgek2": "bloons-tower-defense-3",
	w7rfkwp: "bloons-tower-defense-2",
	h5ad14h: "bloons-tower-defense",
	w27azsb: "bloons-super-monkey",
	gbxfsat: "bloons-pop-three",
	ruj3u9q: "bloons-junior",
	"01c0zon": "bloons",
	bkk0sqe: "civiballs",
	k03fvju: "blocky-snakes",
	so1in6w: "blocky-highway",
	ziwoe0t: "block-hexa-puzzle",
	y1p551h: "block-city-wars",
	"91gxgbx": "bleach-vs-naruto-26",
	qdnryb9: "blade-ball",
	o4oil19: "black-navy-war-2",
	wpp9yjk: "bit-dungeon",
	bhbuns8: "bird-on-bird",
	jn29ie0: "billiards",
	tijhd2p: "biker-street",
	ru301f0: "bike-mayhem",
	prrohi3: "big-truck-adventures",
	b61lgbb: "big-time-butter-baron",
	ylzk7qr: "big-shot-checker",
	ew34q58: "big-shot-boxing",
	"7bdhy2y": "big-ice-tower-tiny-square",
	iaay6s4: "bicycle-kick-champ",
	ksv0dkl: "best-friends-puzzle",
	"739eqcy": "berzerk-ball-2",
	m1h9d0k: "bed-and-breakfast-3",
	lj0hixl: "ben-10-to-the-rescue",
	jl6achx: "bed-and-breakfast-2",
	"8he0k92": "bed-and-breakfast",
	nwfzutx: "bear-haven-nights",
	cb4oo0t: "beach-trip-saga",
	st7b5jv: "beach-baseball",
	ctjv3ng: "battleship-empire",
	we22wlp: "battle-of-tanks",
	olxl942: "battle-masters",
	k671zpn: "battlefield",
	bdgm6is: "battle-bowlers",
	hwrjr3s: "basket-random",
	rvhyahs: "basket-slam-dunk-2",
	y6ivf7d: "basketmole",
	mkiwlq2: "basket-bros",
	"0x3orp5": "basket-balls",
	oyu01o9: "basketball-physics",
	dm2351k: "basketball-park",
	"6xf6t0c": "basketball-fury",
	qjkazu4: "baseball-stadium",
	m2jt4tz: "baseball-smash",
	"53biqwu": "baseball-league",
	t1wh6tw: "baseball-blast",
	rk74c0r: "baseball-advance",
	vfe07f4: "bartender-the-right-mix",
	j8ctldh: "bank-robbery",
	lcamxzo: "banana-dash-world-2",
	a2oil4s: "banana-dash-3",
	cp06itb: "banana-dash",
	nl98x8w: "banana-clicker",
	zbfhc4f: "balloons-creator",
	pzpmltx: "balloon-in-a-wasteland",
	paev3tk: "ball-cat",
	m80oul3: "badminton-league",
	ndlv7ql: "bad-piggies",
	taerv83: "backyard-sports-football",
	o5wa1m2: "backyard-sports-basketball",
	ztdb081: "backyard-sports-baseball",
	"7zbty54": "backyard-hockey",
	bocb04a: "backyard-football-2006",
	tigcvh5: "backyard-basketball",
	ytdr7n5: "backyard-baseball",
	w6dhi5u: "backrooms",
	r1bl5zn: "baby-chicco-adventures",
	ptkyjek: "az-tank",
	leo6tei: "axis-football-league",
	"2ldg8e3": "awesome-seaquest",
	xmqdn88: "awesome-run",
	ow5shwd: "awesome-planes",
	stzq9f9: "awesome-pirates",
	lksq6dp: "awesome-happy-heroes",
	v903goa: "awesome-conquest",
	"6nbiqo2": "athletic-games",
	"7v7otm3": "atari-breakout",
	to51zso: "askl",
	wuk3ugh: "arrow-hero",
	jfpwuax: "army-commander",
	"1wz6gdu": "army-of-ages",
	"8d763eb": "armour-clash",
	a4w3ecq: "armor-mayhem",
	krsmdjm: "armed-with-wings-3",
	"5y3cnxc": "armed-with-wings",
	"9eictv5": "archeryio",
	f0xcagd: "arcane-weapon",
	n63b3l8: "arcane",
	uf8m3ah: "arcade-drift",
	"2lkxsbi": "aqua-boy",
	efknjev: "apple-shooter-champ",
	k2z4jsn: "apple-shooter",
	rlf95fk: "ant-war",
	gqmnqzp: "animatronic-jumpscare-factory",
	y038bhk: "animator-vs-animation-3",
	"5srxwpj": "animal-shelter",
	gzyhgxu: "animal-raceway",
	rj4o37v: "ambulance-rush",
	"6c7brgx": "amazing-strange-rope-police",
	nwal0yc: "blocky-soccer",
	ytz4p5u: "alone-in-the-madness",
	"3icwnw1": "alien-striker",
	obr666b: "all-star-baseball",
	ola2zz2: "alien-complex",
	"4ltsvc5": "alexander-dawn-of-an-empire",
	rowdct1: "alchemy-physic",
	xxrjmpj: "alchemy-elements",
	sj1h7ao: "alchemy-craft",
	cz8l13m: "a-koopas-revenge-2",
	"4n4o9zp": "a-koopas-revenge",
	dfuhe8r: "airport-madness-3",
	"6btnu7n": "air-wolves",
	kvjcahq: "air-hockey-cup",
	h2pnbhu: "air-dash",
	jfzc03z: "a-gun-in-time",
	"6n0gw9b": "age-of-defense-4",
	w7c4fec: "age-of-defense",
	zg46tcc: "agent-mission",
	"54ezspf": "age-of-defense-3",
	zt61o2h: "agent-dash",
	lbh5d5j: "agent-b10-2",
	xw98d83: "agent-b10",
	"5ltaf4r": "adventure-capitalist",
	l6i7uev: "adam-and-eve-2",
	"9zktxoz": "adam-and-eve",
	bjqgggw: "action-turnip",
	"835tmln": "acid-rain",
	"583dw8k": "acid-bunny-2",
	"4dl0gqh": "acid-bunny",
	lbb7wgt: "achilles",
	cxnor20: "achievement-unlocked-3",
	"8i22jhq": "achievement-unlocked-2",
	tuo6j63: "achievement-unlocked",
	"0sw23za": "ace-gangster-taxi",
	uubbta9: "ace-gangster",
	if7dtmi: "absorbed",
	a93ltb5: "abuba-the-alien",
	v6mn153: "above-average-guy",
	pakno0d: "a-bonte-escape",
	ds7sj1h: "abandoned",
	ixnxozh: "4096-3d",
	"72zy61o": "2048-x2-merge-blocks",
	opz6jno: "2048-solitaire",
	xlm3rco: "2048-legend",
	vqkbaz0: "1001-arabian-nights",
	nxihf1w: "100-meter-sprint",
	"1v9okse": "100-balls",
	ginp01l: "99-bricks",
	u437l9t: "99-balls-3d",
	oe2xaju: "60-seconds-santa-run",
	qyrvdw9: "60-second-burger-run",
	k0aahwo: "40x-escape",
	akwpbjk: "13-days-in-hell",
	gjoicbu: "10x10",
	j08hcw0: "12-minibattles",
	fpb7m1c: "10-more-bullets",
	qh9v0rf: "10-minutes-till-dawn",
	rmsv2j5: "10-is-again",
	jcet33v: "8-pool-puzzle",
	bopm977: "8-ball-pool",
	w0rkc0f: "8-ball-billiards-classic",
	"1oob2zb": "7th-inning-smash",
	ayfza8v: "7-days-without-rain",
	fhjaqn5: "5xman",
	"2emd683": "3-slices-2",
	ykdwnqo: "3-slices",
	"0eiw3vc": "3-pandas-in-japan",
	j9ama3c: "3-pandas-in-brazil",
	"4juqh2o": "3-pandas-2-night",
	"0c657b1": "3-pandas",
	bq2xdp3: "3-on-3-hockey",
	"6gt58e4": "2-player-chess",
	vp0mnhg: "2d-world",
	ztxlzj0: "1-will-survive-2",
	pxp9763: "1-on-1-tennis",
	p1z6h2h: "1-on-1-soccer-brazil",
	vwhllpo: "1-on-1-soccer",
	pi3rseo: "1-on-1-hockey",
	y7cwvbc: "1-on-1-basketball",
	uuudt0g: "1line",
	ozxckkd: "amateur-surgeon",
	gr7szgl: "zombies-shooter-part-2",
	"2bpm36n": "zombie-shooter-3d-1",
	"1ro1nyq": "you-vs-100-skibidi-toilets",
	quwewll: "xmas-rooftop-battles",
	"7hnnfv3": "worlds-hardest-game-3",
	"55hf1me": "worlds-hardest-game-2",
	"6169di2": "ultimate-offroad-cars-2",
	dag4ged: "ultimate-car-arena",
	jupp5pp: "tricks",
	l5nyz0a: "traffic-rush",
	yc41e5s: "traffic-jam-3d",
	vqcu6v0: "top-speed-3d",
	twjm6t4: "tomb-of-the-mask-neon",
	hvqvepz: "tomb-of-the-mark-2",
	hfa0hzg: "tomb-of-the-cat-color",
	rkptgea: "tomb-of-the-cat",
	lvx7yv4: "tiny-cars",
	jbiz31n: "time-shooter",
	ra65c8w: "the-speed-ninja",
	yw93xr4: "the-spear-stickman",
	xbcbcvj: "the-sniper-code",
	mtpm6dz: "zoom-be",
	cmogadw: "survival-race",
	bkgxa7a: "super-star-car",
	pjgo593: "super-soccer-noggins-xmas-edition",
	tvtc6oe: "supernova",
	tog8srz: "superhot-prototype",
	ge6daws: "superheroio",
	f18kddk: "super-bike-the-champion",
	ypnas7f: "superbike-hero",
	tegi6f1: "stunt-biker-3d",
	svm8939: "stock-car-hero",
	g8yzoup: "street-racer-2",
	qsi3x93: "stickman-war",
	jq235c6: "stickman-planks-fall",
	qfj9tyr: "stickman-maze-run",
	yqtf21a: "stickman-go",
	ynqwxek: "stickman-fighter-mega-brawl",
	uai9p5w: "stickman-fighter-2",
	"6x5m5n1": "stickman-dragon-fight",
	"8vu1ccq": "stickman-crazy-box",
	c1yerhb: "stickman-army-the-defenders",
	oof4hf0: "stickman-archer-2",
	"4moc9bj": "stickman-archer-3-2018",
	"8p3cb5i": "stick-defenders",
	"9dscowo": "stick-fighter",
	t7ih1ya: "stealing-the-diamond",
	a8xdq2i: "stair-race-3d",
	"0t6s55q": "stacky-maze",
	nzlm1c2: "stack-bounce",
	"9gxc5b8": "squid-battle-simulator",
	crqiv8b: "sports-bike-racing",
	jhz1lse: "snowcross-stunts-x3m",
	j610hrw: "smash-karts",
	"3j62455": "running-fred",
	qzpkqg1: "run-rich-3d",
	h2qe3ez: "rooftop-snipers-2",
	"589z7u9": "temple-run-2-jungle-fall",
	"9eyyhm3": "temple-of-boom",
	wcumflm: "tap-tap-shots",
	d9oybpu: "red-ball-bounce",
	kfzc7jh: "real-construction-excavator-simulator",
	mbcrfla: "rally-point-4",
	erdok77: "rally-point-3",
	yote891: "rally-point-2",
	"0t5cl5h": "rally-point",
	vt56jec: "raccoon-adventure-city-simulator-3d",
	xfnquik: "poppy-glamrock",
	slj9bfq: "penalty-shootout-multi-league",
	emc6naj: "penalty-kick-onlineinstructions",
	"1fbixdk": "penalty-shooters-2",
	w7v0njh: "parkour-rooftop",
	"5dgp739": "parkour-block-xmas-special",
	"5y05j06": "parkour-block-5",
	"9cqonp8": "parkour-block-4",
	"7slqy6i": "parking-fury-3d-night-thief",
	"1qtz02z": "parking-fury-3d-bounty-hunter",
	fd6j9kj: "parking-fury-3d-beach-city",
	f5ds75j: "parking-fury-3",
	"42n21d9": "parking-fury",
	dfpudan: "off-road-rain-cargo-simulator",
	"2fm5rrw": "offroad-forest-racing",
	"0uuoln4": "offroader-v5",
	"0ajd3qj": "noob-vs-pro-vs-stickman-jailbreak",
	"84bra79": "ninja-clash-heroes",
	u8ql235: "neon-tile-rush",
	pbrowf0: "nail-stack",
	yspkokm: "murder",
	cs336dl: "mr-bullet-3d",
	"6hicc3b": "mr-bullet-2-online",
	vduq1qh: "mr-bullet",
	"9gw48x1": "moto-x3m-spooky-land",
	pp7q754: "moto-x3m-winter",
	zacrwzx: "moto-x3m-pool-party",
	njilzal: "moto-x3m-3",
	nj6hmzj: "moto-x3m-2",
	ucmsg2m: "rooftop-snipers",
	"8bvlro4": "roller-ball-6-bounce-ball-6",
	"6hg1pur": "rio-rex",
	folnxyb: "right-jump",
	hlqtsc7: "rider-2",
	"8urk1se": "rhino-rush-stampede",
	cioe5vy: "moto-maniac",
	kav6fvp: "monster-school-challenges",
	"6sjdi5n": "money-movers-3",
	cp83zuz: "minibattles",
	"9eowziq": "mine-shooter",
	lnp9jvo: "military-shooter-training",
	t92ffbx: "microwars",
	ndah16x: "merge-round-racers",
	i884zu3: "merge-rot",
	herl385: "merge-rainbow",
	oa3zzpo: "merge-party",
	rs2h7nw: "merge-cyber-racers",
	f12smsg: "merge-master",
	d9jjkbu: "merge-arena",
	a7cqudh: "merge-alphabet",
	f6xblyt: "meow-meow-life",
	ejezz3n: "mega-ramp-car-stunts",
	"9wpa7b6": "master-chess",
	"20qk0vy": "magikmon",
	zhvau1f: "mad-truck-challenge-special",
	y9024b6: "madalin-stunt-cars-3",
	"9i12vwe": "madalin-stunt-cars-2",
	egqht8t: "ludo-hero",
	qdn8e3d: "lucky-life",
	"3up3jfc": "kix-dream-soccer",
	cwqpful: "kong-climb",
	pily88j: "killer-assassin",
	fia7f4r: "kiwi-clicker",
	pkhmdwp: "kickflip-santa",
	wnz126z: "kart-wars",
	q22iea1: "kart-race-3d",
	w7ck5a0: "jump-monster",
	"01d3fvx": "jungle-friends",
	ko0p4dl: "jumping-shell",
	tns9j1m: "johnny-trigger-action-shooter",
	"96i0qor": "jewel",
	zkyy0yr: "its-story-time",
	"1uf0etv": "jelly-cat",
	ra5ssbr: "iron-legion",
	xrs5yig: "interstellar-run",
	pb5gq9o: "indian-uphill-bus-simulator-3d",
	"3i2kdxt": "indoor-soccer",
	"6rvcgn7": "indian-truck-simulator-3d",
	"7k10y6w": "idle-startup-tycoon",
	"1ti2qoa": "idle-mining-empire",
	mjc527r: "idle-miner",
	m2pau25: "idle-digging-tycoon",
	rn7jq9w: "idle-dice",
	hfygeu6: "idle-ants",
	l1cjkh9: "icy-purple-head-superslide",
	sb81uso: "icy-purple-head-3",
	"90cjl71": "hydro-storm-2",
	b4equx6: "hunter-assassin-2",
	"2ewkn7d": "horse-simulator-3d",
	y1e53ax: "horse-shoeing",
	"5e34wzv": "horror-tale-kidnapper",
	h6vw99m: "horror-tale-2-samantha",
	bxyf3e6: "horror-tale-3-the-witch",
	p1y7hd1: "hills-of-steel",
	"6uyl4wq": "hill-climb-racing-lite",
	fcvqp2g: "hillclimb-racer",
	i1lbub7: "hide-and-smash",
	z2jj7ef: "highway-bike-simulator",
	dqiihbz: "hero-telekinesis",
	kfb66t4: "hero-squad-survival",
	"0f3hubc": "hero-5-katana-slice",
	jrucy6j: "hero-2-super-kick",
	"5dfsdn3": "hell-tile",
	qwm91oa: "helix-jump-halloween",
	"2u3uxl5": "helix-jump-advanced",
	i8g2l8r: "healing-rush",
	ggsumya: "head-soccer-2023",
	giwt8f9: "heads-mayhem",
	dgozbt5: "heads-arena-soccer-all-stars",
	x6vpeqs: "gp-moto-racing-3",
	uferyse: "golfinity",
	aoxt7sm: "go-kart-go-ultra",
	sl0k3rx: "gobattle",
	"7huqlq8": "glitch-dash",
	"4pj79ma": "getaway-shootout",
	pofu0ao: "gangster-crimes-online-6-mafia-city",
	seafi0n: "gun-duck-2",
	d1qxtnv: "gun-duck-1",
	w8vyqck: "run-rush-2",
	zsvcmtr: "run-rush",
	jh4hvdz: "furious-racing-3d",
	b3j60ug: "funny-shooter",
	g2tzdsw: "funny-battle-simulator-2",
	"3nsvr0u": "funny-battle-simulator",
	"3w9kt2o": "free-kick-shooter",
	"8qlp5ik": "fps-assault-shooter",
	"300ey1k": "fox-simulator-3d",
	"9m76owk": "four-in-a-row",
	"02v2tux": "football-stars",
	"5u1huc4": "food-empire-inc",
	so6a5zu: "flying-cars-era",
	esfakuw: "flying-car-game-police-games",
	"7860wwd": "fly-car-stunt-3",
	rud8d3s: "fly-car-stunt-2",
	c2tki99: "fly-car-stunt",
	"5g1r705": "flip-bros",
	nofu327: "fishing-3-online",
	ur23288: "fish-eat",
	"1epe3zb": "fill-the-battery",
	g3w7snn: "extreme-off-road-cars-3-cargo",
	aiyjpzq: "extreme-off-road-cars",
	"83j90x9": "extreme-car-parking",
	fr5lgrv: "euro-truck-driving-simulator-2025",
	"537gytu": "escape-run",
	iwshcm6: "hamster-escape-jailbreak",
	"31cnotg": "hammer-2-reloaded",
	klun0wk: "halloween-helix",
	"63hxh59": "gun-fu-stickman-2",
	okk0iyf: "gun-fest",
	uk0brvy: "guess-the-kitty",
	ahneg0j: "g-switch-4",
	guhelv2: "duo-survival-3",
	s4q48jj: "duck-life-battle",
	"7uqcmnw": "dunkbrush",
	b0er7lt: "duck-life-adventure",
	xi4lcof: "drunken-fighters",
	ntls3y6: "drunken-boxing-2",
	y5f0og6: "drunken-boxing",
	nujz7u3: "drift-f-1",
	jlo773r: "drift-3",
	l0gewxl: "draw-and-save-stickman",
	"7hpmbk3": "dragon-simulator-3d",
	"59ubh8x": "down-the-hill-1",
	rzhy4c9: "doodle-race",
	pwi6gqq: "doll-designer",
	"7rdxu0b": "dog-simulator-3d",
	ujact75: "dodgeball",
	t9xxkzj: "derby-pixel-survival",
	d2rsivw: "deer-simulator",
	zf1go1j: "dangerous-roads",
	"7b7xjbc": "cyber-cars-punk-racing",
	"6cdmtkm": "curvy-road",
	"8cdqw07": "cubito-cubito",
	ys8f6x8: "crazy-runner-in-city",
	"3unolfz": "crazy-pig-simulator",
	"9hj0ion": "crazy-descent",
	"3xtbq10": "crazy-bikes",
	dekdip1: "cooking-tile",
	bpv6au0: "cookie-master",
	m0z2fov: "color-road-2",
	jy1v4ia: "color-road",
	"797038f": "color-artist",
	n6yoybe: "city-rider",
	"0be1v18": "cats",
	"8ifvpb0": "cat-life-simulator-devil-cat",
	m0tlgps: "cat-clicker-re",
	kasm5yd: "cartoon-mini-racing",
	ri5wgjk: "car-stunts-adventure",
	"5fbjub9": "car-simulator-arena",
	w5tgv04: "car-eats-car-sea-adventure",
	c3yr5fz: "car-drift-racers-2",
	"8swp0z3": "cannon-blast",
	o8diej5: "burnout-drift-hilltop",
	"0xgtgsy": "build-league",
	"6qutu6u": "build-crush",
	md90dvr: "brain-test-tricky-puzzles",
	rbtegvs: "brain-test-2-tricky-stories",
	usstn3q: "brainrot-puzzle",
	"7tnne3t": "brainrot-merge-fight",
	"94vv1lb": "brainrot-craft",
	qe49nk8: "brain-for-monster-truck",
	uchogce: "bob-the-robber-5-temple-adventure",
	yohcbig: "bob-the-robber-4-season-3-japan",
	ihwnfdm: "bob-the-robber-4-season-2-russia",
	mwsxuki: "bob-the-robber-4",
	r574xxj: "bob-the-robber-3",
	ee28b42: "boat-drift",
	wgchnet: "block-toggle",
	erie7dt: "blockpost",
	ork7g6f: "stick-merge-halloween",
	j83g2kf: "stick-merge",
	"8oc3eci": "billion-marble",
	y8noo46: "bike-trials-winter-2",
	mc76eq2: "bicycle-stunts-3d",
	ikc4udq: "basket-swooshes",
	czfp7k1: "basketball-slam-dunk",
	j8lsvqc: "basketball-serial-shooter",
	uvr3byf: "basketball-frvr",
	ojyt78i: "ball-rush",
	w3zvt8o: "bad-ice-cream-2",
	g14ilxw: "bad-ice-cream",
	"6dq6oq2": "armedforces",
	qoq0xyj: "archer-master-3d-castle-defense",
	"5bux5z5": "arcane-archer",
	lwvyxc8: "aqua-thrills",
	"4dmhdnt": "aquaparkio",
	cyh2vum: "apple-shooter-1",
	"5h1iqm3": "ape-sling",
	rlskom7: "ant-art-tycoon",
	s4s10l9: "among-us",
	tsmissd: "among-shooter-kill-impostor",
	"8rcsqjn": "adam-and-eve-astronaut",
	yqnp9l3: "2048",
	"0anbw3m": "911-prey",
	we0o0bk: "18-wheeler-truck-parking-2",
	mh7h899: "911-cannibal",
	doxy6x5: "18-wheeler-driving-sim",
	jvuyz1f: "18-wheeler-truck-parking",
	q8blra0: "18-wheeler-cargo-simulator-2",
	hatgvxf: "18-wheeler-cargo-simulator",
	fxw7q2a: "4wd-off-road-driving-sim",
	zk50hrd: "3d-car-simulator",
	h1bmgx8: "boxrob-2",
	z78uo7f: "boxrob",
	"0m3xzrr": "bouncy-woods",
	cdf1w3x: "bottle-flip-2",
	gt9b8e6: "bomb-it-7",
	"3h69fri": "bomb-it-6"
};
var tag_map_default = {
	ctrnck0: "18-wheeler",
	ghl5b9p: "4th-and-goal",
	zrfo5kc: "action",
	vpm5556: "adventure",
	"1b6cne9": "age-of-war",
	aphuc4x: "arcade",
	"6yqtms7": "bad-ice-cream",
	v3vv5jq: "basketball",
	"32zvy4k": "big-tower-tiny-square",
	"40yb4u8": "bloons-tower-defense",
	w295g63: "bob-the-robber",
	"7tt59f0": "bomb-it",
	ms61h2u: "brain-test",
	vakyilv: "car",
	gwyna59: "clicker",
	dqsrmmg: "duck-life",
	"5q37qwp": "escape",
	p0ah16a: "fireboy-and-watergirl",
	ccp9kzt: "flash",
	kre87lw: "flood-runner",
	is42tbq: "geometry-dash",
	ffc5wyd: "google",
	"3r8thxf": "gum-drop-hop",
	bv77udj: "gun-mayhem",
	sv9n725: "icy-purple-head",
	dnf405n: "idle",
	h2feogt: "io-games",
	"04p7pp4": "learn-to-fly",
	k7man81: "minecraft",
	"7lyacav": "nightmares-the-adventures",
	dlvzshh: "papas-game",
	g7oa0g2: "parking-fury",
	sktr2ik: "parkour-block",
	"8ioa97w": "penguin-diner",
	"3bashxf": "pinch-hitter",
	eookdxn: "platform",
	bjsxl6x: "puzzle",
	"0ke28b3": "racing",
	fjmcbf4: "ragdoll",
	m1ognew: "return-man",
	uf9v4wg: "ricochet-kills",
	kr2vgxl: "riddle-school",
	cl1172h: "roblox",
	ae0h3r2: "run-3",
	ve73llf: "running",
	fhfe7zk: "shooting",
	kcv3y42: "shopping-cart-hero",
	zby1dau: "sift-heads",
	tfa8dny: "simulation",
	uttqxzn: "simulator",
	"9dpct75": "skill",
	"9xi8jwn": "snail-bob",
	cbqhx4e: "sniper-assassin",
	xofpnf3: "snow-rider-3d",
	"8ifws2t": "space-is-key",
	w2bgp21: "sport",
	h7l8cz0: "stickman",
	nu7uyqi: "strikeforce-kitty",
	"7yu1vuy": "submachine",
	"8c3ld2u": "sugar-sugar",
	qr4m2tu: "super-mario",
	"1wa9c67": "the-impossible-quiz",
	s70pvw0: "thing-thing",
	o0utbmb: "thumb-fighter",
	ubsto5z: "tomb-of-the-mask",
	"1o9r56b": "trollface-quest",
	rn5x9d5: "truck-loader",
	e4qksok: "twin-shot",
	lb95iv6: "worlds-hardest",
	"891aamk": "zombie",
	gopdm3c: "zoom-be",
	qz96lco: "adam-and-eve",
	"8mwmfbv": "bottle-flip",
	ulsett0: "boxrob",
	cvfldha: "drift-hunters",
	rmr6ztp: "factory-balls",
	xierflk: "fnaf",
	"8k410xk": "g-switch",
	bsi2stb: "level-devil",
	sawexur: "moto-x3m",
	tbmfe41: "mr-bullet",
	rgcau6c: "ovo",
	elceco5: "red-ball",
	fp1mk20: "slope",
	zfz84nh: "subway-surfers",
	dw85thc: "swords-and-sandals",
	"5da7t6k": "time-shooter",
	"17rq88s": "vex-game",
	s3h3o5d: "wheely",
	q5ddib0: "strategy",
	eymnegf: "multiplayer",
	"8h116d8": "casual"
};
//#endregion
//#region src/utils/tagResolver.ts
var import_dist = require_dist();
/**
* tagResolver.ts
* Utility to convert between API category/tag slugs and public random URL IDs
* using per-site tag-map.json via the @data/index alias.
*
* - tagMap:        { randomId: apiTag }  — used by TagPage to fetch from API
* - reverseTagMap: { apiTag: randomId }  — used by UI / routes to build public URLs
*/
var _tagMap = tag_map_default || {};
/** apiTag → randomId (for building tag & game links in UI) */
var reverseTagMap = Object.fromEntries(Object.entries(_tagMap).map(([randomId, apiTag]) => [String(apiTag).toLowerCase(), randomId]));
/**
* Convert an API category/tag slug to its public URL ID for this site.
* If no mapping exists, returns the original clean tag unchanged.
* @example toPublicTag("car") → "vakyilv"
*/
function toPublicTag(category) {
	if (!category) return "";
	const clean = category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	return reverseTagMap[clean] ?? clean;
}
/**
* Convert a public random URL tag ID back to its original API tag slug.
* @example toApiTag("vakyilv") → "car"
*/
function toApiTag(publicTag) {
	if (!publicTag) return "";
	const clean = publicTag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	return _tagMap[clean] ?? clean;
}
//#endregion
//#region src/config/routes.ts
/**
* routes.ts — Centralized URL configuration
*
* Để đổi URL prefix cho toàn site, chỉ cần sửa VITE_GAME_PREFIX trong .env.site1
* Ví dụ: VITE_GAME_PREFIX=play  → /play/moto-x3m
*         VITE_GAME_PREFIX=g     → /g/moto-x3m
*         VITE_GAME_PREFIX=game  → /game/moto-x3m
*/
/** URL prefix cho trang game chi tiết, ví dụ "g" → /g/moto-x3m */
var GAME_PREFIX = "play";
/**
* Tạo đường dẫn đầy đủ tới trang game
* @example gameUrl("moto-x3m", "action") → "/action-g/moto-x3m"
*/
var gameUrl = (slug, category) => {
	if (slug == "eggy-car-unblocked") return `/${slug}`;
	if (category) return `/${toPublicTag(category)}/${slug}`;
	return `/${GAME_PREFIX}/${slug}`;
};
/**
* Lấy mẫu route pattern dùng cho React Router (<Route path={...}>)
*/
var getGameRoutePattern = () => {
	return "/:categoryPrefix/:slug";
};
var site_default = {
	brand: {
		"name": "Unblocked Games G Plus",
		"homeUrl": "/",
		"ariaLabel": "Go to Home",
		"favicon": "/images/logo/unblocked-games-g-plus-fav.ico",
		"logo": "/images/logo/unblocked-games-g-plus-logo-80.png"
	},
	nav: [
		{
			"label": "Home",
			"href": "/",
			"matchPath": "/"
		},
		{
			"label": "Car",
			"href": "/vakyilv",
			"matchPath": "/vakyilv"
		},
		{
			"label": "Action",
			"href": "/zrfo5kc",
			"matchPath": "/zrfo5kc"
		},
		{
			"label": "Shooting",
			"href": "/fhfe7zk",
			"matchPath": "/fhfe7zk"
		},
		{
			"label": "Sport",
			"href": "/w2bgp21",
			"matchPath": "/w2bgp21"
		},
		{
			"label": "Idle",
			"href": "/dnf405n",
			"matchPath": "/dnf405n"
		},
		{
			"label": "Skill",
			"href": "/9dpct75",
			"matchPath": "/9dpct75"
		}
	],
	navFooter: [],
	search: {
		"placeholder": "Search games...",
		"ariaLabel": "Search games"
	},
	footer: {
		"tagline": "Unbanned Games",
		"copyright": "unbanned-games.github.io. All rights reserved.",
		"socials": [
			{
				"name": "X",
				"href": "#",
				"svgPath": "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
			},
			{
				"name": "Discord",
				"href": "#",
				"svgPath": "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37"
			},
			{
				"name": "YouTube",
				"href": "#",
				"svgPath": "M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"
			}
		],
		"linkGroups": [{
			"heading": "Games",
			"links": [
				{
					"label": "Action",
					"href": "/zrfo5kc"
				},
				{
					"label": "Strategy",
					"href": "/q5ddib0"
				},
				{
					"label": "Multiplayer",
					"href": "/eymnegf"
				},
				{
					"label": "Casual",
					"href": "/8h116d8"
				}
			]
		}, {
			"heading": "Company",
			"links": [{
				"label": "About",
				"href": "/about"
			}, {
				"label": "Contact",
				"href": "/contact"
			}]
		}]
	}
};
//#endregion
//#region src/utils/domainRewrite.ts
/**
* Domain rewrite utility — replaces VITE_GAME_DOMAIN_FROM with VITE_GAME_DOMAIN_TO
* in all string values of any object/array recursively.
*
* Configure per-site in .env.siteX:
*   VITE_GAME_DOMAIN_FROM=eggycaronline.io
*   VITE_GAME_DOMAIN_TO=calc247.io
*/
var DOMAIN_FROM = "eggycaronline.io";
var DOMAIN_TO = "calc247.io";
function rewriteDomain(obj) {
	if (typeof obj === "string") return obj.split(DOMAIN_FROM).join(DOMAIN_TO);
	if (Array.isArray(obj)) return obj.map(rewriteDomain);
	if (obj && typeof obj === "object") {
		const out = {};
		for (const [k, v] of Object.entries(obj)) out[k] = rewriteDomain(v);
		return out;
	}
	return obj;
}
/** apiSlug → randomId (for building game links in UI) */
var reverseSlugMap = Object.fromEntries(Object.entries(slug_map_default || {}).map(([randomId, apiSlug]) => [apiSlug, randomId]));
/**
* Convert an API slug to its public URL slug for this site.
* If no mapping exists, returns the original slug unchanged.
* @example toPublicSlug("bubbits") → "ivsrcn5"
*/
function toPublicSlug(apiSlug) {
	return reverseSlugMap[apiSlug] ?? apiSlug;
}
//#endregion
//#region src/themes/idle/components/layout/Header.tsx
var API_BASE_URL$2 = "https://minicms.tbg95.com";
var ORIGIN$1 = "eggycaronline";
function Header() {
	const { pathname } = (0, import_dist.useLocation)();
	const navigate = (0, import_dist.useNavigate)();
	const searchPlaceholder = site_default.search?.placeholder || "Search games...";
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(-1);
	const inputRef = useRef(null);
	const wrapRef = useRef(null);
	const debounceRef = useRef();
	const search = useCallback((q) => {
		clearTimeout(debounceRef.current);
		if (!q.trim()) {
			setResults([]);
			setOpen(false);
			return;
		}
		debounceRef.current = setTimeout(async () => {
			setLoading(true);
			try {
				const res = await fetch(`${API_BASE_URL$2}/v1/games?search=${encodeURIComponent(q)}&limit=8&origin=${ORIGIN$1}`);
				if (res.ok) {
					const data = await res.json();
					const games = rewriteDomain(data.games || data || []);
					setResults(games);
					setOpen(games.length > 0);
				}
			} catch {
				setResults([]);
			} finally {
				setLoading(false);
			}
		}, 300);
	}, []);
	useEffect(() => {
		const handler = (e) => {
			if (wrapRef.current && !wrapRef.current.contains(e.target)) {
				setOpen(false);
				setActive(-1);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);
	const onKeyDown = (e) => {
		if (e.key === "Escape") {
			setOpen(false);
			inputRef.current?.blur();
			return;
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, results.length - 1));
			return;
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
			return;
		}
		if (e.key === "Enter" && active >= 0 && results[active]) goToGame(results[active]);
	};
	const goToGame = (game) => {
		setOpen(false);
		setQuery("");
		setResults([]);
		navigate(gameUrl(toPublicSlug(game.slug), game.category));
	};
	return /* @__PURE__ */ jsx("header", {
		className: "hidden md:block fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-white/10 shadow-md",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex justify-between items-center px-4 md:px-8 h-20 w-full max-w-[1600px] mx-auto",
			children: [
				/* @__PURE__ */ jsx(import_dist.Link, {
					to: site_default.brand.homeUrl,
					className: "flex items-center hover:scale-105 transition-all duration-300",
					"aria-label": site_default.brand.ariaLabel,
					children: /* @__PURE__ */ jsx("img", {
						src: site_default.brand.logo,
						alt: site_default.brand.name,
						className: "h-10 w-auto object-contain block max-w-[200px]"
					})
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden md:flex space-x-6",
					children: site_default.nav.map((item) => {
						const isActive = pathname === item.href;
						return /* @__PURE__ */ jsx(import_dist.Link, {
							to: item.href,
							className: isActive ? "text-secondary-container border-b-2 border-secondary-container pb-1 uppercase text-sm tracking-wider font-bold" : "text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-sm tracking-wider font-bold",
							children: item.label
						}, item.label);
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					ref: wrapRef,
					className: "relative hidden sm:block",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("input", {
							ref: inputRef,
							value: query,
							onChange: (e) => {
								setQuery(e.target.value);
								search(e.target.value);
								setActive(-1);
							},
							onFocus: () => {
								if (results.length > 0) setOpen(true);
							},
							onKeyDown,
							className: "bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-4 pr-10 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-container w-48 transition-all duration-300 focus:w-72 focus:border-secondary-container",
							placeholder: searchPlaceholder,
							type: "text",
							autoComplete: "off"
						}), loading ? /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined absolute right-3 top-2 text-on-surface-variant text-sm animate-spin",
							children: "progress_activity"
						}) : /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined absolute right-3 top-2 text-on-surface-variant text-sm",
							children: "search"
						})]
					}), open && results.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "absolute right-0 top-full mt-2 w-80 bg-surface-container border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50",
						children: results.map((game, i) => /* @__PURE__ */ jsxs("button", {
							onMouseDown: () => goToGame(game),
							className: `w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ${i === active ? "bg-primary-container/30 text-on-surface" : "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface"}`,
							children: [
								game.imageUrl && /* @__PURE__ */ jsx("img", {
									src: game.imageUrl,
									alt: game.title,
									className: "w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-surface-container-highest"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "text-sm font-semibold truncate",
										children: game.title
									}), game.category && /* @__PURE__ */ jsx("div", {
										className: "text-xs text-on-surface-variant capitalize",
										children: game.category
									})]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "material-symbols-outlined text-sm opacity-40",
									children: "arrow_forward"
								})
							]
						}, game.slug))
					})]
				})
			]
		})
	});
}
var home_page_default = {
	seo: {
		"title": "Unblocked Games G Plus",
		"description": "",
		"canonicalUrl": "/"
	},
	pageContent: {
		"breadcrumb": [{
			"label": "Home",
			"href": "/"
		}, { "label": "All Games" }],
		"heading": "Top Unblocked Games G Plus 2026",
		"subheading": "",
		"categoriesTitle": "Browse by Category",
		"category": "Unblocked Games G Plus",
		"categories": [
			{
				"title": "Multiplayer",
				"description": "Battle other players in real-time arenas and team-based combat."
			},
			{
				"title": "Strategy",
				"description": "Build, expand and conquer in deep strategy and resource management games."
			},
			{
				"title": "Indie",
				"description": "Discover hidden gems from independent game developers worldwide."
			},
			{
				"title": "Open World",
				"description": "Explore vast worlds with complete freedom in open-world adventures."
			},
			{
				"title": "Casual",
				"description": "Quick fun games perfect for short play sessions."
			},
			{
				"title": "Competitive",
				"description": "Rise through the ranks in skill-based competitive games."
			}
		],
		"intro": "Play 2000+ Unblocked Games G Plus"
	},
	homeSlugs: [],
	games: []
};
//#endregion
//#region src/themes/idle/components/layout/MobileNav.tsx
function MobileNav() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const firstGameSlug = home_page_default.games[0]?.slug;
	const firstGameCategory = home_page_default.games[0]?.category;
	const getIconForLabel = (label) => {
		switch (label.toLowerCase()) {
			case "home": return "home";
			case "library": return "library_books";
			case "trending": return "local_fire_department";
			case "profile": return "person";
			default: return "sports_esports";
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("nav", {
			className: "md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-2 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-md h-16",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setIsMenuOpen(true),
					className: "text-primary hover:bg-white/5 transition-all duration-200 p-2 rounded-full active:scale-95",
					children: /* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined",
						children: "menu"
					})
				}), /* @__PURE__ */ jsx(import_dist.Link, {
					to: site_default.brand.homeUrl,
					className: "font-headline-lg-mobile text-xl font-black tracking-tighter text-primary-container drop-shadow-[0_0_10px_rgba(189,0,255,0.4)] uppercase",
					children: site_default.brand.name
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 text-primary",
				children: [
					/* @__PURE__ */ jsx("button", {
						className: "hover:bg-white/5 transition-all duration-200 p-2 rounded-full active:scale-95",
						children: /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined",
							children: "search"
						})
					}),
					/* @__PURE__ */ jsx("button", {
						className: "hover:bg-white/5 transition-all duration-200 p-2 rounded-full active:scale-95 hidden sm:block",
						children: /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined",
							children: "notifications"
						})
					}),
					/* @__PURE__ */ jsx("img", {
						alt: "User Profile Avatar",
						className: "w-8 h-8 rounded-full border border-primary-container object-cover ml-1",
						src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsaKdaEwVyKkIukCQGbshGuIy5-5axsJFFNTmyYHh09WmujuDjAu_hv-9UPfqsrqlM5P-EMHf-yJrx79zzLaqpLFNk4v6SeppZNkaby30kQFEd2GTQ9G3lIbC1IzZTxg7SJ5USABwUkEQcW-WHYC0H_2RRvYd2v29bJdUDEP3lfjNNG70A8g8hYlxf0vPckInSrfv4o7BibCKhvQrIZQqXH5qhlv3JlcWdfx1FfT9CniZX69gP0mXV9wfKUe999pRylPTmcuByneHo"
					})
				]
			})]
		}),
		isMenuOpen && /* @__PURE__ */ jsxs("div", {
			className: "md:hidden fixed inset-0 z-[60] flex",
			children: [/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
				onClick: () => setIsMenuOpen(false)
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative w-64 h-full bg-surface-container-lowest border-r border-white/10 shadow-2xl flex flex-col",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-4 border-b border-white/10 flex justify-between items-center bg-surface/50",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-headline-lg-mobile text-xl font-black tracking-tighter text-primary-container drop-shadow-[0_0_10px_rgba(189,0,255,0.4)]",
						children: "MENU"
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setIsMenuOpen(false),
						className: "text-on-surface-variant hover:text-primary transition-all duration-200 p-2 rounded-full active:scale-95",
						children: /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined",
							children: "close"
						})
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-col p-4 gap-2",
					children: site_default.nav.map((item) => /* @__PURE__ */ jsxs(import_dist.Link, {
						to: item.href,
						onClick: () => setIsMenuOpen(false),
						className: "text-on-surface hover:text-primary hover:bg-white/5 p-3 rounded-lg font-bold text-base flex items-center gap-4 transition-colors",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "material-symbols-outlined",
								children: getIconForLabel(item.label)
							}),
							" ",
							item.label
						]
					}, item.label))
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("nav", {
			className: "md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 bg-surface-container-low/90 backdrop-blur-md rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] border-t border-white/10 font-label-caps text-label-caps pb-safe",
			children: [
				/* @__PURE__ */ jsxs(import_dist.Link, {
					to: firstGameSlug ? gameUrl(firstGameSlug, firstGameCategory) : "/",
					className: "flex flex-col items-center justify-center text-secondary-container drop-shadow-[0_0_8px_rgba(0,238,252,0.6)] w-1/4 h-full active:scale-90 transition-transform",
					children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined mb-1",
						style: { fontVariationSettings: "'FILL' 1" },
						children: "play_circle"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px]",
						children: "Play"
					})]
				}),
				/* @__PURE__ */ jsxs(import_dist.Link, {
					to: "/",
					className: "flex flex-col items-center justify-center text-on-surface-variant hover:text-primary w-1/4 h-full active:scale-90 transition-transform",
					children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined mb-1",
						children: "group"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px]",
						children: "Social"
					})]
				}),
				/* @__PURE__ */ jsxs(import_dist.Link, {
					to: "/",
					className: "flex flex-col items-center justify-center text-on-surface-variant hover:text-primary w-1/4 h-full active:scale-90 transition-transform",
					children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined mb-1",
						children: "shopping_cart"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px]",
						children: "Store"
					})]
				}),
				/* @__PURE__ */ jsxs(import_dist.Link, {
					to: "/",
					className: "flex flex-col items-center justify-center text-on-surface-variant hover:text-primary w-1/4 h-full active:scale-90 transition-transform",
					children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined mb-1",
						children: "person"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px]",
						children: "Profile"
					})]
				})
			]
		})
	] });
}
//#endregion
//#region src/themes/idle/components/layout/Footer.tsx
function Footer() {
	return /* @__PURE__ */ jsx("footer", {
		className: "bg-surface-container-lowest border-t border-white/5 py-12 mt-auto",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col items-center gap-6 px-4 md:px-8 w-full max-w-[1600px] mx-auto",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "font-bold text-xl text-tertiary tracking-widest uppercase",
					children: site_default.brand.name
				}),
				site_default.footer?.tagline && /* @__PURE__ */ jsx("p", {
					className: "text-on-surface-variant text-sm text-center max-w-md",
					children: site_default.footer.tagline
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap justify-center gap-6",
					children: (site_default.navFooter || site_default.nav || []).map((item) => /* @__PURE__ */ jsx(import_dist.Link, {
						to: item.href,
						className: "text-on-surface-variant hover:text-secondary-fixed-dim transition-colors text-sm uppercase tracking-wide",
						children: item.label
					}, item.label))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-secondary text-sm mt-4 text-center",
					children: site_default.footer?.copyright || `Â© ${(/* @__PURE__ */ new Date()).getFullYear()} ${site_default.brand.name}. All rights reserved.`
				})
			]
		})
	});
}
//#endregion
//#region src/themes/idle/components/ui/GameCard.tsx
function GameCard({ title, category, image, imageUrl, slug, badge }) {
	const gameSlug = toPublicSlug(slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
	const imageSrc = image || imageUrl || "";
	return /* @__PURE__ */ jsxs(import_dist.Link, {
		to: gameUrl(gameSlug, category),
		className: "game-card relative block rounded-md overflow-hidden aspect-[4/3] bg-surface-container",
		children: [
			/* @__PURE__ */ jsx("img", {
				alt: title,
				className: "w-full h-full object-cover",
				src: imageSrc
			}),
			badge && /* @__PURE__ */ jsxs("div", {
				className: `absolute top-2 left-2 ${badge.colorClass} text-xs font-bold px-2 py-1 rounded flex items-center shadow-md`,
				children: [badge.icon, badge.text]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "overlay absolute inset-0 flex flex-col justify-end p-3",
				children: [/* @__PURE__ */ jsx("h3", {
					className: "text-white font-bold text-sm truncate",
					children: title
				}), /* @__PURE__ */ jsx("span", {
					className: "text-custom-accent text-xs",
					children: category
				})]
			})
		]
	});
}
//#endregion
//#region src/hooks/useSEO.ts
var SITE_NAME = "unbanned-games.github.io";
var DEFAULT_OG_IMAGE = "/og-image.png";
var BASE_URL = "https://unblocked-gamesg-plus.github.io";
var DEFAULT_CANONICAL = `${BASE_URL}/`;
/**
* Custom hook to manage SEO metadata dynamically.
* Updates document title, canonical URL, and all meta tags for the current page.
*/
function useSEO({ title, description, canonicalUrl, ogImage = DEFAULT_OG_IMAGE, ogType = "website", noIndex = false }) {
	useEffect(() => {
		let fullTitle = title;
		document.title = fullTitle;
		const setMeta = (selector, attr, value) => {
			let el = document.querySelector(selector);
			if (!el) {
				el = document.createElement("meta");
				const [attrName, attrVal] = selector.replace(/^\[|\]$/g, "").split("=");
				el.setAttribute(attrName.trim(), attrVal.replace(/"/g, "").trim());
				document.head.appendChild(el);
			}
			el.setAttribute(attr, value);
		};
		const setCanonical = (href) => {
			let el = document.querySelector("link[rel=\"canonical\"]");
			if (!el) {
				el = document.createElement("link");
				el.rel = "canonical";
				document.head.appendChild(el);
			}
			el.href = href;
		};
		const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
		const fullCanonical = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : `${BASE_URL}${currentPath}`;
		setCanonical(fullCanonical);
		setMeta("[name=\"description\"]", "content", description);
		setMeta("[name=\"robots\"]", "content", noIndex ? "noindex, nofollow" : "index, follow");
		setMeta("[property=\"og:title\"]", "content", fullTitle);
		setMeta("[property=\"og:description\"]", "content", description);
		setMeta("[property=\"og:image\"]", "content", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
		setMeta("[property=\"og:type\"]", "content", ogType);
		setMeta("[property=\"og:url\"]", "content", fullCanonical);
		setMeta("[name=\"twitter:title\"]", "content", fullTitle);
		setMeta("[name=\"twitter:description\"]", "content", description);
		setMeta("[name=\"twitter:image\"]", "content", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
		return () => {
			document.title = `${SITE_NAME} — Free Driving & Racing Games Online`;
			setCanonical(DEFAULT_CANONICAL);
		};
	}, [
		title,
		description,
		canonicalUrl,
		ogImage,
		ogType,
		noIndex
	]);
}
//#endregion
//#region src/themes/idle/components/seo/StructuredData.tsx
function StructuredData({ schema, id = "structured-data" }) {
	const scriptRef = useRef(null);
	useEffect(() => {
		const existing = document.getElementById(id);
		if (existing) existing.remove();
		const script = document.createElement("script");
		script.type = "application/ld+json";
		script.id = id;
		script.textContent = JSON.stringify(schema);
		document.head.appendChild(script);
		scriptRef.current = script;
		return () => {
			scriptRef.current?.remove();
		};
	}, [schema, id]);
	return null;
}
//#endregion
//#region src/themes/idle/pages/GameListingPage.tsx
var API_BASE_URL$1 = "https://minicms.tbg95.com";
var ORIGIN = "eggycaronline";
function GameListingPage() {
	useSEO({
		title: home_page_default.seo.title,
		description: home_page_default.seo.description,
		canonicalUrl: home_page_default.seo.canonicalUrl,
		ogType: "website"
	});
	const staticGames = home_page_default.games || [];
	const homeSlugs = home_page_default.homeSlugs;
	const prerenderGames = rewriteDomain(typeof globalThis !== "undefined" && globalThis.__PRERENDER_DATA__?.games?.length > 0 ? globalThis.__PRERENDER_DATA__.games : staticGames);
	const [games, setGames] = useState(prerenderGames);
	const [isFetchingHome, setIsFetchingHome] = useState(!!homeSlugs?.length);
	const [apiTags, setApiTags] = useState([]);
	useEffect(() => {
		fetch(`${API_BASE_URL$1}/v1/tags?origin=${ORIGIN}`).then((r) => r.json()).then((data) => {
			if (Array.isArray(data)) setApiTags(data.map((t) => t.tag));
		}).catch(() => {});
	}, []);
	useEffect(() => {
		if (!homeSlugs?.length) return;
		fetch(`${API_BASE_URL$1}/v1/games/by-slugs`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				slugs: homeSlugs,
				origin: ORIGIN
			})
		}).then((r) => r.json()).then((data) => {
			if (data.games?.length > 0) setGames(rewriteDomain(data.games));
		}).catch(() => {}).finally(() => setIsFetchingHome(false));
	}, []);
	const [moreGames, setMoreGames] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isFetching, setIsFetching] = useState(false);
	const needsAutoLoad = prerenderGames.length === 0 && !homeSlugs?.length;
	useEffect(() => {
		if (!needsAutoLoad) return;
		setIsFetching(true);
		fetch(`${API_BASE_URL$1}/v1/games?page=1&limit=20&origin=${ORIGIN}`).then((r) => r.json()).then((data) => {
			if (data.games && data.games.length > 0) {
				setGames(rewriteDomain(data.games));
				setPage(2);
				if (data.games.length < 20) setHasMore(false);
			} else setHasMore(false);
		}).catch(() => setHasMore(false)).finally(() => setIsFetching(false));
	}, []);
	const handleLoadMore = async () => {
		if (isFetching || !hasMore) return;
		setIsFetching(true);
		try {
			const response = await fetch(`${API_BASE_URL$1}/v1/games?page=${page}&limit=20&origin=${ORIGIN}`);
			if (response.ok) {
				const data = await response.json();
				if (data.games && data.games.length > 0) {
					setMoreGames((prev) => [...prev, ...rewriteDomain(data.games)]);
					setPage((prev) => prev + 1);
				} else setHasMore(false);
			} else setHasMore(false);
		} catch (err) {
			console.error("Failed to load more games", err);
		} finally {
			setIsFetching(false);
		}
	};
	const [showAllTags, setShowAllTags] = useState(false);
	const TAG_LIMIT = 12;
	const navigate = (0, import_dist.useNavigate)();
	const handleSelectTag = (tag) => {
		navigate(`/${toPublicTag(tag)}`);
	};
	const websiteSchema = useMemo(() => ({
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: site_default.brand.name,
		url: BASE_URL,
		description: home_page_default.seo.description,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/?q={search_term_string}`
			},
			"query-input": "required name=search_term_string"
		}
	}), []);
	const itemListSchema = useMemo(() => ({
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: home_page_default.pageContent.heading,
		url: `${BASE_URL}/`,
		numberOfItems: games.length,
		itemListElement: games.map((game, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: game.title
		}))
	}), [games]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(StructuredData, {
			schema: websiteSchema,
			id: "website-schema"
		}),
		/* @__PURE__ */ jsx(StructuredData, {
			schema: itemListSchema,
			id: "itemlist-schema"
		}),
		/* @__PURE__ */ jsx(MobileNav, {}),
		/* @__PURE__ */ jsxs("main", {
			className: "flex-grow pt-24 pb-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-sm text-primary mb-2 flex items-center space-x-2",
						children: [
							/* @__PURE__ */ jsx("a", {
								className: "hover:underline",
								href: "/",
								children: "Games"
							}),
							/* @__PURE__ */ jsx("span", { children: "»" }),
							/* @__PURE__ */ jsx("span", {
								className: "text-on-surface",
								children: home_page_default.pageContent.category
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex flex-col lg:flex-row lg:items-end justify-between gap-4",
						children: /* @__PURE__ */ jsxs("div", {
							className: "max-w-3xl",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-4xl font-extrabold text-on-surface mb-3 tracking-tight uppercase",
								children: home_page_default.pageContent.heading
							}), /* @__PURE__ */ jsx("p", {
								className: "text-on-surface-variant text-base",
								children: home_page_default.pageContent.intro || home_page_default.pageContent.subheading || "Play the best free idle, puzzle, and casual games online."
							})]
						})
					})]
				}),
				apiTags.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "mb-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ jsx("a", {
								href: "/",
								className: "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 bg-surface-container text-on-surface-variant border-white/10 hover:bg-surface-container-high hover:text-on-surface",
								children: "All"
							}),
							(showAllTags ? apiTags : apiTags.slice(0, TAG_LIMIT)).map((tag) => /* @__PURE__ */ jsx("a", {
								href: `/${toPublicTag(tag)}`,
								onClick: (e) => {
									e.preventDefault();
									handleSelectTag(tag);
								},
								className: "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 bg-surface-container text-on-surface-variant border-white/10 hover:bg-surface-container-high hover:text-on-surface",
								children: tag
							}, tag)),
							apiTags.length > TAG_LIMIT && /* @__PURE__ */ jsx("button", {
								onClick: () => setShowAllTags((v) => !v),
								className: "px-4 py-1.5 rounded-full text-sm font-semibold border border-dashed border-white/20 text-on-surface-variant hover:text-on-surface hover:border-white/40 transition-all duration-200 flex items-center gap-1",
								children: showAllTags ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "Show less" }), /* @__PURE__ */ jsx("span", {
									style: { fontSize: "0.75rem" },
									children: "▲"
								})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("span", { children: [
									"+",
									apiTags.length - TAG_LIMIT,
									" more"
								] }), /* @__PURE__ */ jsx("span", {
									style: { fontSize: "0.75rem" },
									children: "▼"
								})] })
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
					children: [isFetchingHome || isFetching && games.length === 0 && moreGames.length === 0 ? Array.from({ length: homeSlugs?.length ?? 20 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-high animate-pulse aspect-[4/3]" }, `skeleton-${i}`)) : games.map((game, index) => /* @__PURE__ */ jsx(GameCard, { ...game }, `home-${index}`)), moreGames.map((game, index) => /* @__PURE__ */ jsx(GameCard, { ...game }, `more-${index}`))]
				}),
				hasMore && /* @__PURE__ */ jsx("div", {
					className: "mt-12 flex justify-center",
					children: /* @__PURE__ */ jsx("button", {
						onClick: handleLoadMore,
						disabled: isFetching,
						className: "px-8 py-3 bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container font-bold rounded-full transition-colors duration-200 border border-white/10 hover:border-transparent shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
						children: isFetching ? "Loading..." : "Load More Games"
					})
				}),
				""
			]
		})
	] });
}
//#endregion
//#region src/themes/idle/components/ui/ChatComment.tsx
function ChatComment({ author, time, content, avatarSrc, authorColorClass = "text-primary" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex gap-3",
		children: [avatarSrc ? /* @__PURE__ */ jsx("img", {
			alt: "Avatar",
			className: "w-8 h-8 rounded-full border border-surface-variant object-cover",
			src: avatarSrc
		}) : /* @__PURE__ */ jsx("div", {
			className: "w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm",
			children: author.charAt(0).toUpperCase()
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 bg-surface-container-low rounded-tr-xl rounded-br-xl rounded-bl-xl p-3 border border-white/5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex justify-between items-start mb-1",
				children: [/* @__PURE__ */ jsx("span", {
					className: `font-bold text-sm ${authorColorClass}`,
					children: author
				}), /* @__PURE__ */ jsx("span", {
					className: "text-[10px] text-on-surface-variant font-stat-value",
					children: time
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-on-surface-variant",
				children: content
			})]
		})]
	});
}
//#endregion
//#region src/hooks/useComments.ts
var API_BASE_URL = "https://backendreact.eggycaronline.io";
var _commentsFetchCache = /* @__PURE__ */ new Map();
function deduplicatedFetchComments(slug) {
	if (_commentsFetchCache.has(slug)) return _commentsFetchCache.get(slug);
	const p = fetch(`${API_BASE_URL}/v1/games/${slug}/comments`).then((res) => res.ok ? res.json() : []).catch(() => []).finally(() => _commentsFetchCache.delete(slug));
	_commentsFetchCache.set(slug, p);
	return p;
}
function useComments(slug, initialComments = []) {
	const [comments, setComments] = useState(initialComments);
	const [newCommentText, setNewCommentText] = useState("");
	const [commenterName, setCommenterName] = useState("");
	useEffect(() => {
		if (!slug) return;
		let active = true;
		deduplicatedFetchComments(slug).then((data) => {
			if (active && data.length) setComments(data);
		});
		return () => {
			active = false;
		};
	}, [slug]);
	const submitComment = async () => {
		if (!newCommentText.trim()) return;
		const name = commenterName.trim() || "Guest Player";
		const email = "player@gmail.com";
		try {
			const res = await fetch(`${API_BASE_URL}/v1/games/${slug}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					text: newCommentText.trim(),
					parentId: null
				})
			});
			if (res.ok) {
				const data = await res.json();
				if (data.success && data.comment) {
					setComments([{
						id: data.comment.id,
						username: data.comment.username,
						timestamp: data.comment.timestamp,
						content: data.comment.content,
						domain: data.comment.domain || window.location.origin,
						avatarColor: data.comment.avatarColor,
						replies: []
					}, ...comments]);
					setNewCommentText("");
				}
			}
		} catch (err) {
			console.error("Failed to submit comment via API:", err);
			setComments([{
				id: String(Date.now()),
				username: name,
				time: "JUST NOW",
				content: newCommentText.trim(),
				domain: window.location.origin,
				replies: []
			}, ...comments]);
			setNewCommentText("");
		}
	};
	return {
		comments,
		setComments,
		newCommentText,
		setNewCommentText,
		commenterName,
		setCommenterName,
		submitComment
	};
}
//#endregion
//#region src/hooks/useGameData.ts
var _slugMap = slug_map_default || {};
function useGameData(urlSlug) {
	const apiSlug = urlSlug ? _slugMap[urlSlug] ?? urlSlug : urlSlug;
	const [data, setData] = useState(() => {
		if (typeof window === "undefined") {
			const globalData = globalThis.__PRERENDER_DATA__;
			if (globalData && (globalData.game || globalData.slug === urlSlug)) return globalData;
			return null;
		}
		const script = document.getElementById("server-page-data");
		if (script) try {
			const parsed = JSON.parse(script.textContent || "{}");
			if (parsed && (parsed.game || parsed.slug === urlSlug || parsed.title)) {
				if (!parsed.games) {
					parsed.slug = urlSlug;
					return rewriteDomain(parsed);
				}
			}
		} catch (err) {
			console.error("Failed to parse server-page-data", err);
		}
		return null;
	});
	const [loading, setLoading] = useState(!data);
	useEffect(() => {
		if (data && data.slug === urlSlug) {
			setLoading(false);
			return;
		}
		if (!urlSlug) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const fetchGameData = async () => {
			try {
				const url = `https://minicms.tbg95.com/v1/games/${apiSlug}?origin=eggycaronline`;
				const response = await fetch(url);
				if (response.ok) {
					const gameData = await response.json();
					gameData.slug = urlSlug;
					setData(rewriteDomain(gameData));
				} else {
					console.error(`Failed to fetch game data for ${apiSlug}: ${response.status}`);
					setData(null);
				}
			} catch (err) {
				console.error(`Error fetching game data for ${apiSlug}:`, err);
				setData(null);
			} finally {
				setLoading(false);
			}
		};
		fetchGameData();
	}, [urlSlug]);
	return {
		data,
		loading
	};
}
//#endregion
//#region src/themes/idle/pages/NotFoundPage.tsx
function NotFoundPage() {
	useSEO({
		title: "Page Not Found",
		description: "The page you are looking for does not exist.",
		noIndex: true
	});
	return /* @__PURE__ */ jsxs("main", {
		className: "min-h-screen bg-background flex flex-col items-center justify-center text-center px-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative mb-8",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[10rem] font-black leading-none select-none",
					style: {
						background: "linear-gradient(135deg, #bd00ff 0%, #00eefc 50%, #e7006e 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						filter: "drop-shadow(0 0 30px rgba(189,0,255,0.5))"
					},
					children: "404"
				}), /* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 flex items-center justify-center pointer-events-none",
					children: /* @__PURE__ */ jsx("span", {
						className: "text-[10rem] font-black leading-none select-none opacity-20 blur-sm",
						style: {
							background: "linear-gradient(135deg, #00eefc 0%, #bd00ff 100%)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							transform: "translate(4px, 4px)"
						},
						children: "404"
					})
				})]
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "text-headline-xl font-black text-on-surface mb-4 tracking-tight",
				children: "Level Not Found"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-on-surface-variant text-body-lg max-w-md mb-10 leading-relaxed",
				children: "Looks like this page glitched out of existence. The game you're looking for may have been moved, deleted, or never existed."
			}),
			/* @__PURE__ */ jsxs(import_dist.Link, {
				to: "/",
				className: "inline-flex items-center gap-2 px-8 py-4 bg-primary-container text-on-primary-container font-bold rounded-full shadow-[0_0_20px_rgba(189,0,255,0.4)] hover:shadow-[0_0_30px_rgba(189,0,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-200",
				children: [/* @__PURE__ */ jsx("span", {
					className: "material-symbols-outlined",
					children: "home"
				}), "Return to Home"]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none overflow-hidden -z-10",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tertiary-container/5 rounded-full blur-3xl" })
				]
			})
		]
	});
}
//#endregion
//#region src/themes/idle/pages/GamePlayPage.tsx
function GamePlayPage() {
	const { slug } = (0, import_dist.useParams)();
	const [gameLoaded, setGameLoaded] = useState(false);
	const iframeRef = useRef(null);
	const gameContainerRef = useRef(null);
	const { data: pageData, loading: dataLoading } = useGameData(slug);
	const { comments, newCommentText, setNewCommentText, submitComment } = useComments(slug, pageData?.comments || []);
	const DETAIL_TITLE_ENV = "Play {title} Online - Unblocked Games G Plus";
	const rawGameTitle = pageData?.title || pageData?.game?.title || pageData?.seo?.title || slug || "";
	useSEO({
		title: DETAIL_TITLE_ENV.includes("{title}") || DETAIL_TITLE_ENV.includes("{game}") ? DETAIL_TITLE_ENV.replace(/\{title\}|\{game\}/gi, rawGameTitle) : DETAIL_TITLE_ENV,
		description: pageData?.seo?.description || "",
		canonicalUrl: gameUrl(slug || "", pageData?.category),
		ogImage: pageData?.seo?.ogImage,
		ogType: pageData?.seo?.ogType || "video.other",
		noIndex: true
	});
	const handleFullscreen = () => {
		const el = iframeRef.current;
		if (!el) return;
		if (el.requestFullscreen) el.requestFullscreen();
		else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
	};
	useEffect(() => {
		const onKey = (e) => {
			if (!gameLoaded) return;
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "f" || e.key === "F") handleFullscreen();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [gameLoaded]);
	useEffect(() => {
		if (!pageData || !gameContainerRef.current) return;
		const top = gameContainerRef.current.getBoundingClientRect().top + window.scrollY - 80 - 16;
		window.scrollTo({
			top,
			behavior: "smooth"
		});
	}, [pageData]);
	if (dataLoading) return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(MobileNav, {}), /* @__PURE__ */ jsx("main", {
		className: "flex-1 w-full pt-16 md:pt-0 min-h-screen flex flex-col pb-24 md:pb-0 md:pt-20 animate-pulse",
		children: /* @__PURE__ */ jsxs("div", {
			className: "p-container-margin md:p-8 flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto w-full",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex-1 flex flex-col gap-6",
				children: /* @__PURE__ */ jsx("div", { className: "relative w-full aspect-video bg-surface-container-lowest rounded-xl" })
			}), /* @__PURE__ */ jsx("div", { className: "w-full xl:w-80 flex flex-col gap-6 bg-surface-container rounded-xl min-h-[400px]" })]
		})
	})] });
	if (!pageData) return /* @__PURE__ */ jsx(NotFoundPage, {});
	const gameSchema = {
		"@context": "https://schema.org",
		"@type": "VideoGame",
		name: pageData.game.title,
		description: pageData.gameSchema?.description || pageData.seo.description,
		genre: pageData.game.tags || ["Idle", "Casual"],
		applicationCategory: "Game",
		operatingSystem: "Web Browser",
		url: `${BASE_URL}${gameUrl(slug || pageData.game.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), pageData?.category)}`,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD"
		},
		aggregateRating: pageData.gameSchema?.aggregateRating || {
			"@type": "AggregateRating",
			ratingValue: "4.8",
			ratingCount: "12400"
		}
	};
	const tags = pageData.game.tags || ["IDLE", "CASUAL"];
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(StructuredData, {
			schema: gameSchema,
			id: "game-schema"
		}),
		/* @__PURE__ */ jsx(MobileNav, {}),
		/* @__PURE__ */ jsx("main", {
			className: "flex-1 w-full pt-16 md:pt-0 min-h-screen flex flex-col pb-24 md:pb-0 md:pt-20",
			children: /* @__PURE__ */ jsxs("div", {
				className: "p-container-margin md:p-8 flex flex-col xl:flex-row gap-8 max-w-[1600px] mx-auto w-full",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 flex flex-col gap-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							ref: gameContainerRef,
							className: "relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group",
							children: [gameLoaded ? /* @__PURE__ */ jsx("iframe", {
								ref: iframeRef,
								src: pageData.game.iframeUrl,
								title: pageData.game.title,
								allow: "fullscreen; autoplay",
								allowFullScreen: true,
								className: "absolute inset-0 w-full h-full border-0 z-30"
							}) : /* @__PURE__ */ jsxs("div", {
								className: "absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-surface-container to-surface-container-lowest z-10",
								children: [
									pageData.game.thumbnailUrl && /* @__PURE__ */ jsx("div", {
										className: "absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none",
										style: { backgroundImage: `url(${pageData.game.thumbnailUrl})` }
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "w-24 h-24 mb-6 relative z-10",
										children: [
											/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-surface-variant" }),
											/* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full border-4 border-t-secondary-container border-r-primary-container border-b-transparent border-l-transparent animate-spin" }),
											/* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 flex items-center justify-center",
												children: /* @__PURE__ */ jsx("span", {
													className: "material-symbols-outlined text-4xl text-primary",
													style: { fontVariationSettings: "'FILL' 1" },
													children: "sports_esports"
												})
											})
										]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => setGameLoaded(true),
										className: "px-8 py-3 bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container font-headline-md text-headline-md rounded-lg shadow-[0_0_20px_rgba(189,0,255,0.4)] hover:shadow-[0_0_30px_rgba(0,238,252,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 z-10 cursor-pointer",
										children: [/* @__PURE__ */ jsx("span", {
											className: "material-symbols-outlined",
											style: { fontVariationSettings: "'FILL' 1" },
											children: "play_arrow"
										}), "TAP TO PLAY"]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-4 font-label-caps text-label-caps text-on-surface-variant tracking-widest z-10",
										children: "READY TO LOAD"
									})
								]
							}), gameLoaded && /* @__PURE__ */ jsx("button", {
								onClick: handleFullscreen,
								title: "Fullscreen (F)",
								className: "absolute top-3 right-3 z-40 w-10 h-10 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary-container hover:border-primary hover:text-on-primary-container active:scale-90",
								children: /* @__PURE__ */ jsx("span", {
									className: "material-symbols-outlined text-xl",
									children: "fullscreen"
								})
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col md:flex-row md:items-end justify-between gap-4",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
								className: "font-headline-xl text-headline-lg-mobile md:text-headline-xl font-black text-on-surface tracking-tighter mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
								children: pageData.game.title
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2 mb-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "px-3 py-1 bg-tertiary-container/20 border border-tertiary-container text-tertiary text-xs font-label-caps rounded-full shadow-[0_0_10px_rgba(231,0,110,0.2)]",
									children: "TRENDING"
								}), tags.map((tag) => /* @__PURE__ */ jsx("span", {
									className: "px-3 py-1 bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs font-label-caps rounded-full uppercase",
									children: tag
								}, tag))]
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4 bg-surface p-4 rounded-xl border border-white/5 shadow-inner",
								children: [
									pageData.stats && pageData.stats.map((stat) => /* @__PURE__ */ jsxs("div", {
										className: "flex flex-col items-center",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "font-stat-value text-stat-value text-secondary-container flex items-center gap-1",
											children: [stat.icon && /* @__PURE__ */ jsx("span", {
												className: "material-symbols-outlined text-sm",
												children: stat.icon
											}), stat.value]
										}), /* @__PURE__ */ jsx("div", {
											className: "text-xs text-on-surface-variant font-label-caps uppercase",
											children: stat.label
										})]
									}, stat.label)),
									!pageData.stats && /* @__PURE__ */ jsxs(Fragment, { children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-center",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "font-stat-value text-stat-value text-secondary-container flex items-center gap-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "material-symbols-outlined text-sm",
													children: "group"
												}), " 12.4K"]
											}), /* @__PURE__ */ jsx("div", {
												className: "text-xs text-on-surface-variant font-label-caps",
												children: "PLAYERS"
											})]
										}),
										/* @__PURE__ */ jsx("div", { className: "w-px h-8 bg-outline-variant" }),
										/* @__PURE__ */ jsxs("div", {
											className: "flex flex-col items-center",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "font-stat-value text-stat-value text-primary flex items-center gap-1",
												children: [/* @__PURE__ */ jsx("span", {
													className: "material-symbols-outlined text-sm",
													children: "favorite"
												}), " 98%"]
											}), /* @__PURE__ */ jsx("div", {
												className: "text-xs text-on-surface-variant font-label-caps",
												children: "RATING"
											})]
										})
									] }),
									gameLoaded && /* @__PURE__ */ jsx("button", {
										onClick: handleFullscreen,
										title: "Fullscreen",
										className: "ml-2 w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-90 text-on-surface",
										children: /* @__PURE__ */ jsx("span", {
											className: "material-symbols-outlined",
											children: "fullscreen"
										})
									})
								]
							})]
						}),
						pageData.similarGames && pageData.similarGames.length > 0 && /* @__PURE__ */ jsxs("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ jsxs("h3", {
								className: "font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "material-symbols-outlined text-secondary-fixed",
									children: "auto_awesome"
								}), "You Might Also Like"]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3",
								children: pageData.similarGames.map((game, idx) => /* @__PURE__ */ jsxs(import_dist.Link, {
									to: gameUrl(toPublicSlug(game.slug), game.category),
									className: "group flex flex-col gap-1.5 cursor-pointer",
									children: [/* @__PURE__ */ jsx("div", {
										className: "relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container border border-white/5 group-hover:border-primary-container/60 transition-colors shadow-sm",
										children: game.imageUrl ? /* @__PURE__ */ jsx("img", {
											src: game.imageUrl,
											alt: game.title,
											loading: "lazy",
											className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
										}) : /* @__PURE__ */ jsx("div", {
											className: "absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center",
											children: /* @__PURE__ */ jsx("span", {
												className: "material-symbols-outlined text-white/40 text-3xl",
												children: "sports_esports"
											})
										})
									}), /* @__PURE__ */ jsx("p", {
										className: "text-xs text-on-surface-variant group-hover:text-on-surface transition-colors leading-tight line-clamp-2 text-center",
										children: game.title
									})]
								}, idx))
							})]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "w-full xl:w-80 flex flex-col gap-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex-1 bg-surface border border-white/5 rounded-xl flex flex-col shadow-md overflow-hidden min-h-[400px]",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "p-4 border-b border-white/5 bg-surface-container-lowest",
								children: /* @__PURE__ */ jsxs("h3", {
									className: "font-headline-md text-headline-md text-on-surface flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "material-symbols-outlined text-primary",
										children: "forum"
									}), "Comments"]
								})
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex-1 p-4 flex flex-col gap-4 overflow-y-auto max-h-[400px]",
								children: comments.map((comment) => /* @__PURE__ */ jsx(ChatComment, {
									author: comment.username || comment.user || "Anonymous",
									time: comment.timestamp ? new Date(comment.timestamp).toLocaleString() : comment.timeAgo || comment.time || "Just now",
									content: comment.content || comment.text || "",
									avatarSrc: comment.avatarUrl
								}, comment.id))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "p-3 bg-surface-container-lowest border-t border-white/5",
								children: /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("input", {
										className: "w-full bg-surface-container border border-outline-variant rounded-full py-2 pl-4 pr-10 text-sm text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
										placeholder: "Type a message...",
										type: "text",
										value: newCommentText,
										onChange: (e) => setNewCommentText(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") submitComment();
										}
									}), /* @__PURE__ */ jsx("button", {
										onClick: submitComment,
										className: "absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 active:scale-95 transition-transform",
										children: /* @__PURE__ */ jsx("span", {
											className: "material-symbols-outlined text-[16px]",
											children: "send"
										})
									})]
								})
							})
						]
					})
				})]
			})
		})
	] });
}
//#endregion
//#region src/themes/idle/pages/StaticPage.tsx
var PAGE_MAP = {
	about: {
		seo: {
			"title": "About Us — Nexus Games",
			"description": "Learn about Nexus Games, your destination for the best free online cyberpunk and multiplayer games. No download required.",
			"canonicalUrl": "/about"
		},
		hero: {
			"heading": "About Nexus Games",
			"subheading": "Where the grid meets the game.",
			"icon": "sports_esports"
		},
		sections: [
			{
				"heading": "Who We Are",
				"body": "Nexus Games is an online gaming platform built for players who demand the best. We curate and host premium free browser games — from cyberpunk shooters and strategy titles to fast-paced multiplayer action — all playable instantly with no downloads or sign-ups."
			},
			{
				"heading": "Our Mission",
				"body": "We believe the best gaming experiences should be free and accessible to everyone. Our mission is to build the most curated, best-performing browser gaming platform on the web — with games that load in seconds and run flawlessly on any device."
			},
			{
				"heading": "The Games",
				"body": "Our library is hand-picked and quality-tested. From trending titles to hidden gems, every game on Nexus meets our bar for performance, design, and fun. We add new games regularly and keep our library fresh and relevant."
			},
			{
				"heading": "Community",
				"body": "Nexus Games is more than a platform — it's a community. Join us on Discord, follow us on Twitter, and subscribe on YouTube to stay up to date on new releases, tournaments, and behind-the-scenes content."
			}
		]
	},
	privacy: {
		seo: {
			"title": "Privacy Policy — Nexus Games",
			"description": "Read the Nexus Games privacy policy. We are committed to protecting your data and keeping your gaming experience private.",
			"canonicalUrl": "/privacy"
		},
		hero: {
			"heading": "Privacy Policy",
			"subheading": "We keep your data protected. Here's how.",
			"icon": "shield_lock"
		},
		sections: [
			{
				"heading": "Information We Collect",
				"body": "We do not require you to create an account or provide personal information to play games on Nexus Games. We may collect anonymous, aggregated usage data (such as page views and popular games) to improve our service. This data is never linked to you personally."
			},
			{
				"heading": "Cookies",
				"body": "We use essential cookies to maintain site functionality (e.g., remembering your preferences). We do not use advertising tracking cookies or third-party profiling. You can manage or disable cookies through your browser settings at any time."
			},
			{
				"heading": "Third-Party Content",
				"body": "Games on our platform may be hosted by or link to third-party services. These services operate under their own privacy policies. We encourage you to review them when interacting with third-party content."
			},
			{
				"heading": "Advertising",
				"body": "Nexus Games may display non-personalized ads to support our free service. Ad partners receive no personally identifiable information from us. All advertising content is reviewed to be appropriate for a general audience."
			},
			{
				"heading": "Children's Privacy",
				"body": "Nexus Games does not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us and we will promptly delete it."
			},
			{
				"heading": "Policy Updates",
				"body": "This policy may be updated from time to time. We will post any changes here with an updated effective date. Continued use of our platform after changes indicates your acceptance of the revised policy."
			}
		]
	},
	contact: {
		seo: {
			"title": "Contact Us — Nexus Games",
			"description": "Contact the Nexus Games team. Send us your feedback, game suggestions, or bug reports.",
			"canonicalUrl": "/contact"
		},
		hero: {
			"heading": "Contact Us",
			"subheading": "Jack in and get in touch with the Nexus team.",
			"icon": "mail"
		},
		sections: [{
			"heading": "Reach Out",
			"body": "Got a question, a game suggestion, or spotted a bug on the grid? We're all ears. Our team monitors all channels and aims to respond within 24–48 hours."
		}, {
			"heading": "Report a Bug",
			"body": "If a game isn't loading or something looks off, let us know. Include your browser, device type, and the game URL so we can investigate quickly."
		}],
		contact: {
			"intro": "Connect with us on any of these channels:",
			"items": [
				{
					"icon": "email",
					"label": "Email",
					"value": "support@nexusgames.app",
					"href": "mailto:support@nexusgames.app"
				},
				{
					"icon": "chat",
					"label": "Discord",
					"value": "discord.gg/nexusgames",
					"href": "https://discord.gg/nexusgames"
				},
				{
					"icon": "language",
					"label": "Website",
					"value": "nexusgames.app",
					"href": "https://nexusgames.app"
				}
			]
		}
	}
};
function renderBody(body) {
	if (typeof body === "string") return body;
	return body.map((seg, i) => {
		if (typeof seg === "string") return /* @__PURE__ */ jsx("span", { children: seg }, i);
		return /* @__PURE__ */ jsx("a", {
			href: seg.href,
			target: seg.external ? "_blank" : void 0,
			rel: seg.external ? "noopener noreferrer" : void 0,
			className: "text-primary underline underline-offset-2 hover:opacity-80 transition-opacity",
			children: seg.text
		}, i);
	});
}
function StaticPage() {
	const { pathname } = (0, import_dist.useLocation)();
	const page = PAGE_MAP[pathname.replace(/^\/?|\/?$/g, "").split("/").pop() || ""];
	useSEO(page ? {
		title: page.seo.title,
		description: page.seo.description,
		canonicalUrl: page.seo.canonicalUrl
	} : {
		title: "Page Not Found",
		description: "This page does not exist.",
		noIndex: true
	});
	if (!page) return /* @__PURE__ */ jsxs("main", {
		className: "flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-headline-xl font-black text-on-surface mb-4",
			children: "Page Not Found"
		}), /* @__PURE__ */ jsx(import_dist.Link, {
			to: "/",
			className: "text-primary underline",
			children: "Back to Arcade"
		})]
	});
	return /* @__PURE__ */ jsxs("main", {
		className: "flex-1 w-full min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 pointer-events-none overflow-hidden -z-10",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute top-2/3 left-1/2 w-80 h-80 bg-tertiary-container/5 rounded-full blur-3xl" })
				]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "relative py-20 px-4 text-center",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-3xl mx-auto",
					children: [
						page.hero.icon && /* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined text-6xl mb-5 block",
							style: {
								background: "linear-gradient(135deg, #bd00ff 0%, #00eefc 50%, #e7006e 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
								filter: "drop-shadow(0 0 20px rgba(189,0,255,0.4))"
							},
							"aria-hidden": "true",
							children: page.hero.icon
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-headline-xl font-black text-4xl md:text-5xl mb-4 tracking-tight",
							style: {
								background: "linear-gradient(135deg, #bd00ff 0%, #00eefc 100%)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent"
							},
							children: page.hero.heading
						}),
						page.hero.subheading && /* @__PURE__ */ jsx("p", {
							className: "text-on-surface-variant text-body-lg max-w-xl mx-auto leading-relaxed",
							children: page.hero.subheading
						})
					]
				})
			}),
			page.sections && page.sections.length > 0 && /* @__PURE__ */ jsx("section", {
				className: "max-w-3xl mx-auto px-4 pb-12 space-y-6",
				children: page.sections.map((section, i) => /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-2xl border transition-all hover:scale-[1.01]",
					style: {
						background: "rgba(189,0,255,0.04)",
						borderColor: "rgba(189,0,255,0.15)"
					},
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-on-surface font-bold text-base uppercase tracking-widest mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "w-2 h-2 rounded-full flex-shrink-0",
							style: {
								background: "linear-gradient(135deg, #bd00ff, #00eefc)",
								boxShadow: "0 0 8px rgba(189,0,255,0.6)"
							},
							"aria-hidden": "true"
						}), section.heading]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-on-surface-variant text-body-md leading-relaxed",
						children: renderBody(section.body)
					})]
				}, i))
			}),
			page.contact && /* @__PURE__ */ jsxs("section", {
				className: "max-w-3xl mx-auto px-4 pb-16",
				children: [page.contact.intro && /* @__PURE__ */ jsx("p", {
					className: "text-on-surface-variant text-body-md mb-6",
					children: page.contact.intro
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: page.contact.items.map((item, i) => /* @__PURE__ */ jsxs("a", {
						href: item.href || "#",
						target: item.href?.startsWith("http") ? "_blank" : void 0,
						rel: item.href?.startsWith("http") ? "noopener noreferrer" : void 0,
						className: "flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(189,0,255,0.25)]",
						style: {
							background: "rgba(189,0,255,0.04)",
							borderColor: "rgba(189,0,255,0.15)"
						},
						children: [/* @__PURE__ */ jsx("span", {
							className: "material-symbols-outlined text-2xl flex-shrink-0",
							style: {
								background: "linear-gradient(135deg, #bd00ff, #00eefc)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent"
							},
							"aria-hidden": "true",
							children: item.icon
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs uppercase tracking-widest text-on-surface-variant mb-0.5",
								children: item.label
							}), /* @__PURE__ */ jsx("p", {
								className: "text-on-surface text-sm truncate",
								children: item.value
							})]
						})]
					}, i))
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "max-w-3xl mx-auto px-4 pb-16 flex justify-center",
				children: /* @__PURE__ */ jsxs(import_dist.Link, {
					to: "/",
					className: "inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors",
					children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[16px]",
						children: "arrow_back"
					}), "Return to Home"]
				})
			})
		]
	});
}
//#endregion
//#region src/themes/idle/pages/TagPage.tsx
function TagPage() {
	const { tag } = (0, import_dist.useParams)();
	const apiTag = toApiTag(tag || "");
	const [data, setData] = useState(null);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [page, setPage] = useState(1);
	const [allLoaded, setAllLoaded] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	useEffect(() => {
		const fetchTagData = async () => {
			if (!tag) return;
			setLoading(true);
			setError(false);
			try {
				const res = await fetch(`https://minicms.tbg95.com/v1/tags/${apiTag}?origin=eggycaronline&page=1&limit=20`);
				if (!res.ok) throw new Error(res.statusText);
				const jsonData = await res.json();
				if (jsonData.tag) {
					setData(jsonData);
					setGames(rewriteDomain(jsonData.games || []));
					setPage(2);
					if ((jsonData.games || []).length < 20) setAllLoaded(true);
					else setAllLoaded(false);
				} else setError(true);
			} catch (err) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		fetchTagData();
	}, [tag, apiTag]);
	const handleLoadMore = async () => {
		if (loadingMore || allLoaded || !tag) return;
		setLoadingMore(true);
		try {
			const res = await fetch(`https://minicms.tbg95.com/v1/tags/${apiTag}?origin=eggycaronline&page=${page}&limit=20`);
			if (!res.ok) throw new Error(res.statusText);
			const jsonData = await res.json();
			if (jsonData.games && jsonData.games.length > 0) {
				setGames((prev) => [...prev, ...rewriteDomain(jsonData.games)]);
				setPage((prev) => prev + 1);
				if (jsonData.games.length < 20) setAllLoaded(true);
			} else setAllLoaded(true);
		} catch (e) {
			console.error("Failed to load more games", e);
		} finally {
			setLoadingMore(false);
		}
	};
	useSEO({
		title: data?.seoTitle || `Games tagged with ${tag}`,
		description: data?.seoDescription || `Play the best ${tag} games`,
		canonicalUrl: `/${tag}`
	});
	if (loading) return /* @__PURE__ */ jsxs("main", {
		className: "flex-grow pt-24 pb-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full relative",
		children: [/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[512px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none -z-10" }), /* @__PURE__ */ jsx("div", {
			className: "flex justify-center items-center h-64 text-white",
			children: /* @__PURE__ */ jsx("span", {
				className: "material-symbols-outlined text-[32px] animate-spin",
				children: "progress_activity"
			})
		})]
	});
	if (error || !data) return /* @__PURE__ */ jsx(NotFoundPage, {});
	return /* @__PURE__ */ jsxs("main", {
		className: "flex-grow pt-24 pb-24 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full relative",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[512px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none -z-10" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8 relative z-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-sm text-primary mb-2 flex items-center space-x-2",
					children: [
						/* @__PURE__ */ jsx("a", {
							className: "hover:underline",
							href: "/",
							children: "Games"
						}),
						/* @__PURE__ */ jsx("span", { children: "»" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-on-surface capitalize",
							children: data.tag
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-col lg:flex-row lg:items-end justify-between gap-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "max-w-3xl",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "text-4xl font-extrabold text-on-surface mb-3 tracking-tight uppercase",
							children: data.seoTitle || `${data.tag} Games`
						}), /* @__PURE__ */ jsx("p", {
							className: "text-on-surface-variant text-base",
							children: data.seoDescription
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
				children: games.map((game, index) => /* @__PURE__ */ jsx(GameCard, {
					slug: game.slug,
					title: game.title,
					category: game.category,
					imageUrl: game.imageUrl,
					imageAltText: game.imageAltText,
					badge: game.badge
				}, game.slug))
			}),
			!allLoaded && games.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-12 flex justify-center pb-12",
				children: /* @__PURE__ */ jsx("button", {
					onClick: handleLoadMore,
					disabled: loadingMore,
					className: "px-8 py-3 bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container font-bold rounded-full transition-colors duration-200 border border-white/10 hover:border-transparent shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
					children: loadingMore ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px] animate-spin",
						children: "progress_activity"
					}), "Loading..."] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
						className: "material-symbols-outlined text-[18px]",
						children: "expand_more"
					}), "Load More Games"] })
				})
			}),
			data.content && /* @__PURE__ */ jsx("section", {
				className: "mt-8 mb-12",
				children: /* @__PURE__ */ jsx("div", {
					className: "intro-content text-on-surface-variant font-body-md",
					dangerouslySetInnerHTML: { __html: data.content }
				})
			})
		]
	});
}
//#endregion
//#region src/themes/idle/pages/CategoriesPage.tsx
/** Stub: idle theme redirects /games to TagPage via home */
function CategoriesPage() {
	const navigate = (0, import_dist.useNavigate)();
	useEffect(() => {
		navigate("/");
	}, [navigate]);
	return null;
}
//#endregion
//#region src/themes/idle/pages/AllGamesPage.tsx
/** Stub: idle theme redirects /all-games to home */
function AllGamesPage() {
	const navigate = (0, import_dist.useNavigate)();
	useEffect(() => {
		navigate("/");
	}, [navigate]);
	return null;
}
//#endregion
//#region src/themes/idle/pages/LoginPage.tsx
function LoginPage() {
	const navigate = (0, import_dist.useNavigate)();
	useEffect(() => {
		navigate("/");
	}, [navigate]);
	return null;
}
//#endregion
//#region src/themes/idle/pages/ProfilePage.tsx
function ProfilePage() {
	const navigate = (0, import_dist.useNavigate)();
	useEffect(() => {
		navigate("/");
	}, [navigate]);
	return null;
}
//#endregion
//#region src/api/frontendAuth.ts
var BASE = `https://backendreact.eggycaronline.io/frontend-auth`;
var TOKEN_KEY = "fe_token";
var _pendingGetMe = null;
/** Normalize server response — ensures displayName is always a string */
function normalizeUser(u) {
	return {
		...u,
		displayName: u.displayName || ""
	};
}
var USER_KEY = "fe_user";
var getToken = () => typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
var saveToken = (token) => {
	if (typeof localStorage !== "undefined") localStorage.setItem(TOKEN_KEY, token);
};
var clearToken = () => {
	if (typeof localStorage !== "undefined") {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_KEY);
	}
};
var saveUser = (u) => {
	if (typeof localStorage !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(u));
};
var isLoggedIn = () => !!getToken();
async function request(method, path, body, auth = false) {
	const headers = { "Content-Type": "application/json" };
	if (auth) {
		const token = getToken();
		if (!token) throw new Error("No token. Please login first.");
		headers["Authorization"] = `Bearer ${token}`;
	}
	const res = await fetch(`${BASE}${path}`, {
		method,
		headers,
		body: body !== void 0 ? JSON.stringify(body) : void 0
	});
	const data = await res.json();
	if (!res.ok) throw Object.assign(new Error(data.message || "API Error"), {
		status: res.status,
		data
	});
	return data;
}
/**
* Đăng nhập / đăng ký bằng Google id_token (từ GSI SDK)
* POST /frontend-auth/google { id_token }
*/
async function loginWithGoogle(id_token) {
	const data = await request("POST", "/google", { id_token });
	saveToken(data.token);
	const u = normalizeUser(data.user);
	saveUser(u);
	return u;
}
/**
* Đăng nhập bằng email + password
* POST /frontend-auth/login { email, password }
*/
async function loginWithPassword(email, password) {
	const data = await request("POST", "/login", {
		email,
		password
	});
	saveToken(data.token);
	const u = normalizeUser(data.user);
	saveUser(u);
	return u;
}
/**
* Đăng ký tài khoản mới bằng email + password
* POST /frontend-auth/register { email, password, displayName? }
*/
async function registerWithPassword(email, password, displayName) {
	const body = {
		email,
		password
	};
	if (displayName && displayName.trim()) body.displayName = displayName.trim();
	const data = await request("POST", "/register", body);
	saveToken(data.token);
	const u = normalizeUser(data.user);
	saveUser(u);
	return u;
}
/**
* Lấy thông tin user hiện tại
* GET /frontend-auth/me  (Bearer token required)
*
* Deduplicates concurrent calls — multiple callers share the same in-flight
* Promise so only 1 HTTP request is made (handles React StrictMode double-effect).
* Cache clears immediately after response, so manual refreshUser() always refetches.
*/
async function getMe() {
	if (_pendingGetMe) return _pendingGetMe;
	_pendingGetMe = request("GET", "/me", void 0, true).then((u) => {
		const normalized = normalizeUser(u);
		saveUser(normalized);
		return normalized;
	}).finally(() => {
		_pendingGetMe = null;
	});
	return _pendingGetMe;
}
/**
* Đăng xuất — chỉ xóa token local, không cần gọi API
*/
function logout() {
	clearToken();
}
/**
* Lấy XP profile của user hiện tại từ server.
* GET /frontend-auth/xp/me
*/
async function fetchXPProfile() {
	return request("GET", "/xp/me", void 0, true);
}
/**
* Award XP sau khi client xác nhận đã chơi đủ điều kiện.
* POST /frontend-auth/xp/award { gameSlug, sessionToken, playedSeconds }
* Returns null nếu user chưa đăng nhập hoặc không có session token.
*/
async function awardXPServer(payload) {
	try {
		return await request("POST", "/xp/award", payload, true);
	} catch (err) {
		const apiErr = err;
		if (apiErr?.status === 429) return {
			blocked: true,
			cooldownUntil: apiErr.data?.cooldownUntil
		};
		return null;
	}
}
/**
* Nhận daily bonus (+15 XP), tối đa 1 lần/ngày.
* POST /frontend-auth/xp/daily
*
* Returns:
*  - XPAwardResponse nếu bonus được nhận thành công
*  - { blocked: true, next_bonus_at: number } nếu đã claim hôm nay (429)
*  - null nếu lỗi / user chưa đăng nhập
*/
async function claimDailyBonusServer() {
	try {
		return await request("POST", "/xp/daily", void 0, true);
	} catch (err) {
		const apiErr = err;
		if (apiErr?.status === 429 && apiErr.data?.code === "ALREADY_CLAIMED") return {
			blocked: true,
			next_bonus_at: apiErr.data.next_bonus_at ?? Date.now() + 1440 * 60 * 1e3
		};
		return null;
	}
}
//#endregion
//#region src/contexts/AuthContext.tsx
var AuthContext = createContext(null);
function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	/**
	* On mount: if there's a stored fe_token, validate it via GET /me.
	* If token is expired/invalid the server returns 401 → clear token.
	* `active` flag + module-level getMe() dedup = exactly 1 HTTP request
	* even when React StrictMode fires this effect twice.
	*/
	useEffect(() => {
		if (!isLoggedIn()) {
			setIsLoading(false);
			return;
		}
		let active = true;
		getMe().then((me) => {
			if (active) setUser(me);
		}).catch(() => {
			if (active) logout();
		}).finally(() => {
			if (active) setIsLoading(false);
		});
		return () => {
			active = false;
		};
	}, []);
	/** Called by LoginPage after Google GSI SDK gives us the id_token */
	const loginGoogle = useCallback(async (id_token) => {
		setIsLoading(true);
		setError(null);
		try {
			setUser(await loginWithGoogle(id_token));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);
	/** Called by the email/password form */
	const loginPassword = useCallback(async (email, password) => {
		setIsLoading(true);
		setError(null);
		try {
			setUser(await loginWithPassword(email, password));
		} catch (err) {
			const apiErr = err;
			if (apiErr?.data?.code === "NO_PASSWORD_SET") setError("This account uses Google sign-in. Please sign in with Google.");
			else setError(apiErr?.message || "Sign-in failed. Please try again.");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);
	/** Called by the register form */
	const register = useCallback(async (email, password, displayName) => {
		setIsLoading(true);
		setError(null);
		try {
			setUser(await registerWithPassword(email, password, displayName));
		} catch (err) {
			const apiErr = err;
			setError(apiErr?.data?.message || apiErr?.message || "Registration failed. Please try again.");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, []);
	const logout$1 = useCallback(() => {
		logout();
		setUser(null);
		setError(null);
	}, []);
	const clearError = useCallback(() => setError(null), []);
	const refreshUser = useCallback(async () => {
		try {
			setUser(await getMe());
		} catch {}
	}, []);
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value: {
			user,
			isLoading,
			error,
			loginGoogle,
			loginPassword,
			register,
			logout: logout$1,
			clearError,
			refreshUser,
			setUser
		},
		children
	});
}
function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
	return ctx;
}
//#endregion
//#region src/utils/xpSystem.ts
var xpSystem_exports = /* @__PURE__ */ __exportAll({
	XP_REWARDS: () => XP_REWARDS,
	awardXP: () => awardXP,
	getXPProfile: () => getXPProfile
});
/**
* XP System user profile structure
*
* localStorage key: `xp_profile_${userId}`  (per-user)
* Anonymous (no user): key `xp_profile_guest`
*
* Profile shape:
*   user_level, progress_in_current_level, max_xp_in_current_level,
*   lastplayedgame, total_xp, played_games[]
*/
/** XP required to progress through each level.
*  Formula: xpForLevel(n) = BASE + (n - 1) * STEP
*  Level 1 → 100 XP, Level 2 → 150 XP, Level 3 → 200 XP … */
var BASE_XP = 100;
var STEP_XP = 50;
/** XP awarded for various actions */
var XP_REWARDS = {
	play_game: 10,
	new_game_played: 25,
	daily_visit: 15
};
/** Minimum ms between XP awards for the same game (prevents F5 farming) */
var GAME_XP_COOLDOWN_MS = 3600 * 1e3;
function storageKey(userId) {
	return `xp_profile_${userId || "guest"}`;
}
function xpForLevel(level) {
	return BASE_XP + (level - 1) * STEP_XP;
}
function defaultProfile(userId) {
	return {
		userId,
		user_level: 1,
		progress_in_current_level: 0,
		max_xp_in_current_level: xpForLevel(1),
		total_xp: 0,
		lastplayedgame: "",
		played_games: [],
		last_daily_bonus: "",
		xp_cooldowns: {}
	};
}
/** Load profile from localStorage, creating a default if absent */
function getXPProfile(userId = "guest") {
	try {
		if (typeof localStorage === "undefined") return defaultProfile(userId);
		const raw = localStorage.getItem(storageKey(userId));
		if (raw) {
			const parsed = JSON.parse(raw);
			if (!parsed.max_xp_in_current_level) parsed.max_xp_in_current_level = xpForLevel(parsed.user_level);
			if (!parsed.played_games) parsed.played_games = [];
			if (!parsed.xp_cooldowns) parsed.xp_cooldowns = {};
			return parsed;
		}
	} catch {}
	return defaultProfile(userId);
}
/** Persist profile to localStorage */
function saveXPProfile(profile) {
	try {
		if (typeof localStorage !== "undefined") localStorage.setItem(storageKey(profile.userId), JSON.stringify(profile));
	} catch {}
}
/**
* Award XP to a user for a given action.
* Returns a `XPGain` object describing what happened (incl. level-up flag).
*
* @param userId  - user.id from AuthContext (pass "guest" for anonymous)
* @param action  - XPAction key
* @param gameSlug - optional slug of the game being played
*/
function awardXP(userId = "guest", action, gameSlug) {
	const profile = getXPProfile(userId);
	const previousLevel = profile.user_level;
	if (gameSlug && (action === "play_game" || action === "new_game_played")) {
		const lastAwarded = profile.xp_cooldowns[gameSlug] ?? 0;
		if (Date.now() - lastAwarded < GAME_XP_COOLDOWN_MS) return {
			action,
			amount: 0,
			leveledUp: false,
			newLevel: profile.user_level,
			previousLevel,
			profile
		};
	}
	if (action === "new_game_played" && gameSlug) {
		if (profile.played_games.includes(gameSlug)) return awardXP(userId, "play_game", gameSlug);
		profile.played_games = [...profile.played_games, gameSlug];
	}
	if (action === "daily_visit") {
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		if (profile.last_daily_bonus === today) return {
			action,
			amount: 0,
			leveledUp: false,
			newLevel: profile.user_level,
			previousLevel,
			profile
		};
		profile.last_daily_bonus = today;
	}
	if (gameSlug) {
		profile.lastplayedgame = gameSlug;
		profile.xp_cooldowns[gameSlug] = Date.now();
	}
	const earned = XP_REWARDS[action];
	profile.total_xp += earned;
	let remaining = profile.progress_in_current_level + earned;
	let leveledUp = false;
	while (remaining >= profile.max_xp_in_current_level) {
		remaining -= profile.max_xp_in_current_level;
		profile.user_level += 1;
		profile.max_xp_in_current_level = xpForLevel(profile.user_level);
		leveledUp = true;
	}
	profile.progress_in_current_level = remaining;
	saveXPProfile(profile);
	return {
		action,
		amount: earned,
		leveledUp,
		newLevel: profile.user_level,
		previousLevel,
		profile
	};
}
//#endregion
//#region src/contexts/XPContext.tsx
function getDailyBonusCache(userId) {
	try {
		if (typeof localStorage === "undefined") return null;
		const raw = localStorage.getItem(`daily_bonus_${userId}`);
		if (!raw) return null;
		const cache = JSON.parse(raw);
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		return cache.date === today ? cache : null;
	} catch {
		return null;
	}
}
function saveDailyBonusCache(userId, next_bonus_at) {
	try {
		const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		if (typeof localStorage !== "undefined") localStorage.setItem(`daily_bonus_${userId}`, JSON.stringify({
			date: today,
			next_bonus_at
		}));
	} catch {}
}
var _xpFetchCache = /* @__PURE__ */ new Map();
function deduplicatedFetchXP(userId) {
	if (_xpFetchCache.has(userId)) return _xpFetchCache.get(userId);
	const p = fetchXPProfile().finally(() => _xpFetchCache.delete(userId));
	_xpFetchCache.set(userId, p);
	return p;
}
/** Maps server response → local XPProfile shape used by UI components */
function serverToLocal(server, userId) {
	return {
		userId,
		user_level: server.user_level,
		progress_in_current_level: server.progress_in_current_level,
		max_xp_in_current_level: server.max_xp_in_current_level,
		total_xp: server.total_xp,
		lastplayedgame: server.lastplayedgame,
		played_games: [],
		last_daily_bonus: server.last_daily_bonus,
		xp_cooldowns: {}
	};
}
/** Maps server award response → XPGain event */
function awardToGain(res) {
	return {
		xp_gained: res.xp_gained,
		leveled_up: res.leveled_up,
		new_level: res.new_level,
		previous_level: res.previous_level,
		total_xp: res.total_xp,
		progress_in_current_level: res.progress_in_current_level,
		max_xp_in_current_level: res.max_xp_in_current_level
	};
}
var XPContext = createContext(null);
function XPProvider({ children }) {
	const { user } = useAuth();
	const userId = user?.id ?? "guest";
	const [xp, setXP] = useState(() => getXPProfile(userId));
	const [xpLoading, setXPLoading] = useState(false);
	const [levelUpEvent, setLevelUpEvent] = useState(null);
	const [nextDailyBonus, setNextDailyBonus] = useState(null);
	const levelUpTimer = useRef(null);
	const dailyFetchingRef = useRef(false);
	/** Show level-up toast for 5 seconds */
	function fireLevelUp(gain) {
		if (levelUpTimer.current) clearTimeout(levelUpTimer.current);
		setLevelUpEvent(gain);
		levelUpTimer.current = setTimeout(() => setLevelUpEvent(null), 5e3);
	}
	useEffect(() => {
		if (!isLoggedIn() || userId === "guest") {
			setXP(getXPProfile("guest"));
			setXPLoading(false);
			return;
		}
		let active = true;
		setXPLoading(true);
		deduplicatedFetchXP(userId).then((server) => {
			if (active) setXP(serverToLocal(server, userId));
		}).catch(() => {
			if (active) setXP(getXPProfile(userId));
		}).finally(() => {
			if (active) setXPLoading(false);
		});
		return () => {
			active = false;
		};
	}, [userId]);
	useEffect(() => {
		if (!isLoggedIn() || userId === "guest") return;
		if (dailyFetchingRef.current) return;
		dailyFetchingRef.current = true;
		const cached = getDailyBonusCache(userId);
		if (cached) {
			setNextDailyBonus(cached.next_bonus_at);
			dailyFetchingRef.current = false;
			return;
		}
		claimDailyBonusServer().then((res) => {
			if (!res) return;
			if ("blocked" in res && res.blocked) {
				const blockedRes = res;
				setNextDailyBonus(blockedRes.next_bonus_at);
				saveDailyBonusCache(userId, blockedRes.next_bonus_at);
				return;
			}
			const award = res;
			const gain = awardToGain(award);
			setXP(serverToLocal(award, userId));
			setNextDailyBonus(null);
			saveDailyBonusCache(userId, (/* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + "T00:00:00Z")).getTime() + 1440 * 60 * 1e3);
			if (gain.leveled_up) fireLevelUp(gain);
		}).finally(() => {
			dailyFetchingRef.current = false;
		});
	}, [userId]);
	const awardGame = useCallback(async (gameSlug, sessionToken, playedSeconds) => {
		if (!isLoggedIn() || !sessionToken) {
			const { awardXP } = await Promise.resolve().then(() => xpSystem_exports);
			setXP(awardXP("guest", "new_game_played", gameSlug).profile);
			return null;
		}
		const res = await awardXPServer({
			gameSlug,
			sessionToken,
			playedSeconds
		});
		if (!res || res.blocked) return null;
		const gain = awardToGain(res);
		setXP((prev) => ({
			...prev,
			user_level: res.new_level,
			progress_in_current_level: res.progress_in_current_level,
			max_xp_in_current_level: res.max_xp_in_current_level,
			total_xp: res.total_xp,
			lastplayedgame: res.lastplayedgame
		}));
		if (gain.leveled_up) fireLevelUp(gain);
		return gain;
	}, []);
	const refresh = useCallback(async () => {
		if (!isLoggedIn() || userId === "guest") {
			setXP(getXPProfile("guest"));
			return;
		}
		try {
			setXP(serverToLocal(await deduplicatedFetchXP(userId), userId));
		} catch {
			setXP(getXPProfile(userId));
		}
	}, [userId]);
	return /* @__PURE__ */ jsx(XPContext.Provider, {
		value: {
			xp,
			xpLoading,
			levelUpEvent,
			nextDailyBonus,
			awardGame,
			refresh
		},
		children
	});
}
//#endregion
//#region src/entry-server.tsx
/**
* Server-Side Render Entry — used by prerender.mjs to generate static HTML
* Imports from @theme/index (resolved to src/themes/{VITE_THEME}/ at build time)
*/
/**
* Render the app at a given URL to an HTML string.
* @param url - The pathname to render (e.g. "/" or "/g/moto-x3m")
*/
function render(url) {
	return renderToString(/* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(XPProvider, { children: /* @__PURE__ */ jsx(import_dist.StaticRouter, {
		location: url,
		children: /* @__PURE__ */ jsxs("div", {
			className: "min-h-screen flex flex-col bg-background text-on-background",
			children: [
				/* @__PURE__ */ jsx(Header, {}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 flex flex-col pt-20",
					children: /* @__PURE__ */ jsxs(import_dist.Routes, { children: [
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/",
							element: /* @__PURE__ */ jsx(GameListingPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/login",
							element: /* @__PURE__ */ jsx(LoginPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/profile",
							element: /* @__PURE__ */ jsx(ProfilePage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/games",
							element: /* @__PURE__ */ jsx(CategoriesPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/all-games",
							element: /* @__PURE__ */ jsx(AllGamesPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/all-games/:range",
							element: /* @__PURE__ */ jsx(AllGamesPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/about",
							element: /* @__PURE__ */ jsx(StaticPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/privacy",
							element: /* @__PURE__ */ jsx(StaticPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/contact",
							element: /* @__PURE__ */ jsx(StaticPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/eggy-car-unblocked",
							element: /* @__PURE__ */ jsx(GamePlayPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: getGameRoutePattern(),
							element: /* @__PURE__ */ jsx(GamePlayPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/404",
							element: /* @__PURE__ */ jsx(NotFoundPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "/:tag",
							element: /* @__PURE__ */ jsx(TagPage, {})
						}),
						/* @__PURE__ */ jsx(import_dist.Route, {
							path: "*",
							element: /* @__PURE__ */ jsx(NotFoundPage, {})
						})
					] })
				}),
				/* @__PURE__ */ jsx(Footer, {})
			]
		})
	}) }) }));
}
//#endregion
export { render };
