import {TreeNode} from "./types";
import {findIndexByPath} from "./utils";
import {reactive} from "vue";

export default function useSelect(flattenTree, focusedNodeKey, emits) {

    const selectedKeys = reactive(new Set<string>())

    // const selectedNodes = reactive<TreeNode[]>([]);
    const clickedKeys  = [];
    const focusedKey = focusedNodeKey;


    function onFocusIn() {
        window.addEventListener('keydown', onKeyDown);
    }

    function onFocusOut() {
        window.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(event: KeyboardEvent) {
        const keyCode = event.code;
        if (keyCode === 'ArrowDown' || keyCode === 'ArrowUp') {
            event.preventDefault();
            onSelectionMoved(keyCode === 'ArrowUp' ? -1 : 1, event.shiftKey)
        }
    }


    function onNodeSelect(event: MouseEvent, item: TreeNode) {
        const {path} = item
        focusedKey.value = '';

        console.log("onNodeSelect")


        // Check if the user is holding Ctrl or Cmd key
        const isCtrlOrCmdSelect = event.ctrlKey || event.metaKey;
        const isShiftSelect = event.shiftKey;

        if (isCtrlOrCmdSelect) {
            // If the user is holding Ctrl or Cmd key
            // const findIndex = selectedNodes.findIndex(item => path === item.path)
            // if (findIndex > -1) {
            //     selectedNodes.splice(findIndex, 1)
            //     item.selected = false;
            //
            // } else {
            //     selectedNodes.push(item)
            //     item.selected = true;
            // }
            if(selectedKeys.has(path)){
                selectedKeys.delete(path);
                const index = clickedKeys.indexOf(path);
                clickedKeys.splice(index,1);
            }else {
                selectedKeys.add(path);
                clickedKeys.push(path);
            }
        } else if (isShiftSelect) {

            const visibleItems = flattenTree.value//flattenVisibleTree(data);
            let lastClickedIndex;
            const lastClickedPath = clickedKeys[clickedKeys.length-1]
            if (lastClickedPath) {
                lastClickedIndex = visibleItems.findIndex(i => i.path === lastClickedPath);
            } else {
                lastClickedIndex = 0;
            }

            const currentIndex = visibleItems.findIndex(i => path === i.path);
            const minIndex = Math.min(lastClickedIndex, currentIndex);
            const maxIndex = Math.max(lastClickedIndex, currentIndex);

            const newSelected = visibleItems.slice(minIndex, maxIndex + 1);
            newSelected.forEach(n=>{
                const path = n.path;
                selectedKeys.add(path)
            })

            // newSelected.forEach(s => s.selected = true)

        } else {
            // for (const node of selectedNodes) {
            //     node.selected = false;
            // }
            // selectedNodes.splice(0, selectedNodes.length)
            // selectedNodes.push(item);
            // item.selected = true;
            selectedKeys.clear();
            selectedKeys.add(item.path)
            clickedKeys.push(item.path)
        }

        emits('nodeSelect', selectedKeys);
    }


    function onSelectionMoved(direction: number, isShift: boolean) {
        if (selectedKeys.length === 0) {
            return
        }
        console.log("onSelectionMoved")

        const lastClickedPath = clickedKeys[clickedKeys.length - 1];
        // data.expanded = true;
        const visibleItems = flattenTree.value
        const index = findIndexByPath(visibleItems, lastClickedPath)

        const newIndex = index + direction;
        if (newIndex == -1 || newIndex == visibleItems.length) {
            return;
        }

        if (!isShift) {
            selectedKeys.clear();
        }
        const newSelectedItem = visibleItems[newIndex].path;
        // newSelectedItem.selected = true;
        selectedKeys.add(newSelectedItem);
        clickedKeys.push(newSelectedItem)
    }

    return {
        selectedKeys, onFocusIn, onFocusOut, onNodeSelect
    };
}
