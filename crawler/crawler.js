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
var db = require('diskdb'); // database to track which event is saved how
db = db.connect('data');
wochentag = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];


var getday = function(date, thenCallback=function(){}){
  db.loadCollections([date]);
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
      "em_suche[vorschau]": "800",
      "em_suche[sort]": "date",
      "em_suche[act_reiter]": "0",
      "em_suche[neue_suche]": "0",
      "em_caching": "0",
      "em_suche[save_old_level]": "0",
      "em_suche[datum_save]": "20.10.2017",
      "em_suche[datum2_save]": "20.10.2017",
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

          var updates = 0;
          var inserts = 0;

          $('.vk_ergebnisse').each(function (i, elem){

            var oEvent = {
              iEventId: $(elem).children("a").first().attr("name").replace(/[^0-9\.]/g, ''),
              sName: $(elem).find("a.vk_erg_title").text(),
              sDate: $(elem).find("div.vk_erg_times").text()
                  .replace(/(Heute)|(Morgen)/ig,wochentag[oDate.getDay()]+', '+date),
              //sAdress: $(elem).find("div.vk_erg_loc").text()
            }
            // update or insert events one by one in database
            var req = db[date].update({iEventId:oEvent.iEventId}, oEvent, {upsert:true});
            if (req.inserted){
              inserts++;
              //give newly inserted events status 1
              db[date].update({iEventId:oEvent.iEventId}, {status:1});
            }
            if(req.updated) updates++;

          });
          console.log(" [updates:"+updates +" inserts:"+inserts+" in "+date+".json]")

          //run function given as parameter of getDay /// PARAMETER is hardcoded :/
          // thenCallback(date);
          fetchOneMoreEventdetail()


          //console.log(eventArray)

          //json = JSON.stringify({array:eventArray}, null, 2);
          //fs.writeFile('data/days/'+date+'.json', json, 'utf8', function(err){});

          //db[date].save(eventArray) // save all to collection date
          // console.log(db[date].find());
    }
  )
}

getEvent = function(id, date){
  id = String(id).replace(/[^0-9\.]/g, '');
  cachedRequest({
     url:'http://veranstaltungen-mannheimer-morgen.morgenweb.de',
     method: "POST",
     encoding: null,
     ttl: 100000,
     form: {
       'em_suche[sort]': 'date',
       'em_suche[act_reiter]': 1,
       'em_suche[neue_suche]': 0,
       'em_caching': 1,
       'em_suche[save_old_level]': 1,
       'em_suche[datum_save]': date,
       'em_suche[datum2_save]': date,
       'em_suche[sort_save]': "date",
       'em_suche[ort_id_save]': null,
       'em_suche[ort_id2_save]': null,
       'em_suche[media_save]': null,
       'em_suche[gewinnspiel_save]': null,
       'em_suche[morgencard_save]': null,
       'em_suche[vrubrik_id_save]': null,
       'em_suche[stichwort_save]': null,
       'em_suche[radius_save]': 999,
       'em_suche[plz_save]': 0,
       'em_suche[vorschau_save]': 25,
       'em_suche[suche_direkt]': 1,
       'em_suche[force_vrubrik_id]': null,
       'em_suche[force_vrubrik_id2]':  null,
       'em_merkbox': 0,
       'em_merkbox_name':  null,
       'em_suche[stichwort_select]':  null,
       'em_suche[stichwort_select_save]':  null,
       'em_suche[zeitraum]':  null,
       'em_do': "ergebnis",
       'em_client': "babe",
       'em_id': id,
       'em_month': 0,
       'em_year': 0,
       'em_do_extra':  null,
       'em_man_submit': 1,
       'em_sb_datum':  null,
       'em_release_lock': 0,
       'dl':  null,
       'em_save_id': null
     }
   },
    function(err,httpResponse,body){
          if(err){
            console.log(err);
            return;
          }
          var $ = cheerio.load(iconv.decode(body, "ISO-8859-1"));
          //console.log($.html());

          var h1 = $('h1');
          var oEventUpdate = {
            sName: h1.text(),
            sCategory: h1.prev("p").text(),
            sDate: h1.next(".vk_detail_times").text()
              .replace(/(Heute)|(Morgen)/ig,wochentag[oDate.getDay()]+', '+date),
            sAdress: $(h1.nextAll(".vk_detail_text")[0]).text(),
            sDescription: $(h1.nextAll(".vk_detail_text")[1]).text(),
            status: 2
          }

          if(oEventUpdate.sName != ''){
            var req = db[date].update({iEventId:id}, oEventUpdate);
            console.log(req);
          }
          console.log(oEventUpdate)

          ////// ENDLESS LOOOP !!!!!!!!!!
          fetchOneMoreEventdetail();
    }
  )
}

var fetchOneMoreEventdetail = function(delayBetweenRequests=0){
  var next = db[date].findOne({status:1});
  console.log(next);
  if (next) getEvent(next.iEventId, date);
  else {
    console.log("All Eventdetails fetched of " + date);
    fetchOneMoreLocation();
  }

}

var fetchOneMoreLocation = function(delayBetweenRequests=0){
  var next = db[date].findOne({status:2});
  if (next){
    console.log(next.sName);
    console.log(
      next.alternativeAdress?
      "Try to cut location ---- " + next.alternativeAdress
      : next.sAdress
    );
    //https://developer.here.com/documentation/geocoder/topics/quick-start-geocode.html
    request({
      url:'https://geocoder.api.here.com/6.2/geocode.json',
      method: "GET",
      qs: {
        app_id: 'TERY6ac06hlozadvCdyy',
        app_code: '1mqHefqb9ZMTdauG1qNNIQ',
        searchtext: next.alternativeAdress? next.alternativeAdress : next.sAdress
        },
      json:true
      },
      function(err,httpResponse,body){
         if(err){ console.log(err); return; }

         try{
            oPos = body.Response.View[0].Result[0].Location.DisplayPosition;
         }
         catch (e) {
           // wenn kein ergebnis gefunden werden konnte
           if(body.Response.View.length == 0){
             console.log('........ rewrite Adress');
             // cut after first comma,
             // before the first comma is propably an institutionname which can be confusing
             db[date].update(
               { iEventId:next.iEventId },
               { alternativeAdress: next.sAdress.substring(next.sAdress.indexOf(', ') + 2)}
             );
             fetchOneMoreLocation();
             return;
           }
           console.log(e)
         }

         var oEventUpdate = {
           oLatLgn:{
             "lat": oPos.Latitude,
             "lng": oPos.Longitude
           },
           status:3
         }
         db[date].update({iEventId:next.iEventId}, oEventUpdate);
         console.log(oEventUpdate.oLatLgn);
         //ENDLESS LOOP
         fetchOneMoreLocation();
      }
    )


  }
  else console.log("All Locations fetched of " + date)
}

// STEP1 always set Day, its necesseary for database and more
date = "27.10.2018";

    // lame weekday code
    var dmy = date.split(".");
    oDate = new Date(dmy[2], dmy[1] - 1, dmy[0]);
    //console.log(wochentag[oDate.getDay()]);

//load database
db.loadCollections([date]);
// get every event of one day. status 1 (updates existing data)
getday(date);
// get all the Details of every event. status 2
// fetchOneMoreEventdetail(date) // loops infinitely
// get the exakt Locations status 3
// fetchOneMoreLocation(date); // loops infinitely
