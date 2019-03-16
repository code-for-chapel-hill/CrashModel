function getEuclidianDistance(x1, y1, x2, y2) {
  var x = (x1 - x2) * (x1 - x2);
  var y = (y1 - y2) * (y1 - y2);
  return Math.sqrt(x + y);
}

function getEuclidianDistanceInMiles(lat1, long1, lat2, long2) {
  var dist = getEuclidianDistance(lat1, long1, lat2, long2);
  var conversionConstant = 58.8968245849;
  return conversionConstant * dist;
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
    var distInMiles = getEuclidianDistanceInMiles(
      trafficSignalPoint[0],
      trafficSignalPoint[1],
      crashPoints[i][0],
      crashPoints[i][1]
    );
    if (distInMiles <= miles) numPointsWithin++;
  }
  return numPointsWithin;
}
