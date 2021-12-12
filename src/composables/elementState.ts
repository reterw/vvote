import { reactive } from 'vue'

export function useElemState() {
    const state = reactive({
        hovered: false
    })

    return state
}