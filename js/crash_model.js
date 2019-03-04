// GLOBAL VARIABLES
var mymap = null;

function startApp() {
  setTimeout(function() {
    $("#loader").fadeOut();
  }, 2500);
  renderMap();
}

function getIconFromImageUrl(imageUrl) {
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [20, 20]
  });
}

function addOpenStreetMapData() {
  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYnNocmVzdGhhIiwiYSI6ImNqZjhpenY0bTI3azAzM2xub2I1MjdicHIifQ.Dsgfne2MuQyz9gocq7A8NA",
    {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: "your.mapbox.access.token"
    }
  ).addTo(mymap);
}

function addPointsFromChapelHillAPI(url, icon, useGeoPoint, useClusterGroup) {
  $.getJSON(url, function(result) {
    var markers = useClusterGroup ? L.markerClusterGroup() : [];
    var markersCopy = [];
    $.each(result.records, function(i, field) {
      var record = result.records[i].fields;
      var point = useGeoPoint ? record.geo_point : record.geo_point_2d;
      var marker = L.marker(point, { icon: icon });
      if (!useClusterGroup) marker.addTo(mymap);
      if (useClusterGroup) markers.addLayer(marker);
      markersCopy.push(marker);
    });
    if (useClusterGroup) mymap.addLayer(markers);
    var group = new L.featureGroup(markersCopy);
    mymap.fitBounds(group.getBounds());
  });
}

function renderMap() {
  mymap = L.map("mapid").setView([51.505, -0.09], 13);
  addOpenStreetMapData();

  var trafficSignalIcon = getIconFromImageUrl(
    "https://cdn4.iconfinder.com/data/icons/logistics-and-delivery-vol-3/64/traffic-light-256.png"
  );
  var trafficSignalMarkers = addPointsFromChapelHillAPI(
    "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=traffic-signals-in-chapel-hill&rows=1000",
    trafficSignalIcon,
    true,
    false
  );
}

startApp();
