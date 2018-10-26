var express = require('express');
var fs = require('fs'); // read and write files
var request = require('request');
var cheerio = require('cheerio');
// cheerio is jquery for node
// is use it to navigate the Dom and pick elements
var app     = express();
var iconv = require('iconv-lite');
// iconv takes care UTF encoding and special characters
var cachedRequest = require('cached-request')(request);
// cachedRequest Wraps request, makes sure we don't request the same over and over again.
var cacheDirectory = "tmp/cache";
var mkdirp = require('mkdirp');
cachedRequest.setCacheDirectory(cacheDirectory);
cachedRequest.setValue('ttl', 100000);

var getday = function(date){
  cachedRequest({
     url:'http://veranstaltungen-mannheimer-morgen.morgenweb.de',
     method: "POST",
     encoding: null,
     ttl: 100000,
     form: {
      "em_suche[datum]": date,
      "em_suche[datum2]": date,
      "em_suche[stichwort]": null,
      "em_suche[stichwort_select]": [
        "334",
        null
      ],
      "fake_input": null,
      "em_suche[suche_direkt]": [
        "3",
        "1"
      ],
      "em_suche[vrubrik_id]": [
        "76",
        "92",
        "91",
        "72",
        "81",
        "45",
        "24",
        "33",
        "48",
        "82",
        "12",
        "39",
        "15",
        "13",
        "62",
        "61",
        "63",
        "21",
        "44",
        "9",
        "73",
        "59",
        "17",
        "22",
        "34",
        "74",
        "18",
        "23",
        "2",
        "28",
        "31",
        "35",
        "42",
        "40",
        "75",
        "4",
        "19",
        "8",
        "10",
        "58",
        "70",
        "38",
        "78",
        "79",
        "80"
      ],
      "em_suche[ort_id2]": "Anderer Ort",
      "em_suche[radius]": "999",
      "em_suche[vorschau]": "500",
      "em_suche[sort]": "date",
      "em_suche[act_reiter]": "0",
      "em_suche[neue_suche]": "0",
      "em_caching": "0",
      "em_suche[save_old_level]": "0",
      "em_suche[datum_save]": "20.10.2018",
      "em_suche[datum2_save]": "20.10.2018",
      "em_suche[sort_save]": null,
      "em_suche[ort_id_save]": null,
      "em_suche[ort_id2_save]": null,
      "em_suche[media_save]": null,
      "em_suche[gewinnspiel_save]": null,
      "em_suche[morgencard_save]": null,
      "em_suche[vrubrik_id_save]": null,
      "em_suche[stichwort_save]": null,
      "em_suche[radius_save]": "999",
      "em_suche[plz_save]": null,
      "em_suche[vorschau_save]": "25",
      "em_suche[force_vrubrik_id]": null,
      "em_suche[force_vrubrik_id2]": null,
      "em_merkbox": "0",
      "em_merkbox_name": null,
      "em_suche[stichwort_select_save]": null,
      "em_suche[zeitraum]": null,
      "em_do": "suche",
      "em_client": "babe",
      "em_id": "0",
      "em_month": "0",
      "em_year": "0",
      "em_do_extra": null,
      "em_man_submit": "1",
      "em_sb_datum": null,
      "em_release_lock": "0",
      "dl": null,
      "em_save_id": null
    }},
    function(err,httpResponse,body){
          if(err){
            console.log(err);
            return;
          }
          var $ = cheerio.load(iconv.decode(body, "ISO-8859-1"));
          //console.log($.html());
          //console.log($);
          var eventArray = [];
          $('.vk_ergebnisse').each(function (i, elem){

            var craw_ev = {
              iEventId: $(elem).children("a").first().attr("name"),
              sName: $(elem).find("a.vk_erg_title").text(),
              sDate: $(elem).find("div.vk_erg_times").text(),
              sAdress: $(elem).find("div.vk_erg_loc").text()
            }
            eventArray.push(craw_ev);

          });
          //console.log(eventArray)

          json = JSON.stringify({array:eventArray})
          fs.writeFile('data/days/'+date+'.json', json, 'utf8', function(err){});

    }
  )
}

getday("20.10.2018")
