
function getDistanceInMiles(lat1, long1, lat2, long2) {
  var earthRadius = 6371;

  var lat1Rads = toRadians(lat1);
  var lat2Rads = toRadians(lat2);

  var latDiff = toRadians(lat2 - lat1);
  var longDiff = toRadians(long2 - long1);

  var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
          Math.cos(lat1Rads) * Math.cos(lat2Rads) *
          Math.sin(longDiff/2) * Math.sin(longDiff/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = earthRadius * c;
  return d;
}

function toRadians(value) {
  return value * Math.PI / 180;
}

/*
Example Usage for chapel hill, durham and charlotte
getCrashesWithinMilesOfTrafficSignal(
  [35.9132, 79.0558], <- chapel hill
  20, <- within 20 miles
  [[35.2271, 80.8431], <- durham
    [35.994, 78.8986]] <- charlotte
) = 1
*/
function getCrashesWithinMilesOfTrafficSignal(
  trafficSignalPoint,
  miles,
  crashPoints
) {
  var numPointsWithin = 0;
  for (var i = 0; i < crashPoints.length; i++) {
    var distInMiles = getDistanceInMiles(
      trafficSignalPoint[0],
      trafficSignalPoint[1],
      crashPoints[i][0],
      crashPoints[i][1]
    );
    if (distInMiles <= miles) numPointsWithin++;
  }
  return numPointsWithin;
}
