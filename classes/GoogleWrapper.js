const APIWrapper = require("./APIWrapper");
const { getExpiryTime } = require("../static/helper");

class GoogleWrapper extends APIWrapper {
  constructor(AT, RT, ATExpiry, clientID, clientSecret, scope, response_type) {
    super(AT, RT, ATExpiry, clientID, clientSecret, scope, response_type);
  }

  getOAuthURL(redirect_uri) {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientID}&redirect_uri=${redirect_uri}&scope=${this.scope}&response_type=${this.response_type}&access_type=offline&include_granted_scopes=true`;
  }

  async getUserInfo() {
    const access_token = this.accessToken;
    const json = await this.requestWithAccessToken(
      `https://www.googleapis.com/oauth2/v1/userinfo`,
      { access_token }
    );
    return json;
  }

  async handleOAuth(redirectURI, code) {
    const body = JSON.stringify({
      code: code,
      client_id: this.clientID,
      client_secret: this.clientSecret,
      redirect_uri: redirectURI,
      grant_type: "authorization_code",
    });
    const url = `https://www.googleapis.com/oauth2/v4/token`;
    const json = await this.postRequest(url, body, {}); // there is no headers in this case
    return json;
  }

  async handleLoginSignup(req, res, redirectURI) {
    const tokens = await this.handleOAuth(redirectURI, req.query.code);
    if (tokens.errorCode) res.status(404).send("Error, something went wrong.");

    this.accessToken = tokens.access_token;
    const profile = await this.getUserInfo();
    if (profile.errorCode) res.status(404).send("Error, something went wrong.");

    req.session.user.google_access_token = tokens.access_token;
    req.session.user.google_refresh_token = tokens.refresh_token;
    req.session.user.google_email = profile.email;
    req.session.user.google_access_token_expiry = getExpiryTime(tokens.expires_in - 100);

  }

  async resetAccessToken() {
    const json = await super.resetAccessToken(`https://oauth2.googleapis.com/token`);
    return json;
  }
}

module.exports = GoogleWrapper;
