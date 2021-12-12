<template>
  <div class="h-full grid grid-cols-12 text-light-50">
    <div header class="fixed z-10 grid grid-cols-12 w-full p-3 bg-dark-900">
      <div class="px-2 col-span-2 flex gap-3 items-center">
        <i class="pi pi-apple" style="fontSize: 2rem"></i>
        <div class="text-xl">投你妈的票</div>
      </div>
      <span class="col-start-4 col-span-6 flex justify-center">
        <span class="p-input-icon-left w-200 flex items-center">
          <i class="pi pi-search" style="fontSize: 1.5rem" />
          <InputText type="text" placeholder="输入搜索内容" class="bg-dark-100 w-full rounded-xl" />
        </span>
      </span>
      <div class="col-start-10 col-span-3 flex justify-end gap-5 cursor-pointer p-2">
        <div
          class="flex flex-row items-center gap-2 hover:bg-dark-300 rounded-xl p-2"
          @click="createVote"
        >
          <i class="pi pi-pencil" style="fontSize:1rem;"></i>
          <div class="text-xl">发起投票</div>
        </div>
        <div class="flex flex-row items-center gap-2 hover:bg-dark-300 rounded-xl p-2">
          <i class="pi pi-user" style="fontSize: 1rem"></i>
          <div class="text-xl" @click="login">登录</div>
        </div>
      </div>
      <div>
        <!-- <SpeedDial :model="items" /> -->
      </div>
    </div>
    <div sidebar class="lg:grid grid-cols-12 w-full mt-25 fixed md:hidden">
      <div class="lg:col-start-2 lg:col-span-1 flex flex-col gap-5">
        <div
          class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
          @click="push('/')"
        >
          <i class="pi pi-home" style="fontSize: 2rem"></i>
          <div class="text-2xl">首页</div>
        </div>
        <div
          class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
        >
          <i class="pi pi-search" style="fontSize: 2rem"></i>
          <div class="text-2xl">发现</div>
        </div>
        <div
          class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
        >
          <i class="pi pi-clone" style="fontSize: 2rem"></i>
          <div class="text-2xl">这是啥</div>
        </div>
        <div
          class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
        >
          <i class="pi pi-facebook" style="fontSize: 2rem"></i>
          <div class="text-2xl">元宇宙</div>
        </div>
      </div>
    </div>
    <router-view content class="mt-20 flex justify-center col-span-6 col-start-4"></router-view>
  </div>
</template>

<script lang="ts">

import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useElemState } from "./composables/elementState";
import { hoverState } from "./directives/hoverState";

gettoken()
// import banner from "./banner.png";
export default defineComponent({
  directives: {
    hoverState,
  },
  setup() {
    let style = "p-button-outline";
    const state = useElemState();
    let iconName = ref("pi pi-thumbs-up");
    let iconVoted = ref(false);
    const { push } = useRouter()
    return {
      login,
      getUrlArgStr,
      gettoken,
      createVote() {
        push('/create-vote')
      },
      test() {
        alert('success');
      },
      items: [
        {
          label: '我的',
          icon: 'pi pi-ban'
        },
        {
          label: '草',
          icon: 'pi pi-cloud'
        }
      ],
      push,
      changeIcon() {
        console.log(iconVoted.value);
        if (iconVoted.value == false) {
          iconName.value = "pi pi-check";
          iconVoted = ref(true);
        }
        else {
          iconName.value = "pi pi-thumbs-up";
          iconVoted.value = false;
        }
      },
      returnHome() {
        window.location.href = "/2.html";
        // alert('fuck you')
      },
      state,
      iconName
    };
  },
});
function login() {
  window.location.href = 'https://github.com/login/oauth/authorize?client_id=100087b3bd25a77c425b&redirect_uri=https://reterw.github.io/index.html'
}
function getUrlArgStr() {
  let q = location.search.substr(1);
  let qs = q.split('=');
  let argStr = qs[1];



  return argStr;
}

function gettoken() {
  console.log('gettoken')
  fetch('https://github.com/login/oauth/access_token?' +
    "client_id=100087b3bd25a77c425b&" +
    "client_secret=6695f391a003c88418bd7a5d57c52e4137e4e2fb&" +
    `code=${getUrlArgStr()}`,
    { method: 'POST' })
    .then((response) => response.json())
    .then(data => console.log(data))


}
</script>
<style scoped>
/* .p-button.p-button-success.p-button-outlined {
  @apply bg-cyan-400;
} */
</style>
<style>
.banner {
  background: url("./assets/banner.png");
}
</style>
