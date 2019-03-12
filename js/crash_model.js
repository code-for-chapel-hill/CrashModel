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

function addPointsFromChapelHillAPI(url, icon, point_key, useClusterGroup) {
  $.getJSON(url, function(result) {
    var markers = useClusterGroup ? L.markerClusterGroup() : [];
    var markersCopy = [];
    $.each(result.records, function(i, field) {
      var point = result.records[i].fields[point_key];
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
  if (mymap) mymap.remove();
  mymap = L.map("mapid").setView([35.9132, -79.0558], 13);
  addOpenStreetMapData();

  if (showTrafficSignals) {
    var trafficSignalIcon = getIconFromImageUrl(
      "img/traffic-light-256.png"
    );
    addPointsFromChapelHillAPI(
      "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=traffic-signals-in-chapel-hill&rows=1000",
      trafficSignalIcon,
      "geo_point",
      false
    );
  }
    if (showBikeCrashes) {
         var bikeCrashIconImageUrl =
        "img/map-marker-2-xxl.png";
      var bikeCrashAPIUrl =
        "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=bicycle-crash-data-chapel-hill-region&rows=1000&facet=ambulancer&facet=bikeage_gr&facet=bike_age&facet=bike_alc_d&facet=bike_dir&facet=bike_injur&facet=bike_pos&facet=bike_race&facet=bike_sex&facet=city&facet=county&facet=crashalcoh&facet=crashday&facet=crash_grp&facet=crash_hour&facet=crash_loc&facet=crash_mont&facet=crash_time&facet=crash_type&facet=crash_year&facet=crsh_sevri&facet=developmen&facet=drvrage_gr&facet=drvr_age&facet=drvr_alc_d&facet=drvr_estsp&facet=drvr_injur&facet=drvr_race&facet=drvr_sex&facet=drvr_vehty&facet=excsspdind&facet=hit_run&facet=light_cond&facet=locality&facet=num_lanes&facet=num_units&facet=rd_charact&facet=rd_class&facet=rd_conditi&facet=rd_config&facet=rd_defects&facet=rd_feature&facet=rd_surface&facet=rural_urba&facet=speed_limi&facet=traff_cntr&facet=weather&facet=workzone_i&facet=bike_unitn&facet=drvr_unitn&facet=on_rd";
      var crashIcon = getIconFromImageUrl(bikeCrashIconImageUrl);
      addPointsFromChapelHillAPI(bikeCrashAPIUrl, crashIcon, "geo_point_2d", true);
      }
    
    if (showPedCrashes) {
         var pedCrashIconImageUrl =
        "img/map-marker-2-xxl 2.png";
      var pedCrashAPIUrl =
        "https://www.chapelhillopendata.org/api/records/1.0/search/?dataset=pedestrian-crashes-chapel-hill-region&rows=1000&facet=ambulancer&facet=city&facet=county&facet=crashalcoh&facet=crashday&facet=crash_grp&facet=crash_loc&facet=crash_type&facet=crsh_sevri&facet=developmen&facet=drvrage_gr";
      var crashIcon = getIconFromImageUrl(pedCrashIconImageUrl);
      addPointsFromChapelHillAPI(pedCrashAPIUrl, crashIcon, "geo_point_2d", true);
      }
}
