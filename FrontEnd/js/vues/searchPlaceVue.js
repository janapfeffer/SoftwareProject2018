var oSearchPlaceVue = new Vue({
    el: "#searchPlace",
    data: {
        sQuery: localStorage.getItem("HANSCH"),
        sName: "Event Finder",
        sButtonName: "Suchen"
    },
    methods: {
        //Sucht nach einem Ort
        searchPlace: function searchPlace() {
            if (document.body.classList.contains('landingpage')) {
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