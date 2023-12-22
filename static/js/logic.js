
// Create the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Create a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Import the geojson data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Display data
d3.json(geoData).then(function(data) {
    console.log(data)

    // Create geojson layer
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            let markerOptions = {
                radius: feature.properties.mag*5,
                fillColor: markerColors(feature.geometry.coordinates[2]),
                color: "#000000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, markerOptions);
        },

        // Popups
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<strong>Magnitude: </strong>" + feature.properties.mag + "<br><strong>Location: </strong>" +
                feature.properties.place + "<br><strong>Depth: </strong>" + feature.geometry.coordinates[2])
        }
    }).addTo(myMap);

    // Create Marker Colors
    function markerColors(depth) {
        switch(true) {
            case depth > 90:
                return "#8B0000";
            case depth > 70:
                return "#FF0000";
            case depth > 50:
                return "#FF4500";
            case depth > 30:
                return "#FFD700";
            case depth > 10:
                return "#FFFF00";
            default:
                return "#90EE90";
        }
    };

    // Create legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+']
        let colors = ['#90EE90', '#FFFF00', '#FFD700', '#FF4500', '#FF0000', '#8B0000'];

        // Loop to create legend items
        for (i = 0; i < labels.length; i++) {
            div.innerHTML += '<li style="background: ' + colors[i] + '"></li>' 
                + labels[i] + '<br>';
            } 
        return div;
    };

    // Add legend to map
    legend.addTo(myMap);
});

