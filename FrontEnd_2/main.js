var vueApp = new Vue({
  el: 'header',
  data: { activeIndex: '1',
        activeIndex2: '1',
        searchLocation: ""
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