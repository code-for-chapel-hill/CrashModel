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

function addPointsFromChapelHillAPI(
  url,
  icon,
  point_key,
  useClusterGroup,
  trafficSignalUrl
) {
  $.getJSON(url, function(result) {
    var markers = useClusterGroup ? L.markerClusterGroup() : [];
    var markersCopy = [];
    for (var i = 0; i < result.records.length; i++) {
      if (typeof result.records[i].geometry == "undefined") {
        continue;
      }
      if (trafficSignalUrl) {
        var point = result.records[i].geometry.coordinates;
        var temp = point.slice();
        point[0] = temp[1];
        point[1] = temp[0];
      } else var point = result.records[i].fields[point_key];
      var marker = L.marker(point, { icon: icon });
      if (!useClusterGroup) marker.addTo(mymap);
      if (useClusterGroup) markers.addLayer(marker);
      markersCopy.push(marker);
    }
    if (useClusterGroup) mymap.addLayer(markers);
    var group = new L.featureGroup(markersCopy);
    // mymap.fitBounds(group.getBounds());
  });
}

function getPointsNonAsync(url, point_key, trafficSignalUrl) {
  points = [];
  $.ajax({
    url: url,
    dataType: "json",
    async: false,
    success: function(result) {
      for (var i = 0; i < result.records.length; i++) {
        if (typeof result.records[i].geometry == "undefined") {
          continue;
        }
        if (trafficSignalUrl) {
          var point = result.records[i].geometry.coordinates;
          var temp = point.slice();
          point[0] = temp[1];
          point[1] = temp[0];
        } else {
          var point = result.records[i].fields[point_key];
        }
        points.push(point);
      }
    }
  });
  return points;
}

function getTrafficSignalScores(
  trafficSignalPoints,
  pedCrashPoints,
  bikeCrashPoints
) {
  var trafficSignalScores = [];
  for (var i = 0; i < trafficSignalPoints.length; i++) {
    bikeCrashCount = getCrashesWithinMilesOfTrafficSignal(
      trafficSignalPoints[i],
      0.2,
      bikeCrashPoints
    );
    pedCrashCount = getCrashesWithinMilesOfTrafficSignal(
      trafficSignalPoints[i],
      0.2,
      pedCrashPoints
    );
    trafficSignalScores.push(bikeCrashCount + pedCrashCount);
  }
  return trafficSignalScores;
}

function trafficSignalComparisionFunction(entry1, entry2) {
  var score1 = entry1[1];
  var score2 = entry2[1];
  return score2 - score1;
}

function zip(arr1, arr2) {
  var newArr = [];
  for (var i = 0; i < arr1.length; i++) {
    newArr.push([arr1[i], arr2[i]]);
  }
  return newArr;
}

function zoomToLatLong(lat, long) {
  mymap.setView([lat, long], 18);
}

function getSortedTrafficSignalScores(
  urlTrafficSignals,
  urlPedCrashes,
  urlBikeCrashes
) {
  trafficSignalPoints = getPointsNonAsync(urlTrafficSignals, "geo_point", true);
  pedCrashPoints = getPointsNonAsync(urlPedCrashes, "geo_point_2d", false);
  bikeCrashPoints = getPointsNonAsync(urlBikeCrashes, "geo_point_2d", false);
  trafficSignalScores = getTrafficSignalScores(
    trafficSignalPoints,
    pedCrashPoints,
    bikeCrashPoints
  );
  trafficSignalPointsAndScores = zip(trafficSignalPoints, trafficSignalScores);
  trafficSignalPointsAndScores = trafficSignalPointsAndScores.sort(
    trafficSignalComparisionFunction
  );
  return trafficSignalPointsAndScores;
}

function addTrafficSignalCircles(trafficSignalPointsAndScores, numToDisplay) {
  var markers = [];
  for (var i = 0; i < numToDisplay; i++) {
    point = trafficSignalPointsAndScores[i][0];
    score = trafficSignalPointsAndScores[i][1];
    var marker = L.marker(point);
    var circle = L.circle(point, {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: score * 10
    }).addTo(mymap);
    markers.push(marker);
  }
  var group = new L.featureGroup(markers);
  mymap.fitBounds(group.getBounds());
}

function renderMap() {
  if (mymap) mymap.remove();
  mymap = L.map("mapid").setView([35.9132, -79.0558], 13);
  addOpenStreetMapData();

  if (showTrafficSignals) {
    var trafficSignalIcon = getIconFromImageUrl("img/traffic-light-256.png");
    addPointsFromChapelHillAPI(
      "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=traffic-signal-location-list&rows=1000",
      trafficSignalIcon,
      "geo_point",
      false,
      true
    );
  }

  trafficSignalScores = getSortedTrafficSignalScores(
    "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=traffic-signal-location-list&rows=1000",
    "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=bicycle-crash-data-chapel-hill-region&rows=1000",
    "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=pedestrian-crashes-chapel-hill-region&rows=1000"
  );

  if (!trafficLocationsAdded) {
    for (var i = 0; i < trafficSignalScores.length; i++) {
      var coords = trafficSignalScores[i];
      var roadName = getRoadNameFromLatLong(coords[0][0], coords[0][1]);
      var lat = coords[0][0];
      var long = coords[0][1];
      $("#traffic_locations").append(
        '<li class="card-link-sidebar"><strong>' +
          (i + 1) +
          ':</strong> <a href="#" onclick="zoomToLatLong(' +
          lat +
          "," +
          long +
          ');" class="card-link-sidebar">' +
          roadName +
          "</a></li>"
      );
    }
    trafficLocationsAdded = true;
  }
  if (showRedCircles) {
    addTrafficSignalCircles(trafficSignalScores, trafficSignalScores.length);
  }

  if (showBikeCrashes) {
    var bikeCrashIconImageUrl = "img/map-marker-2-xxl.png";
    var bikeCrashAPIUrl =
      "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=bicycle-crash-data-chapel-hill-region&rows=1000";
    var crashIcon = getIconFromImageUrl(bikeCrashIconImageUrl);
    addPointsFromChapelHillAPI(
      bikeCrashAPIUrl,
      crashIcon,
      "geo_point_2d",
      true,
      false
    );
  }

  if (showPedCrashes) {
    var pedCrashIconImageUrl = "img/map-marker-2-xxl 2.png";
    var pedCrashAPIUrl =
      "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=pedestrian-crashes-chapel-hill-region&rows=1000";
    var crashIcon = getIconFromImageUrl(pedCrashIconImageUrl);
    addPointsFromChapelHillAPI(
      pedCrashAPIUrl,
      crashIcon,
      "geo_point_2d",
      true,
      false
    );
  }
}

// Popup
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(mymap);
}
/* Also needs
mymap.on('click', onMapClick);
*/
