const APIWrapper = require("./APIWrapper");
const { encodeFormData, getExpiryTime } = require("../static/helper");

class SpotifyWrapper extends APIWrapper {
  constructor(AT, RT, ATExpiry, clientID, clientSecret, scope, response_type) {
    super(AT, RT, ATExpiry, clientID, clientSecret, scope, response_type);
  }

  getOAuthURL(redirect_uri) {
    // TASK: add state
    return `https://accounts.spotify.com/authorize?client_id=${
      this.clientID
    }&response_type=${this.response_type}&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${encodeURIComponent(this.scope)}`;
  }

  async getUserInfo() {
    return await this.requestWithAccessToken(`https://api.spotify.com/v1/me`);
  }

  async getPreviousSongs() {
    return await this.requestWithAccessToken(
      `https://api.spotify.com/v1/me/player/recently-played`
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
    const json = await this.postRequest(url, body, headers);
    return json;
  }

  async resetAccessToken() {
    return await super.resetAccessToken(
      `https://accounts.spotify.com/api/token`
    );
  }

  async handleLoginSignup(req, res, redirectURI) {
    const tokens = await this.handleOAuth(redirectURI, req.query.code);
    if (tokens.errorCode) res.status(404).send("Error, something went wrong.");

    this.accessToken = tokens.access_token;
    const profile = await this.getUserInfo();
    if (profile.errorCode) res.status(404).send("Error, something went wrong.");

    req.session.user.spotify_access_token = tokens.access_token;
    req.session.user.spotify_refresh_token = tokens.refresh_token;
    req.session.user.spotify_email = profile.email;
    req.session.user.spotify_access_token_expiry = getExpiryTime(tokens.expires_in - 100);
    
  }
}

module.exports = SpotifyWrapper;
