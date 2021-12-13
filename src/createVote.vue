<template>
    <div class="mt-35 z-10">
        <div class="flex flex-col w-full mt-10">
            <div class>
                <InputText
                    placeholder="title"
                    type="text"
                    class="bg-dark-200 w-full text-light-300 rounded-xl"
                    v-model="title"
                />
            </div>
            <div class="flex flex-col gap-2 text-xl mt-5 pt-10">
                <div
                    v-for="(e, i) in choices"
                    class="flex items-center bg-dark-200 p-2 justify-between px-5 rounded-xl hover:cursor-pointer"
                >
                    <div class>{{ i + 1 }}. {{ e }}</div>
                    <i class="pi pi-times" @click="deleteChoice(e)"></i>
                </div>
            </div>
            <div class="flex items-center pt-5 sm:flex-row flex-col sm:h-auto h-full">
                <div class="inline-flex">
                    <InputText
                        placeholder="choice content"
                        type="text"
                        class="bg-dark-300 text-light-300 rounded-xl"
                        v-model="choice"
                    ></InputText>
                    <i class="pi pi-plus mx-5 my-5" style="fontSize:1.5rem" @click="addChoice"></i>
                </div>
                <div class="flex-grow"></div>
                <div
                    class="flex gap-4 items-center cursor-pointer flex-shrink hover:bg-dark-300 rounded-xl sm:p-2 p-5 md:w-30 sm:p"
                    style="fontSize:1.5rem"
                    @click="submitVote"
                >
                    <i class="pi pi-check" style="fontSize:1.5rem"></i>
                    <div class="">submit</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useVoteTopicStore } from "./stores/store";

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