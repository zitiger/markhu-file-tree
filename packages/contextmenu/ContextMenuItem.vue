<template>
  <div class="context-item" @click="handleClick">
    <slot/>
  </div>
</template>

<script lang="ts" setup>
import {inject} from "vue";

const {menuId} = defineProps({
  // 数据源列表
  menuId: {
    type: String,
    required: true
  }
});

// const emit = defineEmits(["click"])

const onMenuItemClicked = inject("onMenuItemClicked") as Function
const handleClick = () => {
  onMenuItemClicked(menuId);
}
</script>

<style>
.context-item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  list-style: none;
  line-height: 22px;
  padding: 5px 16px;
  margin: 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;

}

.context-item.is-hover {
  background-color: rgb(96, 56, 17);
  color: #fff;
}

.context-item.is-disabled {
  cursor: not-allowed;
}
</style>
