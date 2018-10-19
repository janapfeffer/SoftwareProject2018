
var example1 = new Vue({
    el: '#example-1',
    data: {
      items: [
        { message: 'Foo' },
        { message: 'Bar' }
      ]
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
    this.sTicketLink = oEvent.sTicketLink

};

var oTestEvent1 = new oEvent({
    iEventId: 1,
    sName: "Quatsch Comdey Club",
    sDescription: "Die Live Show. Das Herzstück des Quatsch Comedy Clubs ist die 'Live Show'."
});

var oTestEvent2 = new oEvent({
    iEventId: 2,
    sName: "Elektro Party",
    sDescription:"Lust auf moderne Elektromusik und ein stilvolles Ambiente? Kostenlos vorbeischauen!." 
});

var oTestEvent3 = new oEvent({
    iEventId: 3,
    sName: "Kultursonntag im Museum für moderne Kunst",
    sDescription: "Gemälde, Figuren und Performances. Dies und vieles mehr erwartet Sie und Ihre Familie. Eintritt: 5€."
});

var aTestEvents = [oTestEvent1, oTestEvent2, oTestEvent3];

var oEventTableVue = new Vue({
    el: "#eventTable",
    data: {
        aTestEvents: aTestEvents
    }
});