"use strict";


/** Array mit Referenz auf die <input>-Elemente für die Listeneinträge. */
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

    try {

        const eintraegeVonDb = await holeListe();
        console.log( "Anzahl Einträge aus Datenbank geladen:", eintraegeVonDb.length );

        if ( eintraegeVonDb.length === 0 ) {

            alert( "Keine Einträge in der Datenbank gefunden." );
            return;
        }

        for ( let i = 0; i < eintraegeVonDb.length; i++ ) {

            const eintrag = eintraegeVonDb[i];

            const nr = eintrag.nr;
            if ( nr < 1 || nr > inputEintragArray.length ) {

                console.warn( "Ungültige Eintragsnummer in Datenbank gefunden:", eintrag );
                continue;
            }
            inputEintragArray[ eintrag.nummer - 1 ].value = eintrag.text;
        }

    } catch ( fehler ) {

        console.error( "Fehler beim Laden der Liste aus der Datenbank:", fehler );
        alert( "Fehler beim Laden der gespeicherten Einträge." );
    }
}


/**
 * Aktuelle Liste in IndexedDB speichern.
 */
async function onSpeichernButton( event ) {

    event.preventDefault();

    const eintraegeArray = [];

    for ( let i = 0; i < inputEintragArray.length; i++ ) {

        const eintragText = inputEintragArray[i].value.trim();
        if ( eintragText.length > 0 ) {

            const eintragObj = {
                nummer: i + 1,
                text  : eintragText
            };

            eintraegeArray.push( eintragObj );
        }
    }

    await speichereListe( eintraegeArray );
    console.log( `Anzahl gespeicherte Einträge: ${eintraegeArray.length}` );
}
