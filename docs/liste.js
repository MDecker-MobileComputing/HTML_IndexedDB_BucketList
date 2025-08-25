"use strict";


/** Array mit Referenz auf die <input>-Elemente für die Listeneinträge. */
let inputEintragArray = [];

/** Referenz auf <div>-Element zur Anzeige Meldungstext. */
let divMeldung = null;


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

    divMeldung = document.getElementById( "meldung" );

    const formular = document.getElementById( "bucketlistFormular" );
    formular.addEventListener( "submit", onSpeichernButton );

    await ladeListe();

    console.log( "Seite für Liste initialisiert." );
});


/**
 * Zeigt eine Nachricht im Meldungsbereich an.
 *
 * @param {string} nachricht Text, der angezeigt werden soll
 *
 * @param {string} stil Stil der Meldung (z.B. "erfolg", "fehler", "info")
 */
function zeigeNachricht( nachricht, stil ) {

    divMeldung.textContent   = nachricht;
    divMeldung.className     = stil;
    divMeldung.style.display = "block"; // sichtbar schalten

    // Nach 5 Sekunden die Meldung ausblenden
    setTimeout( () => {
        divMeldung.style.display = "none";
    }, 5000 );
}

/**
 * Lädt die Liste der Einträge aus IndexedDB.
 */
async function ladeListe() {

    try {

        const eintraegeVonDb = await holeListe();
        console.log( "Anzahl Einträge aus Datenbank geladen:", eintraegeVonDb.length );

        if ( eintraegeVonDb.length === 0 ) {

            zeigeNachricht( "Es sind keine gespeicherten Einträge vorhanden.", "info" );
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
        zeigeNachricht( "Fehler beim Laden der gespeicherten Einträge.", "fehler" );
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

    zeigeNachricht( "Liste gespeichert", "erfolg" );
}
