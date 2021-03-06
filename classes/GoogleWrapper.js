const APIWrapper = require("./APIWrapper");
const { getExpiryTime } = require("../static/helper");

class GoogleWrapper extends APIWrapper {
  constructor(
    accessToken,
    refreshToken,
    ATExpiry,
    clientID,
    clientSecret,
    calendarID
  ) {
    super(accessToken, refreshToken, ATExpiry, clientID, clientSecret);
    this.calendarID = calendarID;
  }

  getDefaultHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  static getOAuthURL(redirect_uri, client_id, scope, response_type) {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&access_type=offline&include_granted_scopes=true`;
  }

  async getUserInfo() {
    return await this.getReqWithAccessToken(
      `https://www.googleapis.com/oauth2/v1/userinfo`,
      { access_token: this.accessToken }
    );
  }

  async handleOAuth(redirectURI, code) {
    const body = JSON.stringify({
      code: code,
      client_id: this.clientID,
      client_secret: this.clientSecret,
      redirect_uri: redirectURI,
      grant_type: "authorization_code",
    });
    const url = `https://oauth2.googleapis.com/token`;
    return await this.postRequest(url, body, {}); // there is no headers in this case
  }

  /**
   * Call the super function. Set the session cookie variables. Return true or an error object.
   */
  async handleLoginSignup(req, redirectURI) {
    const hls = await super.handleLoginSignup(req.query.code, redirectURI);
    if (hls.errorCode) return hls;
    console.log(hls);

    req.session.user.google_access_token = hls.tokens.access_token;
    req.session.user.google_refresh_token = hls.tokens.refresh_token;
    req.session.user.google_email = hls.profile.email;
    req.session.user.google_access_token_expiry = getExpiryTime(
      hls.tokens.expires_in - 100 // for precaution, take away 100 seconds
    );

    return true;
  }

  async resetAccessToken() {
    return await super.resetAccessToken(`https://oauth2.googleapis.com/token`);
  }

  // async getCalendarList() {
  //   const json = await this.getReqWithAccessToken(
  //     `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
  //     {
  //       showHidden: true,
  //     }
  //   );
  //   return json;
  // }

  async insertSpotifyCalendar() {
    const body = JSON.stringify({
      summary: "Spotify",
    });
    const url = `https://www.googleapis.com/calendar/v3/calendars`;
    return await this.postReqWithAccessToken(
      url,
      body,
      this.getDefaultHeaders()
    );
  }

  async makeCalendarGreen() {
    const method = "PUT";
    const body = JSON.stringify({
      colorId: "8",
    });
    const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList/${this.calendarID}`;
    const headers = {
      ...this.getDefaultHeaders(),
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await this.request(url, method, body, headers);
  }

  /**
   * Create the Spotify calendar in the users Google calendar.
   * Change the colour of the calendar to green.
   * Return an error object or the calendar ID
   */
  async setupSpotifyCalendar() {
    const calendar = await this.insertSpotifyCalendar();
    if (calendar.errorCode) return calendar;
    this.calendarID = calendar.id;
    const green = await this.makeCalendarGreen();
    if (green.errorCode) return green;
    return this.calendarID;
  }

  /**
   * Make a request to Google Calendar API to add a song calendar event.
   * @param {String} startTime Start time of the song/calendar event. ISO string format.
   * @param {String} endTime End time of the song/calendar event. ISO string format.
   * @param {String} timeZone The time zone (usually UTC). Assume the start and end time are in the same time zone
   * @param {String} summary Title of the calendar event
   * @param {String} description Description of the calendar event
   */
  async addSongEvent(startTime, endTime, timeZone, summary, description) {
    const body = JSON.stringify({
      start: {
        dateTime: startTime,
        timeZone,
      },
      end: {
        dateTime: endTime,
        timeZone,
      },
      summary,
      description,
    });
    const url = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarID}/events`;
    return await this.postReqWithAccessToken(
      url,
      body,
      this.getDefaultHeaders()
    );
  }

  /**
   * Revoke the application access for a particular user, given the refresh token
   */
  async revokeAccess(token) {
    const url = `https://oauth2.googleapis.com/revoke?token=${token}`;
    return await super.getRequest(url, {
      "Content-type": "application/x-www-form-urlencoded",
    });
  }
}

module.exports = GoogleWrapper;
