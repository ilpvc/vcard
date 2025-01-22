// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/:code?', component:()=>import("../views/Person/index.vue") },
    { path: '/add', component:()=>import("../views/Person/Add/index.vue") },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
