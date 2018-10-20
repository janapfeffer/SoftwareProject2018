/**
 * Map initialization
 */
//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    app_id: 'TERY6ac06hlozadvCdyy',
    app_code: '1mqHefqb9ZMTdauG1qNNIQ',
    useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
});
//Step 2: initialize a map
var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {
        center: { lat: 49.48651, lng: 8.46679 },
        zoom: 14.5,
        pixelRatio: pixelRatio
    });
map.setCenter({ lat: 49.48651, lng: 8.46679 }, true)


//Step 3: make the map interactive
// MapEvents enables the event system - behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


function suggestPlace(responseBody){
    


}

/**
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function getAutocompletion(sQuery) {
    var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json';
    var ajaxRequest = new XMLHttpRequest();

    function getResponseBody(response){
        var responseBody = JSON.stringify(response, null, ' ');
        function suggestPlace(responseBody)
    };
    var onAutoCompleteSuccess = function onAutoCompleteSuccess() {
    
        getResponseBody(this.response);  // In this context, 'this' means the XMLHttpRequest itself.
        //  addSuggestionsToMap(this.response);
    };
       
    /**
    * This function will be called if a communication error occurs during the XMLHttpRequest
    */
    var onAutoCompleteFailed=    function onAutoCompleteFailed() {
         alert('Ooops!');
    };
    // Attach the event listeners to the XMLHttpRequest object
    ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
    ajaxRequest.addEventListener("error", onAutoCompleteFailed);
    ajaxRequest.responseType = "json";

    var params = '?' +
    'query=' +  encodeURIComponent(sQuery) +   // The search text which is the basis of the query
    '&beginHighlight=' + encodeURIComponent("") + //  Mark the beginning of the match in a token. 
    '&endHighlight=' + encodeURIComponent("") + //  Mark the end of the match in a token. 
    '&maxresults=5' +  // The upper limit the for number of suggestions to be included 
                      // in the response.  Default is set to 5.
    '&app_id=' + "TERY6ac06hlozadvCdyy" +
    '&app_code=' + "1mqHefqb9ZMTdauG1qNNIQ";
    ajaxRequest.open('GET', AUTOCOMPLETION_URL + params );
    ajaxRequest.send();

}


/**
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function setCenter(sQuery) {
    //HANSCH always contains the last search request
    var sPlace = (sQuery === "" || sQuery === undefined) ? localStorage.getItem("HANSCH") : sQuery;
    localStorage.setItem("HANSCH", sPlace);
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: sPlace,
            jsonattributes: 1
        };
    geocoder.geocode(
        geocodingParameters,
        /**
        * This function will be called once the Geocoder REST API provides a response
        * @param  {Object} result A JSON object representing the  location(s) found.
        *
        * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
        */
        onSuccess = function onSuccess(result) {
            var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
            var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
            var oLatLgn = {lat: dLat, lng: dLng}
             
            map.setCenter(oLatLgn, true);
            if(map.getZoom() < 14.5){
                map.setZoom(14.5, true);
            }
            if(map.getZoom() > 17){
                map.setZoom(16, true);
            }
        },
        /**
         * This function will be called if a communication error occurs during the JSON-P request
        * @param  {Object} error  The error message received.
        */
        onError = function(error) {
            alert('Ooops!');
        }
    );
}

//TODO - take care and fix the global variable + callback check
var oCoords = undefined;
function getCoordsByAddress(sAddress){
    var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
        searchText: sAddress,
        jsonattributes: 1
    };
    geocoder.geocode(
    geocodingParameters,
    onSuccess = function onSuccess(result) {
        var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
        var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
        var oLatLgn = {lat: dLat, lng: dLng}
        oCoords = oLatLgn;
    },
    onError = function(error) {
        alert('Ooops!');
    }
    )
    return oCoords;
}

function setMarker(sAddress, sName){
    var geocoder = platform.getGeocodingService(),
    geocodingParameters = {
        searchText: sAddress,
        jsonattributes: 1
    };
    geocoder.geocode(
    geocodingParameters,
    onSuccess = function onSuccess(result) {
        var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
        var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
        var oLatLgn = {lat: dLat, lng: dLng}

        var marker = new H.map.Marker(oLatLgn);
        marker.label = sName;

        map.addObject(marker);

        marker.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.label);
    }, false);
    },
    onError = function(error) {
        alert('Ooops!');
    }
    )
}

var bubble; // Hold a reference to any infobubble opened
/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
    if (!bubble) {
        bubble = new H.ui.InfoBubble(
            position,
            { content: text });
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
    }
}

// update map size at window size
window.addEventListener('resize', function () {
    map.getViewPort().resize();
});
