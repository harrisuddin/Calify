function encodeFormData(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

function getURLWithParams(url, params) {
  return params ? url + "?" + encodeFormData(params) : url;
}

// t is in seconds
// returns the time it will be in t seconds as a string
function getExpiryTime(t) {
  return new Date(Date.now() + t * 1000).toString();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * returns true if the time difference is more than or equal to the maxDifference
 * maxDifference should be in seconds
 */
function compareTimeDifference(t1, t2, maxDifference) {
  var date1 = new Date(t1);
  var date2 = new Date(t2);

  var diff = Math.floor((date2 - date1) / 1000); // difference in seconds

  return diff >= maxDifference;
}

module.exports = {
  encodeFormData,
  getURLWithParams,
  compareTimeDifference,
  getExpiryTime,
  sleep
};
