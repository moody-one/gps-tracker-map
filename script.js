// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCQ-l1tIgXkcLVSrwIwO-jG4x2U5ZRvpLQ",
    authDomain: "gps-tracker-537d0.firebaseapp.com",
    databaseURL: "https://gps-tracker-537d0-default-rtdb.firebaseio.com",
    projectId: "gps-tracker-537d0",
    storageBucket: "gps-tracker-537d0.firebasestorage.app",
    messagingSenderId: "806063466436",
    appId: "1:806063466436:web:bfc261355ebacd0e2f2691",
    measurementId: "G-807W5N7100"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const map = L.map('map').setView([20.59, 78.96], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = {};
const infoBox = document.getElementById("info");

function updateMap(data) {
    infoBox.innerHTML = "";
    for (const [id, loc] of Object.entries(data)) {
        if (typeof loc === "object" && loc.lat && loc.lon) {
            const { lat, lon, name } = loc;

            // Update or create marker
            if (markers[id]) {
                markers[id].setLatLng([lat, lon]);
            } else {
                markers[id] = L.marker([lat, lon]).addTo(map).bindPopup(name || "Unknown");
            }

            // Update info box
            infoBox.innerHTML += `<div><b>${name || "User"}</b>: 📍 ${lat}, ${lon}</div>`;
        }
    }
}

// Live listener
db.ref("location").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) updateMap(data);
});
