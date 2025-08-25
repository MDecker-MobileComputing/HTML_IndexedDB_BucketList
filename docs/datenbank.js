"use strict";

const DATENBANK_NAME        = "BucketListDB";
const STORE_LISTENEINTRAEGE = "listeneintraege";


/**
 * Verbindungsobjekt der Datenbank holen (Datenbank wird ggf. erstellt).
 *
 * @returns {Promise<IDBDatabase>} Promise auf Verbindungsobjekt der Datenbank
 */
function holeDatenbankVerbindung() {

    return new Promise( (resolve, reject) => {

        const idbOpenRequest = window.indexedDB.open( DATENBANK_NAME, 1 ); // Schema-Version

        idbOpenRequest.onsuccess = (event) => {

            const db = event.target.result;
            console.log( `Datenbank \"${DATENBANK_NAME}\" erfolgreich geöffnet.` );
            return resolve(db);
        };

        idbOpenRequest.onerror = (event) => {

            const fehlerObjekt = event.target.error;
            console.error( `Fehler beim Öffnen der Datenbank \"${DATENBANK_NAME}\":`, fehlerObjekt );
            return reject( fehlerObjekt );
        };

        idbOpenRequest.onupgradeneeded = (event) => {

            console.log( `Datenbank \"${DATENBANK_NAME}\" wird erstellt/aktualisiert.` );
            const db = event.target.result;

            // Object Store erstellen (falls noch nicht vorhanden)
            if ( !db.objectStoreNames.contains( STORE_LISTENEINTRAEGE ) ) {

                db.createObjectStore( STORE_LISTENEINTRAEGE, {
                    keyPath: "id",
                    autoIncrement: true
                });
                console.log( `Object Store \"${STORE_LISTENEINTRAEGE}\" erstellt.` );
            }
        };
    });
};


/**
 * Alle gespeicherten Einträge aus der Datenbank holen.
 *
 * @returns {Promise<Array>} Promise mit Array aller gespeicherten Einträge
 */
async function holeListe() {

    const datenbank = await holeDatenbankVerbindung();

    return new Promise( (resolve,reject) => {

        const tx    = datenbank.transaction( STORE_LISTENEINTRAEGE, "readonly" );
        const store = tx.objectStore( STORE_LISTENEINTRAEGE );

        const request = store.getAll();

        request.onsuccess = () => { resolve( request.result ); } // request.result ist immer Array, evtl. aber mit 0 Elementen
        request.onerror   = () => { reject(  request.error  ); }
    });

}
