const debug = require("./debug")("Calendar");

class CalendarEvent {
    constructor(data) {
        this.id = data.activityId;
        this.type = data.activityType;
        this.title = data.title;
        this.extendedTitle = data.longTitle;
        this.description = data.description;

        this.start = Date.parse(data.start);
        this.finish = Date.parse(data.finish);
        this.allDay = data.allDay;
        this.cancelled = data.runningStatus === 0;
        this.rollMarked = data.rollMarked;
    }
}

module.exports = class Calendar {
    constructor(auth) {
        debug("Initialising");
        this.auth = auth;
    }

    async getEvents(start = 0, limit = 25, startDate = new Date(), endDate = new Date()) {
        debug("Getting events");
        try {
            let [body, res] = await this.auth.get("/Services/Calendar.svc/GetCalendarEventsByUser", {
                method: "POST",
                qs: {
                    "sessionstate": "readonly",
                    "_dc": new Date().getTime()
                },
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                },
                json: {
                    activityId: null,
                    endDate: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`,
                    homePage: true,
                    limit: limit,
                    locationId: null,
                    page: 1,
                    staffIds: null,
                    start: start,
                    startDate: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
                    userId: this.auth.user.id
                }
            });

            let events = [];
            body.d.forEach((data) => {
                events.push(new CalendarEvent(data));
            }, this);
            debug("Successfully parsed events");
            return events;
        } catch(e) {
            debug("Error fetching events");
            throw e;
        }
    }
}