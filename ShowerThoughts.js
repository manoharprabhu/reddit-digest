const collectShowerThoughts = async(reddit) => {
    const showerThoughts = await reddit.getSubreddit('ShowerThoughts').getTop({ time: 'day' });
    console.log('Fetched ShowerThoughts of the day...');
    return showerThoughts.map(function(thought) { return thought.title; });
}

module.exports = collectShowerThoughts;