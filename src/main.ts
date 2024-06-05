import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueQrcode from 'vue-qrcode'
import Vant from 'vant';
import 'vant/lib/index.css';

createApp(App).component('vue-qrcode', VueQrcode).use(Vant).mount('#app')