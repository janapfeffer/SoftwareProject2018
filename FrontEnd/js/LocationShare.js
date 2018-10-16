// JavaScript source code
function alertInputValue() {
    var ORT = document.getElementById('s_place').value;
   // alert(ORT);
    //HANSCH beinhaltet immer die letzte Eingabe des Feldes also den Ort nach dem gesucht wurde 
    localStorage.setItem("HANSCH", ORT);


    // HIER KOMMT DANN DIE SUCHE DER DATENBANK REIN
}