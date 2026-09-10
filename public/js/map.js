const mapElement = document.getElementById("map");

if (mapElement) {

    const latitude = parseFloat(mapElement.getAttribute("data-lat"));
    const longitude = parseFloat(mapElement.getAttribute("data-lng"));

    const title = mapElement.getAttribute("data-title");

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    const map = L.map("map").setView([latitude, longitude], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const houseIcon = L.divIcon({
    html: "🏠",
    className: "house-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});

const marker = L.marker([latitude, longitude], {
    icon: houseIcon
}).addTo(map);

marker.bindTooltip(`
    <div class="map-tooltip">
        <h4>${title}</h4>
        <p>Exact location provided after booking</p>
    </div>
`, {
    direction: "top",
    offset: [0, -35],
    opacity: 1
});
}