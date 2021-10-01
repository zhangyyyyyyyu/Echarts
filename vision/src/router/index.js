import Vue from 'vue'
import VueRouter from 'vue-router'

import SellerPage from '../views/SellerPage.vue'
import TrendPage from '../views/TrendPage.vue'
import MapPage from '../views/MapPage.vue'
import HotPage from '../views/HotPage.vue'
import StockPage from '../views/StockPage.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        component: Home
    },
    {
        path: '/home',
        component: Home
    }, {
        path: '/seller',
        component: SellerPage
    },
    {
        path: '/trend',
        component: TrendPage
    },
    {
        path: '/map',
        component: MapPage
    },
    {
        path: '/hot',
        component: HotPage
    },
    {
        path: '/stock',
        component: StockPage
    },
]

const router = new VueRouter({
    routes
})

export default router