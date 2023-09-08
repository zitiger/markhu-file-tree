import {TreeNode} from "./types";
import {dirname, join} from "./utils";
import {nextTick, ref, watch} from "vue";

export default function useEdit(expandedKeys: Set<string>, editInputRef, emits) {

    const renameKey = ref('');
    const createFileKey = ref('');
    const createFolderKey = ref('');

    watch(renameKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    watch(createFolderKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    watch(createFileKey, async (newValue) => {
        if (newValue) {
            await nextTick();
            editInputRef.value[0].focus();
        }
    })

    function startRename(key: string) {
        renameKey.value = key;
    }

    function startCreateFile(key: string) {
        expandedKeys.add(key)
        createFileKey.value = key;
    }

    function startCreateFolder(key: string) {
        expandedKeys.add(key)
        createFolderKey.value = key;
    }

    function onEditCancel() {
        renameKey.value = "";
        createFileKey.value = "";
        createFolderKey.value = "";
    }

    function onNodeRename(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input) {
            return
        }

        const title = input.value;
        const oldTitle = node.title;
        const oldPath = node.path;
        const dir = dirname(oldPath);
        const newPath = join(dir, title);

        node.title = title;
        node.path = newPath;

        onEditCancel();
        emits('nodeRename', node, title, oldTitle, newPath, oldPath);
    }

    function onFileCreate(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input) {
            return
        }
        const title = input.value;
        doCreate(node, title, "file")
        emits('fileCreate', node, title);
    }

    function onFolderCreate(node: TreeNode) {
        const input = editInputRef.value[0]
        if (!input) {
            return
        }

        const title = input.value;
        doCreate(node, title, "folder")
        emits('folderCreate', node, title);
    }

    function doCreate(node: TreeNode, title: string, type: string) {
        const newPath = join(node.path, title)
        if (node.children) {
            for (const child of node.children) {
                if (child.path === newPath) {
                    onEditCancel();
                    return
                }
            }
        }

        const newOne: TreeNode = {
            title,
            path: newPath,
            type
        }

        if (!node.children) {
            node.children = []
        }
        node.children.unshift(newOne)

        onEditCancel();
    }

    return {
        renameKey,
        createFileKey,
        createFolderKey,
        startRename,
        startCreateFile,
        startCreateFolder,
        onEditCancel,
        onNodeRename,
        onFileCreate,
        onFolderCreate
    }
}
