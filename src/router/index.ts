// src/router/index.js
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import config from "@/config";

const routes = [
    { path: '/:code?', component:()=>import("../views/Person/index.vue") },
    { path: '/add', component:()=>import("../views/Person/Add/index.vue") },
]

const router = createRouter({
    history: createWebHistory(config.base),
    routes
})

export default router
