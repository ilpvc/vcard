// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/:code?', component:import("../views/Person/index.vue") },
    { path: '/add', component:import("../views/Person/Add/index.vue") },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
