import { FunctionDirective, Ref } from 'vue'
export const hoverState: FunctionDirective<HTMLElement, { hovered: boolean }> = (el, binding, node, prev) => {
    const state = binding.value
    el.addEventListener('mouseenter', () => {
        state.hovered = true
    })
    el.addEventListener('mouseleave', () => {
        state.hovered = false
    })
}
