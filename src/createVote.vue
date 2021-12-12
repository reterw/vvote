<template>
    <div class="mt-35 z-10">
        <div class="flex flex-col w-full">
            <div class>
                <InputText
                    placeholder="标题"
                    type="text"
                    class="bg-dark-200 w-full text-light-300"
                    v-model="title"
                />
            </div>
            <div class="flex flex-row gap-10 text-xl mt-5">
                <div
                    v-for="e in choices"
                    class="flex items-center bg-dark-200 p-2 gap-4 rounded-xl hover:cursor-pointer"
                >
                    <div class>{{ e }}</div>
                    <i class="pi pi-times" @click="deleteChoice(e)"></i>
                </div>
            </div>
            <div class>
                <InputText
                    placeholder="投票内容"
                    type="text"
                    class="bg-dark-300 text-light-300"
                    v-model="choice"
                ></InputText>
                <i class="pi pi-plus mx-5 my-5" style="fontSize:1.5rem" @click="addChoice"></i>
            </div>

            <div
                class="flex gap-4 items-center cursor-pointer mt-5 hover:bg-dark-300 rounded-xl p-2 w-30"
                style="fontSize:1.5rem"
                @click="submitVote"
            >
                <i class="pi pi-check"></i>
                <div>提交</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useVoteTopicStore } from "./stores/voteContents";

export default defineComponent({
    setup() {
        let choices = ref([]);
        let choice = ref('');
        let title = ref('');
        const topicStore = useVoteTopicStore();
        const { push } = useRouter()

        return {
            choices,
            choice,
            title,
            addChoice() {
                choices.value.push(choice.value);
                if (choice.value !== '') {
                    choice.value = '';
                }
            },
            deleteChoice(e) {
                choices.value.splice(choices.value.indexOf(e), 1);
            },
            submitVote() {
                topicStore.create({
                    title: title.value,
                    choices: choices.value,
                    single: false
                });
                push('/')
            }

        };
    },

});

</script>