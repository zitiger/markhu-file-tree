# markhu-file-tree

markhu-file-tree is a customizable draggable file tree component for Vue 3 that draws inspiration from the VSCode resource explorer.

# Feature

* All nodes in the tree have a type of either 'folder' or 'file'.
* Folders can be expanded regardless of whether they are empty or not.
* Items can be dragged and dropped into folders, but not into files.
* 'Folder' or 'file' names can be renamed to new names.
* Multiple files can be selected using the Ctrl/Shift keys.
* The selected item can be navigated using the up and down arrow keys.

# Install

`npm i markhu-file-tree`
or
`yarn add markhu-file-tree`

# Quick start

````html
<script setup>
    import {reactive} from "vue";
    import {FileTree} from "markhu-file-tree";
    import "markhu-file-tree/dist/style.css";

    const treeData = reactive({
        title: "/",
        path: "/",
        type: "folder",
        children: [
            {
                title: "Documents",
                path: "/users/Jim/Documents",
                type: "folder",
                children: [
                    {
                        title: "File1.txt",
                        path: "/users/Jim/Documents/File1.txt",
                        type: "file",
                    },
                    {
                        title: "File2.txt",
                        path: "/users/Jim/Documents/File2.txt",
                        type: "file"
                    }
                ]
            },
            {
                title: "Pictures",
                path: "/users/Jim/Pictures",
                type: "folder",
                children: [
                    {
                        title: "Image1.jpg",
                        path: "/users/Jim/Pictures/Image1.jpg",
                        type: "file"
                    },
                    {
                        title: "Image2.jpg",
                        path: "/users/Jim/Pictures/Image2.jpg",
                        type: "file"
                    }
                ]
            },
        ]
    });

</script>

<template>
    <file-tree :data="treeData"></file-tree>
</template>
````

The `data` property is an object of `TreeNode` nodes:

````typescript
export interface TreeNode {
    title: string,
    path: string,
    type: string,
    expanded?: boolean,
    selected?: boolean,
    focused?: boolean,
    children?: TreeNode[],
    addingFile?: boolean,
    addingFolder?: boolean,
    editing?: boolean
}
````

# Props

| prop              | type               | default              | description                                       |
|-------------------|--------------------|----------------------|---------------------------------------------------|
| data              | TreeNode|                      | A tree to show. The root node will not show in ui |

# Events

| Event Name | Callback Parameters                                | Purpose |
|--------------------|----------------------------------------------------|-----------------------------------------------------------| 
| @nodeSelect | items: TreeNode[]                                  | Triggered when nodes are selected. |
| @nodeCreate | node: TreeNode, title: string                      | Triggered when a new node is created. |
| @nodeRename | node: TreeNode, newTitle: string, oldTitle: string | Triggered when a node is renamed. |
| @nodeExpand | node: TreeNode                                     | Triggered when a node is expanded. | 
| @nodeCollapse | node: TreeNode                                     | Triggered when a node is collapsed. |
| @nodeDrop | newPath: string, oldPath: string                   | Triggered when a node is dragged and dropped to a new location. | 
| @nodeMove | newPath: string, oldPath: string                   | Triggered when a node is moved to a new location. |
| @nodeContextmenu | e: MouseEvent, d: TreeNode                         | Triggered when a node's context menu is opened. |

# Methods

| method                                                                                                   | description                                                                                        |
|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|

# Slots

| Slot Name | Parameters | Purpose |
| --------- | -------------- | ----------------------------------------------------------- | 
| title | {nodeData} | Used to customize the title content of a node. |
| toggler | {nodeData} | Used to customize the expand/collapse icon of a node. |
| icon | {nodeData} | Used to customize the icon of a node. |

# Examples

## Customize title, toggle icon and file icon with slots.
Note: In this example, we use Font Awesome as icon lib.

````html
  <file-tree :data="treeData" @nodeSelect="onNodeSelect" @fileCreate="onFileCreate"
             @folderCreate="onFolderCreate" @nodeRename="onNodeRename"
             @nodeExpand="onNodeExpand" @nodeCollapse="onNodeCollapse"
             @nodeDrop="onNodeDrop" @nodeMove="onNodeMove" @nodeContextmenu="onNodeContextmenu"
>
    <template v-slot:title="{nodeData}">{{ nodeData.title }}</template>
    <template v-slot:toggler="{nodeData}">
          <span style="margin-right: 5px">
          <i class="fa-solid fa-chevron-down" v-if="nodeData.expanded"></i>
          <i class="fa-solid fa-chevron-right" v-else></i>
            </span>
    </template>
    <template v-slot:icon="{nodeData}">
          <span style="margin-right: 5px">
            <i class="fa-regular fa-folder" v-if="nodeData.type==='folder'"></i>
            <i class="fa-regular fa-file-audio" v-else-if="nodeData.title.endsWith('.mp3')"></i>
            <i class="fa-regular fa-file-image" v-else-if="nodeData.title.endsWith('.jpg')"></i>
            <i class="fa-solid fa-file-word" v-else-if="nodeData.title.endsWith('.doc')"></i>
            <i class="fa-solid fa-file-pdf" v-else-if="nodeData.title.endsWith('.pdf')"></i>
            <i class="fa-solid fa-file-csv" v-else-if="nodeData.title.endsWith('.csv')"></i>
            <i class="fa-regular fa-file-lines" v-else-if="nodeData.title.endsWith('.txt')"></i>
            <i class="fa-regular fa-file" v-else></i>
          </span>
    </template>
</file-tree>
````

# Changelog

```

```
