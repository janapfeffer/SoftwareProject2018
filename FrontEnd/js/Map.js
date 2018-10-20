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


function suggestPlaces(inp, arr){
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {
            var a, b, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false;}
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
              /*check if the item starts with the same letters as the text field value:*/
            //   if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            //   }
            }
        });
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
              /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
              currentFocus++;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 38) { //up
              /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
              currentFocus--;
              /*and and make the current item more visible:*/
              addActive(x);
            } else if (e.keyCode == 13) {
              /*If the ENTER key is pressed, prevent the form from being submitted,*/
              e.preventDefault();
              if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
              }
            }
        });
        function addActive(x) {
          /*a function to classify an item as "active":*/
          if (!x) return false;
          /*start by removing the "active" class on all items:*/
          removeActive(x);
          if (currentFocus >= x.length) currentFocus = 0;
          if (currentFocus < 0) currentFocus = (x.length - 1);
          /*add class "autocomplete-active":*/
          x[currentFocus].classList.add("autocomplete-active");
        }
        function removeActive(x) {
          /*a function to remove the "active" class from all autocomplete items:*/
          for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
          }
        }
        function closeAllLists(elmnt) {
          /*close all autocomplete lists in the document,
          except the one passed as an argument:*/
          var x = document.getElementsByClassName("autocomplete-items");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }
      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });
}

function getAutocompletion(sQuery) {
    var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json';
    var ajaxRequest = new XMLHttpRequest();

    function getResponseBody(response){
        var aSuggestions = [];
        response.suggestions.forEach(function(suggestion){
            aSuggestions.push(suggestion.label.replace(/,/g,""))
        });
        // console.log(aSuggestions);
        suggestPlaces(document.getElementById("searchInput"), aSuggestions)
        
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
