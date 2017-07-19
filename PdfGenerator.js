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
    let html = `<!DOCTYPE html><html><head><meta content="width=device-width,initial-scale=1" name=viewport><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"></head>
                <body>
                <style>
                    .panel-primary>.panel-heading {
                        color: #000 !important;
                        background-color: #EFEFEF !important;
                        border-color: #ABABAB !important;
                    }

                    .bg-primary {
                        background-color: #EFEFEF !important;
                        color: #000 !important;
                        padding: 10px !important;
                    }

                    @media print {
                        .panel-primary>.panel-heading {
                            color: #000 !important;
                            background-color: #EFEFEF !important;
                            border-color: #ABABAB !important;
                        }

                        .bg-primary {
                            background-color: #EFEFEF !important;
                            color: #000 !important;
                            padding: 10px !important;
                        }
                    }

                </style>
                <div class="container"><h1 class="display-1">Writing Prompts</h1>
    `;
    content.writingPrompts.forEach(function(submission) {
        html += `<div class="panel panel-primary">
            <div class="panel-heading">
            <div class="panel-title"><span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span> <h3>${submission.title}</h3></div>
            </div>
            <div class="panel-body"> 
            <div style="font-size:14px;font-weight:bold;">${computeReadTime(submission.content)}</div>
            <p>${formatRedditToHTML(submission.content)}</p>
            </div>
            </div>
            <hr />`;
    });

    html += `<h1>Shower Thoughts</h1>`
    content.showerThoughts.forEach(function(thought) {
        html += `<p class="bg-primary">${thought}</p>`
    });
    html += `</div></body></html>`;
    return html;
}

var generatePDF = (content, outputPath) => {
    console.log('Generating PDF...');
    const html = createHTMLFromContent(content);
    pdf.create(html, {
        "border": {
            "top": "0.1in",
            "bottom": "0.1in"
        },
        "format": "Letter"
    }).toFile(`${outputPath}/RedditDigest-${moment().format('MMMM_Do_YYYY-HHmmss')}.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log('Written content to ' + res.filename);
    });
}

module.exports = generatePDF;