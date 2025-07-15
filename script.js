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

const infoBox = document.getElementById("info");
const ref = firebase.database().ref("location");

const markerColors = [
  'blue', 'red', 'green', 'orange', 'yellow',
  'violet', 'grey', 'black', 'gold', 'darkgreen',
  'darkred', 'lightblue'
];

const iconBaseURL = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/";

ref.on("value", (snapshot) => {
  const data = snapshot.val();
  infoBox.innerHTML = "";

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  let colorIndex = 0;

  for (const id in data) {
    const user = data[id];
    const lat = user.lat;
    const lon = user.lon;
    const name = user.name || "Unknown";

    const color = markerColors[colorIndex % markerColors.length];
    colorIndex++;

    const customIcon = L.icon({
      iconUrl: `${iconBaseURL}marker-icon-${color}.png`,
      shadowUrl: `${iconBaseURL}marker-shadow.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(`${name}<br>📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}`);

    infoBox.innerHTML += `
      <div style="margin-bottom: 12px; color: ${color};">
        <strong>${name}</strong><br>📍 ${lat.toFixed(4)}, ${lon.toFixed(4)}
      </div>
    `;
  }
});
