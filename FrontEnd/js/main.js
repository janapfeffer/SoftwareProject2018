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
    this.sCity = oEvent.sCity;
    this.iZip = oEvent.iZip;
    this.sStreet = oEvent.sStreet;
    this.iHouseNumber = oEvent.iHouseNumber;
    this.sAdressAdditional = oEvent.sAdressAdditional;
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
    sDescription: "Gemälde, Figuren und Performances. Dies und vieles mehr erwartet Sie und Ihre Familie. Eintritt: 5€."
    }),
    new oEvent({
        iEventId: 2,
        sName: "Elektro Party",
        sDescription:"Lust auf moderne Elektromusik und ein stilvolles Ambiente? Kostenlos vorbeischauen!."
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
        currentEvents: aTestEvents
    }
});

var osearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: "",
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {
        searchPlace: function searchPlace() {
            geocode(this.sQuery);
        }
    }
})

var oNewEventVue = new Vue({
    el: "#newEventWrapper",
    data: {
        cardShown: false,
        draft: {
          sName: "",
          sDescription: "",
          adress: "",
          date: "",
          time: "",
          status: "draft"
        }
    },
    methods: {
      formdraft: function(){
        oEventTableVue.currentEvents.unshift(this.draft)
      },
      formsubmit: function(){

      },
    }
});
