const snoowrap = require('snoowrap');
const pdf = require('html-pdf');
const moment = require('moment');
const showdown = require('showdown');
const converter = new showdown.Converter();
let config;

try {
    config = require('./config');
} catch (e) {
    console.log('Create config.js file with the reddit script access credentials');
    return 1;
}

const reddit = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.reddit_username,
    password: config.reddit_password
});

const formatRedditToHTML = function(content) {
    return converter.makeHtml(content);
}

const createHTMLFromContent = function(content) {
    let html = `<!DOCTYPE html><html><body style="line-height:1.5em;color:rgba(0,0,0,.8);fill: rgba(0,0,0,.8); ">`;
    content.forEach(function(submission) {
        html += `<div style="margin-bottom: 3em;"><div style="font-size: 24px; font-weight: bold;margin-bottom:1em;">
            ${submission.title}
            </div> <div style="font-size: 16px;"> ${formatRedditToHTML(submission.content)}
            </div></div><hr />`;
    });
    html += `</body></html>`;
    return html;
}

var generatePDF = function(content) {
    console.log('Generating PDF...');
    const html = createHTMLFromContent(content);
    pdf.create(html, {
        "border": {
            "top": "0.1in",
            "bottom": "0.1in",
            "right": "0.2in",
            "left": "0.2in"
        }
    }).toFile('./WritingPrompts-' + moment().format('DD-MM-YYYY-HHmmss') + '.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log('Written content to ' + res.filename);
    });
}

async function main(reddit) {
    const submissionList = await reddit.getSubreddit('WritingPrompts').getTop({ time: 'day' });
    console.log('Fetched top WritingPrompts of the day...');
    const content = [];
    console.log(`Fetching ${submissionList.length} stories...`);
    for (let i = 0; i < submissionList.length; i++) {
        const comments = await reddit.getSubmission(submissionList[i].id).comments;
        if (comments.length >= 2) {
            content.push({ title: submissionList[i].title, content: comments[1].body });
        }
    }
    console.log('Collected WritingPrompts and the top stories...');
    generatePDF(content);
}

main(reddit);