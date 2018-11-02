var oNewLoginVue = new Vue({
    el: "#newLoginWrapper",
    data: {
        cardShown: false,
        draft: {
            sUserName: "",
            sPassword: "",
            status: "draft",
            iLoginId: Math.floor(Math.random() * 99999) + 1,
        },
        value7: ''
    },
    methods: {


        formsubmit: function () {

            var suserlogin = "http://localhost:3000/user/login"
            var ajaxRequest = new XMLHttpRequest();


            var onSuccess = function onSuccess() {

                console.log(this.status);
                if (this.status == 200) {
                    alert('Du bist erfolgreich eingeloggt');
                } else {
                    alert('Anmeldung nicht erfolgreich');

                }

            };
            var onFailed = function onFailed() {
                alert(' SO NE SCHEISSE');
            };


            ajaxRequest.addEventListener("load", onSuccess);
            ajaxRequest.addEventListener("error", onFailed);
            ajaxRequest.responseType = "json";
            ajaxRequest.open("POST", suserlogin, true);
            ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            var suserdata = "email=" + this.draft.sUserName + "&password=" + this.draft.sPassword;

            ajaxRequest.send(suserdata);
            console.log(suserdata);

            this.cardShown = !this.cardShown;
        },


        BobMarleyCard: function () {
            this.cardShown = !this.cardShown;
            oRegisterVue.cardShown = true;


        },
    }
});