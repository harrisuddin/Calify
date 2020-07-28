const APIWrapper = require("./APIWrapper");
const { encodeFormData, getExpiryTime } = require("../static/helper");

class SpotifyWrapper extends APIWrapper {
  constructor(accessToken, refreshToken, ATExpiry, clientID, clientSecret) {
    super(accessToken, refreshToken, ATExpiry, clientID, clientSecret);
  }

  static getOAuthURL(redirect_uri, client_id, scope, response_type) {
    // TASK: add state
    return `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=${response_type}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${encodeURIComponent(scope)}`;
  }

  async getUserInfo() {
    return await this.getReqWithAccessToken(`https://api.spotify.com/v1/me`);
  }

  /**
   * Return the previous songs after a certain point.
   * @param {*} afterTime UNIX timestamp to get songs after a certain point. If afterTime is null then it is not included in the parameters 
   */
  async getPreviousSongs(afterTime) {
    return await this.getReqWithAccessToken(
      `https://api.spotify.com/v1/me/player/recently-played`, 
      (afterTime ? {after: afterTime} : {})
    );
  }

  async handleOAuth(redirectURI, code) {
    const body = encodeFormData({
      grant_type: "authorization_code",
      redirect_uri: redirectURI,
      code: code,
      client_id: this.clientID,
      client_secret: this.clientSecret,
    });
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };
    const url = `https://accounts.spotify.com/api/token`;
    return await this.postRequest(url, body, headers);
  }

  async resetAccessToken() {
    return await super.resetAccessToken(
      `https://accounts.spotify.com/api/token`
    );
  }

  async handleLoginSignup(req, redirectURI) {
    const hls = await super.handleLoginSignup(req.query.code, redirectURI);
    if (hls.errorCode) return hls;

    req.session.user.spotify_access_token = hls.tokens.access_token;
    req.session.user.spotify_refresh_token = hls.tokens.refresh_token;
    req.session.user.spotify_email = hls.profile.email;
    req.session.user.spotify_access_token_expiry = getExpiryTime(
      hls.tokens.expires_in - 100
    );

    return true;
  }

  static formatTrack(elem) {
    const startTime = elem.played_at;
    const endTime = new Date(
      new Date(startTime).getTime() + elem.track.duration_ms
    ).toISOString();
    return {
      title: elem.track.name,
      artists: elem.track.artists.map((artist) => artist.name).join(" • "),
      startTime,
      endTime,
    };
  }
}

module.exports = SpotifyWrapper;
