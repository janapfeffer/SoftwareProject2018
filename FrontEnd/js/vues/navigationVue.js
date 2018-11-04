var oNavigationVue = new Vue({
    el: "#navigation",
    data: {
        horizontalMenueShown: true
    },
    methods: {

        showNewFavoriteCard: function () {
            oNewFavoriteVue.cardShown = !oNewFavoriteeVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
        },

        showNewEventCard: function () {
            oNewEventVue.cardShown = !oNewEventVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoriteeVue.cardShown = false;
        },
        showNewLoginCard: function () {
            oNewLoginVue.cardShown = !oNewLoginVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoriteeVue.cardShown = false;
        },
        showNewRegisterCard: function () {
            oNewRegisterVue.cardShown = !oNewRegisterVue.cardShown;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoriteeVue.cardShown = false;
        },
        showNewDateCard: function () {
            oNewDateVue.cardShown = !oNewDateVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoriteeVue.cardShown = false;
        },
        toggleBigMap: function () {
            document.body.classList.toggle('bigMap');
            map.getViewPort().resize();
            //   oAsideVue.bShown = false;
        }
    }
});
