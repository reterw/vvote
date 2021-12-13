<template>
  <div class="flex flex-col">
    <div
      v-for="e in votes"
      :key="e.id"
      class="relative bg-dark-900 border-1 border-dark-100 col-span-2 mt-2"
    >
      <VoteBox :content="e" @vote="vote(e, $event)" @like="like" @save="save"></VoteBox>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useVoteTopicStore } from "./stores/store";
import VoteBox from "./voteBox.vue";

export default defineComponent({
  components: { VoteBox },
  setup() {
    const { refresh } = useVoteTopicStore()
    onMounted(() => {
      refresh()
    })
    return useVoteTopicStore()
  }
})
</script>