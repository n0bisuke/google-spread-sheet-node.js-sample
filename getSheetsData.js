'use strict';

const fs = require('fs');
const {promisify} = require('util');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const sheets = google.sheets('v4');

//promisifyでプロミス化
const readFileAsync = promisify(fs.readFile);
const ssValuesGetAsync = promisify(sheets.spreadsheets.values.get);

const TOKEN_DIR = __dirname;
const TOKEN_PATH = TOKEN_DIR + '/sheets.googleapis.com-nodejs-quickstart.json';

const main = async () => {
    //クレデンシャル情報の取得
    const content = await readFileAsync(__dirname+'/client_secret.json');
    const credentials = JSON.parse(content); //クレデンシャル

    //認証
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const auth = new googleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    const token = await readFileAsync(TOKEN_PATH);
    oauth2Client.credentials = JSON.parse(token);

    //API経由でシートにアクセス
    const apiOptions = {
        auth: oauth2Client,
        spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        range: 'Class Data!A2:E',
    };
    const response = await ssValuesGetAsync(apiOptions);

    //結果を表示
    console.log(response);
};

main();