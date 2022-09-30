// ==UserScript==
// @name          Okoun: zobraz predchozi 2.0
// @namespace     http://molhanec.net/lopuch/?n=Main.Okoun
// @description   Zobrazi na co je reagovano
// @include *okoun.cz/*
// @exclude *billboard*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant none
// ==/UserScript==

// Author huh based on Johny_G code, jquery fix by Bloodrat

// v 1.1 - cachovani
// v 1.2 - lepsi podpora smazanych prispevku

// JHG - konstanty urcujici odstup citace od odkazu
var offX = 20;
var offY = 20;

// sirka scrollbaru
var scrBarWidth = 17;

// huh -- cache pro prispevky z predchozich stranek
var cache = {};

try {
    // JHG - vytvori okno pro citaci
    var floatTip;
    floatTip = document.createElement("div");
    floatTip.style.position="fixed";
    floatTip.style.width="640px";
    floatTip.style.textAlign="left";
    floatTip.style.backgroundColor="white";
    floatTip.style.border="2px solid black";
    floatTip.style.overflow="hidden";

    // JHG - metoda na nalezeni elementu danych trid (autorem je Jonathan Snook)
    function getElementsByClassName(node, classname) {
        var a = [];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName("*");
        for (var i=0,j=els.length; i<j; i++)
            if(re.test(els[i].className))a.push(els[i]);
        return a;
    }

    // JHG - metoda pro vlastni nastaveni pozice citace
    function moveReplied(target){
        try {
            var offset = target.getBoundingClientRect();

            var moveLeft = offset.left + offX;
            var moveTop = offset.top + offY;

            // JHG - kdyby prispevek presahoval dolu, posunu ho vys; nikdy ho vsak nenecham pretect nahoru
            if ((moveTop + floatTip.offsetHeight) > window.innerHeight) moveTop = window.innerHeight - floatTip.offsetHeight;
            if (moveTop<0) moveTop = 0;

            // JHG - ekvivalent pro preteceni vpravo
            if ((moveLeft + floatTip.offsetWidth + scrBarWidth) > window.innerWidth) moveLeft = window.innerWidth - floatTip.offsetWidth - scrBarWidth;
            if (moveLeft<0) moveLeft = 0;

            // JHG - presunuti citace
            floatTip.style.left = moveLeft + "px";
            floatTip.style.top = moveTop + "px";
        }

        // JHG - oznameni pri chybe
        catch(exception) {
            alert(exception.message);
        }
    }

    // JHG - metoda, ktera po odjeti mysi skryje citaci a vymaze obsah Xml requestu
    function hideReplied(event) {
        try {
            var offset = floatTip.getBoundingClientRect();
            if (event.clientX < offset.left || event.clientX > offset.right || event.clientY < offset.top || event.clientY > offset.bottom) {
                floatTip.removeEventListener("mouseout", hideReplied, false);
                try {
                    document.body.removeChild(floatTip);
                }
                catch(exception) {
                    // pass
                }
                // JHG - tady je treba prerusit stahovani prispevku, pokud uzivatel z odkazu odjel
                xmlhttp.abort();
            }
        }
        catch(exception) {
            alert(exception.message);
        }
    }

    function findPostInPage(url) {
        var links = document.getElementsByTagName('a');
        var s = '';
        for (var i = 0, l = links.length; i < l; ++i) {
            var link = links[i];
            if (link.href == url && link.className == 'date') {
                var parent = link.parentNode.parentNode;
                var content = getElementsByClassName(parent, 'content')[0];
                return content;
            }
        }
        return null;
    }

    function parsePost(text, url) {

        var id = url.split('#')[1];
        var vratText = $(`#${id} .content`).html();
        /*
        var lookfor = '<div id="' + id + '"';
        var start = text.indexOf(lookfor);
        if (start == -1) {
            return null;
        }
        var contentStart = '<div class="content yui-base">';
        console.log(contentStart);
        start = text.indexOf(contentStart, start + lookfor.length);
        console.log(text);
        console.log(start);
        start += contentStart.length;
        var end = text.indexOf('</div>\r\n\t\r\n\t<div class="actions">', start);
        if (end <= start) {
            //console.log("text substring start & end = " + text.substring(start, end));
            //return text.substring(start, end);
            return vratText;
        } else {
            return null;
        }
        */
        // vyhozena celá parsovací logika - vracím jen string vytažený jquery. Nevím co Koles tentokrát rozbil, ale takhle to funguje - Bloodrat
        return vratText;
    }

    var xmlhttp = new XMLHttpRequest();

    // JHG - metoda pro stazeni stranky s prispevkem (upravena z jibbering.com)
    function getPost(target) {
        // JHG - stahneme stranku s co nejmensim poctem prispevku
        xmlhttp.open("GET", target.href, true);

        // JHG - tady osetrime kodovani vysledku (jen to z nejakeho duvodu nepomaha Opere)
        //xmlhttp.overrideMimeType('text/html; charset=windows-1250');

        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4) {
                // JHG - stranka je nactena, zahajime dolovani obsahu prispevku
                var content = parsePost(xmlhttp.responseText, target.href);
               // console.log(content);
                if (content) {
                    floatTip.innerHTML = content;
                    // huh - add to cache
                    cache[target.href] = floatTip.innerHTML;
                } else {
                    floatTip.innerHTML = "Příspěvek nebyl nalezen. Buď byl smazán nebo stávkuje Okoun, zkuste najet na odkaz znovu.";
                }
                // JHG - a posuneme okenko na pozici
                moveReplied(target);
            }
        }
        xmlhttp.send(null);
    }

    //JHG - metoda pro vyplneni a zobrazeni divu s citaci
    function showReplied(event) {
        try {
            var target = event.target;
            // najdeme spolecneho predka vuci kteremu se chceme pozicovat
            while (target && target.nodeName != 'A') {
                target = target.parentNode;
            }
            if (!target) return;
            var content = findPostInPage(target.href);
            if (content) {
                floatTip.innerHTML = content.innerHTML;
            } else {
                if (cache[target.href]) {
                    floatTip.innerHTML = cache[target.href];
                } else {
                    floatTip.innerHTML = "Stahuji post...";
                    getPost(target);
                }
            }
            floatTip.addEventListener("mouseout", hideReplied, false);
            document.body.appendChild(floatTip);
            moveReplied(target);
        }
        catch(exception) {
            alert(exception.message);
        }
    }


    // JHG - nastavi mouseover a mouseout jednotlivym reakcim
    var replies = getElementsByClassName(document, 'prev');
    for (var i = 0; i < replies.length; i++) {
        var reply = replies[i];
        if (reply.nodeName == 'A') {
            reply.addEventListener("mouseover", showReplied, false);
            reply.addEventListener("mouseout", hideReplied, false);
        }
    }

}
catch(exception) {
    alert(exception.message);
}
