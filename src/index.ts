import { useUrlSearchParams } from '@vueuse/core';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import PrimeVue from 'primevue/config';
import Fieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/md-light-indigo/theme.css';
import SpeedDial from 'primevue/speeddial';
import "virtual:windi.css";
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { AUTH_SERVER_URL, deviceId } from './constant';
import createVoteVue from "./createVote.vue";
import { hoverState } from './directives/hoverState';
import index from './index.vue';
import "./style.css";
import voteList from "./voteLists.vue";
import about from "./about.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/create-vote', component: createVoteVue },
        { path: '/', component: voteList },
        { path: '/about', component: about}
    ]
})
router.afterEach(
    (to, from, next) => {
        document.querySelector("body").setAttribute("style", "overflow: auto !important;")
    }
)

const app = createApp(index)

app.use(router)
app.use(PrimeVue)
app.directive('hover', hoverState)
app.component('chips', Chips)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Fieldset', Fieldset)
app.component('Checkbox', Checkbox)
app.component('Avatar', Avatar)
app.component('SpeedDial', SpeedDial)
app.use(createPinia())
app.mount('#app')
