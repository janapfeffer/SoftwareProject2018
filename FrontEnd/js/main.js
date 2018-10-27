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

      showNewEventCard: function(){
          oNewEventVue.cardShown = !oNewEventVue.cardShown;
          oRegisterVue.cardShown = false;
          oNewLoginVue.cardShown = false;
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
      toggleBigMap: function(){
          document.body.classList.toggle('bigMap');
          map.getViewPort().resize();
      }
    }
});

var oEvent = function(oEvent){
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
var aTestEvents = [
    new oEvent({
       iEventId: 3,
       sName: "Kultursonntag im Museum für moderne Kunst",
       sDescription: "Gemälde, Figuren und Performances. Dies und vieles mehr erwartet Sie und Ihre Familie. Eintritt: 5€.",
       sAdress: "C2 20, 68159 Mannheim",
       oLatLgn: {
        "lat": 49.4871,
        "lng": 8.46343
      }

    }),
    new oEvent({
        iEventId: 2,
        sName: "Elektro Party",
        sDescription:"Lust auf moderne Elektromusik und ein stilvolles Ambiente? Kostenlos vorbeischauen!.",
        sAdress: "Berliner Straße 19a, 68159 Mannheim",
        oLatLgn: {
            "lat": 49.48712,
            "lng": 8.47826
          }
    }),
    oTestEvent1 = new oEvent({
        iEventId: 1,
        sName: "Autoparty",
        sDescription: "Beschleunigen und co",
        sAdress: "Mannheim Paradeplatz",
        oLatLgn:{
            "lat": 49.48672,
            "lng": 8.46641
          },
        faved: true
    })
];

aTestEvents = aTestEvents.concat(aJsonTestData);



//Vue fuer die Event Tabelle fertig
var oEventTableVue = new Vue({
    el: "#eventTable",
    data: {
        currentEvents: aTestEvents,
        selected: "" //id of selected event (to see more info)
    },
    methods: {

        favToggle: function(target) {
            // target: eventobject wird hinein gereicht von vue for schleife
            Vue.set(target, 'faved', !target.faved)
            // this is the same as:
            // target.faved = !target.faved;
            // but databinding works also if event hasnt property faved set in the beginning
            // console.log(target.faved);
        },

        // click on event in list to see more details
        select: function(target){
          // only data with specific Ids can be selected
          if (target.iEventId != undefined){
            this.selected = target.iEventId;
          }
        },


    }
});


//Vue fuer die Leiste mit Suchfunktion und Filter Button
var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: "",
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {

        // Oeffnet neue Karte fuer den Filter
        showNewDateCard: function () {
            oNewDateVue.cardShown = !oNewDateVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewLoginVue.cardShown = false;

        },
        //Filter Karten Funktion zuende

        //Sucht nach einem Ort
        searchPlace: function searchPlace() {
          if(document.body.classList.contains('landingpage')){
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
          iEventId: Math.floor(Math.random() * 99999) + 1,
          oSelectedFile: null
        },
        value7: ''
    },
    methods: {
      formdraft: function(){
        if (oEventTableVue.currentEvents[0].status !="draft"){
          oEventTableVue.currentEvents.unshift(this.draft)
        }
        setCenter(this.draft.sAdress);
        setVerifyLocationMarker(this.draft.sAdress, this.draft.sName);
      },
      formsubmit: function(){
        if (oEventTableVue.currentEvents[0].status =="draft"){
          oEventTableVue.currentEvents.shift(); //delete draft in current array
        }
        this.draft.status = "unsend";
        var cloneObj = JSON.parse( JSON.stringify( this.draft ) ); // to not pass it by reference
        oEventTableVue.currentEvents.unshift(cloneObj);
          this.cardShown = !this.cardShown;
          oRegisterVue.cardShown = false;
          oNewLoginVue.cardShown = false;
        this.draft = { // reset vueinternal data to make possible to add new event
          sName: "",
          sDescription: "",
          sAdress: "",
          date: "",
          time: "",
          latlng: {},
          status: "draft",
          iEventId: Math.floor(Math.random() * 99999) + 1,
        }
        //https://www.youtube.com/watch?v=VqnJwh6E9ak see this for picture upload

      },
      autocomplete: function autocomplete() {
        getAutocompletion(this.draft.sAdress, document.getElementById("newEventAddress"));
      },
      onFileSelected: function(event){
        this.draft.oSelectedFile = event.target.files[0];
      }
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

            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;

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

function initEverything(){
    setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage
    setMarkers(oEventTableVue.currentEvents);
}

initEverything();
