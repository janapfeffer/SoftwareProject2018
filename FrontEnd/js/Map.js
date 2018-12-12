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
    center: {
      lat: 49.48651,
      lng: 8.46679
    },
    zoom: 14.5,
    pixelRatio: pixelRatio
  });
map.setCenter({
  lat: 49.48651,
  lng: 8.46679
}, true);

//Step 3: make the map interactive
// MapEvents enables the event system - behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
behavior.disable(H.mapevents.Behavior.DBLTAPZOOM);

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

ui.getControl('scalebar').setAlignment('left-bottom');
ui.getControl('mapsettings').setAlignment('left-bottom');
ui.getControl('zoom').setAlignment('left-bottom');

function suggestPlaces(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  var a, b, i, val = inp.value;
  /*close any already open lists of autocompleted values*/
  closeAllLists();
  if (!val) {
    return false;
  }
  currentFocus = -1;
  /*create a DIV element that will contain the items (values):*/
  a = document.createElement("DIV");
  a.setAttribute("id", inp.id + "autocomplete-list");
  a.setAttribute("class", "autocomplete-items");
  /*append the DIV element as a child of the autocomplete container:*/
  inp.parentNode.appendChild(a);
  /*for each item in the array...*/
  for (i = 0; i < arr.length; i++) {
    /*create a DIV element for each matching element:*/
    b = document.createElement("DIV");
    /*make the matching letters bold:*/
    b.innerHTML = arr[i].substr(0, val.length);
    b.innerHTML += arr[i].substr(val.length);
    /*insert an input field that will hold the current array item's value:*/
    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
    /*execute a function when someone clicks on the item value (DIV element):*/
    b.addEventListener("click", function(e) {
      /*insert the value for the autocomplete text field:*/
      if (inp === document.getElementById("newEventAddress")) {
        oNewEventVue.draft.sAdress = this.getElementsByTagName("input")[0].value;
      }
      if (inp === document.getElementById("searchInput")) {
        oSearchPlaceVue.sQuery = this.getElementsByTagName("input")[0].value;
      }
      /*close the list of autocompleted values,
      (or any other open lists of autocompleted values:*/
      closeAllLists();
    });
    a.appendChild(b);
  }
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
      e.stopPropagation();
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
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}

function getAutocompletion(sQuery, oInputField) {
  var AUTOCOMPLETION_URL = 'https://autocomplete.geocoder.api.here.com/6.2/suggest.json';
  var ajaxRequest = new XMLHttpRequest();

  function getResponseBody(response) {
    var aSuggestions = [];
    response.suggestions.forEach(function(suggestion) {
      var sMatchLevel = suggestion.matchLevel;
      var oSugAdr = suggestion.address;
      var suggestionToDisplay;

      if (sMatchLevel === "houseNumber") {
        suggestionToDisplay = oSugAdr.street + " " + oSugAdr.houseNumber + " " + oSugAdr.postalCode + " " + oSugAdr.city;
      } else if (sMatchLevel === "street") {
        suggestionToDisplay = oSugAdr.street + " " + oSugAdr.postalCode + " " + oSugAdr.city;
      } else if (sMatchLevel === "postalCode") {
        suggestionToDisplay = oSugAdr.postalCode + " " + oSugAdr.city + " " + oSugAdr.state;
      } else if (sMatchLevel === "city") {
        suggestionToDisplay = oSugAdr.city + " " + oSugAdr.state + " " + oSugAdr.country;
      } else if (sMatchLevel === "state") {
        suggestionToDisplay = oSugAdr.state + " " + oSugAdr.country;
      } else if (sMatchLevel === "country") {
        suggestionToDisplay = oSugAdr.country;
      } else if (sMatchLevel === "county") {
        suggestionToDisplay = oSugAdr.county + " " + oSugAdr.state + " " + oSugAdr.country;
      } else if (sMatchLevel === "district") {
        suggestionToDisplay = oSugAdr.postalCode + " " + oSugAdr.city + " " + oSugAdr.state;
      } else {
        suggestionToDisplay = suggestion.label.replace(/,/g, "")
      }
      aSuggestions.push(suggestionToDisplay)
    });
    suggestPlaces(oInputField, aSuggestions)
  };
  var onAutoCompleteSuccess = function onAutoCompleteSuccess() {

    getResponseBody(this.response); // In this context, 'this' means the XMLHttpRequest itself.
  };

  /**
   * This function will be called if a communication error occurs during the XMLHttpRequest
   */
  var onAutoCompleteFailed = function onAutoCompleteFailed() {
    alert('Fehler beim erreichen von HERE Maps. Überprüfe deine Internetverbindung.');
  };
  // Attach the event listeners to the XMLHttpRequest object
  ajaxRequest.addEventListener("load", onAutoCompleteSuccess);
  ajaxRequest.addEventListener("error", onAutoCompleteFailed);
  ajaxRequest.responseType = "json";

  var params = '?' +
    'query=' + encodeURIComponent(sQuery) + // The search text which is the basis of the query
    '&beginHighlight=' + encodeURIComponent("") + //  Mark the beginning of the match in a token.
    '&endHighlight=' + encodeURIComponent("") + //  Mark the end of the match in a token.
    '&maxresults=5' + // The upper limit the for number of suggestions to be included
    // in the response.  Default is set to 5.
    '&app_id=' + "TERY6ac06hlozadvCdyy" +
    '&app_code=' + "1mqHefqb9ZMTdauG1qNNIQ";
  ajaxRequest.open('GET', AUTOCOMPLETION_URL + params);
  ajaxRequest.send();
}

function zoomMap(posi) {

  if (map.getZoom() < 14.5) {
    map.setZoom(14.5, true);
  }
  if (map.getZoom() > 17) {
    map.setZoom(16, true);
  }
  if (posi) {
    map.setCenter(posi, true);
  }

}

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
     */
    onSuccess = function onSuccess(result) {
      var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
      var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
      var oLatLgn = {
        lat: dLat,
        lng: dLng
      }

      map.setCenter(oLatLgn, true);
      zoomMap();
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

function setMarker(oData) {
  var marker = new H.map.Marker(oData.oLatLgn);
  marker.data = oData;

  map.addObject(marker);

  marker.addEventListener('dbltap', function(evt) {
    zoomMap(evt.target.getPosition());
  }, false);
  marker.addEventListener('tap', function(evt) {
    VueScrollTo.scrollTo(document.getElementById(evt.target.data.iEventId), 800, {
      offset: -65,
      force: false,
    })
    oEventTableVue.selected = evt.target.data.iEventId;
  }, false);
  marker.addEventListener('pointerenter', function(evt) {
    openBubble(evt.target.getPosition(), evt.target.data);
    map.getViewPort().element.style.cursor = 'pointer';
  }, false);
  marker.addEventListener('pointerleave', function(evt) {
    closeBubble(evt.target.getPosition());
    map.getViewPort().element.style.cursor = 'auto';
  }, false);

  return marker;
}

function setMarkers(aEvents) {
  //delete existing markers before creating new ones
  map = map.removeObjects(map.getObjects());
  //add marker for every event
  aEvents.forEach((oEvent, index) => {
    if (oEvent.oLatLgn != undefined) {
      // var oData = {index: index, iEventId: oEvent.iEventId};
      oEvent.marker = setMarker(oEvent);
    }
  })
}

function removeMarkers(aEvents) {
  aEvents.forEach((oEvent) => {
    map.removeObject(oEvent.marker);
  })
}

function setVerifyLocationMarker(sAddress) {
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
      var oLatLgn = {
        lat: dLat,
        lng: dLng
      }

      var marker = new H.map.Marker(oLatLgn);
      marker.label = "Ist das der Ort Ihres Events?";

      map.addObject(marker);

      marker.addEventListener('tap', function(evt) {
        map.setCenter(evt.target.getPosition(), true);
        openBubble(evt.target.getPosition(), evt.target.label);
      }, false);

    },
    onError = function(error) {
      alert('Ooops!');
    }
  )

}

var updateViewTimeout;
// track where the user scrolls and drags
map.addEventListener('mapviewchange', function(evt) {
  clearTimeout(updateViewTimeout);
  updateViewTimeout = setTimeout(function() {
    oEventTableVue.mapBounds = map.getViewBounds();
  }, 300)
});


var bubble; // Hold a reference to any infobubble opened
/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, oData, customHTML) {
  var standardBubbleHTML = "<div class=\ibPicture\ style='background-image: url(" + oData.oImage + ")';></div>" +
    "<div class=\infoBubble\>" +
    "<div class=\ibText\>" +
    "<span>" + oData.sName + "</span>" +
    "</div>" +
    "<div class=\iconContainer\>" +
    "<div class=\ibTime>" +
    "<i class='fa fa-calendar' style='font-size:14px'></i>" +
    "<span class=nobr>" + oData.oStartDate + "</span>" +
    "<i class='fa fa-clock-o' style='font-size:15px'></i>" +
    "<span class=nobr>" + oData.oStartTime + "</span>" +
    "<div class=\ibPlace\>" +
    "<i class='fa fa-map-marker' style='font-size:16px'></i>" +
    "<span class=nobr>" + oData.sAdress + "</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  var myHTMLcontent = customHTML != undefined ? customHTML : standardBubbleHTML;

  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position, {
        content: myHTMLcontent
      });
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(myHTMLcontent);
    if (bubble.getState() != "open") {
      bubble.open();
    }
  }
}

function closeBubble() {
  if (bubble) {
    bubble.close();
  }
}

var coord = undefined;
var pickLocationModeMapListener = function(evt) {
  if (verifyMarker) {
    map.removeObject(verifyMarker);
  }
  verifyMarker = undefined;
  coord = undefined;
  coord = map.screenToGeo(evt.currentPointer.viewportX,
    evt.currentPointer.viewportY);
  var sAddress = "";

  function reverseGeocode(platform) {
    var geocoder = platform.getGeocodingService(),
      parameters = {
        prox: "" + coord.lat + "," + coord.lng + ",250",
        mode: 'retrieveAddresses',
        maxresults: '1',
        gen: '9'
      };

    geocoder.reverseGeocode(parameters,
      function(result) {
        sAddress = result.Response.View[0].Result[0].Location.Address.Label;

        var sHTMLBubble = "<div class=\infoBubble\>" +
          "<div class=\ibText\>" +
          "<span>" + "Bestätige oder klick weiter" + "</span>" +
          "</div>" +
          "<div class=\iconContainerLocationPicker\>" +
          "<div class=\ibPlace\>" +
          "<i class='fa fa-map-marker' style='font-size:16px'></i>" +
          "<span class=nobr>" + sAddress + "</span>" +
          "</div>" +
          "</div>" +
          "<button id=\acceptLocationButton\ class=\mdl-button mdl-js-button mdl-button--raised mdl-button-positive\>Bestätigen</button>" +
          "</div>";

        openBubble(coord, {
          sName: "",
          sAdress: "",
          oStartDate: "",
          oStartTime: "",
        }, sHTMLBubble)

        verifyMarker = new H.map.Marker(coord);
        map.addObject(verifyMarker);

        //eventlistener for verify
        document.getElementById("acceptLocationButton").addEventListener("click", function() {
          document.getElementById("newEventAddressDiv").classList.add("is-dirty"); //make the input field look like something got inputted
          oNewEventVue.draft.sAdress = sAddress; //put the adress in the new event form
          oNewEventVue.draft.oLatLng = {
            lat: coord.lat,
            lng: coord.lng
          }
          closeBubble();
          if (verifyMarker) {
            map.removeObject(verifyMarker);
            verifyMarker = undefined;
          }
        });

      },
      function(error) {
        alert("Es gab ein Problem bei der Verbindung mit HERE Maps. Versuche es noch einmal.");
        return;
      });
  }
  reverseGeocode(platform);
};

var pickLocationModeMapListenerSet = false;
var verifyMarker;

function pickLocationMode() {
  var oToggleSwitch = document.getElementById("pickLocationModeToggleLabel");

  //check wether toggle got checked/unchecked
  //got checked
  if (!oToggleSwitch.classList.contains("is-checked")) {
    document.getElementById("newEventAddress").setAttribute("disabled", true);
    oNewEventVue.draft.sAdress = "";
    oNewEventVue.draft.oLatLng = {};

    map.addEventListener('tap', pickLocationModeMapListener)
    pickLocationModeMapListenerSet = true;
    $("#map").delay(100).fadeOut().fadeIn(200); //let map "blink" to show that something changed on it
  }

  //got unchecked
  if (oToggleSwitch.classList.contains("is-checked")) {
    if (document.getElementById("newEventAddress").hasAttribute("disabled")) {
      document.getElementById("newEventAddress").removeAttribute("disabled", true);
    }
    oNewEventVue.draft.sAdress = "";
    oNewEventVue.draft.oLatLng = {};

    //remove map event listener and delete all related markers&bubbles
    closeBubble();
    if (verifyMarker) {
      map.removeObject(verifyMarker);
      verifyMarker = undefined;
    }
    map.removeEventListener('tap', pickLocationModeMapListener);
    pickLocationModeMapListenerSet = false;
    $("#map").delay(100).fadeOut().fadeIn(200); //let map "blink" to show that something changed on it
  }
}

// update map size at window size
window.addEventListener('resize', function() {
  map.getViewPort().resize();
});
