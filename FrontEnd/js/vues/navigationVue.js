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

        showNewEventCard: function () {
            oNewEventVue.cardShown = !oNewEventVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewLoginCard: function () {
            oNewLoginVue.cardShown = !oNewLoginVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewRegisterCard: function () {
            oNewRegisterVue.cardShown = !oNewRegisterVue.cardShown;
            oNewLoginVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        showNewDateCard: function () {
            oNewDateVue.cardShown = !oNewDateVue.cardShown;
            oRegisterVue.cardShown = false;
            oNewEventVue.cardShown = false;
            oNewLoginVue.cardShown = false;
            oNewFavoiteVue.cardShown = false;
        },
        toggleBigMap: function () {
            document.body.classList.toggle('bigMap');
            map.getViewPort().resize();
            //   oAsideVue.bShown = false;
        }
    }
});