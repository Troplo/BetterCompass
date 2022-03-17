const debug = require("./debug")("News");
const striptags = require("striptags");

class NewsAttachment {
    constructor(auth, data) {
        this.auth = auth;
        this.id = data.AssetId;
        this.name = data.OriginalFileName;
        this.path = `/Services/FileDownload/FileRequestHandler?FileDownloadType=1&file=${this.id}`;
    }

    async download() {
        debug(`Downloading attachment ${this.path}`);
        try {
            let [body, res] = await this.auth.get(path, {
                encoding: null // Return a buffer
            });

            return body;
        } catch(e) {
            throw e;
        }
    }
}

class NewsUser {
    constructor(auth, data) {
        this.auth = auth;
        this.id = data.UserId;
        this.name = data.UserName;
        this.imagepath = data.UserImageUrl;
    }

    async downloadImage() {
        debug(`Downloading image ${this.imagepath}`);
        try {
            let [body, res] = await this.auth.get(this.imagepath, {
                encoding: null // Return a buffer
            });

            return body;
        } catch (e) {
            throw e;
        }
    }
}

class NewsItem {
    constructor(auth, data) {
        this.id = data.NewsItemId;
        this.title = data.Title;
        this.content = striptags(data.Content1);
        this.postTime = new Date(data.PostDateTime);
        this.user = new NewsUser(auth, data);

        this.attachments = [];
        data.Attachments.forEach((item) => {
            this.attachments.push(new NewsAttachment(auth, item));
        }, this)
    }
}

module.exports = class News {
    constructor(auth) {
        debug("Initialising");
        this.auth = auth;
    }

    async get(start = 0, limit = 10) {
        debug("Getting news");
        try {
            let [body, res] = await this.auth.get("/Services/NewsFeed.svc/GetMyNewsFeedPaged", {
                method: "POST",
                qs: {
                    "sessionstate": "readonly"
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                json: {
                    activityId: null,
                    limit: limit.toString(),
                    start: start.toString()
                }
            });
            debug("Got response");

            let newsitems = [];
            body.d.data.forEach((item) => {
                newsitems.push(new NewsItem(this.auth, item));
            }, this);
            return newsitems;
        } catch(e) {
            throw e;
        }
    }
}