var oNavigationVue = new Vue({
    el: "#navigation",
    data: {
      horizontalMenueShown: true
    },
    methods: {
      showNewEventCard: function(){
        oNewEventVue.cardShown = !oNewEventVue.cardShown;
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
    this.oStartDate = oEvent.oStartDate;
    this.oEndDate = oEvent.oEndDate;
    this.sEventLink = oEvent.sEventLink;
    this.sTicketLink = oEvent.sTicketLink;
};

// this array should be retrieved from the database, maybe according to location chosen and/or the filter options
var aTestEvents = [
    new oEvent({
       iEventId: 3,
       sName: "Kultursonntag im Museum für moderne Kunst",
       sDescription: "Gemälde, Figuren und Performances. Dies und vieles mehr erwartet Sie und Ihre Familie. Eintritt: 5€.",
       sAdress: "C2 20, 68159 Mannheim"
    }),
    new oEvent({
        iEventId: 2,
        sName: "Elektro Party",
        sDescription:"Lust auf moderne Elektromusik und ein stilvolles Ambiente? Kostenlos vorbeischauen!.",
        sAdress: "Berliner Straße 19a, 68159 Mannheim"
    }),
    oTestEvent1 = new oEvent({
        iEventId: 1,
        sName: "Quatsch Comdey Club",
        sDescription: "Die Live Show. Das Herzstück des Quatsch Comedy Clubs ist die 'Live Show'."
    }),
    new oEvent({
        sName: "PUSH",
    }),
    new oEvent({
        sName: "Neu",
    }),
    new oEvent({
        sName: "More",
    }),
    new oEvent({
        sName: "PUSH",
    }),
    new oEvent({
        sName: "PUSH",
    }),
];

var oEventTableVue = new Vue({
    el: "#eventTable",
    data: {
        currentEvents: aTestEvents,
        selected: "joooo" //id of selected event (to see more info)
    },
    methods: {
        // click on event in list to see more details
        select: function(target){
          // only data with specific Ids can be selected
          if (target.iEventId != undefined){
            this.selected = target.iEventId;
            if(target.sAdress){
              setMarker(target.sAdress,target.sName);
            }
          }
        }
    }
});

var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: "",
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {
        searchPlace: function searchPlace() {
            setCenter(this.sQuery);
        },
        autocomplete: function autocomplete() {
            getAutocompletion(this.sQuery);
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
          date: "",
          time: "",
          status: "draft",
          iEventId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
      formdraft: function(){
        if (oEventTableVue.currentEvents[0].status !="draft"){
          oEventTableVue.currentEvents.unshift(this.draft)
        }
      },
      formsubmit: function(){
        if (oEventTableVue.currentEvents[0].status =="draft"){
          oEventTableVue.currentEvents.shift(); //delete draft in surrent array
        }
        this.draft.status = "unsend";
        var cloneObj = JSON.parse( JSON.stringify( this.draft ) ); // to not pass it by reference
        oEventTableVue.currentEvents.unshift(cloneObj);
        this.cardShown = !this.cardShown;
        this.draft = { // reset vueinternal data to make possible to add new event
          sName: "",
          sDescription: "",
          sAdress: "",
          date: "",
          time: "",
          status: "draft",
          iEventId: Math.floor(Math.random() * 99999) + 1,
        }
      },
    }
});

setCenter(undefined); //Set zoom of map to the last request of the user - works via localstorage
