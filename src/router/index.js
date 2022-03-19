import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/activity/:id',
    name: 'Activity',
    redirect: '/activity/:id/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'ActivityDashboard',
        component: () => import(/* webpackChunkName: "activityDashboard" */ '../views/Activity/ActivityDashboard')
      },
      {
        path: 'roll',
        name: 'ActivityRoll',
        component: () => import(/* webpackChunkName: "activityRoll" */ '../views/Activity/ActivityRoll')
      },
      {
        path: 'schedule',
        name: 'ActivitySchedule',
        component: () => import(/* webpackChunkName: "activitySchedule" */ '../views/Activity/ActivitySchedule')
      },
      {
        path: 'sessions',
        name: 'ActivitySessions',
        component: () => import(/* webpackChunkName: "activitySessions" */ '../views/Activity/ActivitySessions')
      },
      {
        path: 'settings',
        name: 'ActivitySettings',
        component: () => import(/* webpackChunkName: "activitySettings" */ '../views/Activity/ActivitySettings')
      },
      {
        path: 'tasks',
        name: 'ActivityTasks',
        component: () => import(/* webpackChunkName: "activityTasks" */ '../views/Activity/ActivityTasks')
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import(/* webpackChunkName: "activityTasks" */ '../views/Activity/ActivityResources')
      }
    ],
    component: () => import(/* webpackChunkName: "activity" */ '../views/Activity/Activity.vue')
  },
  {
    path: '/user',
    name: 'User',
    redirect: "/user/dashboard",
    children: [
      // UserDashboard, UserAnalytics, UserAttendance, UserReports, UserTasks
      {
        path: 'dashboard',
        name: 'User Dashboard',
        component: () => import(/* webpackChunkName: "userDashboard" */ '../views/User/UserDashboard')
      },
      {
        path: 'analytics',
        name: 'User Analytics',
        component: () => import(/* webpackChunkName: "userAnalytics" */ '../views/User/UserAnalytics')
      },
      {
        path: 'attendance',
        name: 'User Attendance',
        component: () => import(/* webpackChunkName: "userAttendance" */ '../views/User/UserAttendance')
      },
      {
        path: 'reports',
        name: 'User Reports',
        component: () => import(/* webpackChunkName: "userReports" */ '../views/User/UserReports')
      },
      {
        path: 'tasks',
        name: 'User Tasks',
        component: () => import(/* webpackChunkName: "userTasks" */ '../views/User/UserTasks')
      }
    ],
    component: () => import(/* webpackChunkName: "about" */ '../views/User/User.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "*",
    name: "Not Found",
    component: () => import(/* webpackChunkName: "notFound" */ '../views/NotFound')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
