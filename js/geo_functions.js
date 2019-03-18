// function getEuclidianDistance(x1, y1, x2, y2) {
//   var x = (x1 - x2) * (x1 - x2);
//   var y = (y1 - y2) * (y1 - y2);
//   return Math.sqrt(x + y);
// }

function getEuclideanDistance(lat1,long1, lat2, long2) {
  var earthRadius = 6371e3;

  var lat1Rads = lat1.toRadians();
  var lat2Rads = lat2.toRadians();

  var latDiff = (lat2 - lat1).toRadians();
  var longDiff = (long2 - long1).toRadians();

  var a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
          Math.cos(lat1Rads) * Math.cos(lat2Rads) *
          Math.sin(longDiff/2) * Math.sin(longDiff/2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = earthRadius * c;
}

// function getEuclideanDistanceInMiles(lat1, long1, lat2, long2) {
//   var dist = getEuclideanDistance(lat1, long1, lat2, long2);
//   var conversionConstant = 58.8968245849;
//   return conversionConstant * dist;
// }

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
    var distInMiles = getEuclideanDistance(
      trafficSignalPoint[0],
      trafficSignalPoint[1],
      crashPoints[i][0],
      crashPoints[i][1]
    );
    if (distInMiles <= miles) numPointsWithin++;
  }
  return numPointsWithin;
}


// when hovered over a specific signal, then display the
// number of crashes using the getCrashesWithinMilesOfTrafficSignal
// method, use mouseover
function hoverOverSignal (signal) {
  signal.display(getCrashesWithinMilesOfTrafficSignal);
}

function mouseOver()

console.log("hello");
