$(document).ready(function() {
  $("#trafficSignalToggle").change(function() {
    showTrafficSignals = !showTrafficSignals;
    renderMap();
  });
});
