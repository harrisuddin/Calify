const fetch = require("node-fetch");
const {
  getURLWithParams,
  compareTimeDifference,
  encodeFormData,
} = require("../static/helper");

// this will be the superclass for the spotify and google wrappers
class APIWrapper {
  // AT: the access token for the API
  // RT: the refresh token for the API
  constructor(accessToken, refreshToken, ATExpiry, clientID, clientSecret, scope, response_type) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiry = ATExpiry;
    this.expiryLength = 3600; // 1 hour in seconds.
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.response_type = response_type;
  }

  // constructor(AT, RT, ATExpiry, RTExpiry) {
  //     this.accessToken = AT;
  //     this.refreshToken = RT;
  //     this.accessTokenExpiry = ATExpiry;
  //     this.refreshTokenExpiry = RTExpiry;
  // }

  set setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  set setRefreshToken(refreshToken) {
    this.accessToken = refreshToken;
  }

  set setAccessTokenExpiry(ATExpiry) {
    this.accessTokenExpiry = ATExpiry;
  }

  set setClientID(clientID) {
    this.clientID = clientID;
  }

  set setClientSecret(clientSecret) {
    this.clientSecret = clientSecret;
  }

  set setScope(scope) {
    this.scope = scope;
  }

  set setResponseType(response_type) {
    this.response_type = response_type;
  }

  // set setRefreshTokenExipry(RTExpiry) {
  //     this.refreshTokenExpiry = RTExpiry;
  // }

  get getAccessToken() {
    return this.accessToken;
  }

  get getRefreshToken() {
    return this.refreshToken;
  }

  get getAccessTokenExpiry() {
    return this.accessTokenExpiry;
  }

  get getClientID() {
    return this.clientID;
  }

  get getClientSecret() {
    return this.clientSecret;
  }

  get getScope() {
    return this.scope;
  }

  get getResponseType() {
    return this.response_type;
  }

  // get getRefreshTokenExpiry() {
  //     return this.refreshTokenExpiry;
  // }

  isAccessTokenValid() {
    return compareTimeDifference(
      Date().toString(),
      this.accessTokenExpiry,
      this.expiryLength
    );
  }

  //   getOAuthURL(baseURL, response_type, redirect_uri, scope) {
  //     return getURLWithParams(baseURL, {
  //       redirect_uri,
  //       client_id: this.clientID,
  //       scope,
  //       response_type,
  //     });
  //   }

  async handleError(response) {
    if (!response.ok) {
      console.error(response);
      return {
        errorCode: response.status,
        errorText: response.statusText,
        headers: response.headers
      };
    } else {
      const json = await response.json();
      return json;
    }
  }

  /**
   * Make a request to an endpoint.
   * Will return error code -1 for network, operational, etc errors. NOT with 300-599 http errors
   * @param {String} url url of the request
   * @param {String} method "GET" or "POST" etc
   * @param {Object} body body of the request
   * @param {Object} headers headers of the request
   */
  async request(url, method, body, headers) {
    try {
      let request = {
        method: method,
        headers: headers,
      };
      if (method.toLowerCase() != "get") request["body"] = body;
      const response = await fetch(url, request);
      return await this.handleError(response);
    } catch (err) {
      console.error(err);
      return {
        errorCode: -1,
      };
    }
  }

  async requestWithAccessToken(url, params) {
    const newURL = getURLWithParams(url, params);
    const method = "GET";
    const body = {};
    const headers = {
      Authorization: `Bearer ${this.accessToken}`
    };
    return await this.request(newURL, method, body, headers);
  }

  async postRequest(url, body, headers) {
    const method = "POST";
    return await this.request(url, method, body, headers);
  }

  async resetAccessToken(url) {
    const body = encodeFormData({
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
      client_id: this.clientID,
      client_secret: this.clientSecret,
    });
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const json = await this.postRequest(url, body, headers);
    return json;
  }

  async handleLoginSignup(code, redirectURI) {
    const tokens = await this.handleOAuth(redirectURI, code);
    if (tokens.errorCode) return tokens;

    this.accessToken = tokens.access_token;
    const profile = await this.getUserInfo();
    if (profile.errorCode) return profile;

    return {tokens, profile};
  }

  /**
   * Check if the access token is valid and if not then reset it
   * via the resetAccessToken function.
   * Return an error object or the access token
   */
  async validateAccessToken() {
    if (!this.isAccessTokenValid()) {
      const json = await this.resetAccessToken();
      if (json.errorCode) return json;
      this.accessToken = json.access_token;
    }
    return this.accessToken;
  }

}

module.exports = APIWrapper;
