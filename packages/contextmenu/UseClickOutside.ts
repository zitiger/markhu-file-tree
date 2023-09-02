import {onMounted, onBeforeUnmount, ref} from "vue"

function useClickOutside(
    elementRef:  any,
    callback: (event: MouseEvent) => void

): void {
    const clickOutsideHandler = (event: MouseEvent) => {
        const el = elementRef.value
        if (!el || el === event.target || event.composedPath().includes(el)) {
            return
        }

        callback(event)
    }

    onMounted(() => {
        window.addEventListener("click", clickOutsideHandler)
    })

    onBeforeUnmount(() => {
        window.removeEventListener("click", clickOutsideHandler)
    })
}

export default useClickOutside
