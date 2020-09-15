import Vue from 'vue'
import App from './App'
import Store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  Store,
  ...App
})
app.$mount()
