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
            oNewEventVue.cardShown = !oNewEventVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
        },

        showNewFavoriteCard: function () {
            favoritegeklickt = !favoritegeklickt;
            if (favoritegeklickt === true) {
                document.getElementById('h2events').innerText = "Favoriten";
                document.getElementById('AfterLoginFavoriten').innerText = "Events";
                getFavorites(loggedInUser._id);
               }
            else {
                document.getElementById('h2events').innerText = "Events";
                document.getElementById('AfterLoginFavoriten').innerText = "Favoriten";
                getAllEvents();
            }
        },

        showNewLoginCard: function () {
            oNewLoginVue.cardShown = !oNewLoginVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
        },
        showNewRegisterCard: function () {
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
  const GETFAVORITES_URL = "http://localhost:3000/user/" + user_id + "/events";
  var ajaxRequest = new XMLHttpRequest();

  var onSuccess = function onSuccess() {

      var apievents = this.response.saved_events;
      oEventTableVue.allEvents = apievents.map(apievent => {
          return {
              iEventId: apievent._id,
              aRatings: apievent.ratings,
              iCurrentRating: apievent.current_rating,
              sName: apievent.event_name,
              sDescription: apievent.description,
              sAdress: apievent.address,
              oStartDate: apievent.start_date.split("T")[0],
              oStartTime: apievent.start_date.split("T")[1].substring(0,5),
              oEndDate: apievent.end_date,
              sEventLink: apievent.event_link,
              sTicketLink: apievent.ticket_link,
              oLatLgn: {lat: apievent.lat, lng: apievent.lng},
              oImage: "../Backend/" + apievent.event_picture.replace(/\\/g,"/")
          };
      });
      setMarkers(oEventTableVue.allEvents);

      //set stars
      initalFavoriteSetting = true;
      for(var z = 0; z < oEventTableVue.allEvents.length; z++){
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

function getAllEvents() {
    var GETALLEVENTS_URL = 'http://localhost:3000/events';
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
                oStartDate: apievent.start_date.split("T")[0],
                oStartTime: apievent.start_date.split("T")[1].substring(0,5),
                oEndDate: apievent.end_date,
                sEventLink: apievent.event_link,
                sTicketLink: apievent.ticket_link,
                oLatLgn: {lat: apievent.lat, lng: apievent.lng},
                oImage: "../Backend/" + apievent.event_picture.replace(/\\/g,"/")
            };
        });
        setMarkers(oEventTableVue.allEvents);
        if (loggedInUser != ""){
          //set stars
          initalFavoriteSetting = true;
          for (var i = 0; i < loggedInUser.saved_events.length; i++) {
            for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
              if(oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
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
        commentList: function () {
          return this.allEvents.filter(function(value) {
            return value.iEventId === this.selected;
          })[0];
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
                loggedInUser.saved_events = loggedInUser.saved_events.filter(function(value, index, arr){
                  return value != target.iEventId;
                });
              } else { // save _id of target in saved_events of user
                loggedInUser.saved_events.push(target.iEvent);
                requestURL = requestURL + "saveEvent";
              }
              var ajaxRequest = new XMLHttpRequest();

              var onSuccess = function onSuccess(){
                console.log("success: " + this.status);
                if (this.status == 200){
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

            alert("Danke für dein Kommentar. Nachdem es verifiziert wurde, kannst du es hier sehen.");
            var ajaxRequest = new XMLHttpRequest();
            var comment = document.querySelector("#idComment").value;

            var onSuccess = function onSuccess(){
              console.log("toll");
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

        },

        select: function (target) {
            // only data with specific Ids can be selected
            if (target.iEventId != undefined) {
                this.selected = target.iEventId;
                ausgewaehlt = target;
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
        },
        //Offnet bzw macht Popup moeglich
        KommentarGemacht: function (id, name, beschreibung, comments) {
            kommi = true;
            if (loggedInUser != "") {

                if (kommi === true) {
                    document.getElementById('gibhier').innerText = " Gib hier dein Kommentar ab " + loggedInUser.name +"!";
                    // document.getElementById('lol').innerText = loggedInUser.name;
                    var dialog = document.querySelector('dialog');
                    document.getElementById('kommiüberschrift').innerText = name;
                    document.getElementById('eventidkommentare2').innerText = "Hier findest du Kommentare und Bewertungen zu diesem Event ";
                    document.getElementById('eventidkommentare').innerText = beschreibung;

                    // get, whether the currently logged in user has already rated the event
                    var selected_event = oEventTableVue.allEvents.find(obj => {
                      return obj.iEventId == oEventTableVue.selected
                    });
                    var loggedInUser_rating = selected_event.aRatings.find(obj => {
                      return obj.user_id == loggedInUser._id
                    })

                    if(loggedInUser_rating){ //set rating buttons
                      if(loggedInUser_rating.rating == -1){
                        document.getElementById('haha').style.color = "red"
                        document.getElementById('idThumbUp').style.color = "grey"
                      } else {
                        document.getElementById('idThumbUp').style.color = "green"
                        document.getElementById('haha').style.color = "grey"
                      }
                    } else {
                      document.getElementById('idThumbUp').style.color = "grey"
                      document.getElementById('haha').style.color = "grey"
                    }
                    // set current_rating
                    i = selected_event.iCurrentRating;
                    document.getElementById('bewertungsdurchschnitt').innerText = "Durchschnittliche Bewertung: " + selected_event.iCurrentRating;
                    //add comments to list
                    var list = document.getElementById("commentTable");
                    while (list.firstChild) {
                    list.removeChild(list.firstChild);
}
                    for (var r = 0; r < comments.length; r++){
                      var node = document.createElement("LI");                 // Create a <li> node

                      var span = document.createElement("SPAN");
                      span.className = "mdl-list__item-primary-content";
                      span = document.createElement("SPAN");
                      var i = document.createElement("I");
                      i.className = "material-icons mdl-list__item-avatar";
                      i.innerHTML = "person";
                        var comment = document.createElement("SPAN");
                        comment = document.createElement("SPAN");
                      comment.innerHTML = comments[r].comment;         // Create a text node
                        var user = document.createElement("SPAN");
                        user = document.createElement("SPAN");
                      user.innerHTML = comments[r].username;
                      user.className = "mdl-list__item-text-body";

                      span.appendChild(i);
                      span.appendChild(user);
                      span.appendChild(comment);
                        node.appendChild(span);

                        // Append the text to <li>
                      document.getElementById("commentTable").appendChild(node);     // Append <li> to <ul> with id="myList"
                    }
                    dialog.showModal();
                }
                dialog.querySelector('.close').addEventListener('click', function () {
                    dialog.close();
                    getAllEvents();
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


//Vue fuer die Leiste mit Suchfunktion und Filter Button
var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: localStorage.getItem("HANSCH"),
        dDate: null,
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {
        //Sucht nach einem Ort
        searchPlace: function searchPlace() {
            if (document.body.classList.contains('landingpage')) {

                AfterLoginLogin.style.visibility = "visible";
                BigMap.style.visibility = "visible";
                document.body.classList.remove('landingpage');
                document.querySelector("#searchPlace").vanillaTilt.destroy()
                map.getViewPort().resize();
                AfterLoginLogin.style.visibility = "visible";
                BigMap.style.visibility = "visible";
                document.getElementById("idSearchBar").childNodes[2].removeAttribute("hidden");
            }
            //filter for start_date and end_date
            if(this.dDate){
              var GETFILTEREDEVENTS_URL = 'http://localhost:3000/events/filtered';
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
                          oStartDate: apievent.start_date.split("T")[0],
                          oStartTime: apievent.start_date.split("T")[1].substring(0,5),
                          oEndDate: apievent.end_date,
                          sEventLink: apievent.event_link,
                          sTicketLink: apievent.ticket_link,
                          oLatLgn: {lat: apievent.lat, lng: apievent.lng},
                          oImage: "../Backend/" + apievent.event_picture.replace(/\\/g,"/")
                      };
                  });
                  setMarkers(oEventTableVue.allEvents);
                  if (loggedInUser != ""){
                    //set stars
                    initalFavoriteSetting = true;
                    for (var i = 0; i < loggedInUser.saved_events.length; i++) {
                      for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
                        if(oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
                          console.log(oEventTableVue.allEvents[j].iEventId);
                          oEventTableVue.favToggle(oEventTableVue.allEvents[j])
                          break;
                        }
                      }
                    }
                    initalFavoriteSetting = false;
                  }
                  //change center of map and filter for location
                  setCenter(this.sQuery);
              };

              var onFailed = function onFailed() {
                  alert('Die Eventliste konnte nicht nach Datum gefiltert werden!');
                  //change center of map and filter for location
                  setCenter(this.sQuery);
              };
              // Attach the event listeners to the XMLHttpRequest object
              ajaxRequest.addEventListener("load", onSuccess);
              ajaxRequest.addEventListener("error", onFailed);
              ajaxRequest.responseType = "json";

              ajaxRequest.open('GET', GETFILTEREDEVENTS_URL);
              ajaxRequest.setRequestHeader("filter_start_date", this.dDate[0].toString());
              ajaxRequest.setRequestHeader("filter_end_date", this.dDate[1].toString());

              ajaxRequest.send();
            } else {
              //change center of map and filter for location
              getAllEvents();
              setMarkers(oEventTableVue.allEvents);
              setCenter(this.sQuery);
            }


        },
        //AutoComplet Funktion der Suchleiste
        autocomplete: function autocomplete() {
            getAutocompletion(this.sQuery, document.getElementById("searchInput"));
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
            iEventId: Math.floor(Math.random() * 99999) + 1,
            oSelectedFile: null,
            image: null
        },
        value7: ''
    },
    methods: {
        formdraft: function () {
            // var geocoder = platform.getGeocodingService(),
            //     geocodingParameters = {
            //         searchText: oNewEventVue.draft.sAdress,
            //         jsonattributes: 1
            //     };
            // geocoder.geocode(
            //     geocodingParameters,
            //     onSuccess = function onSuccess(result) {

            //         var dLat = result.response.view[0].result[0].location.displayPosition.latitude;
            //         var dLng = result.response.view[0].result[0].location.displayPosition.longitude;
            //         var oLatLgn = { lat: dLat, lng: dLng }
            //         oNewEventVue.draft.oLatLng = oLatLgn;

            //         oEventTableVue.allEvents.unshift(oNewEventVue.draft);
            //         map.setCenter(oLatLgn, true);
            //         setMarker(oNewEventVue.draft);

            //     },
            //     onError = function(error) {
            //         alert('Error beim suchen der Adresse!');
            //     }
            // )
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

                    const fd = new FormData();
                    fd.append("event_name", oNewEventVue.draft.sName);
                    fd.append("description", oNewEventVue.draft.sDescription);
                    fd.append("address", oNewEventVue.draft.sAdress);
                    fd.append("lat", dLat);
                    fd.append("lng", dLng);
                    fd.append("start_date", oNewEventVue.draft.EDate[0]);
                    fd.append("end_date", oNewEventVue.draft.EDate[1]);
                    fd.append("event_types", ["5bd1874824c1783894595b68"]);
                    fd.append("event_picture", oNewEventVue.draft.oSelectedFile, oNewEventVue.draft.oSelectedFile.name);

                    // //file convert + append
                    // var ImageURL = oNewEventVue.draft.image;
                    // // Split the base64 string in data and contentType
                    // var block = ImageURL.split(";");
                    // // Get the content type of the image
                    // var contentType = block[0].split(":")[1];// In this case "image/gif"
                    // // get the real base64 content of the file
                    // var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
                    // // Convert it to a blob to upload
                    // var blob = b64toBlob(realData, contentType);
                    // // fd.append('event_picture', blob, "");

                    axios.post("http://localhost:3000/events", fd).then(res => {
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
                    }).catch(function (error) {
                        console.log(error);
                    });;
                },
                onError = function (error) {
                    alert('Geodaten nicht bekommen!');
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
            if (document.querySelector('#email').value.includes("@") == true) {
                if (document.querySelector('#password2').value != "" && document.querySelector('#password1').value != "" &&
                    document.querySelector('#Username').value != "" && document.querySelector('#email').value != "") {
                    if (document.querySelector("#password2").value == document.querySelector("#password1").value) {
                        var onSuccess = function onSuccess() {
                            alert('ich glaube es hat geklappt. HTTP CODE ABFANGEN WEIL EVTL HAT ES NED GEKLAPPT LOL');
                            this.cardShown = !this.cardShown;
                            oRegisterVue.cardShown = false;
                            oNewLoginVue.cardShown = false;
                            Reg_Pass_Fehler.style.display = "none";
                            Reg_SONS_Fehler.style.display = "none";
                            Reg_EMAIL_Fehler.style.display = "none";
                        };
                        var onFailed = function onFailed() {
                            alert(' SO NE SCHEISSE');
                        };
                    }
                    else {
                        Reg_Pass_Fehler.style.display = "block";
                        Reg_EMAIL_Fehler.style.display = "none";
                        Reg_SONS_Fehler.style.display = "none";
                    }
                }
                else {
                    Reg_SONS_Fehler.style.display = "block";
                    Reg_Pass_Fehler.style.display = "none";
                    Reg_EMAIL_Fehler.style.display = "none";
                }
            }
            else {
                Reg_EMAIL_Fehler.style.display = "block";
                Reg_Pass_Fehler.style.display = "none";
                Reg_SONS_Fehler.style.display = "none";
            }


            Reg_Pass_Fehler
            Reg_SONS_Fehler
            Reg_EMAIL_Fehler



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
                if (this.status === 200) {
                  // save user in global variable
                  loggedInUser = this.response.user;
                  initalFavoriteSetting = true
                  //set favorite events stars (favtoggle)
                  for (var i = 0; i < loggedInUser.saved_events.length; i++) {
                    for (var j = 0; j < oEventTableVue.allEvents.length; j++) {
                      if(oEventTableVue.allEvents[j].iEventId === loggedInUser.saved_events[i]) {
                        console.log(oEventTableVue.allEvents[j].iEventId);
                        oEventTableVue.favToggle(oEventTableVue.allEvents[j])
                        break;
                      }
                    }
                  }
                  initalFavoriteSetting = false;

                    alert('Willkommen ' + loggedInUser.name);
                    document.getElementById('eingeloggteruser').innerText = loggedInUser.name+"s EventFinder";
                    AfterLoginFavoriten.style.visibility = "visible";
                    AfterLoginEvent.style.visibility = "visible";
                    AfterLoginLogin.style.display = "none";
                    newLoginWrapper.style.display = "hidden";

                    oEventTableVue.starVisibility = "visible";

                    //Hier muss die Karte unsichtbar gemacht werden
                    this.cardShown = !this.cardShown;
                    oRegisterVue.cardShown = false;
                    oNewLoginVue.cardShown = false;


                } else {
                    if (document.querySelector("#Login_username").value == "" || document.querySelector("#Login_password").value == "") {

                        LoginFehlerLeer.style.display = "inline";
                    }
                    else {
                        LoginFehlerDaten.style.display = "inline";
                    }


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
            // usernameemail = this.draft.iLoginId;
            ajaxRequest.send(suserdata);

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

function initEverything() {
    setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage
    getAllEvents();
    checkDuplicatePositions(oEventTableVue.allEvents);

    // var datepicker = document.createElement("el-date-picker");
    // datepicker.id = "idDatePicker";
    // datepicker.type = "datetimerange";
    // datepicker.align = "right";
    // // datepicker.start-placeholder = "Start Datum";
    // // datepicker.end-placeholder = "End Datum";
    // document.getElementById("idSearchBar").appendChild(datepicker);
}



initEverything();
