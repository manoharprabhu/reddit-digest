const ConsoleWriter = require('./ConsoleWriter');

const collectWritingPrompts = async(reddit) => {
    const submissionList = await reddit.getSubreddit('WritingPrompts').getTop({ time: 'day' });
    ConsoleWriter('Fetched top WritingPrompts of the day...', false);
    const content = [];
    console.log(`Fetching ${submissionList.length} stories...`);
    for (let i = 0; i < submissionList.length; i++) {
        const comments = await reddit.getSubmission(submissionList[i].id).comments;
        if (comments.length >= 2) {
            content.push({ title: submissionList[i].title, content: comments[1].body });
        }
        ConsoleWriter(`${i+1} / ${submissionList.length}`, true);
    }
    ConsoleWriter('\nCollected WritingPrompts and the top stories...', false);
    return content;
}

module.exports = collectWritingPrompts;