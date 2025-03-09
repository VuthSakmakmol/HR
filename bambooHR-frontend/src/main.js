import { createApp } from 'vue';
import './style.css';  // Your global styles
import App from './App.vue';
import router from './router'; // Use the router from router/index.js

const app = createApp(App);
app.use(router); // Attach Vue Router
app.mount('#app');
