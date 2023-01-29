import { createPinia } from "pinia"
import { createApp } from "vue"
import * as VueRouter from "vue-router"

import Enrollment from "./pages/Enrollment.vue"
import Home from "./pages/Home.vue"
import Login from "./pages/Login.vue"
import OpenHouse from "./pages/OpenHouse.vue"
import Property from "./pages/Property.vue"
import PropertyDetails from "./pages/PropertyDetails.vue"
import User from "./pages/User.vue"

import App from "./App.vue"

import "./assets/main.css"

const pinia = createPinia()

const app = createApp(App)

// app routes

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/enrollment", component: Enrollment },
  { path: "/open-house", component: OpenHouse },
  { path: "/property", component: Property },
  { path: "/property/:id", component: PropertyDetails },
  { path: "/user", component: User },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})

app.use(pinia)
app.use(router)
app.mount("#app")
