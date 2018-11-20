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

// var usernameemail = "";
var kommi = false;
var dialogopen = false;
var logoutmodus = false;
var aktuellebewertung = 0;
var nochniebewertet = true;
var loggedInUser = "";
var daumenhochgeklickt = false;
var daumenruntergeklickt = false;
var favoritegeklickt = false;
var initalFavoriteSetting = false;
var i = 0;
var achtung = 0;
var oNavigationVue = new Vue({
    el: "#navigation",
    data: {
        horizontalMenueShown: true,


    },
    methods: {


        showNewEventCard: function () {
            $(window).scrollTop(0);
            oNewEventVue.cardShown = !oNewEventVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
        },

        showNewFavoriteCard: function () {
            $(window).scrollTop(0);
            favoritegeklickt = !favoritegeklickt;
            if (favoritegeklickt === true) {
                document.getElementById('h2events').innerText = "Favoriten";
                document.getElementById('AfterLoginFavoriten').innerText = "Events";
                getFavorites(loggedInUser._id);
                document.getElementById("idSearchBar").childNodes[2].setAttribute("hidden", "hidden");//hide time filter
            }
            else {
                document.getElementById('h2events').innerText = "Events";
                document.getElementById('AfterLoginFavoriten').innerText = "Favoriten";
                // getAllEvents();
                getFilteredEvents(oSearchPlaceVue.dDate);
                document.getElementById("idSearchBar").childNodes[2].removeAttribute("hidden"); //display time filter
            }
        },

        showNewLoginCard: function () {
            $(window).scrollTop(0);
            if (document.getElementById('AfterLoginLogin').innerText === "LogOut") {
                logoutmodus = false;
                document.getElementById('AfterLoginLogin').innerText = "LogIn";

                document.getElementById('eingeloggteruser').innerText = "EventFinder";
                AfterLoginFavoriten.style.visibility = "hidden";
                loggedInUser = "";
                AfterLoginEvent.style.visibility = "hidden";
                document.getElementById('AfterLoginLogin').innerText = "LogIn";
                newLoginWrapper.style.display = "visible";
                oEventTableVue.starVisibility = "hidden";

            }
            if (logoutmodus === false) {
                oNewLoginVue.cardShown = !oNewLoginVue.cardShown;
                oRegisterVue.cardShown = false;
                oNewEventVue.cardShown = false;

                AfterLoginFavoriten.style.visibility = "hidden";
                loggedInUser = "";
                AfterLoginEvent.style.visibility = "hidden";
                document.getElementById('AfterLoginLogin').innerText = "LogIn";
                newLoginWrapper.style.display = "visible";
                oEventTableVue.starVisibility = "hidden";
            }
            else {
                oNewLoginVue.formsubmit();
                document.getElementById('h2events').innerText = "Events";
                document.getElementById('AfterLoginFavoriten').innerText = "Favoriten";
                // getAllEvents();
                getFilteredEvents(oSearchPlaceVue.dDate);
                oNewEventVue.cardShown = false;

            }
        },
        showNewRegisterCard: function () {
            $('body').scrollTop(0);
            oNewRegisterVue.cardShown = !oNewRegisterVue.cardShown;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
        },
        showNewDateCard: function () {
            oNewDateVue.cardShown = !oNewDateVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewLoginVue.cardShown = false;
        },
        toggleBigMap: function () {
            bigmapgeklickt = !bigmapgeklickt;
            if (bigmapgeklickt === true) {
                AfterLoginLogin.style.visibility = "hidden";
                AfterLoginFavoriten.style.visibility = "hidden";
                AfterLoginEvent.style.visibility = "hidden";
                document.getElementById('BigMap').innerText = "zurück zur Liste ";
            }
            else {
                AfterLoginLogin.style.visibility = "visible";
                document.getElementById('BigMap').innerText = "Große Karte ";
                if (loggedInUser != "") {
                    AfterLoginFavoriten.style.visibility = "visible";
                    AfterLoginEvent.style.visibility = "visible";
                }
                else {
                    AfterLoginLogin.style.visibility = "visible";
                }
            }

            document.body.classList.toggle('bigMap');
            map.getViewPort().resize();

            //   oAsideVue.bShown = false;
        }
    }
});



var bigmapgeklickt = false;

function getFavorites(user_id) {
    oEventTableVue.selected = "";
    const GETFAVORITES_URL = "http://localhost:3000/user/" + user_id + "/events";
    var ajaxRequest = new XMLHttpRequest();

    var onSuccess = function onSuccess() {

        var apievents = this.response.saved_events;
        oEventTableVue.allEvents = apievents.map(apievent => {
            return {
                sDisplayEventLink: apievent.event_link != undefined ? "box" : "none",
                iEventId: apievent._id,
                aRatings: apievent.ratings,
                iCurrentRating: apievent.current_rating,
                sName: apievent.event_name,
                sDescription: apievent.description,
                sAdress: apievent.address,
                oStartDate: apievent.start_date.split("T")[0],
                oStartTime: apievent.start_date.split("T")[1].substring(0, 5),
                oEndDate: apievent.end_date.split("T")[0],
                oEndTime: apievent.end_date.split("T")[1].substring(0, 5),
                sEventLink: apievent.event_link,
                sTicketLink: apievent.ticket_link,
                oLatLgn: { lat: apievent.lat, lng: apievent.lng },
                oImage: "../Backend/" + apievent.event_picture.replace(/\\/g, "/")
            };
        });
        //sort by start date
        oEventTableVue.allEvents.sort(function (a, b) {
            return new Date(b.oApiEventStartDate) - new Date(a.oApiEventStartDate);
        });
        // set bubbles on map
        setMarkers(oEventTableVue.allEvents);
        //set stars
        initalFavoriteSetting = true;
        for (var z = 0; z < oEventTableVue.allEvents.length; z++) {
            oEventTableVue.favToggle(oEventTableVue.allEvents[z]);
        }
        initalFavoriteSetting = false;
    };

    var onFailed = function onFailed() {
        alert('Die Favoritenlist konnte nicht geladen werden!');
    };
    // Attach the event listeners to the XMLHttpRequest object
    ajaxRequest.addEventListener("load", onSuccess);
    ajaxRequest.addEventListener("error", onFailed);
    ajaxRequest.responseType = "json";

    ajaxRequest.open('GET', GETFAVORITES_URL);
    ajaxRequest.send();
};


// aTestEvents = aTestEvents.concat(aJsonTestData);
var aAllEvents = new Array();
var ausgewaehlt = "";
// aAllEvents =

function getAllEvents() { //uses get events/filtered with header filter_start_date = new Date() instead of get events
    oEventTableVue.selected = "";
    var GETALLEVENTS_URL = 'http://localhost:3000/events/filtered';
    var ajaxRequest = new XMLHttpRequest();

    var onSuccess = function onSuccess() {

        var apievents = this.response.oEvents;
        oEventTableVue.allEvents = apievents.map(apievent => {
            return {
                iEventId: apievent._id,
                aComments: apievent.comments,
                aRatings: apievent.ratings,
                sName: apievent.event_name,
                sDescription: apievent.description,
                sAdress: apievent.address,
                iCurrentRating: apievent.current_rating,
                oApiEventStartDate: apievent.start_date,
                oStartDate: apievent.start_date.split("T")[0],
                oStartTime: apievent.start_date.split("T")[1].substring(0, 5),
                oEndDate: apievent.end_date.split("T")[0],
                oEndTime: apievent.end_date.split("T")[1].substring(0, 5),
                sEventLink: apievent.event_link,
                sDisplayEventLink: apievent.event_link != undefined ? "box" : "none",
                sTicketLink: apievent.ticket_link,
                oLatLgn: { lat: apievent.lat, lng: apievent.lng },
                oImage: "../Backend/" + apievent.event_picture.replace(/\\/g, "/")
            };
        });
        //Sortiere die events - sollte später vielleicht backend machen?
        oEventTableVue.allEvents.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.oApiEventStartDate) - new Date(b.oApiEventStartDate);
        });
        setMarkers(oEventTableVue.allEvents);
        if (loggedInUser != "") {
            //set stars
            initalFavoriteSetting = true;
            for (var i = 0; i < loggedInUser.saved_events.length; i++) {
                for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
                    if (oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
                        console.log(oEventTableVue.allEvents[j].iEventId);
                        oEventTableVue.favToggle(oEventTableVue.allEvents[j])
                        break;
                    }
                }
            }
            initalFavoriteSetting = false;
        }
    };

    var onFailed = function onFailed() {
        alert('Die Eventlist konnte nicht geladen werden!');
    };
    // Attach the event listeners to the XMLHttpRequest object
    ajaxRequest.addEventListener("load", onSuccess);
    ajaxRequest.addEventListener("error", onFailed);
    ajaxRequest.responseType = "json";

    ajaxRequest.open('GET', GETALLEVENTS_URL);
    ajaxRequest.setRequestHeader("filter_end_date", new Date());
    ajaxRequest.send();
}
//function getComments(event_id) {
//    const GETCOMMENTS_URL = "http://localhost:3000/events" + event_id;

//    axios.get(GETCOMMENTS_URL).then(res => {
//        console.log("Kommis für " + event_id + " erhalten: " + res);
//        console.log(res.???);

//    }).catch(function (error) {
//        console.log(error);
//    });
//};


//Vue fuer die Event Tabelle fertig
var oEventTableVue = new Vue({
    el: "#eventTable",
    data: {
        allEvents: aAllEvents,
        selected: "", //id of selected event (to see more info)
        mapBounds: { ga: 0, ha: 0, ka: 0, ja: 0 },
        sQuery: "",
        starVisibility: "hidden"

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
                );
                // console.log(bool);
                return bool;
            })
        },
        commentList: function () { // comments of selected event
            var temp = this;
            if (this.selected === "") {
                return [];
            }
            return this.allEvents.filter(function (value) {
                return value.iEventId === temp.selected;
            })[0].aComments;
        }
    },
    methods: {

        favToggle: function (target) {
            // abfrage, ob es gefavt war oder nicht
            if (loggedInUser != "") { //only change status of faved i fa user is logged in
                if (initalFavoriteSetting) { // don't save the event as favorite if it's the initial setting of favorites during log in
                    Vue.set(target, 'faved', true);
                } else {
                    var requestType = "POST";
                    var requestURL = "http://localhost:3000/user/";
                    if (target.faved) { //delete _id of target from saved_events of user
                        requestURL = requestURL + "unsaveEvent";
                        //delete favorite from loggedInUser
                        loggedInUser.saved_events = loggedInUser.saved_events.filter(function (value, index, arr) {
                            return value != target.iEventId;
                        });
                    } else { // save _id of target in saved_events of user
                        loggedInUser.saved_events.push(target.iEvent);
                        requestURL = requestURL + "saveEvent";
                    }
                    var ajaxRequest = new XMLHttpRequest();

                    var onSuccess = function onSuccess() {
                        console.log("success: " + this.status);
                        if (this.status == 200) {
                            // set target to be (not) faved
                            Vue.set(target, 'faved', !target.faved);
                        } else {
                            // warnung dass das gerade nicht ging?
                        }

                    };

                    var onFailed = function onFailed() {
                        console.log("failed");
                    };

                    ajaxRequest.addEventListener("load", onSuccess);
                    ajaxRequest.addEventListener("error", onFailed);
                    ajaxRequest.responseType = "json";
                    ajaxRequest.open(requestType, requestURL, true);
                    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var sFormData = "userId=" + loggedInUser._id + "&eventId=" + target.iEventId;
                    ajaxRequest.send(sFormData);
                }
            } else { // user ist nicht eingeloggt
                // meldung, dass man sich anmelden soll oder so
            }



        },
        kommentargeschickt: function (id) {

            // alert("Danke für dein Kommentar. Nachdem es verifiziert wurde, kannst du es hier sehen.");
            var ajaxRequest = new XMLHttpRequest();
            var comment = document.querySelector("#idComment").value;

            var onSuccess = function onSuccess() {
                console.log("toll");
                var t = oEventTableVue.selected;
                // getAllEvents(); //this leads to the comment being displayed immediatley
                getFilteredEvents(oSearchPlaceVue.dDate);
                oEventTableVue.selected = t;
            };
            var onFailed = function onFailed() {
                console.log("failed");
            };

            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";
            ajaxRequest.open("POST", "http://localhost:3000/events/addComment", true);
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var sFormData = "username=" + loggedInUser.name + "&userId=" + loggedInUser._id + "&eventId=" + oEventTableVue.selected + "&comment=" + comment;
            ajaxRequest.send(sFormData);
            document.querySelector("#idComment").value = "";

        },

        select: function (target) {
            // only data with specific Ids can be selected
            if (dialogopen == false) {
                if (target.iEventId != undefined) {

                    this.selected = target.iEventId;
                    ausgewaehlt = target;
                }
                // map.setCenter(target.marker.getPosition(), true);
                openBubble(target.marker.getPosition(), target.marker.data);
                zoomMap(target.marker.getPosition());
            }
            else { }
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
        },
        //Offnet bzw macht Popup moeglich
        KommentarGemacht: function (id, name, beschreibung, comments) {
            kommi = true;
            if (loggedInUser != "") {

                if (kommi === true) {
                    dialogopen = true;
                    document.querySelector("#idComment").value = "";
                    var dialog = document.querySelector('dialog');
                    document.getElementById('kommiüberschrift').innerText = name;

                    document.getElementById('eventidkommentare').innerText = beschreibung;

                    // get, whether the currently logged in user has already rated the event
                    var selected_event = oEventTableVue.allEvents.find(obj => {
                        return obj.iEventId == oEventTableVue.selected
                    });
                    var loggedInUser_rating = selected_event.aRatings.find(obj => {
                        return obj.user_id == loggedInUser._id
                    })

                    if (loggedInUser_rating) { //set rating buttons
                        if (loggedInUser_rating.rating == -1) {
                            nochniebewertet = false;
                            document.getElementById('haha').style.color = "red"
                            document.getElementById('idThumbUp').style.color = "grey"
                        } else {
                            nochniebewertet = false;
                            document.getElementById('idThumbUp').style.color = "green"
                            document.getElementById('haha').style.color = "grey"
                        }
                    } else {
                        nochniebewertet = true;
                        document.getElementById('idThumbUp').style.color = "grey"
                        document.getElementById('haha').style.color = "grey"
                    }
                    // set current_rating
                    aktuellebewertung = selected_event.iCurrentRating;
                    document.getElementById('ratingnumber').innerText = aktuellebewertung;
                    //add comments to list
                    //                     var list = document.getElementById("commentTable");
                    //                     while (list.firstChild) {
                    //                     list.removeChild(list.firstChild);
                    //                     }
                    //                     for (var r = 0; r < comments.length; r++){
                    //                       var node = document.createElement("LI");                 // Create a <li> node
                    //
                    //                       var span = document.createElement("SPAN");
                    //                       span.className = "mdl-list__item-primary-content";
                    //                       span = document.createElement("SPAN");
                    //                       var i = document.createElement("I");
                    //                       i.className = "material-icons mdl-list__item-avatar";
                    //                       i.innerHTML = "person";
                    //                         var comment = document.createElement("SPAN");
                    //                         comment = document.createElement("SPAN");
                    //                       comment.innerHTML = comments[r].comment;         // Create a text node
                    //                         var user = document.createElement("SPAN");
                    //                         user = document.createElement("SPAN");
                    //                       user.innerHTML = comments[r].username;
                    //                       user.className = "mdl-list__item-text-body";
                    //
                    //                       span.appendChild(i);
                    //                       span.appendChild(user);
                    //                       span.appendChild(comment);
                    //                         node.appendChild(span);
                    //
                    //                         // Append the text to <li>
                    //                       document.getElementById("commentTable").appendChild(node);     // Append <li> to <ul> with id="myList"
                    //                     }
                    dialog.showModal();
                }
                dialog.querySelector('.close').addEventListener('click', function () {
                    dialog.close();
                    // getAllEvents();
                    dialogopen = false;
                    //getFilteredEvents(oSearchPlaceVue.dDate);
                });
                $(dialog).children().first().click(function (e) {
                    e.stopPropagation();
                })
                document.addEventListener("click", function (e) {
                    console.log(e)
                    dialog.close();
                    dialogopen = false;
                });
            }
            else {
                alert("Logg dich bitte ein, um Kommentare und Bewertungen zu hinterlassen");
            }

        },


    }
    // ,
    // mounted: function() {
    //   axios
    //   .get('http://localhost:3000/events')
    //   .then(response => (this.allEvents = response))
    // }
});

function getFilteredEvents(dDate) {
    //filter for start_date and end_date and event types
    //filter_event_type is an array of 1 - x event_types
    if (dDate) {
        //check, whether filter dates are in the past -> reject search
        if (dDate[0] >= new Date().setHours(0, 0, 0, 0) && dDate[1] >= new Date().setHours(0, 0, 0, 0)) {
            var GETFILTEREDEVENTS_URL = 'http://localhost:3000/events/filtered';
            var ajaxRequest = new XMLHttpRequest();

            var onSuccess = function onSuccess() {
                var apievents = this.response.oEvents;
                oEventTableVue.allEvents = apievents.map(apievent => {
                    return {
                        sDisplayEventLink: apievent.event_link != undefined ? "box" : "none",
                        iEventId: apievent._id,
                        aComments: apievent.comments,
                        aRatings: apievent.ratings,
                        sName: apievent.event_name,
                        sDescription: apievent.description,
                        sAdress: apievent.address,
                        iCurrentRating: apievent.current_rating,
                        oStartDate: apievent.start_date.split("T")[0],
                        oStartTime: apievent.start_date.split("T")[1].substring(0, 5),
                        oEndDate: apievent.end_date.split("T")[0],
                        oEndTime: apievent.end_date.split("T")[1].substring(0, 5),
                        sEventLink: apievent.event_link,
                        sTicketLink: apievent.ticket_link,
                        oLatLgn: { lat: apievent.lat, lng: apievent.lng },
                        oImage: "../Backend/" + apievent.event_picture.replace(/\\/g, "/")
                    };
                });
                setMarkers(oEventTableVue.allEvents);
                if (loggedInUser != "") {
                    //set stars
                    initalFavoriteSetting = true;
                    for (var i = 0; i < loggedInUser.saved_events.length; i++) {
                        for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
                            if (oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
                                console.log(oEventTableVue.allEvents[j].iEventId);
                                oEventTableVue.favToggle(oEventTableVue.allEvents[j])
                                break;
                            }
                        }
                    }
                    initalFavoriteSetting = false;
                }
                //change center of map and filter for location
                //   setCenter(oSearchPlaceVue.sQuery);
            };

            var onFailed = function onFailed() {
                alert('Die Eventliste konnte nicht nach Datum gefiltert werden!');
                //change center of map and filter for location
                setCenter(oSearchPlaceVue.sQuery);
            };
            // Attach the event listeners to the XMLHttpRequest object
            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";

            ajaxRequest.open('GET', GETFILTEREDEVENTS_URL);
            ajaxRequest.setRequestHeader("filter_start_date", dDate[0].toString());
            ajaxRequest.setRequestHeader("filter_end_date", dDate[1].toString());
            // ajaxRequest.setRequestHeader("filter_event_type", );

            ajaxRequest.send();
        } else { // at least one of the dates is in the past, which is an incorrect input
            // idDatePickerErrorEmpty
            document.getElementById("idDatePickerErrorEmpty").style.display = "block";
        }

    } else { // no dates given
        //change center of map and filter for location
        getAllEvents();
        setMarkers(oEventTableVue.allEvents);
        // setCenter(oSearchPlaceVue.sQuery);
    }
};

//Vue fuer die Leiste mit Suchfunktion und Filter Button
var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: localStorage.getItem("HANSCH"),
        dDate: null,
        sName: "Event Finder",
        sButtonName: "Suchen",
        FilterdDate: null,
        pickerOptions: {
            shortcuts: [
                {
                    text: 'Heute',
                    onClick(picker) {
                        const end = new Date().setHours(23, 59, 59, 59);
                        const start = new Date().setHours(0, 0, 0, 0);
                        // end.setTime(start.getTime() + 3600 * 1000 * 24 * 1);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: 'nächste Woche',
                    onClick(picker) {
                        const end = new Date(new Date().getTime() + 3600 * 1000 * 24 * 7).setHours(23, 59, 59, 59);
                        const start = new Date().setHours(0, 0, 0, 0);
                        // end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: 'nächster Monat',
                    onClick(picker) {
                        const end = new Date(new Date().getTime() + 3600 * 1000 * 24 * 30).setHours(23, 59, 59, 59);
                        const start = new Date().setHours(0, 0, 0, 0);
                        // end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }
            ]
        },
    },
    methods: {
        //Sucht nach einem Ort
        searchPlace: function searchPlace() {
            if (document.body.classList.contains('landingpage')) {

                AfterLoginLogin.style.visibility = "visible";
                document.body.classList.remove('landingpage');
                document.querySelector("#searchPlace").vanillaTilt.destroy()
                map.getViewPort().resize();
                AfterLoginLogin.style.visibility = "visible";
                document.getElementById("idSearchBar").childNodes[2].removeAttribute("hidden");
            }
            document.getElementById("idDatePickerErrorEmpty").style.display = "none";
            getFilteredEvents(this.dDate);
        },
        //AutoComplet Funktion der Suchleiste
        autocomplete: function autocomplete() {
            getAutocompletion(this.sQuery, document.getElementById("searchInput"));
        },
        filterDate: function () {
            // axios.get('http://localhost:3000/events'
            //     //optional parameters
            //     // , {
            //     //     params: {
            //     //         date: oSearchPlaceVue.FilterdDate
            //     //     }
            //     // }
            // )
            //     .then(function (response) {
            //         removeMarkers(oEventTableVue.allEvents);

            //         var aFilterdEvents = this.response.oEvents;
            //         oEventTableVue.allEvents = aFilterdEvents.map(apievent => {
            //             return {
            //                 iEventId: apievent._id,
            //                 sName: apievent.event_name,
            //                 sDescription: apievent.description,
            //                 sAdress: apievent.address,
            //                 oStartDate: apievent.start_date.split("T")[0],
            //                 oStartTime: apievent.start_date.split("T")[1].substring(0, 5),
            //                 oEndDate: apievent.end_date,
            //                 sEventLink: apievent.event_link,
            //                 sTicketLink: apievent.ticket_link,
            //                 oLatLgn: { lat: apievent.lat, lng: apievent.lng },
            //                 oImage: "../Backend/" + apievent.event_picture.replace(/\\/g, "/"),
            //             };
            //         });
            //         setMarkers(oEventTableVue.allEvents);
            //     })
            //     .catch(function (error) {
            //         // handle error
            //         console.log(error);
            //     })
            //     .then(function () {
            //         // always executed
            //     });
            console.log("filter date triggered");

        }

    }
});

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

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
            oLatLng: {},
            status: "draft",
            EDate: null,
            sEventLink: null,
            iEventId: Math.floor(Math.random() * 99999) + 1,
            oSelectedFile: "",
            image: null,
            titleIsInvalid: false,
            descIsInvalid: false,
            adressIsInvalid: false,
            displayError: false,
            dateIsInvalid: false
        },
        value7: ''
    },
    methods: {
        // formdraft: function () {
        //     var geocoder = platform.getGeocodingService(),
        //         geocodingParameters = {
        //             searchText: oNewEventVue.draft.sAdress,
        //             jsonattributes: 1
        //         };
        //     geocoder.geocode(
        //         geocodingParameters,
        //         onSuccess = function onSuccess(result) {

        //             var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
        //             var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
        //             var oLatLgn = { lat: dLat, lng: dLng }

        //             oNewEventVue.draft.oLatLng = oLatLgn;
        //             oNewEventVue.draft.oStartDate = oNewEventVue.draft.EDate[0].split("T")[0];
        //             oNewEventVue.draft.oStartTime = oNewEventVue.draft.EDate[1].split("T")[1].substring(0, 5);
        //             oNewEventVue.draft.sDisplayEventLink = oNewEventVue.draft.sEventLink = undefined ? "box" : "none";

        //             oEventTableVue.allEvents.unshift(oNewEventVue.draft);
        //             map.setCenter(oLatLgn, true);
        //             setMarker(oNewEventVue.draft);

        //         },
        //         onError = function(error) {
        //             alert('Error beim suchen der Adresse!');
        //         }
        //     )
        // },
        formsubmit: function () {

            titleIsInvalid = false;
            oNewEventVue.draft.descIsInvalid = false;
            oNewEventVue.draft.adressIsInvalid = false;
            oNewEventVue.draft.displayError = false;
            oNewEventVue.draft.dateIsInvalid = false;

            //Hier die Bedingungen + Ausführungen, falls nicht alle Felder korrekt oder gar nicht ausgefüllt wurden.
            if (this.draft.sName === "") {
                this.draft.titleIsInvalid = true;
            }
            if (this.draft.sDescription === "") {
                this.draft.descIsInvalid = true;
            }
            if (this.draft.sAdress === "") {
                this.draft.adressIsInvalid = true;
            }
            if (this.draft.EDate === null) {
                this.draft.dateIsInvalid = true;
            }

            if (this.draft.sName === "" ||
                this.draft.sDescription === "" ||
                this.draft.sAdress === "" ||
                this.draft.EDate === null) {
                this.draft.displayError = true;
                return;
            }

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

                    var image =  document.getElementById("imageUpload").files[0];

                    const fd = new FormData();
                    fd.append("event_name", oNewEventVue.draft.sName);
                    fd.append("description", oNewEventVue.draft.sDescription);
                    fd.append("address", oNewEventVue.draft.sAdress);
                    fd.append("lat", dLat);
                    fd.append("lng", dLng);
                    fd.append("start_date", oNewEventVue.draft.EDate[0]);
                    fd.append("end_date", oNewEventVue.draft.EDate[1]);
                    fd.append("event_types", ["5bd1874824c1783894595b68"]);
                    if (oNewEventVue.draft.oSelectedFile) {
                        fd.append("event_picture", image, image.name);
                    }
                    if (oNewEventVue.draft.sEventLink) {
                        fd.append("event_link", oNewEventVue.draft.sEventLink);
                    }

                    axios.post("http://localhost:3000/events", fd).then(res => {
                        alert("Req angekommen");
                        oNewEventVue.draft.status = "unsend";
                        // reset vueinternal data to make possible to add new event
                        oNewEventVue.draft = {
                            sName: "",
                            sDescription: "",
                            sAdress: "",
                            sDate: "",
                            time: "",
                            oLatLng: {},
                            status: "draft",
                            EDate: null,
                            sEventLink: null,
                            iEventId: Math.floor(Math.random() * 99999) + 1,
                            oSelectedFile: "",
                            image: null,
                            titleIsInvalid: false,
                            descIsInvalid: false,
                            adressIsInvalid: false,
                            displayError: false,
                            dateIsInvalid: false
                        };
                        document.getElementById("imageUpload").value = "";
                    }).catch(function (error) {
                        alert("Fehler beim speichern in der Datenbank");
                        console.log(error);
                    });;
                },
                onError = function (error) {
                    alert('Geodaten nicht bekommen. Bitte überprüfen Sie, ob die angegebene Adresse existiert.');
                }
            )
        },
        autocomplete: function autocomplete() {
            getAutocompletion(this.draft.sAdress, document.getElementById("newEventAddress"));
        },
        onFileSelected: function (event) {
            if(event.target.files[0] === undefined){
                this.draft.oSelectedFile = "";
                return;
            }

            this.draft.oSelectedFile = event.target.files[0];
            
            // Reference to the DOM input element
            var input = event.target;
            // Ensure that you have a file before attempting to read it
            if (input.files && input.files[0]) {
                // create a new FileReader to read this image and convert to base64 format
                var reader = new FileReader();
                // Define a callback function to run, when FileReader finishes its job
                reader.onload = (e) => {
                    // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                    // Read image as base64 and set to imageData
                    this.draft.oSelectedFile = e.target.result;
                }
                // Start the reader job - read file as a data url (base64 format)
                reader.readAsDataURL(input.files[0]);
            }
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
            nameIsInvalid: false,
            passwordIsInvalid2: false,
            passwordIsInvalid: false,
            emailIsInvalid: false,
            iRegisterId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
        formsubmit: function () {
            this.draft.emailIsInvalid = false;
            this.draft.password2IsInvalid = false;
            this.draft.passwordIsInvalid = false;
            this.draft.nameIsInvalid = false;
            var onSuccess = function onSuccess() {
                this.cardShown = !this.cardShown;
                oRegisterVue.cardShown = false;
                oNewLoginVue.cardShown = false;
                Reg_Pass_Fehler.style.display = "none";
                Reg_SONS_Fehler.style.display = "none";
                Reg_EMAIL_Fehler.style.display = "none";
            };
            var onFailed = function onFailed() {
                alert(' Fehler beim Login');
            };
            if (this.draft.rUserName === "") {
                this.draft.nameIsInvalid = true;
                Reg_SONS_Fehler.style.display = "inline";
                Reg_Pass_Fehler.style.display = "none";
                Reg_EMAIL_Fehler.style.display = "none";
            }
            if (this.draft.rPassword === "" || this.draft.rPassword2 === "") {
                this.draft.password2IsInvalid = true;
                this.draft.passwordIsInvalid = true;
                Reg_SONS_Fehler.style.display = "inline";
                Reg_Pass_Fehler.style.display = "none";
                Reg_EMAIL_Fehler.style.display = "none";

            }

            if (this.draft.rEmail === "" || document.querySelector('#email').value.includes("@") == false) {
                this.draft.emailIsInvalid = true;
                Reg_EMAIL_Fehler.style.display = "inline";
                Reg_Pass_Fehler.style.display = "none";
                Reg_SONS_Fehler.style.display = "none";
            }
            if (this.draft.rPassword != this.draft.rPassword2) {
                this.draft.password2IsInvalid = true;
                this.draft.passwordIsInvalid = true;
                Reg_Pass_Fehler.style.display = "inline";
                Reg_EMAIL_Fehler.style.display = "none";
                Reg_SONS_Fehler.style.display = "none";

            }


            Reg_Pass_Fehler
            Reg_SONS_Fehler
            Reg_EMAIL_Fehler
            if (this.draft.emailIsInvalid == true || this.draft.nameIsInvalid == true || this.draft.password2IsInvalid == true) {
            }
            else {

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
            }

        }


    }
});

//Register Vue End

//Login Vue
var oNewLoginVue = new Vue({
    el: "#newLoginWrapper",
    data: {
        cardShown: false,
        draft: {
            passwordIsInvalid: false,
            emailIsInvalid: false,
            sUserName: "",
            sPassword: "",
            status: "draft",
            iLoginId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {

        formsubmit: function () {
            logoutmodus = true;
            this.draft.passwordIsInvalid = false;
            this.draft.emailIsInvalid = false;
            if (logoutmodus === true) {

                var suserlogin = "http://localhost:3000/user/login"
                var ajaxRequest = new XMLHttpRequest();
                var onSuccess = function onSuccess() {
                    console.log(this.status);
                    if (this.status === 200) {
                        // save user in global variable
                        loggedInUser = this.response.user;
                        initalFavoriteSetting = true
                        //set favorite events stars (favtoggle)
                        for (var i = 0; i < loggedInUser.saved_events.length; i++) {
                            for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
                                if (oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
                                    console.log(oEventTableVue.allEvents[j].iEventId);
                                    oEventTableVue.favToggle(oEventTableVue.allEvents[j])
                                    break;
                                }
                            }

                        }
                        initalFavoriteSetting = false;
                        AfterLoginFavoriten.style.visibility = "visible";
                        AfterLoginEvent.style.visibility = "visible";
                        document.getElementById('AfterLoginLogin').innerText = "LogOut";
                        newLoginWrapper.style.display = "hidden";
                        oEventTableVue.starVisibility = "visible";
                        LoginFehlerDaten.style.display = "none";

                        //Hier muss die Karte unsichtbar gemacht werden
                        this.cardShown = !this.cardShown;
                        oRegisterVue.cardShown = false;
                        oNewLoginVue.cardShown = false;


                    }
                    else {
                        emailIsInvalid = true;
                        passwordIsInvalid = true;
                        LoginFehlerDaten.style.display = "inline";

                    }
                };
                var onFailed = function onFailed() {
                    alert(' Login fehlgeschlagen');
                    logoutmodus = false;
                };

                if (this.draft.sUserName === "") {
                    this.draft.emailIsInvalid = true;
                    LoginFehlerLeer.style.display = "inline";

                }

                if (this.draft.sPassword === "") {
                    this.draft.passwordIsInvalid = true;
                    LoginFehlerLeer.style.display = "inline";
                }


                if (this.draft.emailIsInvalid == false && this.draft.passwordIsInvalid == false) {
                    LoginFehlerLeer.style.display = "none";
                    LoginFehlerDaten.style.display = "none";
                    ajaxRequest.addEventListener("load", onSuccess);
                    ajaxRequest.addEventListener("error", onFailed);
                    ajaxRequest.responseType = "json";
                    ajaxRequest.open("POST", suserlogin, true);
                    ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                    var suserdata = "email=" + this.draft.sUserName + "&password=" + this.draft.sPassword;
                    // usernameemail = this.draft.iLoginId;
                    ajaxRequest.send(suserdata);
                }
                else {
                    logoutmodus = false;
                }

            }
            else {
                document.getElementById('eingeloggteruser').innerText = "EventFinder";
                AfterLoginFavoriten.style.visibility = "hidden";
                loggedInUser = "";
                AfterLoginEvent.style.visibility = "hidden";
                document.getElementById('AfterLoginLogin').innerText = "LogIn";
                newLoginWrapper.style.display = "visible";
                oEventTableVue.starVisibility = "hidden";
            }
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

function refreshpage() {
    location.reload();
}

function initEverything() {
    setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage
    getAllEvents();
    checkDuplicatePositions(oEventTableVue.allEvents);
}



initEverything();
