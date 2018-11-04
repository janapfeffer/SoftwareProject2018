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
                        event_picture: oNewEventVue.draft.image
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
