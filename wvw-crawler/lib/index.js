const Crawler = require('./Crawler');
const helper = require('./helper');

const crawler = new Crawler();

crawler.onUpdate(match => {
    helper.findMatchId(match).then(id => {
        if(id === null) {
            console.log(`Found new match ${match.id}`);

            helper.insertNewMatch(match);
        } else {
            console.log(`Updated match ${match.id}`);

            helper.updateMatch(match);
        }
    })

});

crawler.start();
