const axios = require('axios');
const qs = require('qs');
const querystring = require('querystring');

const APP_ID = '*******************************';;
const TENANT = '*******************************';;
const TENANT_ID = '*******************************';;
const APP_SECERET = '*******************************';
const TOKEN_ENDPOINT = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
const SCOPE = 'https://ssw.crm6.dynamics.com/.default';

// ----------------------------------------------------------------------------------------
//  Obtaining an Access Token
// ----------------------------------------------------------------------------------------
let auth = `${APP_ID}:${querystring.escape(APP_SECERET)}`;
let encoded_auth = (Buffer.from(auth)).toString('base64');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.post['Authorization'] = `Basic ${encoded_auth}`;

const tokenPostData = {
    grant_type: "client_credentials",
    scope: SCOPE
}

let accessToken;

axios
    .post(TOKEN_ENDPOINT, qs.stringify(tokenPostData))
    .then(response => {
        console.log("TOKEN", response.data);
        accessToken = response.data.access_token;

        let queryFilter = "$filter=contains(firstname,%27william%27)%20and%20contains(lastname,%27liebenberg%27)";

        let crmUrl = `https://${TENANT}/api/data/v9.1`
        let userQuery = `${crmUrl}/systemusers?${queryFilter}`

        axios.defaults.headers.get['Authorization'] = `Bearer ${accessToken}`;
        axios
            .get(userQuery)
            .then(response => {
                console.log("COMMON", response.data.value[0]);
                console.log("MOBILE", response.data.value[0].mobilephone)
            })
            .catch(error => {
                console.log("COMMON", error);
            });
    })
    .catch(error => {
        console.log("TOKEN", error);
    });