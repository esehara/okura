'use strict';
const electron = require('electron');
const settings = require('./settings');
const twitterAPI = require('node-twitter-api');
const twitter = new twitterAPI({
    consumerKey: settings.consumerKey,
    consumerSecret: settings.consumerSecret,
    callback: 'https://www.google.co,jp'
});

const app = electron.app;
const browserWindow = electron.BrowserWindow;

let mainWindow;

app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', () => {
    mainWindow = new browserWindow();
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
