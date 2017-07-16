const showdown = require('showdown');
const converter = new showdown.Converter();
const pdf = require('html-pdf');
const moment = require('moment');

const formatRedditToHTML = (content) => {
    return converter.makeHtml(content);
}

const computeReadTime = function(content) {
    const WORDS_PER_SECOND = 5;
    const minutes = (content.split(" ").length / WORDS_PER_SECOND) / 60;
    if (minutes < 1) {
        return `<1 minute read`;
    } else {
        return `${parseInt(minutes)} minutes read`;
    }
}

const createHTMLFromContent = (content) => {
    let html = `<!DOCTYPE html><html><body style="padding-left:10px;padding-right:10px;line-height:1.5em;color:rgba(0,0,0,.8);fill: rgba(0,0,0,.8); ">
                <div style="padding-top:50px;padding-bottom:50px;text-align:center; width:100%;font-size: 2em;"><strong>Writing Prompts</strong></div>
    `;
    content.writingPrompts.forEach(function(submission) {
        html += `<div style="margin-bottom: 3em;"><div style="font-size: 24px; font-weight: bold;margin-bottom:1em;">
            ${submission.title}
            </div> 
            <div style="font-size:14px;font-weight:bold;">${computeReadTime(submission.content)}</div>
            <div style="font-size: 16px;"> ${formatRedditToHTML(submission.content)}
            </div></div><hr />`;
    });

    html += `<div style="padding-top:200px;padding-bottom:50px;text-align:center; width:100%;font-size: 2em;"><strong>Shower Thoughts</strong></div>`
    content.showerThoughts.forEach(function(thought) {
        html += `<div style="width: 100%;padding:30px;font-style: oblique;"><span style="font-size: 1.5em">"</span>${thought}<span style="font-size: 1.5em">"</span></div><hr/>`
    });
    html += `</body></html>`;
    return html;
}

var generatePDF = (content, outputPath) => {
    console.log('Generating PDF...');
    const html = createHTMLFromContent(content);
    pdf.create(html, {
        "border": {
            "top": "0.1in",
            "bottom": "0.1in"
        }
    }).toFile(`${outputPath}/RedditDigest-${moment().format('MMMM_Do_YYYY-HHmmss')}.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log('Written content to ' + res.filename);
    });
}

module.exports = generatePDF;