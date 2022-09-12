// ==UserScript==
// @name           okoun_ultradebili_banlist
// @namespace      okoun.cz
// @description    Okoun workaround
// @version       0.0.1
// @include       https://*.okoun.cz/*
// @include       https://*.okoun.cz/msgbox.jsp*
// @include       https://*.okoun.cz/msgbox.do*
// @include       https://*.okoun.cz/markMessages.do
// @include       https://*.okoun.cz/markArticles.do
// @include       https://*.okoun.cz/postArticle.do
// @include       https://*.okoun.cz/markFavouriteBoards.do
// @require      https://raw.githubusercontent.com/BartJolling/inject-some/master/inject-some.js
// @resource     ultradebilicss    https://nyx.cz/files/000/025/2520235_d2c63c88a2889dd51ee6/original.bin?name=filter_04.bin
// @resource     ultradebilijs https://nyx.cz/files/000/025/2520236_87478d5c0ed35df1eee9/original.bin?name=Filter_04.bin
// @run-at       document-idle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    //inject css
    injectsome.content.css(GM_getResourceText("ultradebilicss", "ultradebilicss"));
    // injectsome.content.html(GM_getResourceText("timesheetshtml"));

    //inject scripts
    injectsome.content.script(GM_getResourceText("ultradebilijs"), "ultradebilijs");

})();
