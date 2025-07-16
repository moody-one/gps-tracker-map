const firebaseConfig = {
  apiKey: "AIzaSyCQ-l1tIgXkcLVSrwIwO-jG4x2U5ZRvpLQ",
  authDomain: "gps-tracker-537d0.firebaseapp.com",
  databaseURL: "https://gps-tracker-537d0-default-rtdb.firebaseio.com",
  projectId: "gps-tracker-537d0",
  storageBucket: "gps-tracker-537d0.appspot.com",
  messagingSenderId: "806063466436",
  appId: "1:806063466436:web:bfc261355ebacd0e2f2691"
};

firebase.initializeApp(firebaseConfig);

const map = L.map('map').setView([20.59, 78.96], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const ref = firebase.database().ref("location");
const infoBox = document.getElementById("info");
const sosPopup = document.getElementById("sos-popup");
const ignoreBtn = document.getElementById("ignore-btn");
const beep = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

let sosActive = false;

ref.on("value", (snapshot) => {
  const data = snapshot.val();
  infoBox.innerHTML = "";
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  for (const id in data) {
    const user = data[id];
    const lat = user.lat;
    const lon = user.lon;
    const name = user.name || "Unknown";
    const sos = user.sos === true;

    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`${name}<br>📍 ${lat}, ${lon}`);
    infoBox.innerHTML += `<div style="margin-bottom: 8px;"><b>${name}</b><br>📍 ${lat}, ${lon}</div>`;

    if (sos && !sosActive) {
      sosPopup.style.display = "flex";
      sosActive = true;
      beep.loop = true;
      beep.play();
    }
  }
});

ignoreBtn.onclick = () => {
  sosPopup.style.display = "none";
  beep.pause();
  beep.currentTime = 0;
  sosActive = false;
};
