// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/font-awesome/css/font-awesome.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../fonts/fontawesome-webfont.eot":[["fontawesome-webfont.80db1567.eot","../node_modules/font-awesome/fonts/fontawesome-webfont.eot"],"../node_modules/font-awesome/fonts/fontawesome-webfont.eot"],"./../fonts/fontawesome-webfont.woff2":[["fontawesome-webfont.cda54bb3.woff2","../node_modules/font-awesome/fonts/fontawesome-webfont.woff2"],"../node_modules/font-awesome/fonts/fontawesome-webfont.woff2"],"./../fonts/fontawesome-webfont.woff":[["fontawesome-webfont.c3cf7ef2.woff","../node_modules/font-awesome/fonts/fontawesome-webfont.woff"],"../node_modules/font-awesome/fonts/fontawesome-webfont.woff"],"./../fonts/fontawesome-webfont.ttf":[["fontawesome-webfont.cf80d36a.ttf","../node_modules/font-awesome/fonts/fontawesome-webfont.ttf"],"../node_modules/font-awesome/fonts/fontawesome-webfont.ttf"],"./../fonts/fontawesome-webfont.svg":[["fontawesome-webfont.9ab71dbb.svg","../node_modules/font-awesome/fonts/fontawesome-webfont.svg"],"../node_modules/font-awesome/fonts/fontawesome-webfont.svg"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/@fontsource/ubuntu/index.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./files/ubuntu-cyrillic-ext-400-normal.woff2":[["ubuntu-cyrillic-ext-400-normal.ace1438e.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-cyrillic-ext-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-cyrillic-ext-400-normal.woff2"],"./files/ubuntu-all-400-normal.woff":[["ubuntu-all-400-normal.d86fdb56.woff","../node_modules/@fontsource/ubuntu/files/ubuntu-all-400-normal.woff"],"../node_modules/@fontsource/ubuntu/files/ubuntu-all-400-normal.woff"],"./files/ubuntu-cyrillic-400-normal.woff2":[["ubuntu-cyrillic-400-normal.995d1d15.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-cyrillic-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-cyrillic-400-normal.woff2"],"./files/ubuntu-greek-ext-400-normal.woff2":[["ubuntu-greek-ext-400-normal.136d8689.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-greek-ext-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-greek-ext-400-normal.woff2"],"./files/ubuntu-greek-400-normal.woff2":[["ubuntu-greek-400-normal.0b70b53e.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-greek-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-greek-400-normal.woff2"],"./files/ubuntu-latin-ext-400-normal.woff2":[["ubuntu-latin-ext-400-normal.b01dea12.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-latin-ext-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-latin-ext-400-normal.woff2"],"./files/ubuntu-latin-400-normal.woff2":[["ubuntu-latin-400-normal.b12d7d0d.woff2","../node_modules/@fontsource/ubuntu/files/ubuntu-latin-400-normal.woff2"],"../node_modules/@fontsource/ubuntu/files/ubuntu-latin-400-normal.woff2"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/@fontsource/montserrat/index.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./files/montserrat-cyrillic-ext-400-normal.woff2":[["montserrat-cyrillic-ext-400-normal.444af8f3.woff2","../node_modules/@fontsource/montserrat/files/montserrat-cyrillic-ext-400-normal.woff2"],"../node_modules/@fontsource/montserrat/files/montserrat-cyrillic-ext-400-normal.woff2"],"./files/montserrat-all-400-normal.woff":[["montserrat-all-400-normal.4be54426.woff","../node_modules/@fontsource/montserrat/files/montserrat-all-400-normal.woff"],"../node_modules/@fontsource/montserrat/files/montserrat-all-400-normal.woff"],"./files/montserrat-cyrillic-400-normal.woff2":[["montserrat-cyrillic-400-normal.21732151.woff2","../node_modules/@fontsource/montserrat/files/montserrat-cyrillic-400-normal.woff2"],"../node_modules/@fontsource/montserrat/files/montserrat-cyrillic-400-normal.woff2"],"./files/montserrat-vietnamese-400-normal.woff2":[["montserrat-vietnamese-400-normal.766e5a4a.woff2","../node_modules/@fontsource/montserrat/files/montserrat-vietnamese-400-normal.woff2"],"../node_modules/@fontsource/montserrat/files/montserrat-vietnamese-400-normal.woff2"],"./files/montserrat-latin-ext-400-normal.woff2":[["montserrat-latin-ext-400-normal.ccf04e2e.woff2","../node_modules/@fontsource/montserrat/files/montserrat-latin-ext-400-normal.woff2"],"../node_modules/@fontsource/montserrat/files/montserrat-latin-ext-400-normal.woff2"],"./files/montserrat-latin-400-normal.woff2":[["montserrat-latin-400-normal.2caa7e62.woff2","../node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2"],"../node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"scss/index.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./../img/pawel-zentala-scaled.jpg":[["pawel-zentala-scaled.3961a4d6.jpg","img/pawel-zentala-scaled.jpg"],"img/pawel-zentala-scaled.jpg"],"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"js/index.js":[function(require,module,exports) {
/** Disable selecting text */
document.onselectstart = function () {
  return false;
};

document.onmousedown = function () {
  return false;
};
/** Show video when its load */


window.addEventListener('DOMContentLoaded', function () {
  var video = document.querySelector(".video-hero__video");
  var poster = document.querySelector(".video-hero__poster");
  var posterImage = document.querySelector(".video-hero__poster img");
  var helloWorld = document.querySelector(".hello-world"); // on posterImage loaded make cover transparent

  posterImage.onload = function () {
    return helloWorld.classList.add('hello-world--transparent');
  }; // video video on mobile


  if (window.mobilecheck()) video.classList.add('is-hidden'); // when bg video loaded...

  var videoPlayed = false;

  video.oncanplaythrough = function () {
    // check if wasn't played before and it is not a mobile device
    if (!videoPlayed && !window.mobilecheck()) {
      // show video
      video.classList.remove('is-hidden'); // delay rest of actions to avoid showing controls and blink

      setTimeout(function () {
        video.play().then(function () {
          videoPlayed = true; // hide poster

          poster.classList.add('video-hero__poster--hidden');
        }).catch(function (err) {
          return console.lo(err);
        });
      }, 2.5 * 1000);
    }
  };
});
/** Helpers */

window.mobilecheck = function () {
  var check = false;

  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};
},{}],"index.js":[function(require,module,exports) {
"use strict";

require("font-awesome/css/font-awesome.css");

require("@fontsource/ubuntu");

require("@fontsource/montserrat");

require("./scss/index.scss");

require("./js/index");
},{"font-awesome/css/font-awesome.css":"../node_modules/font-awesome/css/font-awesome.css","@fontsource/ubuntu":"../node_modules/@fontsource/ubuntu/index.css","@fontsource/montserrat":"../node_modules/@fontsource/montserrat/index.css","./scss/index.scss":"scss/index.scss","./js/index":"js/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49717" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map