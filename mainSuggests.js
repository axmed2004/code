//var homeSetsSrc = "https://viable.at.ua/cdn/homeSettings.js";
//var homeSetsSrc = "/storage/emulated/0/viajs/homeSettings.js";
var homeSetsSrc="/storage/emulated/0/.awd/cdn/homeSettings.js";
var _ = document,
    SETS,
    MAIN = {},
    ms = window.ms || function() {},
    Google = {
        url: 'https://www.google.com/complete/search?&cp=4&client=mobile-gws-wiz-hp&xssi=&hl=ru-US&authuser=0&psi=&ei=&dpr=1.5&q='
    };

//alert(keys(_.currentScript))
if (!window.via)
    window.via = {
        toast: function(a) {
            console.log(a)
        },
        searchText: function(a) {
            if (~a.indexOf("javascript:"))
                window.open(a);
            location = "https://www.google.com/search?q=" + a;
        }
    };
///////debugger
function dlog(s) {
    MAIN.debug && via.toast(s);
};
if (window.debug) {
    window.onerror = function(mes, url, line, col, e) {
        dlog(mes + "\n" + url + "\n" + line + ": " + col);
    };
    dlog("debug");
}
//////////shim
if (!HTMLElement.prototype.prepend) {
    HTMLElement.prototype.prepend = function(text) {
        this.insertAdjacentText("afterBegin", text);
    }
    HTMLElement.prototype.append = function(text) {
        this.insertAdjacentText("beforeEnd", text);
    }
    URL = function(url) {
        this.searchParams = {};
        var par = url.split("?")[1].split("&");
        for (var i = 0; i < par.length; i++)
            this.searchParams[par[i].split("=")[0]] = par[i].split("=")[1] || "";
        this.searchParams.forEach = function(fn) {
            for (var key in this)
                fn(this[key], key)
        }
    }
}
//@overrides
HTMLElement.prototype.newChild = function(tag, props, onload) {
    var el = document.createElement(tag);
    el.onload = onload;
    for (var key in props) el.setAttribute(key, props[key]);
    this.appendChild(el);
    return el;
};

///main
MAIN.main = function() {
    try {
        var batLevel = "";
        SETS = settingStore();
        //setTitle();
        SETS.title && (
            (window.requestIdleCallback &&
                requestIdleCallback(setTitle, {
                    timeout: 10000
                })
            ) || setTimeout(setTitle, 10000)
        );
        !SETS.noIcons && localStorage &&
            imgPreload();
        $(".frosted-glass") ?
            onDomReady() :
            _.addEventListener("DOMContentLoaded", onDomReady);

        function setTitle() {
            navigator.getBattery()
                .then(function(m) {
                    batLevel = m.level;
                    document.title = "рџЏ " + (new Date()).toLocaleString("ru", {
                        month: 'long',
                        day: 'numeric',
                        //  weekday: 'short',
                        hour: 'numeric',
                        minute: 'numeric',
                        //  second: 'numeric'
                    }) + "рџ”‹" + parseInt(batLevel * 100) + "%";
                })
                .catch(dlog);
        }

        function imgPreload() {
            try {
                var imgPathsStore = localStorage.getItem("imgPaths");
                if (imgPathsStore) {
                    var imgPaths = JSON.parse(imgPathsStore);
                    /*		alert((imgPaths));*/
                    for (var i = 0; i < imgPaths.length; i++) {
                        var img = document.createElement("img");
                        img.src = imgPaths[i];
                    }
                }
            } catch (e) {
                dlog("line73: " + e.message + " \n" + e.stack, '')
            };
        }

        function onDomReady() {
            SETS.debug && outLog();
            !SETS.noIcons && bmToIcons();
            //styles ????
            SETS.css && $("style").append(SETS.css);
            !SETS.noSugs && loadSugs();
            //@override
            if (SETS.saveSearches && localStorage)
                window.search = function() {
                    try {
                        var a = document.getElementById("search_input").value;
                        searchStore(a);
                        return "" != a && (window.via.searchText(a), document.getElementById("search_input").value = ""), !1
                    } catch (e) {
                        dlog(e.stack)
                    }
                }
                //////settings button
                !SETS.noSets && addButton();
        }

        function outLog() {
            var scVer = "homepage_v10 shim-es5-6_settings_fix-input";
            try {
                var output = $('.frosted-glass');
                output.style.cssText = 'font-size:10px';
                dlog = function(m) {
                    via.toast(m);
                    output.innerText += (m + '\n');
                };
            } catch (e) {
                dlog(e)
            }
            //	dlog(scVer);
            dlog(navigator.appVersion);
            dlog((navigator.onLine ? 'Online' : 'Offline') +
                " localStorage: " + !!localStorage +
                " es5=" + !![].forEach +
                " es6=" + !!Array.from, +" viaBrowser=" + !!window.via
            );
            //	dlog(keys(SETS));
            //	dlog(searchStore());

        }

        function addButton() {
            MAIN.showSettings = showSettings;
            MAIN.settingStore = settingStore;
            $("style").append("" +
                ".ad.box{float:right;transform:scale(0.7);}" +
                ".ad.box .title{" +
                "background:rgba(34,34,200,0.2);"
                //+"font-size:20px;"
                //+"line-height : 2em;"
                //+"height : 2em;"
                +
                "}"
            );
            _.body.insertAdjacentHTML("beforeEnd", "<div onclick=MAIN.showSettings() class='ad box'><p class=title >" +
                "рџ“Џ" +
                "</p></div>");
            /*_.body.insertAdjacentHTML("beforeEnd","<div class='ad box addons'><a href=https://viable.at.ua/addons_en.html></a><p class=title >"
            +"рџ”Ё"
            +"</p></div>");*/
        };
        //////


        function scriptRequest(term, onSuccess) {
            try {
                var callbackName = 'term' + String(Math.random()).slice(-6);
                var url = Google.url + term + '&callback=Google.' + callbackName;
                var sc;
                Google[callbackName] = function(data) {
                    try {
                        scriptOk = true;
                        delete Google[callbackName];
                        sc.parentNode.removeChild(sc);
                        onSuccess(data);
                    } catch (e) {
                        dlog("line66: " + e.message + " \n" + e.stack, '')
                    };
                };
                sc = _.body.newChild("script", {
                    src: url,
                    onerror: function() {
                        sc.parentNode.removeChild(sc);
                        dlog('line69:error loading:' + term);

                    }
                });
            } catch (e) {
                dlog("line73: " + e.message + " \n" + e.stack, '')
            };
        }

        function parseResponse(data) {
            try {
                var re = /<\/?(b|i)>/g;
                var arr = [];
                for (var i = 0; i < data[0].length; i++) {
                    arr.push(data[0][i][0].replace(re, ''));
                };

                return arr;
            } catch (e) {
                dlog("line84: " + e.message + " \n" + e.stack, '')
            };
        }

        function bmToIcons() {

            try {
                var width = $(".box>.title") && parseInt(getComputedStyle($(".box>.title")).width) || 66,
                    hrefs = _.querySelectorAll(".box>a"),
                    imgPaths = [];

                if (getComputedStyle(_.querySelector("#box_container")).flexWrap == "wrap-reverse")
                    for (var i = hrefs.length - 1; i > 0; i--)
                        cycle(i);
                else
                    for (var i = 0; i < hrefs.length; i++)
                        cycle(i);

                localStorage
                    &&
                    localStorage.setItem("imgPaths", JSON.stringify(imgPaths));

                $("style").prepend(
                    ".title>img{max-width:" + width +
                    "px;min-width:" + width / 2 +
                    "px;height:auto;}" +
                    ".title{display:flex;align-items:center;justify-content:center;}"
                );

                function cycle(i) {

                    var domain = hrefs[i].hostname
                        //||hrefs[i].protocol.replace(":","");
                    var path;
                    var title = hrefs[i].nextElementSibling || hrefs[i].parentElement.firstElementChild;
                    var img = document.createElement("img");
                    let errState = 0;
                    if (SETS.localPath) {
                        errState = -1;
                        path = window.localPath + domain;
                    } else if (!domain || domain == "localhost") path = "https://viable.at.ua/cdn/icons/" + (domain || hrefs[i].protocol.replace(":", "") || null) + ".png";
                    else path = getURL(hrefs[i].origin + hrefs[i].pathname);
                    //path=getURL(domain);
                    img.onerror =
                        img.onload = function() {
                            if (img.naturalWidth > 16) title.firstChild.replaceWith(img);
                            else if (!errState++) img.src = getURL(domain, 1);
                            else if (errState == 2) img.src = getURL(domain.split(".").slice(-2).join("."), 1);
                        }
                    img.src = path;
                    if (!~imgPaths.indexOf(path))
                        imgPaths.push(path);
                }

                function getURL(domain, goo) {
                    if (!goo)
                        return `http:/\/favicon.yandex.net/favicon/v2/${domain}?size=120`;
                    // 
                    //return "http://www.getfavicon.org/get.pl?url="+domain+"&submitget=get+favicon";
                    //return "https://api.faviconkit.com/"+domain+"/64";
                    return "https://www.google.com/s2/favicons?sz=64&domain=" + domain;

                    return "https://icons.foundryapp.net/icon?size=16.." + width + "..180&url=" + domain +
                        "&fallback_icon_url=https://viable.at.ua/cdn/icons/" + domain + ".png";

                    return "https://besticon-demo.herokuapp.com/icon?size=16.." + width + "..180&url=" + domain +
                        "&fallback_icon_url=https://viable.at.ua/cdn/icons/" + domain + ".png";
                }
            } catch (e) {
                dlog(e.message + " \n" + e.stack)
            }
            ms();
        }

        function searchStore(item) {
            try {
                if (!localStorage) return ["4pda via", "<Storage not supported>"];
                if (!SETS.saveSearches) return ["4pda via", "<search history not active>"];
                var ls = JSON.parse(localStorage.getItem("searchHistory"));
                ls = ls || []
                if (!item)
                    return ls;
                if (~ls.indexOf(item))
                    return;
                ls.unshift(item);
                ls.length = 12;

                localStorage.setItem("searchHistory", JSON.stringify(ls));
            } catch (e) {
                //localStorage.removeItem("searchHistory");
                dlog(e.stack);
            }
        }

        function showSettings() {
            try {
                if ($('dialog')) {
                    $('dialog').show();
                    return;
                }
                [].forEach || _.body.newChild("script", {
                    //src: "https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js",
                    src: "/storage/emulated/0/.awd/cdn/es5-shim.min.js",
                    // /storage/emulated/0/.awd/cdn/
                }, function() {
                    dlog("Es5 loaded")
                });
                Array.from || _.body.newChild("script", {
                    //src: "https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js",
                    src: "/storage/emulated/0/.awd/cdn/es6-shim.min.js",
                }, function() {
                    dlog("Es6 loaded")
                });
                _.body.newChild("script", {
                    async: true,
                    src: homeSetsSrc,
                });
                via.toast("вЊ›loading...")
            } catch (e) {
                dlog(e.stack)
            }
        }

        function loadSugs() {
            ////searchInp customize
            var searchInp = $('#search_input');
            searchInp.setAttribute('type', 'search');
            searchInp.setAttribute('autocapitalize', 'off');
            searchInp.onsearch = function() {
                searchInp.dispatchEvent(new KeyboardEvent('keyup'));
            }
            if (SETS.inputTricks) {
                searchInp.setAttribute('role', 'combobox');
                searchInp.setAttribute('spellcheck', 'true');
                //	searchInp.setAttribute('autocomplete', 'on');
                searchInp.setAttribute('autocorrect', 'on');
                //searchInp.inputmode="verbatim";
                searchInp.autosave = "unique66ll";
                //searchInp.style.whiteSpace='wrap';
                //searchInp.style.overflow='auto';
                searchInp.setAttribute = function() {};
            }
            //////onfocus
            !SETS.noUp && searchInp.addEventListener("focus", inputHandler);
            !SETS.noUp && searchInp.addEventListener("blur", inputHandler);

            //preconnect Google suggestions
            scriptRequest("preconnect", function() {});
            $("style").append(
                ".autocomplete-suggestions {text-align: left; cursor: default; border: 1px solid #ccc; border-top: 0; background: #fff; box-shadow: -1px 1px 3px rgba(0,0,0,.1);position: absolute; display: none; z-index: 500; max-height: 500px; overflow: auto; overflow-y: auto; box-sizing: border-box;}" +
                ".autocomplete-suggestion, option {border:0.5px outside rgba(50,50,50,1); position: relative; padding: 0 .6em; line-height: 1.6; white-space: nowrap; overflow:auto; text-overflow: clio; font-size: 1.02em; color: #333; }" +
                ".autocomplete-suggestion b { font-weight: normal; color: #1f8dd6; }.autocomplete-suggestion.selected { background: #f0f0f0; }"
            );
            // JavaScript autoComplete v1.0.4
            // https://github.com/Pixabay/JavaScript-autoComplete
            var autoComplete = function() {
                function e(e) {
                    function t(e, t) {
                        return e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)
                    }

                    function o(e, t, o) {
                        e.attachEvent ? e.attachEvent("on" + t, o) : e.addEventListener(t, o)
                    }

                    function s(e, t, o) {
                        e.detachEvent ? e.detachEvent("on" + t, o) : e.removeEventListener(t, o)
                    }

                    function n(e, s, n, l) {
                        o(l || document, s, function(o) {
                            for (var s, l = o.target || o.srcElement; l && !(s = t(l, e));) l = l.parentElement;
                            s && n.call(l, o)
                        })
                    }
                    if (document.querySelector) {
                        var l = {
                            selector: 0,
                            source: 0,
                            minChars: 3,
                            delay: 150,
                            offsetLeft: 0,
                            offsetTop: 1,
                            cache: 1,
                            menuClass: "",
                            renderItem: function(e, t) {
                                t = t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                                var o = new RegExp("(" + t.split(" ").join("|") + ")", "gi");
                                return '<div class="autocomplete-suggestion" data-val="' + e + '">' + e.replace(o, "<b>$1</b>") + "</div>"
                            },
                            onSelect: function() {}
                        };
                        for (var c in e) e.hasOwnProperty(c) && (l[c] = e[c]);
                        for (var a = "object" == typeof l.selector ? [l.selector] : document.querySelectorAll(l.selector), u = 0; u < a.length; u++) {
                            var i = a[u];
                            i.sc = document.createElement("div"), i.sc.className = "autocomplete-suggestions " + l.menuClass, i.autocompleteAttr = i.getAttribute("autocomplete"), i.setAttribute("autocomplete", "off"), i.cache = {}, i.last_val = "", i.updateSC = function(e, t) {
                                var o = i.getBoundingClientRect();
                                if (i.sc.style.left = Math.round(o.left + (window.pageXOffset || document.documentElement.scrollLeft) + l.offsetLeft) + "px", i.sc.style.top = Math.round(o.bottom + (window.pageYOffset || document.documentElement.scrollTop) + l.offsetTop) + "px", i.sc.style.width = Math.round(o.right - o.left) + "px", !e && (i.sc.style.display = "block", i.sc.maxHeight || (i.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(i.sc, null) : i.sc.currentStyle).maxHeight)), i.sc.suggestionHeight || (i.sc.suggestionHeight = i.sc.querySelector(".autocomplete-suggestion").offsetHeight), i.sc.suggestionHeight))
                                    if (t) {
                                        var s = i.sc.scrollTop,
                                            n = t.getBoundingClientRect().top - i.sc.getBoundingClientRect().top;
                                        n + i.sc.suggestionHeight - i.sc.maxHeight > 0 ? i.sc.scrollTop = n + i.sc.suggestionHeight + s - i.sc.maxHeight : 0 > n && (i.sc.scrollTop = n + s)
                                    } else i.sc.scrollTop = 0
                            }, o(window, "resize", i.updateSC), document.body.appendChild(i.sc), n("autocomplete-suggestion", "mouseleave", function() {
                                var e = i.sc.querySelector(".autocomplete-suggestion.selected");
                                e && setTimeout(function() {
                                    e.className = e.className.replace("selected", "")
                                }, 20)
                            }, i.sc), n("autocomplete-suggestion", "mouseover", function() {
                                var e = i.sc.querySelector(".autocomplete-suggestion.selected");
                                e && (e.className = e.className.replace("selected", "")), this.className += " selected"
                            }, i.sc), n("autocomplete-suggestion", "mousedown", function(e) {
                                if (t(this, "autocomplete-suggestion")) {
                                    var o = this.getAttribute("data-val");
                                    i.value = o, l.onSelect(e, o, this), i.sc.style.display = "none"
                                }
                            }, i.sc), i.blurHandler = function() {
                                try {
                                    var e = document.querySelector(".autocomplete-suggestions:hover")
                                } catch (t) {
                                    var e = 0
                                }
                                e ? i !== document.activeElement && setTimeout(function() {
                                    i.focus()
                                }, 20) : (i.last_val = i.value, i.sc.style.display = "none", setTimeout(function() {
                                    i.sc.style.display = "none"
                                }, 350))
                            }, o(i, "blur", i.blurHandler);
                            var r = function(e) {
                                var t = i.value;
                                if (i.cache[t] = e, e.length && t.length >= l.minChars) {
                                    for (var o = "", s = 0; s < e.length; s++) o += l.renderItem(e[s], t);
                                    i.sc.innerHTML = o, i.updateSC(0)
                                } else i.sc.style.display = "none"
                            };
                            i.keydownHandler = function(e) {
                                var t = window.event ? e.keyCode : e.which;
                                if ((40 == t || 38 == t) && i.sc.innerHTML) {
                                    var o, s = i.sc.querySelector(".autocomplete-suggestion.selected");
                                    return s ? (o = 40 == t ? s.nextSibling : s.previousSibling, o ? (s.className = s.className.replace("selected", ""), o.className += " selected", i.value = o.getAttribute("data-val")) : (s.className = s.className.replace("selected", ""), i.value = i.last_val, o = 0)) : (o = 40 == t ? i.sc.querySelector(".autocomplete-suggestion") : i.sc.childNodes[i.sc.childNodes.length - 1], o.className += " selected", i.value = o.getAttribute("data-val")), i.updateSC(0, o), !1
                                }
                                if (27 == t) i.value = i.last_val, i.sc.style.display = "none";
                                else if (13 == t || 9 == t) {
                                    var s = i.sc.querySelector(".autocomplete-suggestion.selected");
                                    s && "none" != i.sc.style.display && (l.onSelect(e, s.getAttribute("data-val"), s), setTimeout(function() {
                                        i.sc.style.display = "none"
                                    }, 20))
                                }
                            }, o(i, "keydown", i.keydownHandler), i.keyupHandler = function(e) {
                                var t = window.event ? e.keyCode : e.which;
                                if (!t || (35 > t || t > 40) && 13 != t && 27 != t) {
                                    var o = i.value;
                                    if (o.length >= l.minChars) {
                                        if (o != i.last_val) {
                                            if (i.last_val = o, clearTimeout(i.timer), l.cache) {
                                                if (o in i.cache) return void r(i.cache[o]);
                                                for (var s = 1; s < o.length - l.minChars; s++) {
                                                    var n = o.slice(0, o.length - s);
                                                    if (n in i.cache && !i.cache[n].length) return void r([])
                                                }
                                            }
                                            i.timer = setTimeout(function() {
                                                l.source(o, r)
                                            }, l.delay)
                                        }
                                    } else i.last_val = o, i.sc.style.display = "none"
                                }
                            }, o(i, "keyup", i.keyupHandler), i.focusHandler = function(e) {
                                i.last_val = "\n", i.keyupHandler(e)
                            }, l.minChars || o(i, "focus", i.focusHandler)
                        }
                        this.destroy = function() {
                            for (var e = 0; e < a.length; e++) {
                                var t = a[e];
                                s(window, "resize", t.updateSC), s(t, "blur", t.blurHandler), s(t, "focus", t.focusHandler), s(t, "keydown", t.keydownHandler), s(t, "keyup", t.keyupHandler), t.autocompleteAttr ? t.setAttribute("autocomplete", t.autocompleteAttr) : t.removeAttribute("autocomplete"), document.body.removeChild(t.sc), t = null
                            }
                        }
                    }
                }
                return e
            }();
            ! function() {
                "function" == typeof define && define.amd ? define("autoComplete", function() {
                    return autoComplete
                }) : "undefined" != typeof module && module.exports ? module.exports = autoComplete : window.autoComplete = autoComplete
            }();

            new autoComplete({
                selector: searchInp,
                minChars: SETS.saveSearches ? 0 : 1,
                delay: 0,
                cache: 1,
                offsetTop: SETS.toDown ? -310 : null,
                offsetLeft: 0,
                onSelect: function(e) {
                    e.preventDefault();
                    searchInp.dispatchEvent(new KeyboardEvent('keyup'));
                },
                source: function(term, suggest) {
                    try {
                        if (!term && SETS.saveSearches) {
                            var list = searchStore();
                            if (SETS.toDown) {
                                list = list.reverse();
                            }
                            suggest(list);
                        } else
                            scriptRequest(term, function(data) {
                                var list = parseResponse(data);
                                if (SETS.toDown) {
                                    list = list.reverse();
                                }
                                suggest(list);
                            });
                    } catch (e) {
                        dlog("line84: " + e.message + " \n" + e.stack, '')
                    };
                },
                renderItem: function(item, search) {
                    if ((search != searchInp.value) ||
                        (searchInp != document.activeElement) ||
                        !SETS.saveSearches && !search) {
                        keydown("Escape");
                        throw {
                            message: (search != searchInp.value) && "search!=searchInp.value" ||
                                (searchInp != document.activeElement) && "InputNotFocused" ||
                                !search && "empty search",
                            stack: ""
                        };
                    }
                    if (item == search || !item) {
                        //dlog("item==search=="+item);
                        return "<div hidden class='autocomplete-suggestion' data-val=></div>";
                    }
                    try {
                        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        var re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');
                        var shortedItem = (search.length > 6) ? item.replace(search, '...') : item;
                        return "<div class='autocomplete-suggestion' data-val='" + item + "'>" + shortedItem.replace(re, '<b>$1</b>') + '</div>';
                    } catch (e) {
                        dlog("line93: " + e.message + " \n" + e.stack, '')
                    };
                }
            });
            ////functions
            var toShow;

            function inputHandler(e) {
                dlog(e.target);

                try {
                    var focus = (e.type == "focus");
                    if (focus) {
                        /*		if(SETS.toDown){
                        			clearTimeout(toShow);
                        			$("#content").style.position="fixed";
                        		}*/
                        scriptRequest("", function() {});
                    } else {
                        keydown("Escape");
                        //		if(SETS.toDown) setTimeout(function(){
                        //		$("#content"). style.position="";},200)
                    }
                    //return;
                    "#bookmark_part,.ad.box,a.logo,a.logo+a,.frosted-glass,#content,.search_bar"
                    .split(",").forEach(function(str) {
                        if ($(str))
                            $(str).classList[focus ? "add" : "remove"]("focus");
                    });

                } catch (e) {
                    dlog(e.message + " \n" + e.stack)
                };
            };

            function keydown(name) {
                var e = new KeyboardEvent("keydown");
                delete e["keyCode"];
                Object.defineProperty(e, 'keyCode', {
                    value: 27,
                    writable: true
                });
                searchInp.dispatchEvent(e);
            }
        }

        function settingStore(sets, callback) {
            try {
                if (sets) {
                    if (!localStorage) via.toast("Not supported!!!");
                    else localStorage.setItem("settings", JSON.stringify(sets));
                    return;
                }
                sets = {
                    css: "",
                    noUp: window.noUpAttr || 0,
                    localPath: window.localPath || "",
                    debug: window.debug || 0,
                    noIcons: window.noIcons || 0,
                };
                try {
                    (new URL($('script[src*=ac\\.js]').src))
                    .searchParams.forEach(function(value, key) {
                        sets[key] = value || 1;
                    });
                } catch (e) {
                    dlog(e.stack)
                }

                //	setTimeout(function(){
                try {
                    if (localStorage && localStorage.getItem("settings"))
                        sets = JSON.parse(localStorage.getItem("settings")) || sets;
                    callback && callback(sets);
                } catch (e) {
                    alert("localStorage" + e.stack)
                }
                //	}, 0);

                return sets;
            } catch (e) {
                dlog("localStorage" + e.stack)
            }
        }

    } catch (e) {
        dlog("line159: " + e.message + " \n" + e.stack, '')
    };
}

MAIN.reverse_children = function(element) {
        for (var i = 1; i < element.childNodes.length; i++) {
            element.insertBefore(element.childNodes[i], element.firstChild);
        }
    }
    /////
function $(str) {
    return _.querySelector(str)
};

function keys(o, sep) {
    var list = '';
    for (var key in o) list += key + ': ' + o[key] + (sep || "; ") //'\n';
    return (list || (o && o.name) || o);
};
ms("before main")
MAIN.main();
ms("end");