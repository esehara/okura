'use strict';
const electron = require('electron');
const settings = require('./settings');
const twitterAPI = require('node-twitter-api');
const twitter = new twitterAPI({
    consumerKey: '3XyjpQvmBjEfvvnbHrOjag3N8',
    consumerSecret: 'wxOb7uCaxXfxRoNVZQpSKFf2cOa1qRaXGe6o6iw1N5C9NbTrCA',
    callback: 'https://www.google.co,jp'
});

const app = electron.app;
const browserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let mainWindow;

app.on('window-all-closed', () => {
    app.quit();
});

let twitter_accessToken;
let twitter_accessTokenSecret;
app.on('ready', () => {
    mainWindow = new browserWindow();
    twitter.getRequestToken(function (error, requestToken, requestTokenSecret, results) {
        var url = twitter.getAuthUrl(requestToken);
        mainWindow.webContents.on('will-navigate', function (event, url) {
            var matched;
            if (matched = url.match(/\?oauth_token=([^&]*)&oauth_verifier=([^&]*)/)) {
                twitter.getAccessToken(requestToken, requestTokenSecret, matched[2], function (error, accessToken, accessTokenSecret, results) {
                    twitter_accessToken = accessToken;
                    twitter_accessTokenSecret = accessTokenSecret;
                    twitter.verifyCredentials(twitter_accessToken, twitter_accessTokenSecret, {}, function (error, data, respons) {
                        mainWindow.loadURL('file://' + __dirname + '/src/html/index.html');
                    });
                });
            }
            event.preventDefault();
        });
        mainWindow.loadURL(url);
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

function getfromList(event) {
    twitter.lists("statuses",
                  {
                      list_id: '774648276532416513',
                      slug: "list2"
                  },
                  twitter_accessToken,
                  twitter_accessTokenSecret,
                  (error, data, response) => {
                      event.sender.send("render-from-list", data);
                  });
}

ipc.on('get-from-list', (event, args) => {
    getfromList(event);
});

ipc.on('tweet', (event, arg) => {
    twitter.statuses("update",
                     {status: "オッではない"},
                     twitter_accessToken,
                     twitter_accessTokenSecret,
                     () => {});
});

ipc.on('ottu', (event, arg) => {
    twitter.statuses("update",
                     {status: "@" + arg.name + " オッ",
                      in_reply_to_status_id: arg.tweet_id
                     },
                     twitter_accessToken,
                     twitter_accessTokenSecret,
                     () => {});
});
