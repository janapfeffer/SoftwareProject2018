// API reference: https://developer.here.com/api-explorer/rest/batch_geocoding/batch-geocode-addresses 
var request = require('request');



function postBatchGeocoderRequest() {
    var BATCH_GEOCODER_URL = 'https://batch.geocoder.api.here.com/6.2/jobs';

    request({
        url: BATCH_GEOCODER_URL,
        method: "POST",
        form: {
            app_id: "TERY6ac06hlozadvCdyy",
            app_code: "1mqHefqb9ZMTdauG1qNNIQ",
            mailto: "<cornelius.schaefer1@gmail.com>",
            outdelim: "|",
            outcols: "displayLatitude,displayLongitude,locationLabel,houseNumber,street,district,city,postalCode,county,state,country",
            outputcombined: "false",
            action: "run"
        },
        body: 
            "recId|searchText|country" 
    + "|0001|Invalidenstraße 116 10115 Berlin|DEU"
    +" |0002|Am Kronberger Hang 8 65824 Schwalbach|DEU"
    + "|0003|425 W Randolph St Chicago IL 60606|USA"
    + "|0004|One Main Street Cambridge MA 02142|USA"
    + "|0005|200 S Mathilda Ave Sunnyvale CA 94086|USA",
    },
    function(err, httpResponse, body){
        console.log(err, body);
    });
    
    console.log("log");

};

postBatchGeocoderRequest();
