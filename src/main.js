import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

// Axios 全局配置
axios.defaults.baseURL = 'http://127.0.0.1:5000'; // 后端API地址
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.prototype.$axios = axios;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
