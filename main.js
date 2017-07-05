const snoowrap = require('snoowrap');
const config = require('./config');
const pdf = require('html-pdf');
const moment = require('moment');
const showdown = require('showdown');
const converter = new showdown.Converter();

const reddit = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.reddit_username,
    password: config.reddit_password
});

var responseCount = 0;

var formatRedditToHTML = function(content) {
    //console.log(converter.makeHtml(content));
    return converter.makeHtml(content);
}

var createHTMLFromContent = function(content) {
    var html = '<!DOCTYPE html><html><body style="line-height:1.5em;color:rgba(0,0,0,.8);fill: rgba(0,0,0,.8); ">';
    content.forEach(function(submission) {
        html += '<div style="margin-bottom: 3em;"><div style="font-size: 24px; font-weight: bold;margin-bottom:1em;">' +
            submission.title +
            '</div> <div style="font-size: 16px;">' + formatRedditToHTML(submission.content) +
            '</div></div><hr />';
    });
    html += '</body></html>';
    return html;
}

var generatePDF = function(content) {
    console.log('Generating PDF...');
    var html = createHTMLFromContent(content);
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

reddit
    .getSubreddit('WritingPrompts')
    .getTop({ time: 'day' })
    .then(function(submissionList) {
        console.log('Fetched top WritingPrompts of the day...');
        var content = [];
        submissionList.forEach(function(submission) {
            reddit.getSubmission(submission.id).comments.then(function(comments) {
                if (comments.length >= 2) {
                    content.push({ title: submission.title, content: comments[1].body });
                }
                responseCount++;
                if (responseCount >= submissionList.length) {
                    console.log('Collected WritingPrompts and the top stories...');
                    generatePDF(content);
                }
            });
        });
    }).then(function() {});