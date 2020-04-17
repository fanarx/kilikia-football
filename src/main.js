import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

//import './directives/clickOutside.js';
import './assets/css/tailwind.css';

// createApp({
//   store,
//   render: h => h(App)
// }).mount('#app');
if ('serviceWorker' in navigator) {
  // sw.js can literally be empty, but must exist
  navigator.serviceWorker.register('/sw.js');
}

const app = createApp(App);
app.use(store);
app.mount('#app');
