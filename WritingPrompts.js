const collectWritingPrompts = async(reddit) => {
    const submissionList = await reddit.getSubreddit('WritingPrompts').getTop({ time: 'day' });
    console.log('Fetched top WritingPrompts of the day...');
    const content = [];
    console.log(`Fetching ${submissionList.length} stories...`);
    for (let i = 0; i < submissionList.length; i++) {
        const comments = await reddit.getSubmission(submissionList[i].id).comments;
        if (comments.length >= 2) {
            content.push({ title: submissionList[i].title, content: comments[1].body });
        }
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`${i+1}`);
    }
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log('Collected WritingPrompts and the top stories...');
    return content;
}

module.exports = collectWritingPrompts;