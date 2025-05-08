/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./newSDK/MessageChannel.ts":
/*!**********************************!*\
  !*** ./newSDK/MessageChannel.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ActionName: () => (/* binding */ ActionName),\n/* harmony export */   MessageChannel: () => (/* binding */ MessageChannel)\n/* harmony export */ });\n// /MessageChannel.ts\nvar ActionName;\n(function (ActionName) {\n    ActionName[\"PLAY\"] = \"PLAY\";\n    ActionName[\"PAUSE\"] = \"PAUSE\";\n    ActionName[\"STOP\"] = \"STOP\";\n    ActionName[\"GET_USER_PROFILE\"] = \"GET_USER_PROFILE\";\n    ActionName[\"GO_TO_GAME\"] = \"GO_TO_GAME\";\n    ActionName[\"GET_PLAYER_DATA\"] = \"GET_PLAYER_DATA\";\n    ActionName[\"SET_PLAYER_DATA\"] = \"SET_PLAYER_DATA\";\n    ActionName[\"GET_SERVER_TIME\"] = \"GET_SERVER_TIME\";\n})(ActionName || (ActionName = {}));\nconst AllowedActions = new Set(Object.values(ActionName));\n/**\n * Централизованный диспетчер сообщений между iframe и parent\n */\nclass MessageChannel {\n    constructor(parentOrigin) {\n        this.parentOrigin = parentOrigin;\n        this.callbacks = new Map();\n        this.handleResponse = (evt) => {\n            if (evt.origin !== this.parentOrigin || typeof evt.data !== 'string')\n                return;\n            let resp;\n            try {\n                resp = JSON.parse(evt.data);\n            }\n            catch (_a) {\n                console.warn('[SDK] Ignoring invalid JSON response');\n                return;\n            }\n            const cb = this.callbacks.get(resp.messageId);\n            if (!cb || resp.source !== 'WebsiteSDK' || resp.actionName !== cb.actionName) {\n                return;\n            }\n            clearTimeout(cb.timer);\n            this.callbacks.delete(resp.messageId);\n            if (resp.error) {\n                cb.reject(new Error(resp.error));\n            }\n            else {\n                cb.resolve(resp.payload);\n            }\n        };\n        window.addEventListener('message', this.handleResponse);\n    }\n    request(actionName, payload, timeoutMs = 5000) {\n        if (!AllowedActions.has(actionName)) {\n            return Promise.reject(new Error(`[SDK] Action \"${actionName}\" is not allowed`));\n        }\n        const messageId = crypto.randomUUID();\n        const envelope = {\n            source: 'WelwiseSDK',\n            actionName,\n            messageId,\n            payload,\n        };\n        const json = JSON.stringify(envelope);\n        return new Promise((resolve, reject) => {\n            const timer = window.setTimeout(() => {\n                this.callbacks.delete(messageId);\n                reject(new Error(`[SDK] \"${actionName}\" timed out after ${timeoutMs}ms`));\n            }, timeoutMs);\n            this.callbacks.set(messageId, { resolve, reject, actionName, timer });\n            window.parent.postMessage(json, this.parentOrigin);\n            console.log('[SDK] postMessage sent:', json, this.parentOrigin);\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./newSDK/MessageChannel.ts?");

/***/ }),

/***/ "./newSDK/PlatformNavigation.ts":
/*!**************************************!*\
  !*** ./newSDK/PlatformNavigation.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   PlatformNavigation: () => (/* binding */ PlatformNavigation)\n/* harmony export */ });\n/* harmony import */ var _MessageChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageChannel */ \"./newSDK/MessageChannel.ts\");\n\nclass PlatformNavigation {\n    constructor(channel) {\n        this.channel = channel;\n    }\n    goToGame(gameId) {\n        console.log('[SDK] PlatformNavigation.goToGame() called');\n        return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.GO_TO_GAME, { gameId });\n    }\n}\n\n\n//# sourceURL=webpack:///./newSDK/PlatformNavigation.ts?");

/***/ }),

/***/ "./newSDK/Player.ts":
/*!**************************!*\
  !*** ./newSDK/Player.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Player: () => (/* binding */ Player)\n/* harmony export */ });\n/* harmony import */ var _MessageChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageChannel */ \"./newSDK/MessageChannel.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// Player.ts\n\nclass Player {\n    constructor(channel) {\n        this.channel = channel;\n    }\n    getData() {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] player.getData() called');\n            return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.GET_PLAYER_DATA);\n        });\n    }\n    setData(data) {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] player.setData() called', data);\n            return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.SET_PLAYER_DATA, data);\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./newSDK/Player.ts?");

/***/ }),

/***/ "./newSDK/WelwiseGames.ts":
/*!********************************!*\
  !*** ./newSDK/WelwiseGames.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WelwiseGames: () => (/* binding */ WelwiseGames)\n/* harmony export */ });\n/* harmony import */ var _WelwiseGamesAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WelwiseGamesAPI */ \"./newSDK/WelwiseGamesAPI.ts\");\n/* harmony import */ var _handshake__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handshake */ \"./newSDK/handshake.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// /WelwiseGames.ts\n\n\nclass WelwiseGames {\n    constructor() {\n        throw new Error('[SDK] Use WelwiseGames.init() instead of constructor');\n    }\n    static init() {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] init() called');\n            if (WelwiseGames.instance) {\n                console.warn('[SDK] init(): SDK already was initializated');\n                return WelwiseGames.instance;\n            }\n            // Выполняем рукопожатие\n            const { hasParent, parentOrigin } = yield (0,_handshake__WEBPACK_IMPORTED_MODULE_1__.performHandshake)();\n            if (!hasParent || !parentOrigin) {\n                console.error('[SDK] Handshake failed: SDK unavailable');\n                throw new Error('[SDK] Handshake with parent frame failed. SDK unavailable.');\n            }\n            // Создаём API-обёртку\n            console.log('[SDK] Handshake successful: Creating API wrapper');\n            WelwiseGames.instance = new _WelwiseGamesAPI__WEBPACK_IMPORTED_MODULE_0__.WelwiseGamesAPI(parentOrigin);\n            console.log('[SDK] Initialization complete');\n            return WelwiseGames.instance;\n        });\n    }\n}\nWelwiseGames.instance = null;\n// Привязываем класс к глобальному объекту\n;\nwindow.WelwiseGames = WelwiseGames;\n\n\n//# sourceURL=webpack:///./newSDK/WelwiseGames.ts?");

/***/ }),

/***/ "./newSDK/WelwiseGamesAPI.ts":
/*!***********************************!*\
  !*** ./newSDK/WelwiseGamesAPI.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WelwiseGamesAPI: () => (/* binding */ WelwiseGamesAPI)\n/* harmony export */ });\n/* harmony import */ var _MessageChannel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MessageChannel */ \"./newSDK/MessageChannel.ts\");\n/* harmony import */ var _PlatformNavigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlatformNavigation */ \"./newSDK/PlatformNavigation.ts\");\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Player */ \"./newSDK/Player.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// /WelwiseGamesAPI.ts\n\n\n\nclass WelwiseGamesAPI {\n    constructor(parentOrigin) {\n        this.parentOrigin = parentOrigin;\n        // Создаём канал сообщений внутри обёртки\n        this.channel = new _MessageChannel__WEBPACK_IMPORTED_MODULE_0__.MessageChannel(this.parentOrigin);\n        this.PlatformNavigation = new _PlatformNavigation__WEBPACK_IMPORTED_MODULE_1__.PlatformNavigation(this.channel);\n        this.player = new _Player__WEBPACK_IMPORTED_MODULE_2__.Player(this.channel);\n    }\n    /** Запускает игру или действие */\n    play() {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] play() called');\n            return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.PLAY);\n        });\n    }\n    /** Приостанавливает игру */\n    pause() {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] pause() called');\n            return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.PAUSE);\n        });\n    }\n    serverTime() {\n        return __awaiter(this, void 0, void 0, function* () {\n            console.log('[SDK] pause() called');\n            return this.channel.request(_MessageChannel__WEBPACK_IMPORTED_MODULE_0__.ActionName.GET_SERVER_TIME);\n        });\n    }\n}\n\n\n//# sourceURL=webpack:///./newSDK/WelwiseGamesAPI.ts?");

/***/ }),

/***/ "./newSDK/handshake.ts":
/*!*****************************!*\
  !*** ./newSDK/handshake.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   performHandshake: () => (/* binding */ performHandshake)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// /handshake.ts\n/**\n * Выполняет рукопожатие с родительским фреймом.\n * Возвращает объект с флагом наличия родителя и origin (если получен ответ).\n */\nfunction performHandshake() {\n    return __awaiter(this, void 0, void 0, function* () {\n        console.log('[SDK] Starting handshake with parent frame');\n        if (!window.parent || window.parent === window) {\n            console.log('[SDK] No parent frame found: communication disabled');\n            return { hasParent: false, parentOrigin: null };\n        }\n        return new Promise(resolve => {\n            const startTime = Date.now();\n            let resolved = false;\n            const messageId = `${Date.now()}-${Math.random()}`;\n            console.log(`[SDK] Sending handshake request, messageId=${messageId}`);\n            const listener = (event) => {\n                var _a, _b;\n                if (typeof event.data !== 'string') {\n                    console.warn('[SDK] Ignoring message: not a string');\n                    return;\n                }\n                let data;\n                try {\n                    data = JSON.parse(event.data);\n                }\n                catch (_c) {\n                    console.warn('[SDK] Ignoring message: invalid JSON');\n                    return;\n                }\n                if (data.source !== 'WebsiteSDK' ||\n                    data.actionName !== 'GET_IFRAME_ORIGIN_SRC' ||\n                    data.messageId !== messageId) {\n                    console.warn('[SDK] Ignoring message: unexpected fields', `source=${data.source}, actionName=${data.actionName}, messageId=${data.messageId}`);\n                    return;\n                }\n                const duration = Date.now() - startTime;\n                console.log(`[SDK] ✅ Handshake response received in ${duration} ms, payload.origin=`, (_a = data.payload) === null || _a === void 0 ? void 0 : _a.origin);\n                resolved = true;\n                window.removeEventListener('message', listener);\n                clearTimeout(timeoutId);\n                const origin = typeof ((_b = data.payload) === null || _b === void 0 ? void 0 : _b.origin) === 'string'\n                    ? data.payload.origin\n                    : null;\n                resolve({ hasParent: true, parentOrigin: origin });\n            };\n            window.addEventListener('message', listener);\n            // Send handshake request\n            window.parent.postMessage(JSON.stringify({\n                source: 'WelwiseSDK',\n                actionName: 'GET_IFRAME_ORIGIN_SRC',\n                messageId,\n            }), '*');\n            const timeoutId = setTimeout(() => {\n                if (!resolved) {\n                    console.warn('[SDK] Parent frame did not respond to handshake within timeout');\n                    window.removeEventListener('message', listener);\n                    resolve({ hasParent: true, parentOrigin: null });\n                }\n            }, 500);\n        });\n    });\n}\n\n\n//# sourceURL=webpack:///./newSDK/handshake.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./newSDK/WelwiseGames.ts");
/******/ 	
/******/ })()
;