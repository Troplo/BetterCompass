import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/activity/:id",
    redirect: "/activity/instance/:id/dashboard"
  },
  {
    path: "/activity/:type/:id",
    name: "Activity",
    redirect: "/activity/:type/:id/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Activity Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "activityDashboard" */ "../views/Activity/ActivityDashboard"
          )
      },
      {
        path: "roll",
        name: "Activity Roll",
        component: () =>
          import(
            /* webpackChunkName: "activityRoll" */ "../views/Activity/ActivityRoll"
          )
      },
      {
        path: "discussions",
        name: "Activity Discussions",
        component: () =>
          import(
            /* webpackChunkName: "activityDiscussions" */ "../views/Activity/ActivityDiscussions"
          )
      },
      {
        path: "schedule",
        name: "Activity Schedule",
        component: () =>
          import(
            /* webpackChunkName: "activitySchedule" */ "../views/Activity/ActivitySchedule"
          )
      },
      {
        path: "sessions",
        name: "Activity Sessions",
        component: () =>
          import(
            /* webpackChunkName: "activitySessions" */ "../views/Activity/ActivitySessions"
          )
      },
      {
        path: "settings",
        name: "Activity Settings",
        component: () =>
          import(
            /* webpackChunkName: "activitySettings" */ "../views/Activity/ActivitySettings"
          )
      },
      {
        path: "tasks",
        name: "Activity Tasks",
        component: () =>
          import(
            /* webpackChunkName: "activityTasks" */ "../views/Activity/ActivityTasks"
          )
      },
      {
        path: "resources",
        name: "Resources",
        component: () =>
          import(
            /* webpackChunkName: "activityTasks" */ "../views/Activity/ActivityResources"
          )
      }
    ],
    component: () =>
      import(
        /* webpackChunkName: "activity" */ "../views/Activity/Activity.vue"
      )
  },
  {
    path: "/user/",
    name: "User",
    redirect: "/user/dashboard",
    children: [
      {
        path: "dashboard",
        name: "User Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "userDashboard" */ "../views/User/UserDashboard"
          )
      },
      {
        path: "analytics",
        name: "User Analytics",
        component: () =>
          import(
            /* webpackChunkName: "userAnalytics" */ "../views/User/UserAnalytics"
          )
      },
      {
        path: "attendance",
        name: "User Attendance",
        component: () =>
          import(
            /* webpackChunkName: "userAttendance" */ "../views/User/UserAttendance"
          )
      },
      {
        path: "reports",
        name: "User Reports",
        component: () =>
          import(
            /* webpackChunkName: "userReports" */ "../views/User/UserReports"
          )
      },
      {
        path: "tasks",
        name: "User Tasks",
        component: () =>
          import(/* webpackChunkName: "userTasks" */ "../views/User/UserTasks")
      },
      {
        path: "events",
        name: "User Events",
        component: () =>
          import(
            /* webpackChunkName: "userEvents" */ "../views/User/UserEvents"
          )
      },
      {
        path: "settings",
        name: "BetterCompass Settings",
        component: () =>
          import(
            /* webpackChunkName: "userSettings" */ "../views/User/UserSettings"
          )
      },
      {
        path: "score",
        name: "CompassScore",
        component: () =>
          import(
            /* webpackChunkName: "userScore" */ "../views/User/UserCompassScore"
          )
      },
      {
        path: "subjects",
        name: "User Subjects",
        component: () =>
          import(
            /* webpackChunkName: "userSubjects" */ "../views/User/UserSubjects"
          )
      },
      {
        path: "identity",
        name: "CompassIdentity",
        component: () =>
          import(
            /* webpackChunkName: "userIdentity" */ "../views/User/UserIdentity"
          )
      }
    ],
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/User/User.vue")
  },
  {
    path: "/user/:id",
    name: "User",
    redirect: "/user/:id/dashboard",
    children: [
      {
        path: "dashboard",
        name: "User Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "userDashboard" */ "../views/User/UserDashboard"
          )
      },
      {
        path: "analytics",
        name: "User Analytics",
        component: () =>
          import(
            /* webpackChunkName: "userAnalytics" */ "../views/User/UserAnalytics"
          )
      },
      {
        path: "attendance",
        name: "User Attendance",
        component: () =>
          import(
            /* webpackChunkName: "userAttendance" */ "../views/User/UserAttendance"
          )
      },
      {
        path: "reports",
        name: "User Reports",
        component: () =>
          import(
            /* webpackChunkName: "userReports" */ "../views/User/UserReports"
          )
      },
      {
        path: "tasks",
        name: "User Tasks",
        component: () =>
          import(/* webpackChunkName: "userTasks" */ "../views/User/UserTasks")
      },
      {
        path: "events",
        name: "User Events",
        component: () =>
          import(
            /* webpackChunkName: "userEvents" */ "../views/User/UserEvents"
          )
      },
      {
        path: "settings",
        name: "BetterCompass Settings",
        component: () =>
          import(
            /* webpackChunkName: "userSettings" */ "../views/User/UserSettings"
          )
      },
      {
        path: "score",
        name: "CompassScore",
        component: () =>
          import(
            /* webpackChunkName: "userScore" */ "../views/User/UserCompassScore"
          )
      },
      {
        path: "subjects",
        name: "User Subjects",
        component: () =>
          import(
            /* webpackChunkName: "userSubjects" */ "../views/User/UserSubjects"
          )
      },
      {
        path: "identity",
        name: "CompassIdentity",
        component: () =>
          import(
            /* webpackChunkName: "userIdentity" */ "../views/User/UserIdentity"
          )
      }
    ],
    component: () =>
      import(/* webpackChunkName: "user" */ "../views/User/User.vue")
  },
  {
    path: "/school",
    name: "School",
    redirect: "/school/resources",
    children: [
      {
        path: "resources",
        name: "School Resources",
        component: () =>
          import(
            /* webpackChunkName: "schoolResources" */ "../views/School/SchoolResources"
          )
      },
      {
        path: "staff",
        name: "School Staff",
        component: () =>
          import(
            /* webpackChunkName: "schoolStaff" */ "../views/School/SchoolStaff"
          )
      },
      {
        path: "subjects",
        name: "School Subjects",
        component: () =>
          import(
            /* webpackChunkName: "schoolSubjects" */ "../views/School/SchoolSubjects"
          )
      },
      {
        path: "classes",
        name: "School Classes",
        component: () =>
          import(
            /* webpackChunkName: "schoolClasses" */ "../views/School/SchoolClasses"
          )
      }
    ],
    component: () =>
      import(/* webpackChunkName: "school" */ "../views/School/School")
  },
  {
    path: "/communications",
    name: "Communications",
    redirect: "/communications/home",
    children: [
      {
        path: ":id",
        name: "Communications",
        component: () =>
          import(
            /* webpackChunkName: "communicationsChat" */ "../views/Communications/CommunicationsChat"
          )
      }
    ],
    component: () =>
      import(
        /* webpackChunkName: "communications" */ "../views/Communications/Communications"
      )
  },
  {
    path: "/changelog",
    name: "Changelog",
    component: () =>
      import(/* webpackChunkName: "changelog" */ "../views/Changelog.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/everything",
    name: "Everything",
    component: () =>
      import(/* webpackChunkName: "everything" */ "../views/Everything")
  },
  {
    path: "/admin",
    name: "Admin",
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Admin Dashboard",
        component: () =>
          import(
            /* webpackChunkName: "adminHome" */ "../views/Admin/AdminHome.vue"
          )
      },
      {
        path: "users",
        name: "Admin Users",
        component: () =>
          import(
            /* webpackChunkName: "adminUsers" */ "../views/Admin/AdminUsers.vue"
          )
      }
    ],
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin/Admin.vue")
  },
  {
    path: "*",
    name: "Not Found",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/NotFound")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
