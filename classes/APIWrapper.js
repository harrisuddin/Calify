const fetch = require("node-fetch");
const {
  getURLWithParams,
  compareTimeDifference,
  encodeFormData,
} = require("../static/helper");
const expiryLength = 3600; // 1 hour in seconds.

// this will be the superclass for the spotify and google wrappers
class APIWrapper {
  constructor(accessToken, refreshToken, ATExpiry, clientID, clientSecret) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiry = ATExpiry;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  isAccessTokenValid() {
    if (!this.accessTokenExpiry) return false;
    return compareTimeDifference(
      Date().toString(),
      this.accessTokenExpiry,
      expiryLength
    );
  }

  /**
   * If the response is not OK (300-599 http error code).
   * Then return a object with the error code, error text, and the response headers.
   * If OK, return response.json().
   * @param {*} response The response of a request
   */
  async handleResponse(response) {
    if (!response.ok) {
      console.error(response);
      return {
        errorCode: response.status,
        errorText: response.statusText,
        headers: response.headers,
      };
    } else {
      const json = await response.json();
      return json;
    }
  }

  /**
   * Make a request to an endpoint.
   * Will return this ```{errorCode: -1}``` for network, operational, etc errors. NOT with 300-599 http errors
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
      return await this.handleResponse(response);
    } catch (err) {
      console.error(err);
      return {
        errorCode: -1,
      };
    }
  }

  /**
   * Make a GET request with the access token in the header
   * @param {*} url The url you are making a request to 
   * @param {*} params An object containing all the parameters of the request 
   * @param {*} headers An object containing all the headers of the request
   */
  async getReqWithAccessToken(url, params, headers) {
    const newURL = getURLWithParams(url, params);
    const method = "GET";
    const body = {};
    const h = {
      ...headers,
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await this.request(newURL, method, body, h);
  }

  /**
   * Make a POST request with the access token in the header
   */
  async postReqWithAccessToken(url, body, headers) {
    const method = "POST";
    const h = {
      ...headers,
      Authorization: `Bearer ${this.accessToken}`,
    };
    return await this.request(url, method, body, h);
  }

  /**
   * Helper method for making POST requests
   */
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

  /**
   * Get the tokens and user profile from the API service.
   * The subclasses must implement the handleOAuth and getUserInfo functions,
   * return an error object if not.
   * @param {*} code The code recieved from the API service
   * @param {*} redirectURI The URL to redirect to after logging in or signing up
   */
  async handleLoginSignup(code, redirectURI) {
    const tokens = await this.handleOAuth(redirectURI, code);
    if (tokens.errorCode) return tokens;

    this.accessToken = tokens.access_token;
    const profile = await this.getUserInfo();
    if (profile.errorCode) return profile;

    return { tokens, profile };
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
