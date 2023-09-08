<template>
  <div class="file-tree-view" @focusin="onFocusIn" @focusout="onFocusOut" tabindex="0">
    <div v-for="nodeData in flattenTree" :key="nodeData.path" draggable="true" class="file-tree-node"
         @dragstart.stop="onDragStart(nodeData)" @dragend.stop="onDragEnd"
         @contextmenu.stop.prevent="onNodeContextmenu($event, nodeData)"
         :class="[{selected: selectedKeys.has(nodeData.path), focused: focusedKey === nodeData.path}]"
    >
      <div v-show="nodeData.path!=='/'" style="display: flex" :style="{'margin-left': (nodeData.level)*20+'px' }"
           class="file-tree-node-content"
           :class="[{
             'node-drag-hover-above': hoverAboveKey===nodeData.path,
             'node-drag-hover-in': hoverInKey===nodeData.path,
             'node-drag-hover-below': hoverBelowKey===nodeData.path,
           }]"
           @dragenter.stop="onDragEnter" @dragover.stop.prevent="onDragOver($event, nodeData)"
           @dragleave.stop="onDragLeave"
           @drop.stop="onDrop(nodeData,data)" @click="onNodeSelect($event, nodeData)">
        <span v-if="nodeData.type === 'folder'" @click.stop="onNodeToggle(nodeData)" class="icon" @dragover.prevent>
          <slot name="toggler" :nodeData="nodeData">
            <template
                v-if="expandedKeys.has(nodeData.path) || nodeData.path === createFileKey ||  nodeData.path === createFolderKey">-</template>
            <template v-else>+</template>
          </slot>
        </span>
        <span>
          <slot name="icon" :nodeData="nodeData">
            <template v-if="nodeData.type === 'folder'">[D]</template>
            <template v-else>[F]</template>
          </slot>
        </span>

        <template v-if="renameKey === nodeData.path">
          <input style="width: 100%" type="text" @blur="onNodeRename(nodeData)"
                 v-on:keydown.enter="onNodeRename(nodeData)"
                 v-on:keyup.esc="onEditCancel"
                 ref="editInputRef"
                 :value="nodeData.title"
          >
        </template>
        <slot name="title" :nodeData="nodeData" v-else>
          <span style="width: 100%">{{ nodeData.title }}</span>
        </slot>
      </div>
      <div v-if="nodeData.type === 'folder' && ( createFileKey === nodeData.path|| createFolderKey === nodeData.path)"
           :style="{'padding-left': nodeData.level*20+20+'px' }">
        <template v-if="createFolderKey === nodeData.path">
          <input style="width: 100%" type="text" ref="editInputRef"
                 @blur="onFolderCreate(nodeData)"
                 v-on:keydown.enter="onFolderCreate(nodeData)"
                 v-on:keyup.esc="onEditCancel"
          >
        </template>

        <template v-else-if="createFileKey === nodeData.path">
          <input style="width: 100%" type="text" ref="editInputRef"
                 @blur="onFileCreate(nodeData)"
                 v-on:keydown.enter="onFileCreate(nodeData)"
                 v-on:keyup.esc="onEditCancel">
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from "vue";
import type {TreeNode} from "./types";
import useDragDrop from "./useDragDrop";
import useSelect from "./useSelect";
import useEdit from "./useEdit";

const props = defineProps({
  // 数据源列表
  data: {
    type: Object as () => TreeNode,
    required: true
  }
});

const data = reactive(props.data)
const emits = defineEmits(
    ['nodeSelect', 'fileCreate', 'folderCreate', 'nodeRename',
      'nodeContextmenu', 'nodeExpand', 'nodeCollapse', 'nodeDrop',
      'nodeMove', 'nodeDrop', 'nodeSelect', 'fileCreate',
      'folderCreate', 'nodeRename', "nodeContextmenu", "nodeExpand", "nodeCollapse"]);

const editInputRef = ref();
const focusedKey = ref<string>('');
const expandedKeys = reactive(new Set<string>());

const flattenTree = computed(() => {
  let result: TreeNode[] = [];

  function traverse(tree: TreeNode, level = 0) {
    for (const node of tree.children) {
      node.level = level;
      result.push(node);

      if ((expandedKeys.has(node.path)) && node.children) {
        traverse(node, level + 1);
      }
    }
  }

  traverse(data)

  return result
})
const {selectedKeys, onFocusIn, onFocusOut, onNodeSelect} = useSelect(flattenTree, focusedKey, emits);
const {
  hoverAboveKey,
  hoverInKey,
  hoverBelowKey,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop
} = useDragDrop(emits);
const {
  renameKey,
  createFolderKey,
  createFileKey,
  startRename,
  startCreateFolder,
  startCreateFile,
  onEditCancel,
  onNodeRename,
  onFileCreate,
  onFolderCreate
} = useEdit(expandedKeys, editInputRef, emits);


defineExpose({startRename, startCreateFolder, startCreateFile})

function onNodeContextmenu(event: MouseEvent, nodeData: TreeNode) {
  focusedKey.value = nodeData.path;
  emits("nodeContextmenu", event, nodeData)
}

function onNodeToggle(nodeData) {
  const expanded = expandedKeys.has(nodeData.path);

  if (!expanded) {
    expandedKeys.add(nodeData.path)
    emits("nodeExpand", nodeData)
  } else {
    expandedKeys.delete(nodeData.path)
    emits("nodeCollapse", nodeData)
  }
}
</script>
<style>

.file-tree-view ul {
  margin-left: 0;
  padding-left: 0;
}

.file-tree-node {
  border: 1px solid transparent;
}

.file-tree-node.selected {
  background-color: #5295E7;
  border: 1px solid #5295E7;

}

.file-tree-node.focused {
  border: 1px solid #5295E7;
}

.file-tree-node-content {
  border: 1px solid transparent;
}

.node-drag-hover-in {
  background-color: #5295E7;
  color: white;
  border: 1px solid #5295E7;
}

.node-drag-hover-above {
  border-top: 1px solid #5295E7 !important;
}

.node-drag-hover-below {
  border-bottom: 1px solid #5295E7 !important;
}
</style>

<style scoped>
.file-tree-view {
  outline: none
}
</style>
