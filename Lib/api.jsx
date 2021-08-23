import Helper from './helper';

const baseURL = 'https://od-api.oxforddictionaries.com/api/v2'
const oxfordAuth = {
  app_id: 'OXFORD DICTIONARY ACCOUNT_ID',
  app_key: 'OXFORD DICRIONARY API_KEY'}


// THE API CLASS COMPONENT..
export default class API {
  

  // Making an API request...
  static apiRequest(methodName, method='GET', body=null) {
    if(baseURL.length > 0) {
      // If requestURL is speicfied, then use it, else use the serverURL
      let apiURL = baseURL;
      //This will check if the last character of the apiURL is '/', remove it.
      apiURL = apiURL[apiURL.length - 1] == '/' ? apiURL.substring(0, apiURL.length - 1) : apiURL;
      
      // Calls the API URL, with the methodname being the word to be called..
      return fetch(apiURL + '/' + methodName, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'app_id': oxfordAuth.app_id,
          'app_key': oxfordAuth.app_key
        },
        body: method == 'POST' ? (body !== null ? JSON.stringify(body) : '') : ''
      });
    }
    else {
      return new Promise((resolve, reject) => {
        reject({
          success: false,
          statusCode: 'ERROR',
          message: 'Base URL is not set.',
          payload: null});})}}






  // Checks the httpResponse recieved from the server, if the response is valid and a success, it will parse the response in JSON format to be 
  // nested to get the definition, else it would return an ERROR!!
  static checkHttpResponse(response) {
    if(response !== null && response !== undefined) {
      if(response.ok) {
        return response.json();
      }
      else {
        return {
          success: false,
          statusCode: 'HTTP_' + response.status,
          message: Helper.isNotNullAndUndefined(response.statusText) 
          ? response.statusText : "Server error: HTTP " + response.status,
          payload: null}}}

    else {
      return {
        success: false,
        statusCode: 'HTTP_NORESPONSE',
        message: 'No response from the request.',
        payload: null}}}




  // used to call the Oxford API to get the definition of the word, and would more specifically get the 
  // lemmas attribute, which contains the definition of the word in the Oxford dictionary..
  static getLemmas(word) {
    return new Promise((resolve, reject) => { 
      this.apiRequest(
        'lemmas/en/' + word.toLowerCase()
      )
      .then((response) => this.checkHttpResponse(response))
      .then((responseJson) => {
        console.log('Response JSON: ', responseJson);
        resolve(
          {
            success: true,
            statusCode: 'HTTP_200',
            message: '',
            payload: responseJson});})
      
            .catch((error) => {
        reject(error);});});}

  

  static getDefinition(word) {
    return new Promise((resolve, reject) => { 
      this.apiRequest(
        'entries/en/' + word.toLowerCase()
      )
      .then((response) => this.checkHttpResponse(response))
      .then((responseJson) => {
        resolve(
          {
            success: true,
            statusCode: 'HTTP_200',
            message: '',
            payload: responseJson});})

      .catch((error) => {
        reject(error);});});}

}
