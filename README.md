# BetterCompass

BetterCompass is a frontend for
[JDLF's compass.education](http://compass.education/) written in Vue 2 and
Vuetify.

The normal Compass frontend has a variety of issues, being made over a decade
ago with a growing inconsistent design as it is being updated, it is very slow,
the mobile app for students is horrible and buggy (at least on Android) which
lacks features, the website isn't responsive, and feels very neglected overall.

A public instance of BetterCompass can be found at
[https://compass.troplo.com](https://compass.troplo.com), which is constantly
kept up to date, and is recommended to be used if you don't want to self host
your own instance.

BetterCompass may have missing features that are out of scope, this is likely
because I do not have full access to the Compass platform, and feature
availability can differ between different instances.

## Supported Compass features

### Account Types

You may be able to login with unsupported accounts, but the features unique to
said account type are unlikely to be available, as it was intended for student
accounts.

- [x] Student
- [ ] Guest
- [ ] Staff
- [x] Parent (Partial support, billing will never be supported for security
      reasons.)
- [ ] Admin
- [ ] Visitor

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
- [x] Viewing and creating both Compass-compatible and BetterCompass
      notes/tasks.

### User Profile

- [x] View chronicle entries (and extra information)
- [x] View today's attendance status
- [x] Attendance history
- [x] Viewing reports
- [x] Analytics (for NAPLAN, etc)
- [x] User learning tasks

### Misc

- [x] School Resources
- [ ] BetterCompass cache for offline usage on PWA (BetterCompass Exclusive)
- [x] Ability to hide excess calendar header events (BetterCompass Exclusive)
- [x] See overdue learning task amount on homepage (BetterCompass Exclusive)

Home: ![BetterCompass Home](https://i.troplo.com/i/5da430fb.png)

Subject: ![BetterCompass Activity Page](https://i.troplo.com/i/fb6afe86.png)

Subject Learning Task:
![BetterCompass Learning Task](https://i.troplo.com/i/42b6be87.png)
BetterCompass uses a proxy for the Compass API to allow for a seamless
integration with BetterCompass.<br> This can be found in `/proxy`, and can be
run with `node .`, view setup instructions in proxy/README.md.

## Project setup

Rename .env.example to .env and fill it out with your own information.

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

#### View the BetterCompass license in the LICENSE file.
