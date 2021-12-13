<template>
  <div class="h-full grid grid-cols-12 text-light-50">
    <div header class="fixed z-10 grid grid-cols-12 w-full sm:p-3 p-0 h-25 bg-dark-900">
      <div class="px-2 col-span-2 flex gap-3 items-center">
        <i class="pi pi-bell" style="fontSize: 2rem"></i>
        <div class="text-xl lg:block hidden">We Vote</div>
      </div>
      <span class="col-start-4 col-span-6 flex justify-center">
        <span class="p-input-icon-left w-200 flex items-center">
          <i class="pi pi-search" style="fontSize: 1.5rem" />
          <InputText type="text" placeholder="type search" class="bg-dark-100 w-full rounded-xl" />
        </span>
      </span>
      <div class="col-start-10 col-span-3 flex justify-end gap-5 cursor-pointer p-2">
        <div
          class="flex flex-row items-center gap-2 hover:bg-dark-300 rounded-xl p-2"
          @click="createVote"
        >
          <i class="pi pi-pencil" style="fontSize:1rem;"></i>
          <div class="text-xl lg:block hidden">create vote</div>
        </div>
        <div
          v-if="!user.isLogined"
          class="flex flex-row items-center gap-2 hover:bg-dark-300 rounded-xl p-2"
          @click="login"
        >
          <i class="pi pi-user" style="fontSize: 1rem"></i>
          <div class="text-xl lg:block hidden">login</div>
        </div>
        <div v-else class="flex flex-row items-center gap-2 hover:bg-dark-300 rounded-xl p-2">
          <Avatar :image="user.avatarUrl"></Avatar>
          <div class="text-xl lg:block hidden">{{ user.username }}</div>
        </div>
      </div>
      <div>
        <!-- <SpeedDial :model="items" /> -->
      </div>
    </div>
    <div sidebar class="lg:grid grid-cols-12 w-full mt-25 fixed">
      <div class="lg:col-start-2 lg:col-span-2 lg:p-0 col-span-1">
        <div class="pr-5 flex flex-col gap-5">
          <div
            class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
            @click="push('/')"
          >
            <i class="pi pi-home" style="fontSize: 2rem"></i>
            <div class="text-2xl lg:block hidden">home</div>
          </div>
          <!-- <div
            class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
          >
            <i class="pi pi-search" style="fontSize: 2rem"></i>
            <div class="text-2xl lg:block hidden">发现</div>
          </div>
          <div
            class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
          >
            <i class="pi pi-clone" style="fontSize: 2rem"></i>
            <div class="text-2xl lg:block hidden">这是啥</div>
          </div>
          <div
            class="flex flex-row gap-5 items-center hover:bg-dark-300 rounded-xl cursor-pointer p-2"
          >
            <i class="pi pi-facebook" style="fontSize: 2rem"></i>
            <div class="text-2xl lg:block hidden">元宇宙</div>
          </div> -->
        </div>
      </div>
    </div>
    <router-view
      content
      class="mt-15 flex justify-center lg:col-span-6 lg:col-start-4 col-span-10 col-start-3 px-5 relative"
    ></router-view>
  </div>
</template>

<script lang="ts">

import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useElemState } from "./composables/elementState";
import { CLIENT_ID, deviceId, GITHUB_LOGIN_URL, REDIRECT_URL } from "./constant";
import { hoverState } from "./directives/hoverState";
import { useUserInfo } from "./stores/store";

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
    const user = useUserInfo()
    const { push } = useRouter()
    return {
      createVote() {
        push('/create-vote')
      },
      test() {
        alert('success');
      },
      user,
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
      login() {
        window.location.href = `${GITHUB_LOGIN_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&state=${deviceId}`
      },
      returnHome() {
        window.location = "/2.html";
        // alert('fuck you')
      },
      state,
      iconName
    };
  },
});
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
