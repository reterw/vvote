import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import {
    VoteChoice, VoteCreationOptions, VoteTopic
} from '../../shared/vote';

export const useVoteTopicStore = defineStore('vote-topic', () => {
    const votes: Ref<VoteTopic[]> = ref([
    ])

    async function refresh() {
        const result: VoteTopic[] = await (await fetch("http://localhost:8000/2016-08-15/proxy/test/readVotes/")).json()
        votes.value = result
    }

    async function vote(c: VoteChoice) {
        if (c.voted) {
            c.voteCount -= 1
            c.voted = false
        } else {
            c.voteCount += 1
            c.voted = true
        }
    }
    async function like(v: VoteTopic) {
        if (v.liked) {
            v.liked = false
        } else {
            v.liked = true
        }
    }
    async function save(v: VoteTopic) {
        v.saved = !v.saved
    }
    async function create(v: VoteCreationOptions) {
        console.log('wtf')
        const resp = await fetch("http://localhost:8000/2016-08-15/proxy/test/putVote/", { method: "POST", body: JSON.stringify(v) })
        console.log(resp.status)
        console.log(resp.headers)
        refresh()



        
    }
    async function remove() {
        //TBD
    }
    return {
        refresh,
        votes,
        vote,
        like,
        save,
        create,
        remove,
    }
})