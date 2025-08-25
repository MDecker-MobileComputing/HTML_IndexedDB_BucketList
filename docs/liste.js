"use strict";

let inputEintragArray = [];


/**
 * Event-Handler, der aufgerufen wird, wenn die Webseite geladen wurde.
 */
window.addEventListener( "load", async function () {

    inputEintragArray = [
        document.getElementById( "eintrag1" ),
        document.getElementById( "eintrag2" ),
        document.getElementById( "eintrag3" ),
        document.getElementById( "eintrag4" ),
        document.getElementById( "eintrag5" )
    ];

    const formular = document.getElementById( "bucketlistFormular" );
    formular.addEventListener( "submit", onSpeichernButton );

    await ladeListe();

    console.log( "Seite für Liste initialisiert." );
});


/**
 * Lädt die Liste der Einträge aus IndexedDB.
 */
async function ladeListe() {

}


/**
 * Aktuelle Liste in IndexedDB speichern.
 */
async function onSpeichernButton() {

}
