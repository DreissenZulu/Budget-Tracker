import { openDB } from 'https://unpkg.com/idb?module';

let db;

( async ()=> {
  db = await openDB("budget", 1, {
    upgrade(db) {
      const objectStore = db.createObjectStore("pending", {
        keyPath: "offlineId",
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true 
        });

      console.log( `~ created the db/upgraded it:`, objectStore.name );
    } });
})();

// Function only operates while offline. Saves new transactions offline until the browser goes back online
async function saveOfflineRecord( newTransaction ) {
  const trans = db.transaction("pending", "readwrite");
  const pendingTable = trans.objectStore("pending");
  pendingTable.add( newTransaction );

  await trans.done;

  console.log(`Saving new record offline: ` + JSON.stringify(newTransaction));
}

async function syncOfflineToServer() {

}

function browserOnline() {
  console.log("Browser is online. Writing to database...");
  syncOfflineToServer();
}

function browserOffline() {
  console.log("Browser is offline. Saving locally...");
}

// listen for app coming back online
window.addEventListener("online", browserOnline);
window.addEventListener("offline", browserOffline);

export default saveOfflineRecord;
