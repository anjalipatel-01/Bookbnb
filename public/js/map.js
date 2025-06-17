const map = L.map('map').setView([20.5937, 78.9629], 5); // Default: India

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

if (locationString) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;

        map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(map)
          .bindPopup(locationString)
          .openPopup();
      } else {
        console.warn("Location not found.");
      }
    })
    .catch(err => {
      console.error("Geocoding error:", err);
    });
}
