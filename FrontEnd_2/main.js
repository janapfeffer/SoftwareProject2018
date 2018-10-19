
main = new Vue({
  el: 'header',
  data: {
      activeIndex: '1',
      activeIndex2: '1'
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
});


var vueMap = new Vue({
    el: '#map',
    data: { 
          searchLocation: ""
      },
    methods: {
        searchPlace: function () {
            alert("searchPlace Methode");
            var searchInput = this.searchLocation;
            localStorage.setItem("HANSCH", ORT);
        }
    }
  });

eventlist = new Vue({
  el: '#eventlist',
  data: {
    shownEvents: [
      {
        title: 'Semestereroeffnungsparty',
        desc: 'Es ist wieder zeit',
        time: 'Heute 17 Uhr',
        place: 'Jungbusch'
      },
      {
        title: 'Ausstellungseroeffnung',
        desc: 'die Agyptische sammlung des Kulturinstituts laed ein',
        time: 'Heute 19 Uhr',
        place: 'Q2'
      }
    ]
  },
  methods: {
  }
});
