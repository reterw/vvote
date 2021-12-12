<template>
  <div>
    <div class="flex flex-col">
      <div
        v-for="e in votes"
        :key="e.id"
        class="relative w-50rem bg-dark-900 border-1 border-dark-100 col-span-2 mt-2"
      >
        <VoteBox :content="e" @vote="vote" @like="like" @save="save"></VoteBox>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useVoteTopicStore } from "./stores/voteContents";
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