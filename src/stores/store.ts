import { useUrlSearchParams } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, Ref, ref } from "vue";
import {
    DoVoteOptions,
    VoteChoice, VoteCreationOptions, VoteTopic
} from '../../shared/vote';
import { AUTH_SERVER_URL, deviceId as _deviceId } from "../constant";

export const useUserInfo = defineStore('user', () => {
    const username = ref('')
    const deviceId = ref(_deviceId)
    const avatarUrl = ref('')
    const accessToken = ref('')
    const isLogined = computed(() => accessToken.value.length > 0)

    const queries = useUrlSearchParams()

    async function handleAuthentication() {
        console.log(`${queries.code}`)
        const url = `${AUTH_SERVER_URL}?code=${queries.code}&state=${_deviceId}`
        const resp = await fetch(url)
        const { userId, avatarUrl: avatar, accessToken: token } = await resp.json()
        username.value = userId
        avatarUrl.value = avatar
        accessToken.value = token
    }

    if (queries.code) {
        handleAuthentication()
    }

    return {
        username,
        deviceId,
        avatarUrl,
        isLogined,
    }
})

export const useVoteTopicStore = defineStore('vote-topic', () => {
    const votes: Ref<VoteTopic[]> = ref([
    ])

    async function refresh() {
        const user = useUserInfo()
        const result: VoteTopic[] = await (await fetch(import.meta.env.VITE_VOTE_URL, { headers: { username: user.username } })).json()
        await Promise.all(result.map(async (r) => {
            if (r.author !== 'Anonymous') {
                const resp = await fetch(`https://api.github.com/users/${r.author}`)
                const { avatar_url } = await resp.json()
                r.avatar = avatar_url
            }
        }))
        votes.value = result
    }

    async function vote(t: VoteTopic, c: VoteChoice) {
        const user = useUserInfo()
        const option: DoVoteOptions = {
            voteTopicId: t.id,
            voteChoiceId: c.id
        }
        const response = await fetch(import.meta.env.VITE_VOTE_URL, { method: "PUT", body: JSON.stringify(option), headers: { username: user.username } })

        const { voteCount } = await response.json()

        c.voteCount = voteCount
        c.voted = true
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
        const user = useUserInfo()
        await fetch(import.meta.env.VITE_VOTE_URL, { method: "POST", body: JSON.stringify(v), headers: { username: user.username } })
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