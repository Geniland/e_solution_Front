import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app');

if (!localStorage.getItem('token')) {
  localStorage.setItem(
    'token',
    'VT-' + Math.random().toString(36).substring(2)
  );
}
