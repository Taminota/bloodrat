// ==UserScript==
// @name           Ryba_bez_parazitu
// @namespace      okoun.cz
// @description    Okoun workaround
// @version       0.0.1
// @include       *okoun.cz/*
// @include       https://*.okoun.cz/msgbox.jsp*
// @include       https://*.okoun.cz/msgbox.do*
// @include       https://*.okoun.cz/markMessages.do
// @include       https://*.okoun.cz/markArticles.do
// @include       https://*.okoun.cz/postArticle.do
// @include       https://*.okoun.cz/markFavouriteBoards.do
// @require      https://raw.githubusercontent.com/BartJolling/inject-some/master/inject-some.js
// @resource     ultradebilicss    https://nyx.cz/files/000/025/2520235_d2c63c88a2889dd51ee6/original.bin?name=filter_04.bin
// @run-at       document-idle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    //inject css
    injectsome.content.css(GM_getResourceText("ultradebilicss", "ultradebilicss"));
    // injectsome.content.html(GM_getResourceText("timesheetshtml"));
    })();
    var $debilove = "SAS1939"; // prispevky se zobrazi az po kliknuti na nick

var podbarvit = `[
    {"nick":"cestujicivnoci", "background_color":"beige"},
    {"nick":"Losssssss", "background_color":"#c3f9ff"}
]`;

if (location.protocol == 'http:') {
  window.location.assign("https://www.okoun.cz");
}

var ultradebilove_cas = localStorage.getItem("ultradebilove_cas");
var $ultradebilove = localStorage.getItem("ultradebilove");

var b_ud_stahnout = false;

if (typeof $ultradebilove === 'undefined') {
  b_ud_stahnout = true;
}

if (ultradebilove_cas) {
    var newDate = new Date();
    var difference = newDate.getTime() - ultradebilove_cas;

    if (difference > 600000) {
        b_ud_stahnout = true;
    }
} else {
    b_ud_stahnout = true;
}

if (b_ud_stahnout) {
    $ultradebilove = $(getUD()).find('div.xdata').html();
    localStorage.setItem("ultradebilove_cas", newDate.getTime());
}

var podbarvit2 = JSON.parse(podbarvit);

var $defaultFormat = "plain"; /* plain | html | radeox */


var mods = $(".yui-u").first().html();
mods = mods.split("<br><br>");
mods = mods[0];


var $el = $(".main > .yui-g > .yui-u").first();

if ($el.length === 0) {
    $el = $(".main > .yui-gc > .yui-u").first();
}

$el.html("<p title='Naposledy načteno' id='xtime'></p><p><input placeholder='Hledej' id='srchinput'></p>");
$el.append("<h3>S novými <span id='pocetsnovymi'></span></h3><div id='novydiv'></div>");

// Opravene mizeni .pager a mazaciho tlacitka pokud se jedna o vzkaznik - BR 12.9.22 - ZACATEK
$el_pager = $("div.pager").first();
var jeToMujVzkaznik = $(".expbutton").find("a.expcol").text();
	if (jeToMujVzkaznik !== 'Nový vzkaz') {
	$el_pager.detach().prependTo( ".list-and-pagers-wrapper");
	}

// $el_pager.detach().prependTo( ".list-and-pagers-wrapper");
// Opravene mizeni .pager a mazaciho tlacitka pokud se jedna o vzkaznik - BR 12.9.22 - KONEC
$( "<div id='welcome2'></div>" ).insertAfter( $(".welcome"));

$("[name='markWelcomeMsgBoardForm']").hide();

$("h2").append("<span id='rozbal2' title='Rozbal popis klubu'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
$( "#welcome2").html("<div id='rozbal3'>"+$( ".welcome" ).html()+"</div>");

$("h2").append("<span id='mods_expand' title='Moderátoři'>M</span>");
$("#welcome2").append("<div id='rozbal4'>"+mods+"</div>");


var $prispevky = $("div.item");
var $neprecteny;
var $debilove_arr = $debilove.split(",");


$ultradebilove = $ultradebilove.split(' ,').join(',');
$ultradebilove = $ultradebilove.split(', ').join(',');

localStorage.setItem("ultradebilove", $ultradebilove);

var $ultradebilove_arr = $ultradebilove.split(",");
var ultradebilove_counter = 0;

$prispevky.each(function() {

    var prispevek = $(this);

    if (jQuery.inArray(prispevek.find("span.user").html(), $debilove_arr )!== -1) {
        $(this).addClass( "hiddenart" );
    }

    var username = prispevek.find( "span.user").html();

    if (jQuery.inArray(username, $ultradebilove_arr )!== -1) {
        ultradebilove_counter++;

    // zde je začátek přidaného kódu - BR

    var titleId = prispevek.find("div.content").html();
    if (titleId.search("img") !== -1) {
        var id = $(this).attr('id');
        $(`#${id} .title`).text('měl bych se raději zabít');
        $(`#${id} .yui-base`).find("img").attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
    /*
        var pathname = window.location.pathname;
        if (pathname == 'https://www.okoun.cz/msgbox.jsp'||'http://www.okoun.cz/msgbox.jsp') {
            $(`#${id} .content`).find("img").attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
        }*/
    }

      // a zde je konec, jinak beze změn - BR
      // umlceni ultradebila - BR 12.9.22 - ZACATEK
var id = $(this).attr('id');
	    $(`#${id} .yui-base`).html("Měl bych se zabít a chcípnout v libovolném pořadí.");
	    if (jeToMujVzkaznik === 'Nový vzkaz') {
			$(`#${id} .content`).html("Měl bych se zabít a chcípnout v libovolném pořadí.");
			}
     // umlceni ultradebila - BR 12.9.22 - KONEC
        $(this).addClass( "hiddenart2" );
    }

    if (prispevek.hasClass('new')) {
        $neprecteny = prispevek;
    }

    $.each(podbarvit2, function(key,value) {
        if (username == value.nick) {
            prispevek.css("background-color", value.background_color);
        }
    });

    $(this).find("span.user").after("&nbsp;&nbsp;<a title='Filtruj' class='userfilter' href='"+window.location.pathname+"?searchedUsers="+username+"'>&bull;</a>");

    $(this).find(".actions").append( "<span class='oblibit' data-xid="+$(this).attr("id")+">Oblíbit</span>");
});


if (ultradebilove_counter> 0 ) {
    $el_pager.append ("<span class='skrytoprispevku'>Skryto příspěvků: "+ultradebilove_counter+"</span>");
}

$(document).on("click", ".skrytoprispevku", function (e) {
    $(".hiddenart2").addClass("hiddenart2_show");
    $(".hiddenart2").removeClass("hiddenart2");

    $(".skrytoprispevku").hide();
});

if ($neprecteny) {
    if (NotInViewport($neprecteny)) {
        const julie = $neprecteny[0];
        julie.scrollIntoView(false);
        window.scrollBy(0,100);
    }
}

var mesice = "ledna,února,března,dubna,května,června,července,srpna,září,října,listopadu,prosince";
var mesice_arr = mesice.split(",");
var $novy = $("#novydiv");

xload();

setInterval( function(){
    xload();
}, 60000);



function xload() {

    var $pocetsnovymi = 0;
    $novy.load( "https://www.okoun.cz/favourites.jsp?new=1&k="+Math.random()+" .item", function() {

        $novy.find(".item").each(function() {
            var str_dt = $(this).find("span.date").html();
            var arr = str_dt.split(" ");
            var arr2 = arr[0].split(".");
            var out = arr[1];

            out += twoplaces(mesice_arr.indexOf(arr2[1]));
            out += twoplaces(arr2[0]);

            if (arr[2].length<8) {out += "0";}
            out += arr[2];

            var nazev = $(this).find("a.name").html();
            var href = $(this).find("a.name").attr('href');
            var novych = $(this).find("b").html();

            novych = novych.replace('&nbsp;nových', '');
            novych = novych.replace('&nbsp;nový', '');
            novych = novych.replace('&nbsp;nové', '');

            $(this).html("<a class='klub' data-tm='" + out + "' title='"+ str_dt + "' href='" + href + "'>" +  nazev + "</a> - " + novych);

            $pocetsnovymi = $pocetsnovymi +1;
        });

        $("#novydiv .item").sort(descending_sort).appendTo('#novydiv');
        $("#pocetsnovymi").html("(" + $pocetsnovymi + ")");
    });


    var dt = new Date();

    $("#xtime").html(dt.getHours() + ":" + twoplaces(dt.getMinutes()) + ":" + twoplaces(dt.getSeconds()));
}



function descending_sort(a, b) {
    return ($(b).html()) > ($(a).html()) ? 1 : -1;
}


function twoplaces(n) {
    return (n<10) ? "0"+n: n;
}



$("[name='searchBoardsForm']").submit(function() {

  if ($("[name='searchBoardsForm'] [name='keyword']").val()=="") {
    alert ("Hledáš prázdný text");
    return false;
  }

});


$(".hiddenart .user").on( "click", function() {
    $(this).parent().parent().removeClass("hiddenart");
});

$('select[name ="bodyType"]').val($defaultFormat);

function NotInViewport(e) {

  var elementTop = e.offset().top;
  var elementBottom = elementTop + e.outerHeight();
  var viewportTop = $(window).scrollTop();
  var viewportBottom = viewportTop + $(window).height();

  return !(elementBottom > viewportTop && elementTop < viewportBottom);
}


$('div.menu').append('&nbsp;&nbsp;<span><a id="loadarchiv" href="#">Archiv</a></span>');

$(document).on("click", ".smazatzaznam", function (e) {

    if (confirm("Určitě odstranit z archivu?")) {
        var bookmarks = jQuery.parseJSON(localStorage.getItem("zalozky"));

        var idx = 0;
        var k = $(this).data("xid");

        $("#"+k).remove();

        $.each(bookmarks, function(key,value) {
            if (k == value.id) {
                bookmarks.splice(idx, 1);
            };
            idx = idx +1;
        });

        localStorage.setItem("zalozky", JSON.stringify(bookmarks));
    }
});


$(".oblibit").on( "click", function() {

    var prispevek = $(this).parent().parent();

    var user2 = prispevek.find(".ico-wrapper > a").attr('href');
    if (user2) {
        user2 = user2.replace('/msgbox.do?rcpt=', '');
    }

    var savearticle = {
        "id":  $(this).data("xid"),
        "icosrc": prispevek.find(".ico-wrapper > a > img").attr('src'),
        "user": prispevek.find("span.user").text(),
        "user2": user2,
        "descr": prispevek.find("span.user > span.descr").text(),
        "permalink": prispevek.find("div.permalink > a").attr('href'),
        "content": prispevek.find("div.content").html(),
        "replyto": prispevek.find("div.actions a.prev").html(),
        "replytolink": prispevek.find("div.actions a.prev").attr('href')
    };

    const bookmarks0 = localStorage.getItem('zalozky');

    if (bookmarks0) {
        var bookmarks = JSON.parse(bookmarks0);
        bookmarks.push (savearticle);
    } else {
        bookmarks = [];
        bookmarks.push (savearticle);
    }

    localStorage.setItem("zalozky",JSON.stringify(bookmarks));
    alert ("Přidáno.");
})


$("#loadarchiv").on( "click", function() {

    var $el2 = $(".yui-g").first();

    if ($el2.length === 0) {
        $el2 = $(".yui-u.yui-ge.first.main").first();
    }

    $el2.html(``);

    var bookmarks = jQuery.parseJSON(localStorage.getItem("zalozky"));

    $.each(bookmarks, function(key,value) {

        if (!value.deleted) {

            var xout =`

                <div id="` + value.id + `" class="item">
                <div class="ico user" style="clear:left">
                <div class="ico-wrapper">
                    <a href="/msgbox.do?rcpt=` + value.user2 + `"><img src="` + value.icosrc + ` " alt=""></a>
                </div>
                </div>
                <div class="meta">
                <span class="user">` + value.user + ` </span>
                    <span class="descr">&nbsp;</span>

                        <div class="permalink">
                        <a href="` + value.permalink + ` " class="date link">Přejít na příspěvek</a>
                    </div>
                </div>

                <div class="content yui-base">` + value.content + ` </div>

                <div class="actions">

                    <span class="smazatzaznam" data-xid="` + value.id + `">Smazat záznam</span>

                `;


                if (value.replyto) {
                    xout += ' Reakce na <a class="prev" href="' + value.replytolink + '">' + value.replyto + '</a>';
                }

                xout += "</div></div>";

            $el2.prepend (xout);

        }

    });


    $el2.prepend (`
        <div class="yui-u first">
          <h2><a href="#">Archiv</a></h2>
        </div>
    `);


    $el2.css("background-color", "#F0F8FF");
    $el2.css("border-radius", "5px");
    $el2.css("padding", "10px");

    var $yuigc = $(document).find(".yui-gc");

    if ($yuigc) {
        $yuigc.removeClass("news");
    }


});



$(document).on("click", "#rozbal2", function (e) {
    $("#rozbal3").slideToggle( "300", function() {
    });
});

$(document).on("click", "#mods_expand", function (e) {
    $("#rozbal4").slideToggle( "300", function() {
    });
});




$(document).on("keyup", "#srchinput", function (e) {
    var inputValue = $(this).val().toLowerCase();

    $("#novydiv a.klub").each(function() {

        if ($(this).text().toLowerCase().indexOf(inputValue) > -1)   {
            $(this).parent().removeClass("notfound");
        } else {
            $(this).parent().addClass("notfound");
        }

    });
});


var btn = $('button:contains("Smazat")').first();
btn.appendTo($('.pager').first());
btn.css("float", "right");
btn.html("Smazat vybrané");
btn.attr('id', "smazatvybrane");
btn.hide();

var btn = $('button.submit:contains("Hledat")').eq(1);
var frm = $('div.search form').first();
btn.appendTo(frm);

$(document).on("click", "span.delete input", function (e) {
    var nekterynahozeny = false;
    var checkboxy = $(document).find("span.delete input");

    $.each(checkboxy, function() {
        if ($(this).is(':checked')) {
            nekterynahozeny = true;
        };
    });

    if (nekterynahozeny) {
        $("#smazatvybrane").show();
    } else {
        $("#smazatvybrane").hide();
    }
});


function getUD(){

    console.log ("stahuju UD");
    return $.ajax({
        type: "GET",
        url: '/boards/ryba_bez_parazitu',
        cache: false,
        async: false
    }).responseText;
}



