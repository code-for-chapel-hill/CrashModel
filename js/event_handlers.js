$(document).ready(function() {
  $("#trafficSignalToggle").change(function() {
    showTrafficSignals = !showTrafficSignals;
    renderMap();
  });
    $("#bikeCrashesToggle").change(function() {
    showBikeCrashes = !showBikeCrashes;
    renderMap();
  });
});
