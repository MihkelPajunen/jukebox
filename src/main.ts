import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// font awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

// animate on scroll
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const app = createApp(App);

app.use(router);
app.use(createPinia());

app.component('FontAwesome', FontAwesomeIcon);

app.mount('#app');
