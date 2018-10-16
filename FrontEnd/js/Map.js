

/**
 * Calculates and displays the address details of 200 S Mathilda Ave, Sunnyvale, CA
 * based on a free-form text
 *
 *
 * A full list of available request parameters can be found in the Geocoder API documentation.
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-geocode.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function geocode(platform) {
    //HANSCH beinhaltet immer die letzte Eingabe des Feldes also den Ort nach dem gesucht wurde 
    var ORD = localStorage.getItem("HANSCH");
    console.log("Hello world!" + ORD);
    var geocoder = platform.getGeocodingService(),
        geocodingParameters = {
            searchText: ORD,
            jsonattributes: 1
        };

    geocoder.geocode(
        geocodingParameters,
        onSuccess,
        onError
    );
}
/**
 * This function will be called once the Geocoder REST API provides a response
 * @param  {Object} result          A JSONP object representing the  location(s) found.
 *
 * see: http://developer.here.com/rest-apis/documentation/geocoder/topics/resource-type-response-geocode.html
 */
function onSuccess(result) {
    var locations = result.response.view[0].result;
    /*
     * The styling of the geocoding response on the map is entirely under the developer's control.
     * A representitive styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    addLocationsToMap(locations);
    addLocationsToPanel(locations);
    // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
    alert('Ooops!');
}




/**
 * Boilerplate map initialization code starts below:
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

//Step 2: initialize a map - this map is centered over California
var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {
        center: { lat: 37.376, lng: -122.034 },
        zoom: 12,
        pixelRatio: pixelRatio
    });

var locationsContainer = document.getElementById('panel');

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

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




/**
 * Creates a series of H.map.Markers for each location found, and adds it to the map.
 * @param {Object[]} locations An array of locations as received from the
 *                             H.service.GeocodingService
 */
function addLocationsToMap(locations) {
    var group = new H.map.Group(),
        position,
        i;

    // Add a marker for each location found
    for (i = 0; i < locations.length; i += 1) {
        position = {
            lat: locations[i].location.displayPosition.latitude,
            lng: locations[i].location.displayPosition.longitude
        };
        marker = new H.map.Marker(position);
        // alles Fake Daten 
        var FakeEventMA1 = new H.map.Marker({ lat: 49.47689, lng: 8.46798 });
        map.addObject(FakeEventMA1);
        var FakeEventMA2 = new H.map.Marker({ lat: 49.5, lng: 8.465 });
        map.addObject(FakeEventMA2);
        var FakeEventMA3 = new H.map.Marker({ lat: 49.44, lng: 8.462 });
        map.addObject(FakeEventMA3);
        var FakeEventMA4 = new H.map.Marker({ lat: 49.41, lng: 8.4671 });
        map.addObject(FakeEventMA4);
        var FakeEventMA5 = new H.map.Marker({ lat: 49.49, lng: 8.4672 });
        map.addObject(FakeEventMA5);
        
        marker.label = locations[i].location.address.label;
        group.addObject(marker);
    }

    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.label);
    }, false);

    // Add the locations group to the map
    map.addObject(group);
    map.setCenter(group.getBounds().getCenter());
}

// Now use the map as required...
geocode(platform);