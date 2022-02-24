<template>
  <div class="sm:p-10 p-3 grid grid-cols-10 text-white">
    <Avatar
      v-if="content.avatar"
      size="xlarge"
      class="p-avatar-circle mt-5 sm:col-span-1 col-span-2"
      :image="content.avatar"
    ></Avatar>
    <Avatar
      v-else
      icon="pi pi-user"
      size="xlarge"
      class="p-avatar-circle mt-5 sm:col-span-1 col-span-2"
    ></Avatar>

    <div class="col-span-4 font-black mt-5">
      <div class="userName font-thin text-light-50">@{{ content.author }}</div>
      <div class="title text-light-200">{{ content.title }}</div>
    </div>

    <div
      v-for="c in content.choices"
      :key="c.id"
      class="flex col-start-2 col-span-8 items-center hover:bg-[rgba(255,255,255,0.2)] rounded p-2 cursor-pointer"
    >
      <div class>{{ c.name }}</div>
      <div class="flex-grow"></div>
      <div class>{{ c.voteCount }}</div>
      <Button class="p-button-text" :icon="getVoteIconName(c.voted)" @click="doVote(c)"></Button>
    </div>

    <div class="col-start-9 col-span-4 flex gap-3 sm:m-5 text-light-100">
      <i :class="likedIcon" class="cursor-pointer" @click="$emit('like', content)"></i>
      <i :class="savedIcon" class="cursor-pointer" @click="$emit('save', content)"></i>
      <i :class="deleteIcon" class="cursor-pointer" @click="$emit('delete', content)"></i>
      <i class="pi pi-external-link cursor-pointer"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import { VoteChoice, VoteTopic } from "../shared/vote";
import { required } from "./utils";


export default defineComponent({
  props: {
    content: required<VoteTopic>(Object)
  },
  emits: ['vote', 'like', 'save','delete'],
  setup(props, context) {
    const getVoteIconName = ((voted: boolean) => voted ?   "pi pi-thumbs-up" : "pi pi-thumbs-fill");
    const likedIcon = computed(() => props.content.liked ? "pi pi-heart-fill" : "pi pi-heart");
    const savedIcon = computed(() => props.content.saved ? "pi pi-star-fill" : "pi pi-star");
    const deleteIcon = computed(() => props.content.saved ? "pi pi-trash-fill" : "pi pi-trash");
    return {
      doVote(c: VoteChoice) {
        context.emit('vote', c)
      },
      getVoteIconName,
      likedIcon,
      savedIcon,
      deleteIcon,
    };
  },

});

</script>