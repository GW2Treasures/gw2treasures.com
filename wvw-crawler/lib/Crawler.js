const Api = require('gw2api-client').default;

class Crawler {
    constructor() {
        this.updateCallback = () => {};
        this.started = false;
        this.interval = 0;
        this.api = new Api();

        this.update = this.update.bind(this);
    }

    onUpdate(callback) {
        this.updateCallback = callback;
    }

    start() {
        if(!this.started) {
            this.started = true;
            this.interval = setInterval(this.update, 10 * 1000);
            this.update();
        }
    }

    stop() {
        if(this.started) {
            this.started = false;
            clearInterval(this.interval);
        }
    }

    update() {
        console.log('Loading matches');
        this.api.wvw().matches().all().then(matches => {
            console.log(`Loaded ${matches.length} matches.`);

            matches.forEach(match => {
                match.start_time = new Date(match.start_time);
                match.end_time = new Date(match.end_time);
                this.updateCallback(match);
            });
        }).catch(err => {
            console.error(err);
        });
    }
}

module.exports = Crawler;
