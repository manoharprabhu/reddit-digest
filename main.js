#!/usr/bin/env node --harmony-async-await

const snoowrap = require('snoowrap');
const ShowerThoughts = require('./ShowerThoughts');
const PdfGenerator = require('./PdfGenerator');
const WritingPrompts = require('./WritingPrompts');
const path = require('path');
const fs = require('fs');

if (process.argv.length != 4) {
    console.log('Syntax: reddit-digest /path/to/reddit/config path/to/save/pdf');
    return 1;
}

let configFilePath = path.resolve(process.argv[2]);
let outputPath = path.resolve(process.argv[3]);

try {
    fs.lstatSync(outputPath).isDirectory();
} catch (e) {
    if (e.code == 'ENOENT') {
        console.log('Output folder does not exist. Please create it before running the script.');
    } else {
        console.log(e);
    }
    return 1;
}

let config;
try {
    config = require(configFilePath);
} catch (e) {
    console.log('Create config.json file with the reddit script access credentials');
    return 1;
}

let reddit;
try {
    reddit = new snoowrap({
        userAgent: config.userAgent,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.reddit_username,
        password: config.reddit_password
    });
} catch (e) {
    console.log('Unable to create the reddit client. Check the config file.');
    console.log(e);
    return 1;
}

async function main(reddit) {
    try {
        const writingPrompts = await WritingPrompts(reddit);
        const showerThoughts = await ShowerThoughts(reddit);
        PdfGenerator({ writingPrompts, showerThoughts }, outputPath);
    } catch (e) {
        console.log('Error while fetching the content. Try again.');
        console.log(e);
    }
}

main(reddit);