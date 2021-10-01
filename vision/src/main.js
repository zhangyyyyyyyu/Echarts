import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入字体文件
import './assets/font/iconfont.css'
//引入全局样式文件
import './assets/global.css'
import axios from 'axios'

//并未使用socketService
import SocketService from './utils/socket_service'
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.instance

//请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
    //将axios挂载到vue的原型对象上
    //在别的组件中  this.$http
Vue.prototype.$http = axios

//将全局的echarts挂载到vue原型的身上
//再别的组件中直接使用  this.$echats 
Vue.prototype.$echarts = window.echarts



Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')