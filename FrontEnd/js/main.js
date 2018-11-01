var oNavigationVue = new Vue({
    el: "#navigation",
    data: {
        horizontalMenueShown: true
    },
    methods: {

        showNewFavoiteCard: function () {
            oNewFavoiteVue.cardShown = !oNewFavoiteVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
        },

        showNewEventCard: function () {
            oNewEventVue.cardShown = !oNewEventVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewLoginCard: function () {
            oNewLoginVue.cardShown = !oNewLoginVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewRegisterCard: function () {
            oNewRegisterVue.cardShown = !oNewRegisterVue.cardShown;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewDateCard: function () {
            oNewDateVue.cardShown = !oNewDateVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        toggleBigMap: function () {
            document.body.classList.toggle('bigMap');
            map.getViewPort().resize();
            //   oAsideVue.bShown = false;
        }
    }
});

var oEvent = function (oEvent) {
    this.iEventId = oEvent.iEventId;
    this.sName = oEvent.sName;
    this.sDescription = oEvent.sDescription;
    this.sAdress = oEvent.sAdress;
    this.sInstagramHastag = oEvent.sInstagramHastag;
    this.iVerificationStatus = oEvent.iVerificationStatus;
    this.osDate = oEvent.sDate;
    this.oEndDate = oEvent.sEndDate;
    this.sEventLink = oEvent.sEventLink;
    this.sTicketLink = oEvent.sTicketLink;
    this.oLatLgn = oEvent.oLatLgn;
    this.faved = oEvent.faved;
};

// this array should be retrieved from the database, maybe according to location chosen and/or the filter options
// var aTestEvents = [
//     new oEvent({
//        iEventId: 3,
//        sName: "Kultursonntag im Museum für moderne Kunst",
//        sDescription: "Gemälde, Figuren und Performances. Dies und vieles mehr erwartet Sie und Ihre Familie. Eintritt: 5€.",
//        sAdress: "C2 20, 68159 Mannheim",
//        oLatLgn: {
//         "lat": 49.4871,
//         "lng": 8.46343
//       }

//     }),
//     new oEvent({
//         iEventId: 2,
//         sName: "Elektro Party",
//         sDescription:"Lust auf moderne Elektromusik und ein stilvolles Ambiente? Kostenlos vorbeischauen!.",
//         sAdress: "Berliner Straße 19a, 68159 Mannheim",
//         oLatLgn: {
//             "lat": 49.48712,
//             "lng": 8.47826
//           }
//     }),
//     oTestEvent1 = new oEvent({
//         iEventId: 1,
//         sName: "Autoparty",
//         sDescription: "Beschleunigen und co",
//         sAdress: "Mannheim Paradeplatz",
//         oLatLgn:{
//             "lat": 49.48672,
//             "lng": 8.46641
//           },
//         faved: true
//     })
// ];

// aTestEvents = aTestEvents.concat(aJsonTestData);
var aAllEvents = [];
// aAllEvents =

function getAllEvents() {
    var GETALLEVENTS_URL = 'http://localhost:3000/events';
    var ajaxRequest = new XMLHttpRequest();


    var onSuccess = function onSuccess() {

        var apievents = this.response.oEvents;
        oEventTableVue.allEvents = apievents.map(apievent => {
            return {
                iEventId: apievent._id,
                sName: apievent.event_name,
                sDescription: apievent.description,
                sAdress: apievent.address.freeformAddress,
                osDate: apievent.start_date,
                oEndDate: apievent.end_date,
                sEventLink: apievent.event_link,
                sTicketLink: apievent.ticket_link,
                oLatLgn: apievent.address.loc
            };
        });

        setMarkers(oEventTableVue.allEvents);

    };

    var onFailed = function onFailed() {
        alert('Ooops!');
    };
    // Attach the event listeners to the XMLHttpRequest object
    ajaxRequest.addEventListener("load", onSuccess);
    ajaxRequest.addEventListener("error", onFailed);
    ajaxRequest.responseType = "json";

    ajaxRequest.open('GET', GETALLEVENTS_URL);
    ajaxRequest.send();
}

//Vue fuer die Event Tabelle fertig
var oEventTableVue = new Vue({
    el: "#eventTable",
    data: {
        allEvents: aAllEvents,
        selected: "", //id of selected event (to see more info)
        mapBounds: { ga: 0, ha: 0, ka: 0, ja: 0 },
        sQuery: ""
    },
    computed: {
        filteredList: function () {
            vi = this;
            return this.allEvents.filter(function (ev) {
                var bool = (
                    (vi.mapBounds.ja < ev.oLatLgn.lat)
                    && (vi.mapBounds.ka > ev.oLatLgn.lat)
                    && (vi.mapBounds.ga < ev.oLatLgn.lng)
                    && (vi.mapBounds.ha > ev.oLatLgn.lng)
                )
                // console.log(bool);
                return bool
            })
        }
    },
    methods: {
        favToggle: function (target) {
            // target: eventobject wird hinein gereicht von vue for schleife
            Vue.set(target, 'faved', !target.faved)
            // this is the same as:
            // target.faved = !target.faved;
            // but databinding works also if event hasnt property faved set in the beginning
            // console.log(target.faved);
        },
        // click on event in list to see more details
        select: function (target) {
            // only data with specific Ids can be selected
            if (target.iEventId != undefined) {
                this.selected = target.iEventId;
            }

            // map.setCenter(target.marker.getPosition(), true);
            openBubble(target.marker.getPosition(), target.marker.data);
        },
        searchEvent: function () {
            if (sQuery === "" || sQuery === undefined) {
                this.allEvents = aTestEvents;
                return;
            }
            var aFilterdEvents;
            this.allEvents.forEach(function (oEvent) {
                if (oEvent.sName.includes(sQuery)) {
                    aFilterdEvents.push(oEvent);
                }
            });
            this.allEvents = aFilterdEvents;
        }
    }
    // ,
    // mounted: function() {
    //   axios
    //   .get('http://localhost:3000/events')
    //   .then(response => (this.allEvents = response))
    // }
});


//Vue fuer die Leiste mit Suchfunktion und Filter Button
var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: localStorage.getItem("HANSCH"),
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {
        //Sucht nach einem Ort
        searchPlace: function searchPlace() {
            if (document.body.classList.contains('landingpage')) {
                document.body.classList.remove('landingpage');
                document.querySelector("#searchPlace").vanillaTilt.destroy()
                map.getViewPort().resize();
            }
            setCenter(this.sQuery);
        },
        //AutoComplet Funktion der Suchleiste
        autocomplete: function autocomplete() {
            getAutocompletion(this.sQuery, document.getElementById("searchInput"));
        }
    }
});

var oNewEventVue = new Vue({
    el: "#newEventWrapper",
    data: {
        cardShown: false,
        draft: {
            sName: "",
            sDescription: "",
            sAdress: "",
            sDate: "",
            time: "",
            latlng: {},
            status: "draft",
            EDate: null,
            iEventId: Math.floor(Math.random() * 99999) + 1,
            oSelectedFile: null,
            image: null
        },
        value7: ''
    },
    methods: {
        formdraft: function () {
            if (oEventTableVue.currentEvents[0].status != "draft") {
                oEventTableVue.currentEvents.unshift(this.draft)
            }
            setCenter(this.draft.sAdress);
            setVerifyLocationMarker(this.draft.sAdress, this.draft.sName);
        },
        formsubmit: function () {
            // Koordinaten für Adresse holen
            var geocoder = platform.getGeocodingService(),
                geocodingParameters = {
                    searchText: this.draft.sAdress,
                    jsonattributes: 1
                };
            geocoder.geocode(
                geocodingParameters,
                onSuccess = function onSuccess(result) {

                    var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
                    var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
                    var oLatLgn = { lat: dLat, lng: dLng }

                    //Post Request mit LatLgn senden
                    var URI = 'http://localhost:3000/events';
                    var ajaxRequest = new XMLHttpRequest();
        
                    var onSuccess = function onSuccess() {
        
                        alert("Req angekommen");
                        oNewEventVue.draft.status = "unsend";
                        oNewEventVue.draft = { // reset vueinternal data to make possible to add new event
                            sName: "",
                            sDescription: "",
                            sAdress: "",
                            date: "",
                            time: "",
                            latlng: {},
                            EDate: null,
                            status: "draft",
                            iEventId: Math.floor(Math.random() * 99999) + 1,
                        }
                    };
        
                    var onFailed = function onFailed() {
                        alert('Event konnt nicht angelegt werden!');
                    };
                    // Attach the event listeners to the XMLHttpRequest object
                    ajaxRequest.addEventListener("load", onSuccess);
                    ajaxRequest.addEventListener("error", onFailed);
                    ajaxRequest.responseType = "json";
                    var body = {
                        event_name: oNewEventVue.draft.sName,
                        description: oNewEventVue.draft.sDescription,
                        address: {
                            freeformAddress: oNewEventVue.draft.sAdress,
                            loc: oLatLgn
                        },
                        start_date: oNewEventVue.draft.EDate[0],
                        end_date: oNewEventVue.draft.EDate[1],
                        event_types: ["5bd1874824c1783894595b68"],
                        event_picture: oNewEventVue.image
                    };
                    var stringBody = JSON.stringify(body);
        
                    ajaxRequest.open('POST', URI);
                    ajaxRequest.setRequestHeader('Content-Type', 'application/json');
                    ajaxRequest.send(stringBody);

                },
                onError = function (error) {
                    alert('Ooops!');
                }
            )


           

            //https://www.youtube.com/watch?v=VqnJwh6E9ak see this for picture upload
        },
        autocomplete: function autocomplete() {
            getAutocompletion(this.draft.sAdress, document.getElementById("newEventAddress"));
        },
        onFileSelected: function (event) {
            this.draft.oSelectedFile = event.target.files[0];
        },
        onChange(image) {
            console.log('New picture selected!')
            if (image) {
                console.log('Picture loaded.')
                this.draft.image = image
            } else {
                console.log('FileReader API not supported: use the <form>, Luke!')
            }
        }
    },
    components: {
        'picture-input': PictureInput
    }
});

setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage




// Register Vue
var oRegisterVue = new Vue({
    el: "#newRegisterWrapper",
    data: {
        cardShown: false,
        draft: {
            rUserName: "",
            rEmail: "",
            rPassword: "",
            rPassword2: "",
            status: "draft",
            iRegisterId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
        formdraft: function () {
            if (oEventTableVue.currentEvents[0].status != "draft") {
                oEventTableVue.currentEvents.unshift(this.draft)
            }
        },
        formsubmit: function () {
            var onSuccess = function onSuccess() {
                alert('ich glaube es hat geklappt. HTTP CODE ABFANGEN WEIL EVTL HAT ES NED GEKLAPPT LOL');
            };
            var onFailed = function onFailed() {
                alert(' SO NE SCHEISSE');
            };


            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;

            var newuser = "http://localhost:3000/user/signup"
            var ajaxRequest = new XMLHttpRequest();

            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";
            ajaxRequest.open("POST", newuser, true);
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var snewuserdata = "name=" + this.draft.rUserName + "&email=" + this.draft.rEmail + "&password=" + this.draft.rPassword;
            console.log(snewuserdata);
            ajaxRequest.send(snewuserdata);
        },

    }
});

//Register Vue End


//Login Vue
var oNewLoginVue = new Vue({
    el: "#newLoginWrapper",
    data: {
        cardShown: false,
        draft: {
            sUserName: "",
            sPassword: "",
            status: "draft",
            iLoginId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {


        formsubmit: function () {

            var suserlogin = "http://localhost:3000/user/login"
            var ajaxRequest = new XMLHttpRequest();


            var onSuccess = function onSuccess() {

                console.log(this.status);
                if (this.status == 200) {
                    alert('Du bist erfolgreich eingeloggt');
                } else {
                    alert('Anmeldung nicht erfolgreich');

                }

            };
            var onFailed = function onFailed() {
                alert(' SO NE SCHEISSE');
            };


            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";
            ajaxRequest.open("POST", suserlogin, true);
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            var suserdata = "email=" + this.draft.sUserName + "&password=" + this.draft.sPassword;

            ajaxRequest.send(suserdata);
            console.log(suserdata);

            this.cardShown = !this.cardShown;
        },


        BobMarleyCard: function () {
            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = true;


        },
    }
});
//Login Vue End


// Date Vue
var oNewDateVue = new Vue({
    el: "#newDateWrapper",
    data: {
        cardShown: false,
        draft: {
            FilterDate: "",
            status: "draft",
            iFilterId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
        formdraft: function () {
            if (oEventTableVue.currentEvents[0].status != "draft") {
                oEventTableVue.currentEvents.unshift(this.draft)
            }
        },
        formsubmit: function () {

            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;

        },

    }
});

// Favoite Vue
var oNewFavoiteVue = new Vue({
    el: "#newFavoriteWrapper",
    data: {
        cardShown: false,
        draft: {
            // Muss die favoiten aus der DB holen
            Favorites: "",
            status: "draft",
            iFilterId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
        close: function () {

            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;

        },

    }
});

// var oAsideVue = new Vue({
//     el: "#aside",
//     data: {
//         bShown: true
//     }
// });


// suche nach gleichen events mit exakt gleichen Koordinaten
// und verändert die Position der Duplikate ein bisschen (in place)
function checkDuplicatePositions(arr) {
    // console.time("duplishift")
    arrCopy = arr.slice(0); //copy array but keep references to orig. objects
    while (arrCopy.length) {
        testFor = arrCopy.shift().oLatLgn // original eventobj that keeps location data
        countDuplicates = 0;
        for (var i = 0; i < arrCopy.length; i++) // iterate over array lookig for duplicates
            if (testFor.lat - arrCopy[i].oLatLgn.lat == 0) // lat gleich?
                if (testFor.lng - arrCopy[i].oLatLgn.lng == 0) { // long gleich ?
                    countDuplicates++;
                    // Die Duplikate ordnen sich in einer angedeuteten Spiralformation um
                    // die echten Koordinaten an. loool :D
                    angle = countDuplicates * 1.4 + 4;
                    arrCopy[i].oLatLgn.lng -= angle * Math.cos(angle) * 0.000005;
                    arrCopy[i].oLatLgn.lat -= angle * Math.sin(angle) * 0.000002;
                    arrCopy.splice(i, 1) // remove object of arrCopy
                }
    }
    // console.timeEnd("duplishift")
}

function initEverything() {
    setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage
    getAllEvents()
    checkDuplicatePositions(oEventTableVue.allEvents);
}



initEverything();
