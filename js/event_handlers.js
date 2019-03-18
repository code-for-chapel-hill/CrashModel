$(document).ready(function() {
  $("#trafficSignalToggle").change(function() {
    showTrafficSignals = !showTrafficSignals;
    renderMap();
  });
  $("#bikeCrashesToggle").change(function() {
    showBikeCrashes = !showBikeCrashes;
    renderMap();
  });
  $("#pedestrianCrashesToggle").change(function() {
    showPedCrashes = !showPedCrashes;
    renderMap();
  });
  $("#redCirclesToggle").change(function() {
    showRedCircles = !showRedCircles;
    renderMap();
  });
});
