var oRegisterVue = new Vue({
    el: "#newRegisterWrapper",
    data: {
        cardShown: false,
        draft: {
            rUserName: "",
            rEmail: "",
            rPassword: "",
            rPassword2: "",
            status: "draft",
            iRegisterId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {
        formdraft: function () {
            if (oEventTableVue.currentEvents[0].status != "draft") {
                oEventTableVue.currentEvents.unshift(this.draft)
            }
        },
        formsubmit: function () {
            var onSuccess = function onSuccess() {
                alert('ich glaube es hat geklappt. HTTP CODE ABFANGEN WEIL EVTL HAT ES NED GEKLAPPT LOL');
            };
            var onFailed = function onFailed() {
                alert(' SO NE SCHEISSE');
            };


            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = false;
            oNewLoginVue.cardShown = false;

            var newuser = "http://localhost:3000/user/signup"
            var ajaxRequest = new XMLHttpRequest();

            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";
            ajaxRequest.open("POST", newuser, true);
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var snewuserdata = "name=" + this.draft.rUserName + "&email=" + this.draft.rEmail + "&password=" + this.draft.rPassword;
            console.log(snewuserdata);
            ajaxRequest.send(snewuserdata);
        },

    }
});