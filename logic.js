var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
maxZoom: 18,
id: "mapbox.streets",
accessToken: API_KEY
}).addTo(myMap);

// var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, function(response) {
    console.log(response);

    var locationArr = response.features;

    for (var i = 0; i < locationArr.length; i++) {
        var location = response.features[i].geometry.coordinates;
        var magnitude = response.features[i].properties.mag;
        var id = response.features[i].properties.ids;
        var place = response.features[i].properties.place;

        var color = "";
        if (magnitude > 5) {
            color = "#FF0000";
            radius = magnitude * 50000;
        }
        else if (magnitude > 4) {
            color = "#FFFF00";
            radius = magnitude * 40000;
        }
        else if (magnitude > 3) {
            color = "#FFFF00";
            radius = magnitude * 35000
        }
        else if (magnitude > 2) {
            color = "#7FFF00";
            radius = magnitude * 30000;
        }
        else {
            color = "#00FF00";
            radius = magnitude * 30000;
        }

        L.circle(location, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // radius: magnitude * 35000
            radius: radius
        }).bindPopup(`<center><h1> ${magnitude} Mag Earthquake</h1></center><ul><li>Location: ${place}</li><li>Coordinates: ${location}</li><li>Unique ID: ${id}</li></ul>`).addTo(myMap);
    }

    function getColor(d) {
        return d > 5 ? "#FF0000" :
        d > 4 ? "#FFFF00" :
        d > 3 ? "#FFFF00" :
        d > 2 ? "#7FFF00" :
        "#00FF00";
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
});