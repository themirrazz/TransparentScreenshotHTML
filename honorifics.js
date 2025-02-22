// LICENSE https://github.com/kyosukeweb/honorifics.js/blob/main/LICENSE.md
// QuickAndDirty
// Easily update any text
setInterval(function () {
    var query = window.__HonorificsElementContainers__ || '[data-honorific]';
    var all = Array.from(document.querySelectorAll(query));
    for(var i = 0; i < all.length; i++) {
        all[i].hidden = navigator.honorifics ? false : true;
    }
}, window.__HonorificsRefreshTime__ || 100);
