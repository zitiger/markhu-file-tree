<template>
  <Teleport to="body">
    <div class="contextMenu-wrapper">
      <transition name="fade">
        <div class="contextMenu" ref="contextmenuRef" :style="style" v-if="visible">
          <slot />
        </div>
      </transition>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, provide } from "vue"
const contextmenuRef = ref<HTMLDivElement | null>(null)
import useClickOutside from "./UseClickOutSide"

const visible = ref(false)
let contextData:any = null;

const emits =  defineEmits(["menuitem-click"])

function onMenuItemClicked(menuId:string){

  emits("menuitem-click",contextData, menuId);
  visible.value=false
}

provide("onMenuItemClicked", onMenuItemClicked)

const position = ref({
  top: 0,
  left: 0
})

const style = computed(() => {
  return {
    left: position.value.left + "px",
    top: position.value.top + "px"
  }
})

const hide = () => {
  visible.value = false
}
// 计算x,y的偏移值
const calculatePosition = (axis: "X" | "Y", mousePos: number, elSize: number) => {
  const windowSize = axis === "X" ? window.innerWidth : window.innerHeight
  const scrollPos = axis === "X" ? window.scrollX : window.scrollY

  let pos = mousePos - scrollPos
  if (pos + elSize > windowSize) {
    pos = Math.max(0, pos - elSize)
  }

  return pos + scrollPos
}
useClickOutside(
    contextmenuRef,
    () => {
      hide()
    }
)

const show = async (e: MouseEvent,data:any) => {
  e.preventDefault()
  visible.value = true
  contextData=data;
  await nextTick()
  const el = contextmenuRef.value
  if (!el) {
    return
  }
  const width = el.clientWidth
  const height = el.clientHeight
  const { pageX: x, pageY: y } = e
  position.value.top = calculatePosition("Y", y, height)
  position.value.left = calculatePosition("X", x, width)
}


defineExpose({
  show,
  hide
})
</script>
<style  scoped>
.contextMenu-wrapper {
  z-index: 9999;
  background-color: transparent;
}



.contextMenu {
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px 0;
  margin: 0;
  background-color: #ffffff;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  min-width: 10px;
  word-wrap: break-word;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
