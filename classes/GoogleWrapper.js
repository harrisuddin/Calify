const APIWrapper = require("./APIWrapper");
const { getExpiryTime } = require("../static/helper");
// const defaultHeaders = {
//   "Content-Type": "application/json",
//   Accept: "application/json",
//   Authorization: `Bearer ${this.accessToken}`
// };

class GoogleWrapper extends APIWrapper {
  constructor(accessToken, refreshToken, ATExpiry, clientID, clientSecret, scope, response_type, calendarID) {
    super(accessToken, refreshToken, ATExpiry, clientID, clientSecret, scope, response_type);
    this.calendarID = calendarID;
  }

  getDefaultHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`
    };
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

  async handleLoginSignup(req, redirectURI) {
    const hls = await super.handleLoginSignup(req.query.code, redirectURI);
    if (hls.errorCode) return hls;

    req.session.user.google_access_token = hls.tokens.access_token;
    req.session.user.google_refresh_token = hls.tokens.refresh_token;
    req.session.user.google_email = hls.profile.email;
    req.session.user.google_access_token_expiry = getExpiryTime(
      hls.tokens.expires_in - 100 // for precaution, take away 100 seconds
    );

    return true;
  }

  async resetAccessToken() {
    const json = await super.resetAccessToken(
      `https://oauth2.googleapis.com/token`
    );
    return json;
  }

  async getCalendarList() {
    const json = await super.requestWithAccessToken(
      `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
      {
        showHidden: true
      }
    );
    return json;
  }

  async insertSpotifyCalendar() {
    const body = JSON.stringify({
      summary: "Spotify"
    });
    const url = `https://www.googleapis.com/calendar/v3/calendars`;
    const json = await this.postRequest(url, body, this.getDefaultHeaders());
    return json;
  }

  async makeCalendarGreen() {
    const method = "PUT";
    const body = JSON.stringify({
      colorId: "8"
    });
    const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList/${this.calendarID}`;
    const json = await this.request(url, method, body, this.getDefaultHeaders());
    return json;
  }

  /**
   * Create the Spotify calendar in the users Google calendar.
   * Change the colour of the calendar to green.
   * Return an error object or the calendar id
   */
  async setupSpotifyCalendar() {
    const calendar = await this.insertSpotifyCalendar();
    if (calendar.errorCode) return calendar;
    this.calendarID = calendar.id;
    const green = await this.makeCalendarGreen();
    if (green.errorCode) return green;
    return calendar.id;
  }

  // summary means the title of the calendar event
  // startTime and endTime are in the format 2020-05-09T23:46:27.499Z
  async addSongEvent(startTime, endTime, timeZone, summary, description) { 
    const body = JSON.stringify({
      start: {
        dateTime: startTime,
        timeZone
      },
      end: {
        dateTime: endTime,
        timeZone
      },
      summary, 
      description
    });
    const url = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarID}/events`;
    const json = await this.postRequest(url, body, this.getDefaultHeaders());
    return json;
  }

}

module.exports = GoogleWrapper;
