import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Chips from 'primevue/chips';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext'
import Fieldset from 'primevue/fieldset';
import Checkbox from 'primevue/checkbox';
import Avatar from 'primevue/avatar'
import SpeedDial from 'primevue/speeddial'

import 'primevue/resources/themes/md-light-indigo/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import "virtual:windi.css"
import "./style.css"

import index from './index.vue'
import createVoteVue from "./createVote.vue";
import voteList from "./voteLists.vue";
import { hoverState } from './directives/hoverState';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createPinia } from 'pinia';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/create-vote', component: createVoteVue },
        { path: '/', component: voteList },
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
