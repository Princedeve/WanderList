const mapElement = document.getElementById("map");

if (mapElement) {

    const latitude = parseFloat(mapElement.getAttribute("data-lat"));
    const longitude = parseFloat(mapElement.getAttribute("data-lng"));

    const title = mapElement.getAttribute("data-title");
    const location = mapElement.getAttribute("data-location");

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    const map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`<b>${title}</b><br>${location}`)
        .openPopup();
}