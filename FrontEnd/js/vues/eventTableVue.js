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