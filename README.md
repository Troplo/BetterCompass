# BetterCompass
BetterCompass is a frontend for [JDLF's compass.education](http://compass.education/) written in Vue.js and Vuetify.
## Supported features
### Activities
#### Learning Tasks
- [x] Uploading submission
- [x] Viewing text feedback
- [x] Responding to feedback
- [ ] Rubric
- [x] Viewing learning task details, such as attachments, description, etc.
- [ ] Viewing tags (e.g. "Assessment", "Assignment", etc)
#### Roll
- [x] Viewing users in class as student (BetterCompass Exclusive)
#### Resources
- [x] Downloading resources
- [x] Viewing resource learning task
#### Schedule
- [x] Viewing class schedule in week, and month modes.
#### Dashboard
- [x] Viewing current instance learning task
- [x] Viewing current class news
- [x] Viewing current teacher, and location information
- [x] Viewing and creating class notes (BetterCompass Exclusive)
### Events
- [x] Event list
- [x] Get event details
- [ ] Download event resources
### Home
- [x] Daily, and weekly (BetterCompass Exclusive) calendar views
- [x] Viewing personalized school news
- [x] Viewing and creating both Compass-compatible and BetterCompass notes/tasks.
### User Profile
- [x] View chronicle entries (and extra information)
- [x] View today's attendance status
- [ ] Attendance history
- [x] (Partially completed) Viewing reports
- [ ] Analytics (for NAPLAN, etc)
- [x] User learning tasks
### Misc
- [x] School Resources
- [ ] BetterCompass cache for offline usage on PWA (BetterCompass Exclusive)
- [x] Ability to hide excess calendar header events (BetterCompass Exclusive)
- [x] See overdue learning task amount on homepage (BetterCompass Exclusive)

Home:
![BetterCompass Home](https://i.troplo.com/i/74391e75.png)

Subject:
![BetterCompass Activity Page](https://i.troplo.com/i/fb6afe86.png)

Subject Learning Task:
![BetterCompass Learning Task](https://i.troplo.com/i/42b6be87.png)
BetterCompass uses a proxy for the Compass API to allow for a seamless integration with BetterCompass.<br>
This can be found in `/proxy`, and can be run with `node .`

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
